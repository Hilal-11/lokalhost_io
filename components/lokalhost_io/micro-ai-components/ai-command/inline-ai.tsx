"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  Languages,
  ListMinus,
  ListPlus,
  Mic2,
  RotateCw,
  SpellCheck,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { diffStreaming, type DiffPart } from "./word-diff";

const EASE = [0.22, 1, 0.36, 1] as const;
const POS_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";

export type InlineAIAction = "improve" | "shorter" | "longer" | "fix-grammar" | "tone" | "translate" | "custom";

const ACTION_META: Record<Exclude<InlineAIAction, "custom">, { label: string; icon: React.ReactNode }> = {
  improve: { label: "Improve writing", icon: <Wand2 /> },
  shorter: { label: "Make shorter", icon: <ListMinus /> },
  longer: { label: "Make longer", icon: <ListPlus /> },
  "fix-grammar": { label: "Fix grammar", icon: <SpellCheck /> },
  tone: { label: "Change tone", icon: <Mic2 /> },
  translate: { label: "Translate", icon: <Languages /> },
};

/* ------------------------------------------------------------------ */
/* Selection geometry                                                 */
/* ------------------------------------------------------------------ */

const MIRROR_PROPS = [
  "box-sizing", "width", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "padding-top", "padding-right", "padding-bottom", "padding-left", "font-style", "font-variant", "font-weight",
  "font-stretch", "font-size", "line-height", "font-family", "text-align", "text-transform", "text-indent",
  "letter-spacing", "word-spacing", "tab-size", "word-break", "overflow-wrap",
];

/** Viewport rects of characters [start, end) inside a textarea, via a hidden mirror element. */
export function textareaRangeRects(ta: HTMLTextAreaElement, start: number, end: number): DOMRect[] {
  const cs = getComputedStyle(ta);
  const box = ta.getBoundingClientRect();
  const div = document.createElement("div");
  MIRROR_PROPS.forEach((p) => div.style.setProperty(p, cs.getPropertyValue(p)));
  Object.assign(div.style, {
    position: "fixed",
    top: `${box.top}px`,
    left: `${box.left}px`,
    height: `${box.height}px`,
    visibility: "hidden",
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    pointerEvents: "none",
  });
  const value = ta.value;
  div.textContent = value.slice(0, start);
  const span = document.createElement("span");
  span.textContent = value.slice(start, end) || "​";
  div.appendChild(span);
  div.appendChild(document.createTextNode(value.slice(end) || " "));
  document.body.appendChild(div);
  div.scrollTop = ta.scrollTop;
  const rects = Array.from(span.getClientRects()).filter((r) => r.width > 0 || r.height > 0);
  div.remove();
  return rects;
}

function union(rects: DOMRect[]) {
  if (!rects.length) return null;
  const top = Math.min(...rects.map((r) => r.top));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  const left = Math.min(...rects.map((r) => r.left));
  const right = Math.max(...rects.map((r) => r.right));
  return { top, bottom, left, right, cx: (left + right) / 2 };
}

type Target = HTMLTextAreaElement | HTMLElement;

interface Selected {
  text: string;
  start: number;
  end: number;
  range?: Range;
  box: NonNullable<ReturnType<typeof union>>;
}

function readSelection(el: Target): Selected | null {
  if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
    if (document.activeElement !== el) return null;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    if (end - start < 2) return null;
    const box = union(textareaRangeRects(el as HTMLTextAreaElement, start, end));
    return box ? { text: el.value.slice(start, end), start, end, box } : null;
  }
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  if (!el.contains(range.commonAncestorContainer)) return null;
  const text = sel.toString();
  if (text.trim().length < 2) return null;
  const box = union(Array.from(range.getClientRects()));
  return box ? { text, start: 0, end: 0, range: range.cloneRange(), box } : null;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export interface InlineAIProps {
  /** The textarea or contenteditable element to watch. */
  targetRef: React.RefObject<Target | null>;
  /** Actions shown in the menu, in order. */
  actions?: InlineAIAction[];
  /** Streams the rewritten text for an action. */
  onRun: (action: InlineAIAction, selectedText: string, instruction?: string) => AsyncIterable<string>;
  /** Called after the replacement is inserted. */
  onAccept?: (result: string, original: string) => void;
  /**
   * Take over insertion (e.g. for Tiptap / ProseMirror). When set, the built-in
   * execCommand replacement is skipped and this is called instead.
   */
  onReplace?: (result: string, original: string) => void;
  className?: string;
}

type Phase = "hidden" | "pill" | "menu" | "result";

export function InlineAI({
  targetRef,
  actions = ["improve", "shorter", "longer", "fix-grammar", "tone", "translate", "custom"],
  onRun,
  onAccept,
  onReplace,
  className,
}: InlineAIProps) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>("hidden");
  const [sel, setSel] = React.useState<Selected | null>(null);
  const [instruction, setInstruction] = React.useState("");
  const [result, setResult] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "streaming" | "done" | "error">("idle");
  const [last, setLast] = React.useState<{ action: InlineAIAction; instruction?: string } | null>(null);
  const [flash, setFlash] = React.useState<DOMRect[]>([]);
  const phaseRef = React.useRef(phase);
  phaseRef.current = phase;
  const runId = React.useRef(0);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => setMounted(true), []);

  // track the selection inside the target
  React.useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = targetRef.current;
        if (!el) return;
        if (phaseRef.current === "menu" || phaseRef.current === "result") return; // frozen while working
        const s = readSelection(el);
        setSel(s);
        setPhase(s ? "pill" : "hidden");
      });
    };
    const onScroll = () => {
      if (phaseRef.current === "hidden") return;
      const el = targetRef.current;
      if (!el || !sel) return;
      // recompute geometry for the frozen selection
      const box =
        el instanceof HTMLTextAreaElement
          ? union(textareaRangeRects(el, sel.start, sel.end))
          : sel.range
            ? union(Array.from(sel.range.getClientRects()))
            : null;
      if (box) setSel((s) => (s ? { ...s, box } : s));
    };
    document.addEventListener("selectionchange", update);
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [targetRef, sel]);

  const close = React.useCallback(() => {
    runId.current++;
    setPhase("hidden");
    setStatus("idle");
    setResult("");
    setInstruction("");
    targetRef.current?.focus();
  }, [targetRef]);

  const openMenu = React.useCallback(() => {
    setPhase("menu");
    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>("[data-action]")?.focus());
  }, []);

  // ⌘/Ctrl+J opens the menu for the current selection
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        const el = targetRef.current;
        if (!el) return;
        const s = readSelection(el);
        if (!s) return;
        e.preventDefault();
        setSel(s);
        openMenu();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [targetRef, openMenu]);

  const run = async (action: InlineAIAction, instr?: string) => {
    if (!sel) return;
    const id = ++runId.current;
    setLast({ action, instruction: instr });
    setPhase("result");
    setResult("");
    setStatus("streaming");
    try {
      for await (const token of onRun(action, sel.text, instr)) {
        if (runId.current !== id) return;
        setResult((r) => r + token);
      }
      if (runId.current === id) setStatus("done");
    } catch {
      if (runId.current === id) setStatus("error");
    }
  };

  const accept = React.useCallback(() => {
    const el = targetRef.current;
    if (!el || !sel || status !== "done") return;
    const text = result.trim();
    el.focus();
    let flashRects: DOMRect[] = [];
    if (onReplace) {
      flashRects = sel.range ? Array.from(sel.range.getClientRects()) : [];
      onReplace(text, sel.text);
    } else if (el instanceof HTMLTextAreaElement) {
      el.setSelectionRange(sel.start, sel.end);
      // execCommand keeps the native undo stack (Ctrl+Z) working
      const ok = document.execCommand("insertText", false, text);
      if (!ok) {
        el.setRangeText(text, sel.start, sel.end, "end");
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
      flashRects = textareaRangeRects(el, sel.start, sel.start + text.length);
    } else if (sel.range) {
      const s = window.getSelection();
      s?.removeAllRanges();
      s?.addRange(sel.range);
      flashRects = Array.from(sel.range.getClientRects());
      document.execCommand("insertText", false, text);
    }
    onAccept?.(text, sel.text);
    runId.current++;
    setPhase("hidden");
    setStatus("idle");
    setResult("");
    setFlash(flashRects);
    window.setTimeout(() => setFlash([]), 650);
  }, [targetRef, sel, status, result, onAccept, onReplace]);

  // Enter / Esc while the result panel is open
  React.useEffect(() => {
    if (phase !== "result" && phase !== "menu") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Enter" && phase === "result" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        accept();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest("[data-inline-ai]") || targetRef.current?.contains(t)) return;
      runId.current++;
      setPhase("hidden");
      setStatus("idle");
      setResult("");
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [phase, close, accept, targetRef]);

  const parts: DiffPart[] = React.useMemo(
    () => (sel && phase === "result" ? diffStreaming(sel.text, result, status === "done") : []),
    [sel, phase, result, status]
  );

  if (!mounted) return null;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const box = sel?.box;
  const menuW = phase === "menu" ? 240 : 104;
  const above = box ? box.top > 64 : true;
  const toolX = box ? Math.min(vw - menuW - 8, Math.max(8, box.cx - menuW / 2)) : 0;
  const toolY = box ? (above ? box.top - 8 : box.bottom + 8) : 0;
  const panelW = Math.min(440, vw - 24);
  const panelX = box ? Math.min(vw - panelW - 12, Math.max(12, box.cx - panelW / 2)) : 0;
  const panelY = box ? box.bottom + 10 : 0;

  return createPortal(
    <div data-inline-ai="" className={cn("font-sans", className)}>
      <style href="lk-inline-ai" precedence="default">{`
        @keyframes lk-diff-in { from { opacity: 0; filter: blur(2px); } to { opacity: 1; filter: blur(0); } }
        .lk-diff > * { animation: lk-diff-in 200ms cubic-bezier(0.22,1,0.36,1) both; }
        @media (prefers-reduced-motion: reduce) { .lk-diff > * { animation: none; } }
      `}</style>

      {/* toolbar: pill → menu */}
      <AnimatePresence>
        {box && (phase === "pill" || phase === "menu") && (
          <motion.div
            key="toolbar"
            className="fixed left-0 top-0 z-50"
            initial={{ x: toolX, y: toolY, opacity: 0, scale: reduce ? 1 : 0.9 }}
            animate={{ x: toolX, y: toolY, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.95, transition: { duration: 0.12 } }}
            transition={{ x: POS_SPRING, y: POS_SPRING, opacity: { duration: 0.15 }, scale: { duration: 0.15, ease: EASE } }}
            style={{ transformOrigin: above ? "bottom center" : "top center" }}
            onMouseDown={(e) => {
              // keep the selection alive in the target while clicking the pill
              if (!(e.target instanceof HTMLInputElement)) e.preventDefault();
            }}
          >
            <motion.div
              ref={menuRef}
              layout={!reduce}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={cn("overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-md", above && "-translate-y-full")}
              style={{ borderRadius: 12 }}
            >
              {phase === "pill" ? (
                <motion.button
                  layout="position"
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={openMenu}
                  className={cn("flex h-8 items-center gap-1.5 whitespace-nowrap px-2.5 text-[12.5px] font-medium text-foreground transition-colors hover:bg-accent", ring)}
                  aria-label="Ask AI about the selected text (Ctrl+J)"
                >
                  <Sparkles className="size-3.5" />
                  Ask AI
                  <kbd className="ml-0.5 rounded border border-border px-1 font-sans text-[10px] text-muted-foreground">⌘J</kbd>
                </motion.button>
              ) : (
                <motion.div
                  layout="position"
                  className="flex w-60 flex-col p-1"
                  role="menu"
                  aria-label="AI actions"
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[data-action]") ?? []);
                    const i = items.indexOf(document.activeElement as HTMLElement);
                    e.preventDefault();
                    items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
                  }}
                >
                  <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025 } } }} className="flex flex-col">
                    {actions.filter((a): a is Exclude<InlineAIAction, "custom"> => a !== "custom").map((a) => (
                      <motion.button
                        key={a}
                        type="button"
                        role="menuitem"
                        data-action=""
                        variants={{ hidden: { opacity: 0, y: reduce ? 0 : -3 }, show: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.16 }}
                        onClick={() => void run(a)}
                        className="flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-left text-[13px] text-foreground outline-none transition-colors hover:bg-accent focus-visible:bg-accent"
                      >
                        <span className="flex text-muted-foreground [&_svg]:size-4">{ACTION_META[a].icon}</span>
                        {ACTION_META[a].label}
                      </motion.button>
                    ))}
                    {actions.includes("custom") && (
                      <motion.form
                        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (instruction.trim()) void run("custom", instruction.trim());
                        }}
                        className="mt-1 flex items-center gap-1.5 border-t border-border px-1 pt-1.5"
                      >
                        <input
                          ref={inputRef}
                          data-action=""
                          value={instruction}
                          onChange={(e) => setInstruction(e.target.value)}
                          placeholder="Ask AI to…"
                          aria-label="Custom instruction"
                          className="h-8 flex-1 rounded-md bg-transparent px-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
                        />
                        <motion.button
                          type="submit"
                          whileTap={{ scale: 0.9 }}
                          disabled={!instruction.trim()}
                          aria-label="Run instruction"
                          className={cn("flex size-7 items-center justify-center rounded-md bg-foreground text-background transition-opacity disabled:opacity-30", ring)}
                        >
                          <ArrowRight className="size-3.5" />
                        </motion.button>
                      </motion.form>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* result panel */}
      <AnimatePresence>
        {box && phase === "result" && (
          <motion.div
            key="result"
            role="dialog"
            aria-label="AI suggestion"
            className="fixed left-0 top-0 z-50"
            initial={{ x: panelX, y: panelY + (reduce ? 0 : 6), opacity: 0 }}
            animate={{ x: panelX, y: panelY, opacity: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98, y: panelY - 4, transition: { duration: 0.15 } }}
            transition={{ x: POS_SPRING, y: POS_SPRING, opacity: { duration: 0.18 } }}
            style={{ width: panelW }}
          >
            <div className="overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg">
              <div className="flex items-center gap-1.5 border-b border-border px-3 py-2 text-[12px] font-medium text-muted-foreground">
                <motion.span
                  className="flex"
                  animate={status === "streaming" && !reduce ? { rotate: [0, 18, -10, 0], scale: [1, 1.2, 0.95, 1] } : { rotate: 0, scale: 1 }}
                  transition={status === "streaming" ? { duration: 1.4, repeat: Infinity } : { duration: 0.2 }}
                >
                  <Sparkles className="size-3.5" />
                </motion.span>
                {last?.action === "custom" ? last.instruction : last ? ACTION_META[last.action as Exclude<InlineAIAction, "custom">]?.label : "Suggestion"}
                {status === "streaming" && <span className="ml-auto tabular-nums text-muted-foreground/70">writing…</span>}
              </div>
              <p className="lk-diff max-h-56 overflow-y-auto px-3 py-2.5 text-[13.5px] leading-6 text-foreground/90 [overflow-wrap:anywhere]">
                {status === "error" ? (
                  <span className="text-destructive">Couldn&apos;t generate a suggestion. Try again.</span>
                ) : parts.length === 0 ? (
                  <span className="text-muted-foreground">…</span>
                ) : (
                  parts.map((p, i) =>
                    p.type === "same" ? (
                      <span key={i}>{p.text}</span>
                    ) : p.type === "remove" ? (
                      <del key={i} className="rounded-sm bg-destructive/[0.07] text-destructive/80 decoration-destructive/60">
                        {p.text}
                      </del>
                    ) : (
                      <ins key={i} className="rounded-sm bg-success/[0.1] text-foreground no-underline [text-decoration:underline] decoration-success decoration-2 underline-offset-[3px]">
                        {p.text}
                      </ins>
                    )
                  )
                )}
              </p>
              <span className="sr-only" aria-live="polite">
                {status === "done" ? "Suggestion ready. Press Enter to accept or Escape to discard." : ""}
              </span>
              <div className="flex items-center justify-between gap-2 border-t border-border bg-muted/30 px-2 py-1.5">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => last && void run(last.action, last.instruction)}
                  disabled={status === "streaming"}
                  className={cn("inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50", ring)}
                >
                  <RotateCw className="size-3.5" /> Try again
                </motion.button>
                <div className="flex items-center gap-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={close}
                    className={cn("inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", ring)}
                  >
                    <X className="size-3.5" /> Discard <kbd className="font-sans text-[10.5px] opacity-60">Esc</kbd>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={accept}
                    disabled={status !== "done"}
                    className={cn("inline-flex h-7 items-center gap-1.5 rounded-md bg-foreground px-2.5 text-[12px] font-medium text-background shadow-sm transition-colors hover:bg-foreground/90 disabled:opacity-40", ring)}
                  >
                    <Check className="size-3.5" /> Accept <kbd className="font-sans text-[10.5px] opacity-60">↵</kbd>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* accept flash */}
      <AnimatePresence>
        {flash.map((r, i) => (
          <motion.span
            key={`${i}-${r.top}-${r.left}`}
            aria-hidden
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed z-40 rounded-[3px] bg-foreground/15"
            style={{ top: r.top, left: r.left, width: r.width, height: r.height }}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export default InlineAI;

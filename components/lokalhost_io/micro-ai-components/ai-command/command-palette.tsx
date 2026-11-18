"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Command, defaultFilter } from "cmdk";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Check, Clock, Copy, CornerDownLeft, MessageSquarePlus, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Markdown } from "../streaming-message/markdown";

const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";
const ASK = "__ask_ai__";

/* ------------------------------------------------------------------ */
/* Kbd — presses down when the key is actually pressed                */
/* ------------------------------------------------------------------ */

const KEY_ALIASES: Record<string, string> = {
  "⌘": "meta",
  cmd: "meta",
  ctrl: "control",
  "⌃": "control",
  "⇧": "shift",
  shift: "shift",
  "⌥": "alt",
  alt: "alt",
  "↵": "enter",
  enter: "enter",
  esc: "escape",
  "⌫": "backspace",
  tab: "tab",
  "↑": "arrowup",
  "↓": "arrowdown",
};

const PressedKeys = React.createContext<Set<string>>(new Set());

export function Kbd({ children, className }: { children: string; className?: string }) {
  const pressed = React.useContext(PressedKeys);
  const key = KEY_ALIASES[children.toLowerCase()] ?? children.toLowerCase();
  const down = pressed.has(key);
  return (
    <motion.kbd
      animate={{ y: down ? 1 : 0 }}
      transition={{ duration: 0.08 }}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-border bg-background px-1 font-sans text-[11px] font-medium text-muted-foreground",
        down ? "shadow-none" : "shadow-[0_1px_0_0_var(--border)]",
        className
      )}
    >
      {children}
    </motion.kbd>
  );
}

function usePressedKeys(active: boolean) {
  const [pressed, setPressed] = React.useState<Set<string>>(() => new Set());
  React.useEffect(() => {
    if (!active) return;
    const down = (e: KeyboardEvent) => setPressed((p) => (p.has(e.key.toLowerCase()) ? p : new Set(p).add(e.key.toLowerCase())));
    const up = (e: KeyboardEvent) =>
      setPressed((p) => {
        if (!p.has(e.key.toLowerCase())) return p;
        const n = new Set(p);
        n.delete(e.key.toLowerCase());
        return n;
      });
    const clear = () => setPressed(new Set());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [active]);
  return pressed;
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface PaletteCommand {
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Keys shown as chips, e.g. ["⌘", "N"]. */
  shortcut?: string[];
  /** Group heading. */
  group?: string;
  /** Extra search terms. */
  keywords?: string[];
  onSelect: () => void;
}

export interface AICommandPaletteProps {
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  commands: PaletteCommand[];
  /** Streams an answer for free-form questions. Enables the "Ask AI" row. */
  onAsk?: (query: string) => AsyncIterable<string>;
  /** "Insert" action in the answer footer. */
  onInsert?: (answer: string) => void;
  placeholder?: string;
  /** Global hotkey letter used with ⌘/Ctrl. Pass `false` to disable. Defaults to "k". */
  hotkey?: string | false;
  /** How many recent commands to remember. Defaults to 3. */
  recentLimit?: number;
  className?: string;
}

type Row = { value: string; command?: PaletteCommand };

/* ------------------------------------------------------------------ */
/* Palette                                                            */
/* ------------------------------------------------------------------ */

export function AICommandPalette({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  commands,
  onAsk,
  onInsert,
  placeholder = "Search commands or ask AI…",
  hotkey = "k",
  recentLimit = 3,
  className,
}: AICommandPaletteProps) {
  const reduce = useReducedMotion();
  const uid = React.useId();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (openProp === undefined) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [openProp, onOpenChange]
  );

  const [mode, setMode] = React.useState<"command" | "answer">("command");
  const [query, setQuery] = React.useState("");
  const [value, setValue] = React.useState("");
  const [askFirst, setAskFirst] = React.useState(false);
  const [recent, setRecent] = React.useState<string[]>([]);
  const [asked, setAsked] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "pending" | "streaming" | "done" | "error">("idle");
  const [copied, setCopied] = React.useState(false);
  const runId = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pressed = usePressedKeys(open);

  // global hotkey
  React.useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey, open, setOpen]);

  // reset on close
  React.useEffect(() => {
    if (open) return;
    runId.current++;
    const t = window.setTimeout(() => {
      setMode("command");
      setQuery("");
      setAskFirst(false);
      setAnswer("");
      setStatus("idle");
    }, 160);
    return () => window.clearTimeout(t);
  }, [open]);

  /* filtering */
  const q = query.trim();
  const matches = React.useMemo(() => {
    if (!q) return commands;
    return commands
      .map((c) => ({ c, s: defaultFilter(c.label, q, c.keywords) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.c);
  }, [commands, q]);

  const groups = React.useMemo(() => {
    const map = new Map<string, PaletteCommand[]>();
    for (const c of matches) {
      const g = c.group ?? "Commands";
      map.set(g, [...(map.get(g) ?? []), c]);
    }
    return [...map.entries()];
  }, [matches]);

  const recentCommands = !q ? recent.map((id) => commands.find((c) => c.id === id)).filter((c): c is PaletteCommand => !!c) : [];
  const showAsk = !!onAsk && !!q;
  const askOnTop = showAsk && (askFirst || matches.length === 0);

  const rows: Row[] = [
    ...(askOnTop ? [{ value: ASK }] : []),
    ...recentCommands.map((c) => ({ value: `recent:${c.id}`, command: c })),
    ...groups.flatMap(([, cs]) => cs.map((c) => ({ value: c.id, command: c }))),
    ...(showAsk && !askOnTop ? [{ value: ASK }] : []),
  ];
  const firstValue = rows[0]?.value ?? "";

  React.useEffect(() => {
    setValue(firstValue);
  }, [firstValue, q]);

  const runCommand = (c: PaletteCommand) => {
    setRecent((r) => [c.id, ...r.filter((id) => id !== c.id)].slice(0, recentLimit));
    setOpen(false);
    c.onSelect();
  };

  const ask = async (text: string) => {
    if (!onAsk || !text.trim()) return;
    const id = ++runId.current;
    setMode("answer");
    setAsked(text.trim());
    setQuery("");
    setAnswer("");
    setStatus("pending");
    try {
      for await (const token of onAsk(text.trim())) {
        if (runId.current !== id) return;
        setStatus("streaming");
        setAnswer((a) => a + token);
      }
      if (runId.current === id) setStatus("done");
    } catch {
      if (runId.current === id) setStatus("error");
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const backToCommands = () => {
    runId.current++;
    setMode("command");
    setAnswer("");
    setStatus("idle");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* blocked */
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && mode === "command" && showAsk) {
      e.preventDefault();
      setAskFirst((v) => !v);
      setValue(ASK);
    } else if (e.key === "Backspace" && !query && mode === "answer") {
      e.preventDefault();
      backToCommands();
    } else if (e.key === "Enter" && mode === "answer" && query.trim()) {
      e.preventDefault();
      void ask(query);
    }
  };

  const streaming = status === "pending" || status === "streaming";

  const item = (row: Row, children: React.ReactNode) => (
    <Command.Item
      key={row.value}
      value={row.value}
      onSelect={() => (row.value === ASK ? void ask(query) : row.command && runCommand(row.command))}
      className="relative flex h-10 cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] text-foreground outline-none"
    >
      {value === row.value && (
        <motion.span
          layoutId={reduce ? undefined : `${uid}-highlight`}
          className="absolute inset-0 rounded-lg bg-accent"
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
        />
      )}
      <span className="relative flex min-w-0 flex-1 items-center gap-2.5">{children}</span>
    </Command.Item>
  );

  const commandRow = (row: Row) => {
    const c = row.command as PaletteCommand;
    return item(
      row,
      <>
        <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">
          {row.value.startsWith("recent:") ? <Clock /> : c.icon}
        </span>
        <span className="flex-1 truncate">{c.label}</span>
        {c.shortcut && (
          <span className="flex gap-1">
            {c.shortcut.map((k) => (
              <Kbd key={k}>{k}</Kbd>
            ))}
          </span>
        )}
      </>
    );
  };

  const askRow = () =>
    item(
      { value: ASK },
      <>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
          <Sparkles className="size-3.5" />
        </span>
        <span className="flex-1 truncate">
          <span className="text-muted-foreground">Ask AI: </span>“{q}”
        </span>
        <Kbd>Tab</Kbd>
      </>
    );

  return (
    <PressedKeys.Provider value={pressed}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 bg-background/50 backdrop-blur-[4px]"
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                forceMount
                aria-describedby={undefined}
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                  inputRef.current?.focus();
                }}
              >
                <motion.div
                  layout={!reduce}
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.97, transition: { duration: 0.15 } }}
                  transition={SPRING}
                  className={cn(
                    "fixed left-1/2 top-[14vh] z-50 w-[min(620px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover font-sans text-popover-foreground shadow-xl outline-none",
                    className
                  )}
                >
                  <Dialog.Title className="sr-only">Command palette</Dialog.Title>
                  <LayoutGroup id={uid}>
                    <Command shouldFilter={false} value={value} onValueChange={setValue} loop label="Command palette">
                      {mode === "answer" && (
                        <motion.div layout="position" className="flex items-start gap-2.5 border-b border-border px-4 pb-3 pt-4">
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.9 }}
                            onClick={backToCommands}
                            aria-label="Back to commands"
                            className={cn("-ml-1 mt-px flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", ring)}
                          >
                            <ArrowLeft className="size-4" />
                          </motion.button>
                          <motion.p layoutId={reduce ? undefined : `${uid}-query`} className="flex-1 text-[15px] font-medium leading-6 text-foreground">
                            {asked}
                          </motion.p>
                        </motion.div>
                      )}

                      {mode === "answer" ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2, delay: 0.05 }}
                          className="max-h-[46vh] overflow-y-auto px-4 py-3 [scrollbar-width:thin]"
                          aria-busy={streaming}
                        >
                          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground">
                            <motion.span
                              className="flex"
                              animate={streaming && !reduce ? { rotate: [0, 18, -10, 0], scale: [1, 1.2, 0.95, 1] } : { rotate: 0, scale: 1 }}
                              transition={streaming ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : SPRING}
                            >
                              <Sparkles className="size-3.5" />
                            </motion.span>
                            {streaming ? "Thinking" : status === "error" ? "Something went wrong" : "Answer"}
                          </div>
                          {status === "pending" ? (
                            <div className="flex flex-col gap-2 py-1">
                              {[92, 78, 60].map((w) => (
                                <span key={w} className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${w}%` }} />
                              ))}
                            </div>
                          ) : (
                            <Markdown content={answer} streaming={status === "streaming"} animation="blur" className="text-[13.5px]" />
                          )}
                          <span className="sr-only" aria-live="polite">
                            {status === "done" ? "Answer ready" : ""}
                          </span>
                        </motion.div>
                      ) : null}

                      <motion.div layout="position" className={cn("flex items-center gap-2.5 px-4", mode === "answer" ? "border-t border-border py-2.5" : "border-b border-border py-3")}>
                        {mode === "command" ? <Search className="size-4 shrink-0 text-muted-foreground" /> : <MessageSquarePlus className="size-4 shrink-0 text-muted-foreground" />}
                        <motion.div layoutId={mode === "command" && !reduce ? `${uid}-query` : undefined} className="flex-1">
                          <Command.Input
                            ref={inputRef}
                            value={query}
                            onValueChange={setQuery}
                            onKeyDown={onInputKeyDown}
                            placeholder={mode === "answer" ? "Ask a follow-up…" : placeholder}
                            className="h-7 w-full bg-transparent text-[14.5px] text-foreground outline-none placeholder:text-muted-foreground/70"
                          />
                        </motion.div>
                        <Kbd>Esc</Kbd>
                      </motion.div>

                      {mode === "command" && (
                        <Command.List className="max-h-[min(360px,50vh)] overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin]">
                          {rows.length === 0 && (
                            <div className="py-10 text-center text-[13px] text-muted-foreground">No commands found.</div>
                          )}
                          {askOnTop && <Command.Group heading="AI">{askRow()}</Command.Group>}
                          {recentCommands.length > 0 && (
                            <Command.Group heading="Recent" className="lk-cmd-group">
                              {recentCommands.map((c) => commandRow({ value: `recent:${c.id}`, command: c }))}
                            </Command.Group>
                          )}
                          {groups.map(([name, cs]) => (
                            <Command.Group key={name} heading={name} className="lk-cmd-group">
                              {cs.map((c) => commandRow({ value: c.id, command: c }))}
                            </Command.Group>
                          ))}
                          {showAsk && !askOnTop && <Command.Group heading="AI">{askRow()}</Command.Group>}
                        </Command.List>
                      )}

                      {/* footer */}
                      <div className="flex h-11 items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 text-[12px] text-muted-foreground">
                        {mode === "answer" ? (
                          <div className="flex items-center gap-1">
                            <FooterButton onClick={copyAnswer} disabled={!answer}>
                              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                              {copied ? "Copied" : "Copy"}
                            </FooterButton>
                            {onInsert && (
                              <FooterButton
                                onClick={() => {
                                  onInsert(answer);
                                  setOpen(false);
                                }}
                                disabled={!answer || streaming}
                              >
                                <CornerDownLeft className="size-3.5" /> Insert
                              </FooterButton>
                            )}
                            <FooterButton onClick={() => inputRef.current?.focus()}>
                              <MessageSquarePlus className="size-3.5" /> Ask follow-up
                            </FooterButton>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Kbd>↑</Kbd>
                              <Kbd>↓</Kbd> navigate
                            </span>
                            <span className="flex items-center gap-1">
                              <Kbd>↵</Kbd> select
                            </span>
                            {onAsk && (
                              <span className="hidden items-center gap-1 sm:flex">
                                <Kbd>Tab</Kbd> ask AI
                              </span>
                            )}
                          </div>
                        )}
                        <span className="flex items-center gap-1">
                          {mode === "answer" ? (
                            <>
                              <Kbd>⌫</Kbd> back
                            </>
                          ) : (
                            <>
                              <Kbd>⌘</Kbd>
                              <Kbd>K</Kbd>
                            </>
                          )}
                        </span>
                      </div>
                    </Command>
                  </LayoutGroup>
                  <style href="lk-cmdk" precedence="default">{`
                    [cmdk-group-heading] { padding: 8px 10px 4px; font-size: 11px; font-weight: 500; letter-spacing: .04em; text-transform: uppercase; color: var(--muted-foreground); }
                    [cmdk-group] + [cmdk-group] { margin-top: 4px; }
                  `}</style>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </PressedKeys.Provider>
  );
}

function FooterButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn("inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50", ring)}
    >
      {children}
    </motion.button>
  );
}

export default AICommandPalette;

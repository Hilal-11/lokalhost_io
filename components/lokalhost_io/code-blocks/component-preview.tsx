"use client";

import { cn } from "@/lib/utils";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Code2, Command, Copy, Eye, TerminalSquare, X } from "lucide-react";
import { SiNpm, SiPnpm, SiYarn, SiClaude } from "react-icons/si";
import { PiCatBold } from "react-icons/pi";
import { TbBrandVercelFilled } from "react-icons/tb";
import { GiWrappedHeart } from "react-icons/gi";
import { AiOutlineOpenAI } from "react-icons/ai";

/* ────────────────────────────────────────────────────────────
   Curated Shiki theme set — 4 dark + 3 light.
   ──────────────────────────────────────────────────────────── */

export const DARK_THEMES = [
  { value: "one-dark-pro", label: "One Dark Pro" },
  { value: "github-dark-default", label: "GitHub Dark" },
  { value: "dracula", label: "Dracula" },
  { value: "tokyo-night", label: "Tokyo Night" },
] as const;

export const LIGHT_THEMES = [
  { value: "github-light-default", label: "GitHub Light" },
  { value: "one-light", label: "One Light" },
  { value: "catppuccin-latte", label: "Catppuccin Latte" },
] as const;

export type DarkTheme = (typeof DARK_THEMES)[number]["value"];
export type LightTheme = (typeof LIGHT_THEMES)[number]["value"];

/* ────────────────────────────────────────────────────────────
   Types + shared data
   ──────────────────────────────────────────────────────────── */

export interface ComponentPreviewProps {
  children?: React.ReactNode;
  /** Extra classes on the inner panel (border, radius, bg). */
  className?: string;
  /** Classes for the outer padded frame behind the panel. */
  frameClassName?: string;
  compact?: boolean;
  comment?: string[];
  isBlock?: boolean;
  code?: string;
  language?: string;
  /** Shiki theme used in the Code tab when the app is in light mode. */
  lightTheme?: LightTheme;
  /** Shiki theme used in the Code tab when the app is in dark mode. */
  darkTheme?: DarkTheme;
  /** Show the line-number gutter in the Code tab. Defaults to true. */
  showLineNumbers?: boolean;
  /** Max height (px) of the code panel before it scrolls. Defaults to 500. */
  maxCodeHeight?: number;
  /** Which tab is active on first render. Defaults to "Code". */
  defaultTab?: "Preview" | "Code";
  /** Called after a successful code copy — hook up analytics if you want. */
  onCopyCode?: (code: string) => void;
  /** Install commands shown in the Install dialog. `[component]` placeholders are kept as-is. */
  installCommands?: Partial<Record<PackageManager, string>>;
}

type PackageManager = "npx" | "pnpm" | "yarn" | "bun";
type AITool = "claude" | "v0" | "lovable" | "chatgpt";

const pmMeta: Record<PackageManager, { command: string; icon: React.ReactNode; label: string }> = {
  npx: { command: "npx shadcn@latest add [component]", icon: <SiNpm size={12} />, label: "npx" },
  pnpm: { command: "pnpm dlx shadcn@latest add [component]", icon: <SiPnpm size={12} />, label: "pnpm" },
  yarn: { command: "yarn dlx shadcn@latest add [component]", icon: <SiYarn size={12} />, label: "yarn" },
  bun: { command: "bunx --bun shadcn@latest add [component]", icon: <PiCatBold size={12} />, label: "bun" },
};

const aiMeta: Record<AITool, { prompt: string; icon: React.ReactNode; label: string }> = {
  claude: { prompt: "Install and use this component from the shadcn registry.", icon: <SiClaude size={14} />, label: "Claude" },
  v0: { prompt: "Use this shadcn component in my project.", icon: <TbBrandVercelFilled size={14} />, label: "v0" },
  lovable: { prompt: "Add this component to my project.", icon: <GiWrappedHeart size={14} />, label: "Lovable" },
  chatgpt: { prompt: "Install this component using the shadcn CLI.", icon: <AiOutlineOpenAI size={14} />, label: "ChatGPT" },
};

const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function IconSwap({ on, children, fallback }: { on: boolean; children: React.ReactNode; fallback: React.ReactNode }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={on ? "on" : "off"}
        initial={{ scale: 0.5, opacity: 0, rotate: on ? -15 : 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.16, ease: EASE }}
        className="flex"
      >
        {on ? children : fallback}
      </motion.span>
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────────
   Modal shell (scoped to the preview frame)
   ──────────────────────────────────────────────────────────── */

function Modal({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("button")?.focus());
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[4px] dark:bg-black/50"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.97, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="w-[340px] max-w-[88%] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.2)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModalHeader({ icon, label, onClose }: { icon: React.ReactNode; label: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2.5 dark:border-neutral-800">
      <span className="flex items-center gap-2 text-[12.5px] font-medium text-neutral-500 dark:text-neutral-400">
        {icon}
        {label}
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        aria-label="Close"
        className={cn("flex size-6 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100", ring)}
      >
        <X size={13} />
      </motion.button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Sliding segmented control (Preview / Code)
   ──────────────────────────────────────────────────────────── */

function SegmentedTabs({ tab, setTab }: { tab: "Preview" | "Code"; setTab: (t: "Preview" | "Code") => void }) {
  const id = useId();
  return (
    <div role="tablist" aria-label="View" className="flex h-8 items-center gap-0.5 rounded-[10px] border border-neutral-200 bg-neutral-100/80 p-[3px] dark:border-neutral-800 dark:bg-neutral-900">
      {(["Preview", "Code"] as const).map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={tab === t}
          onClick={() => setTab(t)}
          className={cn(
            "relative flex h-full items-center gap-1.5 rounded-[7px] px-2.5 text-[12.5px] font-medium transition-colors",
            tab === t ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
            ring
          )}
        >
          {tab === t && (
            <motion.span
              layoutId={`${id}-tab`}
              className="absolute inset-0 rounded-[7px] border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:border-neutral-700 dark:bg-neutral-800"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">
            {t === "Preview" ? <Eye size={13} /> : <Code2 size={13} />}
            {t}
          </span>
        </button>
      ))}
    </div>
  );
}

const toolbarBtn = cn(
  "flex h-8 items-center gap-1.5 rounded-[10px] border border-neutral-200 bg-white px-2.5 text-[12.5px] font-medium text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors",
  "hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100",
  ring
);

/* ────────────────────────────────────────────────────────────
   Install modal
   ──────────────────────────────────────────────────────────── */

function InstallModal({ commands }: { commands?: Partial<Record<PackageManager, string>> }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PackageManager>("npx");
  const [copied, setCopied] = useState(false);
  const id = useId();
  const command = commands?.[selected] ?? pmMeta[selected].command;

  const copy = async () => {
    if (await copyText(command)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <>
      <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setOpen(true)} className={toolbarBtn}>
        <TerminalSquare size={13} />
        Install
      </motion.button>

      <Modal open={open} onClose={() => setOpen(false)} label="Install this component">
        <ModalHeader icon={<TerminalSquare size={13} />} label="Install this component" onClose={() => setOpen(false)} />
        <div className="flex items-center gap-1 border-b border-neutral-200 p-1.5 dark:border-neutral-800" role="tablist" aria-label="Package manager">
          {(Object.keys(pmMeta) as PackageManager[]).map((pm) => (
            <button
              key={pm}
              type="button"
              role="tab"
              aria-selected={selected === pm}
              onClick={() => {
                setSelected(pm);
                setCopied(false);
              }}
              className={cn(
                "relative flex h-7 flex-1 items-center justify-center gap-1.5 rounded-lg text-[12px] font-medium transition-colors",
                selected === pm ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
                ring
              )}
            >
              {selected === pm && (
                <motion.span layoutId={`${id}-pm`} className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
              )}
              <span className="relative flex items-center gap-1.5">
                {pmMeta[pm].icon}
                {pmMeta[pm].label}
              </span>
            </button>
          ))}
        </div>
        <div className="p-3">
          <button
            type="button"
            onClick={copy}
            title="Click to copy"
            className={cn(
              "group flex w-full items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-left font-mono text-[12px] text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900",
              ring
            )}
          >
            <span className="shrink-0 text-neutral-400">$</span>
            <span className="flex-1 truncate">{command}</span>
            <span className="text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
              <IconSwap on={copied} fallback={<Copy size={13} />}>
                <Check size={13} strokeWidth={2.5} className="text-neutral-900 dark:text-neutral-100" />
              </IconSwap>
            </span>
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? "Command copied" : ""}
          </span>
        </div>
      </Modal>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   Copy-prompt palette (⌘K while the preview is hovered/focused)
   ──────────────────────────────────────────────────────────── */

function CommandPalette({ activeRef }: { activeRef: React.RefObject<boolean> }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<AITool | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && activeRef.current) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeRef]);

  const copy = async (tool: AITool) => {
    if (await copyText(aiMeta[tool].prompt)) {
      setCopied(tool);
      setTimeout(() => setCopied(null), 1400);
    }
  };

  return (
    <>
      <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setOpen(true)} className={toolbarBtn} aria-label="Copy prompt">
        <Command size={13} />
        <span className="hidden sm:inline">Copy Prompt</span>
      </motion.button>

      <Modal open={open} onClose={() => setOpen(false)} label="Copy install prompt">
        <ModalHeader icon={<Command size={13} />} label="Copy install prompt for…" onClose={() => setOpen(false)} />
        <motion.div className="p-1" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}>
          {(Object.keys(aiMeta) as AITool[]).map((tool) => (
            <motion.button
              key={tool}
              type="button"
              variants={{ hidden: { opacity: 0, y: 4 }, show: { opacity: 1, y: 0 } }}
              onClick={() => copy(tool)}
              className={cn("group flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-[13px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800", ring)}
            >
              <span className="flex items-center gap-2.5">
                <span className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  {aiMeta[tool].icon}
                </span>
                {aiMeta[tool].label}
              </span>
              <span className="text-neutral-400 transition-transform group-hover:translate-x-0.5">
                <IconSwap on={copied === tool} fallback={<ArrowUpRight size={13} />}>
                  <Check size={13} strokeWidth={2.5} className="text-neutral-900 dark:text-neutral-100" />
                </IconSwap>
              </span>
            </motion.button>
          ))}
        </motion.div>
        <span className="sr-only" aria-live="polite">
          {copied ? "Prompt copied" : ""}
        </span>
      </Modal>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   Code tab internals
   ──────────────────────────────────────────────────────────── */

const htmlCache = new Map<string, string>();

function CodeHighlight({ code, language = "tsx", shikiTheme, showLineNumbers }: { code: string; language?: string; shikiTheme: LightTheme | DarkTheme; showLineNumbers: boolean }) {
  const key = `${language}|${shikiTheme}|${code}`;
  const [html, setHtml] = useState<string | null>(() => htmlCache.get(key) ?? null);

  useEffect(() => {
    let cancelled = false;
    const hit = htmlCache.get(key);
    if (hit) {
      setHtml(hit);
      return;
    }
    import("shiki").then(({ codeToHtml }) =>
      codeToHtml(code, { lang: language, theme: shikiTheme })
        .catch(() => codeToHtml(code, { lang: "text", theme: shikiTheme }))
        .then((h) => {
          htmlCache.set(key, h);
          if (!cancelled) setHtml(h);
        })
    );
    return () => {
      cancelled = true;
    };
  }, [key, code, language, shikiTheme]);

  if (!html) return <CodeFallback code={code} showLineNumbers={showLineNumbers} />;

  return (
    <>
      {showLineNumbers && (
        <style href="lk-preview-lines" precedence="default">{`
          .shiki-lines code { counter-reset: line; }
          .shiki-lines .line { counter-increment: line; display: inline-block; width: 100%; padding-left: 0.75rem; }
          .shiki-lines .line::before { content: counter(line); display: inline-block; width: 2rem; margin-right: 0.75rem; text-align: right; opacity: 0.35; user-select: none; font-variant-numeric: tabular-nums; }
        `}</style>
      )}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{ fontFamily: "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace" }}
        className={cn(
          showLineNumbers && "shiki-lines",
          "[&>pre]:overflow-x-auto [&>pre]:py-4 [&>pre]:text-[12.5px] [&>pre]:leading-[1.75]",
          showLineNumbers ? "[&>pre]:pl-0 [&>pre]:pr-4" : "[&>pre]:px-4",
          "[&>pre]:h-full [&>pre]:![font-family:inherit] [&_code]:bg-transparent"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

function CodeFallback({ code, showLineNumbers }: { code: string; showLineNumbers: boolean }) {
  const lines = code.split("\n");
  return (
    <pre className="h-full overflow-auto px-4 py-4 font-mono text-[12.5px] leading-[1.75] text-neutral-700 dark:text-neutral-300">
      <code className={showLineNumbers ? "grid" : "block"} style={showLineNumbers ? { gridTemplateColumns: "auto 1fr" } : undefined}>
        {lines.map((line, i) =>
          showLineNumbers ? (
            <span key={i} className="contents">
              <span className="select-none pr-3 text-right tabular-nums text-neutral-400/70">{i + 1}</span>
              <span>{line || " "}</span>
            </span>
          ) : (
            <span key={i} className="block">
              {line || " "}
            </span>
          )
        )}
      </code>
    </pre>
  );
}

function CopyCodeButton({ text, onCopy }: { text: string; onCopy?: (code: string) => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (await copyText(text)) {
      setCopied(true);
      onCopy?.(text);
      setTimeout(() => setCopied(false), 1600);
    }
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "flex size-7 items-center justify-center rounded-lg border border-neutral-200 bg-white/90 text-neutral-500 shadow-sm backdrop-blur transition-colors hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400 dark:hover:text-neutral-100",
        ring
      )}
    >
      <IconSwap on={copied} fallback={<Copy size={13} />}>
        <Check size={13} strokeWidth={2.5} className="text-neutral-900 dark:text-neutral-100" />
      </IconSwap>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </motion.button>
  );
}

/* ────────────────────────────────────────────────────────────
   Main component
   ──────────────────────────────────────────────────────────── */

export function ComponentPreview({
  children,
  className = "",
  frameClassName = "bg-neutral-100 dark:bg-neutral-900",
  compact = false,
  comment = [],
  isBlock = false,
  language = "",
  code,
  lightTheme = "github-light-default",
  darkTheme = "one-dark-pro",
  showLineNumbers = true,
  maxCodeHeight = 500,
  defaultTab = "Code",
  onCopyCode,
  installCommands,
}: ComponentPreviewProps) {
  const [tab, setTab] = useState<"Preview" | "Code">(defaultTab);
  const { resolvedTheme } = useTheme();
  const active = useRef(false);

  const activeShikiTheme = useMemo<LightTheme | DarkTheme>(() => {
    if (!resolvedTheme) return lightTheme;
    return resolvedTheme === "dark" ? darkTheme : lightTheme;
  }, [resolvedTheme, lightTheme, darkTheme]);

  return (
    <div className="not-prose my-6 w-full px-4">
      <div
        className={cn("relative w-full overflow-hidden rounded-2xl border border-neutral-200 p-3 sm:p-4 dark:border-neutral-800", frameClassName)}
        onPointerEnter={() => (active.current = true)}
        onPointerLeave={() => (active.current = false)}
        onFocus={() => (active.current = true)}
        onBlur={() => (active.current = false)}
      >
        <div
          className={cn(
            "overflow-hidden rounded-xl border border-neutral-200 bg-white font-sans shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_1px_2px_rgba(0,0,0,0.5)]",
            className
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 bg-neutral-50/70 px-2.5 py-2 dark:border-neutral-800 dark:bg-neutral-900/40">
            <SegmentedTabs tab={tab} setTab={setTab} />
            <div className="flex shrink-0 items-center gap-1.5">
              <InstallModal commands={installCommands} />
              <CommandPalette activeRef={active} />
            </div>
          </div>

          <div className="relative h-auto w-full overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {tab === "Preview" ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.18 }}
                  className={cn("not-prose flex items-center justify-center font-sans", isBlock ? "" : "p-4", compact ? "min-h-[120px]" : "min-h-[500px]")}
                >
                  {children ?? <span className="text-sm text-neutral-500">No preview provided for this component.</span>}
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.18 }}
                  className="relative min-h-full overflow-y-auto [scrollbar-width:thin]"
                  style={{ maxHeight: maxCodeHeight }}
                >
                  {code ? (
                    <>
                      <div className="sticky top-0 z-10 flex h-0 justify-end">
                        <div className="pr-2 pt-2">
                          <CopyCodeButton text={code} onCopy={onCopyCode} />
                        </div>
                      </div>
                      <CodeHighlight code={code} language={language || "tsx"} shikiTheme={activeShikiTheme} showLineNumbers={showLineNumbers} />
                    </>
                  ) : (
                    <div className="flex min-h-[200px] items-center justify-center font-sans text-sm text-neutral-500">No code provided for this component.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {comment.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {comment.map((text, i) => (
            <span key={i} className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-sans text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              {text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComponentPreview;

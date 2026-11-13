"use client";

import { cn } from "@/lib/utils";
import { Suspense, useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";
import { useTheme } from "next-themes";

import {
  Check,
  Copy,
  Command,
  ArrowRight,
  TerminalSquare,
  X,
} from "lucide-react";
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

interface ComponentPreviewProps {
  children?: React.ReactNode;
  /** Extra classes on the inner white/black panel (border, radius, bg). */
  className?: string;
  /**
   * Classes for the outer padded frame behind the panel — the
   * "outer-layer color". Defaults to your existing neutral-100/900 look.
   */
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
}

type PackageManager = "npx" | "pnpm" | "yarn" | "bun";
type AITool = "claude" | "v0" | "lovable" | "chatgpt";

/**
 * Static, display-only commands — not derived from any component slug.
 * Swap these strings whenever you're ready to point them at something real.
 */
const pmMeta: Record<
  PackageManager,
  { command: string; icon: React.ReactNode; color: string; label: string }
> = {
  npx: {
    command: "npx shadcn@latest add [component]",
    icon: <SiNpm size={12} />,
    color: "text-red-500",
    label: "npx",
  },
  pnpm: {
    command: "pnpm dlx shadcn@latest add [component]",
    icon: <SiPnpm size={12} />,
    color: "text-yellow-500",
    label: "pnpm",
  },
  yarn: {
    command: "yarn dlx shadcn@latest add [component]",
    icon: <SiYarn size={12} />,
    color: "text-blue-400",
    label: "yarn",
  },
  bun: {
    command: "bunx --bun shadcn@latest add [component]",
    icon: <PiCatBold size={12} />,
    color: "text-orange-400",
    label: "bun",
  },
};

const aiMeta: Record<AITool, { prompt: string; icon: React.ReactNode; label: string }> = {
  claude: {
    prompt: "Install and use this component from the shadcn registry.",
    icon: <SiClaude size={14} />,
    label: "Claude",
  },
  v0: {
    prompt: "Use this shadcn component in my project.",
    icon: <TbBrandVercelFilled size={14} />,
    label: "v0",
  },
  lovable: {
    prompt: "Add this component to my project.",
    icon: <GiWrappedHeart size={14} />,
    label: "Lovable",
  },
  chatgpt: {
    prompt: "Install this component using the shadcn CLI.",
    icon: <AiOutlineOpenAI size={14} />,
    label: "ChatGPT",
  },
};

/* ────────────────────────────────────────────────────────────
   Shared modal shell
   ──────────────────────────────────────────────────────────── */

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[320px] max-w-[85%] rounded-xl border border-border bg-popover shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ icon, label, onClose }: { icon: React.ReactNode; label: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border">
      <span className="flex items-center gap-2 text-[12px] font-sans text-muted-foreground">
        {icon}
        {label}
      </span>
      <button
        onClick={onClose}
        className="flex items-center justify-center h-5 w-5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Sliding segmented control (Preview / Code)
   ──────────────────────────────────────────────────────────── */

function SegmentedTabs({
  tab,
  setTab,
}: {
  tab: "Preview" | "Code";
  setTab: (t: "Preview" | "Code") => void;
}) {
  return (
    <div className="h-full p-[3px] bg-neutral-200 dark:bg-neutral-800 rounded-[9px] flex items-center justify-center shrink-0">
      <div className="relative flex gap-2 items-center bg-neutral-100 dark:bg-neutral-900 rounded-[9px] p-0.5 h-7 text-[13px] font-sans font-medium">
      <div
        className={cn(
          "absolute top-0.5 bottom-0.5 w-[60px] rounded-[9px] bg-white dark:bg-neutral-800 shadow-sm border border-border transition-transform duration-200 ease-out",
          tab === "Code" && "left-2 translate-x-[60px]"
        )}
      />
      <button
        onClick={() => setTab("Preview")}
        className={cn(
          "relative z-10 w-[60px] h-full rounded-[9px] transition-colors",
          tab === "Preview" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Preview
      </button>
      <button
        onClick={() => setTab("Code")}
        className={cn(
          "relative z-10 w-[60px] h-full rounded-[9px] transition-colors",
          tab === "Code" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Code
      </button>
    </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Install modal — static commands, no slug dependency
   ──────────────────────────────────────────────────────────── */

function InstallModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PackageManager>("npx");
  const [copied, setCopied] = useState(false);
  const command = pmMeta[selected].command;

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="p-[3px] bg-neutral-200 dark:bg-neutral-800 rounded-[10px] flex items-center justify-center shrink-0">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-[9px] border border-border bg-white dark:bg-neutral-950 text-[13px] font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <TerminalSquare size={12} />
          Install
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader icon={<TerminalSquare size={13} />} label="install this component" onClose={() => setOpen(false)} />

        <div className="flex items-center gap-1 p-2 border-b border-border">
          {(Object.keys(pmMeta) as PackageManager[]).map((pm) => (
            <button
              key={pm}
              onClick={() => {
                setSelected(pm);
                setCopied(false);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 h-7 rounded-lg text-[12px] font-medium transition-colors",
                selected === pm ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className={pmMeta[pm].color}>{pmMeta[pm].icon}</span>
              {pmMeta[pm].label}
            </button>
          ))}
        </div>

        <div className="p-3">
          <button
            onClick={copy}
            title="Click to copy"
            className="w-full flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 font-sans text-[12px] text-left text-foreground hover:bg-muted transition-colors cursor-copy"
          >
            <span className="text-neutral-500 shrink-0">$</span>
            <span className="truncate flex-1">{command}</span>
            {copied ? (
              <Check size={13} className="text-neutral-500 shrink-0" />
            ) : (
              <Copy size={13} className="opacity-50 shrink-0" />
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   Command palette (⌘K) — static prompts, no slug dependency
   ──────────────────────────────────────────────────────────── */

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<AITool | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const copy = async (tool: AITool) => {
    await navigator.clipboard.writeText(aiMeta[tool].prompt);
    setCopied(tool);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <>
      <div className="p-[3px] bg-neutral-200 dark:bg-neutral-800 rounded-[9px] flex items-center justify-center shrink-0">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-[10px] border border-border bg-white dark:bg-neutral-950 text-[13px] font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Command size={12} />
          <span className="hidden sm:inline">Copy Prompt</span>
        </button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader icon={<Command size={13} />} label="copy install prompt for…" onClose={() => setOpen(false)} />
        <div className="p-1">
          {(Object.keys(aiMeta) as AITool[]).map((tool) => (
            <button
              key={tool}
              onClick={() => copy(tool)}
              className="w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-[13px] font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                  {aiMeta[tool].icon}
                </span>
                {aiMeta[tool].label}
              </span>
              {copied === tool ? (
                <Check size={13} className="text-neutral-500" />
              ) : (
                <ArrowRight size={13} className="opacity-30" />
              )}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   Code tab internals — theme-aware, respects showLineNumbers
   ──────────────────────────────────────────────────────────── */

function CodeHighlight({
  code,
  language = "tsx",
  shikiTheme,
  showLineNumbers,
}: {
  code: string;
  language?: string;
  shikiTheme: LightTheme | DarkTheme;
  showLineNumbers: boolean;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: language,
      theme: shikiTheme,
    }).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language, shikiTheme]);

  if (!html) {
    return <CodeFallback code={code} showLineNumbers={showLineNumbers} />;
  }

  return (
    <>
      {showLineNumbers && (
        <style>{`
          .shiki-lines code { counter-reset: line; }
          .shiki-lines .line { counter-increment: line; display: inline-block; width: 100%; padding-left: 0.75rem; }
          .shiki-lines .line::before {
            content: counter(line);
            display: inline-block;
            width: 2rem;
            margin-right: 0.50rem;
            text-align: right;
            color: hsl(var(--muted-foreground));
            opacity: 0.4;
            user-select: none;
          }
        `}</style>
      )}
      <div
        style={{ fontFamily: "'Geist Mono', 'Geist Mono Fallback', monospace" }}
        className={cn(
          showLineNumbers && "shiki-lines",
          "[&>pre]:overflow-x-auto [&>pre]:text-[13px] [&>pre]:leading-relaxed [&>pre]:py-4",
          showLineNumbers ? "[&>pre]:pl-0 [&>pre]:pr-4" : "[&>pre]:px-4",
          "[&>pre]:h-full [&>pre]:overflow-y-auto [&_code]:bg-transparent [&>pre]:![font-family:inherit]"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

function CodeFallback({ code, showLineNumbers }: { code: string; showLineNumbers: boolean }) {
  const lines = code.split("\n");
  return (
    <pre className="overflow-x-auto text-[13px] leading-relaxed font-sans text-foreground h-full overflow-y-auto px-4 py-4">
      <code className={showLineNumbers ? "grid" : "block"} style={showLineNumbers ? { gridTemplateColumns: "auto 1fr" } : undefined}>
        {lines.map((line, i) =>
          showLineNumbers ? (
            <span key={i} className="contents">
              <span className="select-none pr-2 text-right text-muted-foreground/40">{i + 1}</span>
              <span>{line || "\u00A0"}</span>
            </span>
          ) : (
            <span key={i} className="block">
              {line || "\u00A0"}
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
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy?.(text);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 px-2 h-6 rounded-md border border-border bg-white dark:bg-black text-muted-foreground hover:text-foreground transition-colors"
      title="Copy code"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
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
}: ComponentPreviewProps) {
  const [tab, setTab] = useState<"Preview" | "Code">(defaultTab);
  const { resolvedTheme } = useTheme();

  const activeShikiTheme = useMemo<LightTheme | DarkTheme>(() => {
    if (!resolvedTheme) return lightTheme;
    return resolvedTheme === "dark" ? darkTheme : lightTheme;
  }, [resolvedTheme, lightTheme, darkTheme]);

  return (
    <div className="my-6 not-prose w-full px-4">
      <div className={cn("p-4 rounded-2xl border relative overflow-hidden w-full", frameClassName)}>
        <div className={cn("rounded-xl border border-border bg-white dark:bg-black overflow-hidden font-sans", className)}>
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 border-b border-border bg-neutral-50/60 dark:bg-neutral-950/60">
            <SegmentedTabs tab={tab} setTab={setTab} />

            <div className="flex items-center gap-2 shrink-0">
              <InstallModal />
              <CommandPalette />
            </div>
          </div>

          <div className="w-full h-auto overflow-hidden relative">
            {tab === "Preview" && (
              <div
                className={cn(
                  "flex justify-center items-center not-prose font-sans",
                  isBlock ? "" : "p-4",
                  compact ? "min-h-[120px]" : "min-h-[500px]"
                )}
              >
                {children ?? (
                  <span className="text-sm text-muted-foreground">no preview provided for this component.</span>
                )}
              </div>
            )}

            {tab === "Code" && (
              <div className="relative min-h-full overflow-y-auto" style={{ maxHeight: maxCodeHeight }}>
                {code ? (
                  <>
                    <div className="absolute top-2 right-2 z-10">
                      <CopyCodeButton text={code} onCopy={onCopyCode} />
                    </div>
                    <Suspense fallback={<CodeFallback code={code} showLineNumbers={showLineNumbers} />}>
                      <CodeHighlight
                        code={code}
                        language={language || "tsx"}
                        shikiTheme={activeShikiTheme}
                        showLineNumbers={showLineNumbers}
                      />
                    </Suspense>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground font-sans">
                    no code provided for this component.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {comment.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {comment.map((text, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-muted text-muted-foreground font-sans"
            >
              {text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
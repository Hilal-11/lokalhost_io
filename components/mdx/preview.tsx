"use client";

import { cn } from "@/lib/utils";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  CodeXml,
  Copy,
  Eye,
  Maximize2,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { SiNpm, SiPnpm, SiYarn, SiClaude } from "react-icons/si";
import { PiCatBold } from "react-icons/pi";
import { TbBrandVercelFilled, TbCursorText } from "react-icons/tb";
import { GiWrappedHeart } from "react-icons/gi";
import {
  PACKAGE_MANAGERS,
  REGISTRY_BASE,
  registryCommand,
  registryUrl,
  type PackageManager,
} from "@/lib/registry";
import { CodeView, CopyButton, copyText } from "./code-view";

/* ------------------------------------------------------------------ */
/* Shared bits                                                        */
/* ------------------------------------------------------------------ */

export const pmIcons: Record<PackageManager, ReactNode> = {
  npm: <SiNpm size={13} className="text-red-500" />,
  pnpm: <SiPnpm size={12} className="text-amber-500" />,
  yarn: <SiYarn size={13} className="text-sky-500" />,
  bun: <PiCatBold size={13} className="text-orange-400" />,
};

function useOutside(ref: React.RefObject<HTMLElement | null>, onOutside: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOutside();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, onOutside, active]);
}

const toolbarBtn =
  "inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 text-[12.5px] font-medium " +
  "text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-neutral-300 hover:text-neutral-900 " +
  "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100 " +
  "active:scale-[0.97]";

const menuPanel =
  "absolute right-0 top-full z-[60] mt-2 origin-top-right overflow-hidden rounded-xl border border-neutral-200 bg-white/95 p-1 " +
  "shadow-xl shadow-black/[0.06] backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95 dark:shadow-black/40";

const menuMotion = {
  initial: { opacity: 0, scale: 0.96, y: -4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: -4 },
  transition: { duration: 0.14, ease: "easeOut" as const },
};

/* ------------------------------------------------------------------ */
/* Install chip — click to copy, pick package manager                 */
/* ------------------------------------------------------------------ */

export function InstallChip({ name }: { name: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false), open);

  const command = registryCommand(name, pm);
  const short = command.replace(`${REGISTRY_BASE}/r/`, "").replace(/\.json$/, "");

  const copy = async () => {
    if (await copyText(command)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div ref={ref} className="relative flex">
      <div className="flex h-8 items-center overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900">
        <button
          type="button"
          onClick={copy}
          title={command}
          className="group flex h-full min-w-0 items-center gap-2 pl-2.5 pr-2 font-mono text-[12px] text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/60"
        >
          <span className="shrink-0">{pmIcons[pm]}</span>
          <span className="max-w-[150px] truncate sm:max-w-[230px]">{short}</span>
          <span className="relative flex size-3.5 shrink-0 items-center justify-center text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
            <Check
              size={13}
              strokeWidth={2.5}
              className={cn("absolute text-emerald-500 transition-all", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")}
            />
            <Copy size={12} className={cn("absolute transition-all", copied ? "scale-50 opacity-0" : "scale-100 opacity-100")} />
          </span>
        </button>
        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Choose package manager"
          className="flex h-full items-center px-1.5 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100"
        >
          <ChevronDown size={13} className={cn("transition-transform duration-200", open && "rotate-180")} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div {...menuMotion} className={cn(menuPanel, "w-36")}>
            {PACKAGE_MANAGERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPm(p);
                  setOpen(false);
                  setCopied(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[13px] transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  pm === p ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"
                )}
              >
                <span className="flex items-center gap-2">
                  {pmIcons[p]}
                  {p}
                </span>
                {pm === p && <Check size={13} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Copy prompt — ready-made prompt for AI builders                    */
/* ------------------------------------------------------------------ */

type AITool = "claude" | "v0" | "lovable" | "cursor";

const aiTools: { id: AITool; label: string; icon: ReactNode; chip: string }[] = [
  { id: "claude", label: "Claude", icon: <SiClaude size={14} />, chip: "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400" },
  { id: "v0", label: "v0", icon: <TbBrandVercelFilled size={14} />, chip: "bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100" },
  { id: "lovable", label: "Lovable", icon: <GiWrappedHeart size={14} />, chip: "bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400" },
  { id: "cursor", label: "Cursor", icon: <TbCursorText size={14} />, chip: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400" },
];

function buildPrompt(name: string) {
  return [
    `Add the "${name}" component from the Lokalhost.io shadcn registry to this project.`,
    `Install it with: ${registryCommand(name)}`,
    `Registry item: ${registryUrl(name)}`,
    `After installing, import it from the generated file and use it where it fits. Keep Tailwind CSS classes intact and make sure any listed dependencies are installed.`,
  ].join("\n");
}

function PromptMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<AITool | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useOutside(ref, () => setOpen(false), open);

  const copy = async (tool: AITool) => {
    if (await copyText(buildPrompt(name))) {
      setCopied(tool);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className={cn(toolbarBtn, "group", open && "border-neutral-300 text-neutral-900 dark:border-neutral-700 dark:text-neutral-100")}>
        <Sparkles size={13} className="text-neutral-400 transition-colors group-hover:text-amber-500" />
        <span className="hidden sm:inline">Copy prompt</span>
        <ChevronDown size={12} className={cn("text-neutral-400 transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div {...menuMotion} className={cn(menuPanel, "w-48")}>
            <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400">Copy prompt for</p>
            {aiTools.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => copy(t.id)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <span className="flex items-center gap-2.5">
                  <span className={cn("flex size-6 items-center justify-center rounded-md", t.chip)}>{t.icon}</span>
                  {t.label}
                </span>
                {copied === t.id ? (
                  <Check size={13} strokeWidth={2.5} className="text-emerald-500" />
                ) : (
                  <Copy size={12} className="text-neutral-400" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview                                                            */
/* ------------------------------------------------------------------ */

interface PreviewProps {
  children: ReactNode;
  className?: string;
  isPremium?: boolean;
  /** "<folder>/<file>" — used for the iframe route and as the default registry name. */
  link: string;
  /** Registry item name. Defaults to the last segment of `link`. Pass `null` to hide the install chip. */
  registry?: string | null;
  useIframe?: boolean;
  height?: string | number;
  compact?: boolean;
  comment?: string[];
  /** Renders children edge-to-edge (no inner padding). */
  isBlock?: boolean;
  code?: string;
  language?: string;
}

type Tab = "preview" | "code";

export function Preview({
  children,
  className,
  link,
  registry,
  useIframe = false,
  height,
  compact = false,
  comment = [],
  isBlock = false,
  code,
  language = "tsx",
}: PreviewProps) {
  const id = useId();
  const [tab, setTab] = useState<Tab>("preview");
  const [fullscreen, setFullscreen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [mounted, setMounted] = useState(false);
  const registryName = registry === null ? null : registry ?? link.split("/").pop() ?? link;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  const minHeight =
    height !== undefined ? (typeof height === "number" ? `${height}px` : height) : compact ? "160px" : "420px";

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      {/* Tabs */}
      <div role="tablist" className="relative flex w-fit items-center gap-0.5 rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900">
        {(["preview", "code"] as Tab[]).map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "relative flex h-7 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors",
              tab === t ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            )}
          >
            {tab === t && (
              <motion.span
                layoutId={`preview-tab-${id}`}
                className="absolute inset-0 rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
                transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {t === "preview" ? <Eye size={14} /> : <CodeXml size={14} />}
              {t === "preview" ? "Preview" : "Code"}
            </span>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {registryName && <InstallChip name={registryName} />}
        {registryName && <PromptMenu name={registryName} />}
        <button
          type="button"
          onClick={() => {
            setTab("preview");
            setReplayKey((k) => k + 1);
          }}
          title="Replay preview"
          aria-label="Replay preview"
          className={cn(toolbarBtn, "group w-8 justify-center px-0")}
        >
          <RotateCcw size={13} className="transition-transform duration-500 group-hover:-rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => setFullscreen((f) => !f)}
          title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
          aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          className={cn(toolbarBtn, "w-8 justify-center px-0")}
        >
          {fullscreen ? <X size={14} /> : <Maximize2 size={13} />}
        </button>
      </div>
    </div>
  );

  const frame = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
        fullscreen && "flex min-h-0 flex-1 flex-col",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {tab === "preview" ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn("relative", fullscreen && "flex-1 overflow-auto")}
          >
            {/* dotted canvas */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 text-neutral-300/70 dark:text-neutral-800"
              style={{
                backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
              }}
            />
            {useIframe ? (
              <iframe
                key={replayKey}
                title={link}
                src={`/preview/${link}`}
                className="relative block w-full"
                style={{ border: "none", height: fullscreen ? "100%" : minHeight, minHeight }}
              />
            ) : (
              <div
                key={replayKey}
                className={cn(
                  "relative flex w-full items-center justify-center",
                  isBlock ? "p-4 sm:p-6" : "p-6 sm:p-10",
                  fullscreen && "h-full"
                )}
                style={{ minHeight }}
              >
                {children}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn("relative bg-neutral-50 dark:bg-neutral-950", fullscreen && "flex-1 overflow-auto")}
          >
            {code ? (
              <>
                <div className="absolute right-3 top-3 z-10 rounded-lg border border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
                  <CopyButton text={code.trim()} />
                </div>
                <CodeView code={code} language={language} collapsible={!fullscreen} collapsedHeight={420} />
              </>
            ) : (
              <div className="flex min-h-[200px] items-center justify-center text-sm text-neutral-500">
                No code provided for this example.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="not-prose my-6">
      {fullscreen && mounted ? (
        <>
          {/* keep layout height while the preview is portalled */}
          <div className="flex flex-col gap-3">
            {toolbar}
            <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800" style={{ minHeight }} />
          </div>
          {createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] flex flex-col gap-3 bg-white/80 p-3 backdrop-blur-md sm:p-6 dark:bg-black/80"
            >
              {toolbar}
              {frame}
            </motion.div>,
            document.body
          )}
        </>
      ) : (
        <div className="flex flex-col gap-3">
          {toolbar}
          {frame}
        </div>
      )}

      {comment.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {comment.map((text, i) => (
            <span
              key={i}
              className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
            >
              {text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export { CopyButton };

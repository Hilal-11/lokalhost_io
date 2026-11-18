"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { SiNpm, SiPnpm, SiYarn } from "react-icons/si";
import { PiCatBold, PiTerminalFill } from "react-icons/pi";

type PackageManager = "npx" | "pnpm" | "yarn" | "bun";

export interface InstallCommandProps {
  /**
   * Map of package manager -> full command string to display/copy.
   * Only the managers present here are shown. "npm" is accepted as an alias for "npx".
   */
  commands: Partial<Record<PackageManager | "npm", string>>;
  /** Label shown in the terminal header. Defaults to "Terminal". */
  title?: string;
  /** Which manager is selected by default. Falls back to the first available. */
  defaultManager?: PackageManager;
  /** Called with the manager when the user switches. */
  onManagerChange?: (manager: PackageManager) => void;
  /** Optional className passthrough for outer wrapper. */
  className?: string;
}

const PM_ORDER: PackageManager[] = ["pnpm", "bun", "yarn", "npx"];

const PM_META: Record<PackageManager, { label: string; icon: React.ReactNode }> = {
  npx: { label: "npx", icon: <SiNpm size={13} /> },
  pnpm: { label: "pnpm", icon: <SiPnpm size={12} /> },
  yarn: { label: "yarn", icon: <SiYarn size={13} /> },
  bun: { label: "bun", icon: <PiCatBold size={13} /> },
};

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600";
const EASE = [0.22, 1, 0.36, 1] as const;
const htmlCache = new Map<string, string>();

export default function InstallCommand({ commands, title = "Terminal", defaultManager, onManagerChange, className = "" }: InstallCommandProps) {
  const reduce = useReducedMotion();
  const normalized: Partial<Record<PackageManager, string>> = { ...commands, npx: commands.npx ?? commands.npm };
  const available = PM_ORDER.filter((pm) => normalized[pm]);

  const [selected, setSelected] = useState<PackageManager>(defaultManager && normalized[defaultManager] ? defaultManager : available[0]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listId = useId();

  const command = normalized[selected] ?? "";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    const i = Math.max(0, available.indexOf(selected));
    setActive(i);
    requestAnimationFrame(() => optionRefs.current[i]?.focus());
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    if (!command) {
      setHtml("");
      return;
    }
    const hit = htmlCache.get(command);
    if (hit) {
      setHtml(hit);
      return;
    }
    import("shiki").then(({ codeToHtml }) =>
      codeToHtml(command, { lang: "bash", themes: { light: "github-light", dark: "github-dark" }, defaultColor: false }).then((out) => {
        htmlCache.set(command, out);
        if (!cancelled) setHtml(out);
      })
    );
    return () => {
      cancelled = true;
    };
  }, [command]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  const choose = (pm: PackageManager) => {
    setSelected(pm);
    setOpen(false);
    setCopied(false);
    onManagerChange?.(pm);
  };

  if (available.length === 0) return null;

  return (
    <div
      className={`w-full overflow-visible rounded-xl border border-neutral-200 bg-white font-sans shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${className}`}
    >
      <style href="lk-install-command" precedence="default">{`
        .install-command-shiki .shiki, .install-command-shiki .shiki span { color: var(--shiki-light); background-color: transparent !important; }
        .dark .install-command-shiki .shiki, .dark .install-command-shiki .shiki span { color: var(--shiki-dark); }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 rounded-t-xl border-b border-neutral-200 bg-neutral-50/70 py-2 pl-3.5 pr-2 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <PiTerminalFill size={15} />
          <span className="text-[12.5px] font-medium">{title}</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={`Package manager: ${PM_META[selected].label}`}
            className={`flex h-7 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white pl-2 pr-1.5 text-[12.5px] font-medium text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 ${ring}`}
          >
            <span className="flex text-neutral-500 dark:text-neutral-400">{PM_META[selected].icon}</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={selected} initial={{ y: reduce ? 0 : 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduce ? 0 : -8, opacity: 0 }} transition={{ duration: 0.18, ease: EASE }}>
                {PM_META[selected].label}
              </motion.span>
            </AnimatePresence>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex text-neutral-400">
              <ChevronDown className="size-3.5" />
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                id={listId}
                role="listbox"
                aria-label="Package manager"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.12 } }}
                transition={{ duration: 0.18, ease: EASE }}
                style={{ transformOrigin: "top right" }}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                  e.preventDefault();
                  const n = available.length;
                  const next = (active + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
                  setActive(next);
                  optionRefs.current[next]?.focus();
                }}
                className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[124px] rounded-xl border border-neutral-200 bg-white p-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]"
              >
                {available.map((pm, i) => (
                  <button
                    key={pm}
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={pm === selected}
                    tabIndex={i === active ? 0 : -1}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(pm)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[12.5px] outline-none transition-colors ${
                      i === active ? "bg-neutral-100 dark:bg-neutral-800" : ""
                    } ${pm === selected ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"}`}
                  >
                    <span className="flex">{PM_META[pm].icon}</span>
                    <span className="flex-1">{PM_META[pm].label}</span>
                    {pm === selected && <Check className="size-3.5" strokeWidth={2.5} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Command row */}
      <div className="flex items-center justify-between gap-3 py-2.5 pl-4 pr-2">
        <div className="install-command-shiki min-w-0 flex-1 overflow-x-auto font-mono text-[12.5px] [scrollbar-width:none] [&>span>pre]:m-0 [&>span>pre]:!bg-transparent [&>span>pre]:p-0 [&_code]:!bg-transparent [&_code]:whitespace-pre">
          <span className="mr-2 select-none text-neutral-400">$</span>
          {html ? <span className="inline-block" dangerouslySetInnerHTML={{ __html: html }} /> : <span className="text-neutral-700 dark:text-neutral-300">{command}</span>}
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy command"}
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100 ${ring}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "y" : "n"}
              initial={{ scale: 0.5, rotate: copied ? -15 : 0, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.16, ease: EASE }}
              className="flex"
            >
              {copied ? <Check className="size-3.5 text-neutral-900 dark:text-neutral-100" strokeWidth={2.5} /> : <Copy className="size-3.5" />}
            </motion.span>
          </AnimatePresence>
          <span className="sr-only" aria-live="polite">
            {copied ? "Command copied" : ""}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

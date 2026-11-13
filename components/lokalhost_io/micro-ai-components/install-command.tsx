"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Copy, Check } from "lucide-react";
import { SiNpm, SiPnpm, SiYarn } from "react-icons/si";
import { PiCatBold, PiTerminalFill } from "react-icons/pi";
import { codeToHtml } from "shiki";

type PackageManager = "npx" | "pnpm" | "yarn" | "bun";

interface InstallCommandProps {
  /**
   * Map of package manager -> full command string to display/copy.
   * Only the managers present here are shown in the dropdown.
   * "npm" is accepted as an alias for "npx" (same slot, same icon/label)
   * so a typo'd key doesn't silently drop the option.
   */
  commands: Partial<Record<PackageManager | "npm", string>>;
  /** Label shown in the terminal header. Defaults to "Terminal". */
  title?: string;
  /** Which manager is selected by default. Falls back to the first available. */
  defaultManager?: PackageManager;
  /** Optional className passthrough for outer wrapper. */
  className?: string;
}

const PM_ORDER: PackageManager[] = ["pnpm", "bun", "yarn", "npx"];

const PM_META: Record<PackageManager, { label: string; icon: React.ReactNode; color: string }> = {
  npx: { label: "npx", icon: <SiNpm size={14} />, color: "text-red-500" },
  pnpm: { label: "pnpm", icon: <SiPnpm size={14} />, color: "text-yellow-500" },
  yarn: { label: "yarn", icon: <SiYarn size={14} />, color: "text-blue-400" },
  bun: { label: "bun", icon: <PiCatBold size={14} />, color: "text-orange-400" },
};

export default function InstallCommand({
  commands,
  title = "Terminal",
  defaultManager,
  className = "",
}: InstallCommandProps) {
  const normalizedCommands: Partial<Record<PackageManager, string>> = {
    ...commands,
    npx: commands.npx ?? commands.npm,
  };

  const available = PM_ORDER.filter((pm) => normalizedCommands[pm]);

  const [selected, setSelected] = useState<PackageManager>(
    defaultManager && normalizedCommands[defaultManager] ? defaultManager : available[0]
  );
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const command = normalizedCommands[selected] ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!command) {
      setHtml("");
      return;
    }

    codeToHtml(command, {
      lang: "bash",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      defaultColor: false,
    }).then((out) => {
      if (!cancelled) setHtml(out);
    });

    return () => {
      cancelled = true;
    };
  }, [command]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — fail silently, button just won't confirm
    }
  }

  if (available.length === 0) return null;

  return (
    <div
      className={`w-full rounded-[9px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 overflow-visible ${className}`}
    >
      <style>{`
        .install-command-shiki .shiki,
        .install-command-shiki .shiki span {
          color: var(--shiki-light);
          background-color: transparent !important;
        }
        .dark .install-command-shiki .shiki,
        .dark .install-command-shiki .shiki span {
          color: var(--shiki-dark);
        }
      `}</style>

      {/* Header */}
      <div className="bg-neutral-200/20 dark:bg-neutral-900/20 flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-2.5 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
          <PiTerminalFill size={16} />
          <span className="text-[13px] font-medium">{title}</span>
        </div>

        {/* Package manager selector — bezel style */}
        <div className="relative" ref={dropdownRef}>
          <div className="p-[3px] rounded-[9px] bg-neutral-100 dark:bg-neutral-800/60">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="flex items-center gap-1.5 rounded-[6px] bg-white px-2.5 py-1 text-[13px] font-medium text-neutral-700 hover:bg-neutral-50 active:scale-[0.98] transition-all dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-850"
            >
              <span className={PM_META[selected].color}>{PM_META[selected].icon}</span>
              {PM_META[selected].label}
              <ChevronDown
                className={`h-3.5 w-3.5 text-neutral-400 transition-transform dark:text-neutral-500 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {open && (
            <div
              role="listbox"
              className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[110px] rounded-[9px] border border-neutral-200 bg-white p-1 shadow-lg shadow-black/10 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/40"
            >
              {available.map((pm) => (
                <button
                  key={pm}
                  type="button"
                  role="option"
                  aria-selected={pm === selected}
                  onClick={() => {
                    setSelected(pm);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-left text-[13px] transition-colors ${
                    pm === selected
                      ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200"
                  }`}
                >
                  <span className={`${PM_META[pm].color} ${pm === selected ? "" : "opacity-70"}`}>
                    {PM_META[pm].icon}
                  </span>
                  {PM_META[pm].label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Command row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div
          className="install-command-shiki flex-1 overflow-x-auto text-[13px] font-mono [&>pre]:!bg-transparent [&_code]:!bg-transparent [&>pre]:m-0 [&>pre]:p-0 [&_code]:whitespace-pre"
        >
          {html ? (
            <span
              className="inline"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <span className="text-neutral-700 dark:text-neutral-300">{command}</span>
          )}
        </div>

        <div className="shrink-0 p-[3px] rounded-[9px] bg-neutral-100 dark:bg-neutral-800/60">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy command"}
            className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 active:scale-[0.98] transition-all dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-850 dark:hover:text-neutral-200"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
            ) : (
              <Copy className="h-3.5 w-3.5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FileCode2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodeFile, Snippet } from "@/lib/mobile/docs.server";
import { PACKAGE_MANAGERS, type PackageManager } from "@/lib/mobile/install";
import { usePrefs } from "../shell/prefs";
import { CopyButton, Segmented } from "./primitives";

/* ------------------------------------------------------------------ */
/* Highlighted HTML comes pre-rendered from the server (Shiki, dual    */
/* theme). Colours switch via CSS variables in globals.css (.lk-code). */
/* ------------------------------------------------------------------ */

function Highlighted({
  html,
  lineNumbers,
  maxHeight,
  className,
}: {
  html: string;
  lineNumbers?: boolean;
  maxHeight?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !maxHeight) return;
    const update = () => setFade(el.scrollHeight - el.clientHeight - el.scrollTop > 8);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [html, maxHeight]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label="Code"
      data-lk-lines={lineNumbers ? "" : undefined}
      className={cn(
        "lk-code lk-focus lk-scroll overflow-auto text-[13px] leading-[1.7] outline-offset-[-2px]",
        fade && "lk-fade-bottom",
        className
      )}
      style={maxHeight ? { maxHeight } : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* CodeBlock — file tabs, TS/JS toggle, copy                          */
/* ------------------------------------------------------------------ */

export function CodeBlock({
  files,
  maxHeight = 460,
  className,
  bare,
}: {
  files: CodeFile[];
  maxHeight?: number;
  className?: string;
  /** No outer border (when embedded in another panel). */
  bare?: boolean;
}) {
  const { lang, set } = usePrefs();
  const [active, setActive] = useState(0);
  const tabsId = useId();
  const hasJs = files.some((f) => f.js);
  const file = files[Math.min(active, files.length - 1)];
  const shown = lang === "js" && file.js ? file.js : file;

  return (
    <div className={cn("overflow-hidden bg-lk-code", !bare && "rounded-lk-card border border-lk-border", className)}>
      <div className="flex h-11 items-center gap-2 border-b border-lk-border px-2">
        <div role="tablist" aria-label="Files" className="lk-scroll flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto">
          {files.map((f, i) => {
            const name = lang === "js" && f.js ? f.js.name : f.name;
            const selected = i === active;
            return (
              <button
                key={f.name}
                role="tab"
                type="button"
                id={`${tabsId}-tab-${i}`}
                aria-selected={selected}
                aria-controls={`${tabsId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const next = (i + (e.key === "ArrowRight" ? 1 : -1) + files.length) % files.length;
                  setActive(next);
                  (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
                }}
                className={cn(
                  "lk-focus lk-transition inline-flex h-7 shrink-0 items-center gap-1.5 rounded-[6px] px-2 font-mono text-[12px]",
                  selected ? "bg-lk-surface-3 text-lk-fg" : "text-lk-muted hover:bg-lk-surface-2 hover:text-lk-fg"
                )}
              >
                <FileCode2 size={13} aria-hidden />
                {name}
              </button>
            );
          })}
        </div>
        {hasJs && (
          <Segmented
            size="sm"
            role="radiogroup"
            label="Language"
            value={lang}
            onChange={(v) => set("lang", v)}
            options={[
              { value: "ts", label: "TS" },
              { value: "js", label: "JS" },
            ]}
          />
        )}
        <CopyButton text={shown.code} label={`Copy ${"name" in shown ? shown.name : file.name}`} />
      </div>
      <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={`${tabsId}-tab-${active}`}>
        <p className="border-b border-lk-border px-4 py-1.5 font-mono text-[11.5px] text-lk-subtle">
          {"target" in shown ? shown.target : file.target}
        </p>
        <Highlighted html={shown.html} lineNumbers maxHeight={maxHeight} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Snippet block — one highlighted snippet with an optional title     */
/* ------------------------------------------------------------------ */

export function SnippetBlock({
  snippet,
  title,
  icon,
  lineNumbers = true,
  maxHeight,
  className,
}: {
  snippet: Snippet;
  title?: ReactNode;
  icon?: ReactNode;
  lineNumbers?: boolean;
  maxHeight?: number;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lk-card border border-lk-border bg-lk-code", className)}>
      {title ? (
        <div className="flex h-10 items-center justify-between gap-2 border-b border-lk-border pl-3 pr-2">
          <span className="flex min-w-0 items-center gap-2 truncate font-mono text-[12px] text-lk-muted">
            {icon ?? <FileCode2 size={13} aria-hidden />}
            {title}
          </span>
          <CopyButton text={snippet.code} />
        </div>
      ) : null}
      <div className="relative">
        <Highlighted html={snippet.html} lineNumbers={lineNumbers} maxHeight={maxHeight} />
        {!title && <CopyButton text={snippet.code} className="absolute right-2 top-2" />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Command block with package-manager tabs                            */
/* ------------------------------------------------------------------ */

export function PackageManagerTabs({ value, onChange }: { value: PackageManager; onChange: (v: PackageManager) => void }) {
  return (
    <Segmented
      size="sm"
      role="radiogroup"
      label="Package manager"
      value={value}
      onChange={onChange}
      options={PACKAGE_MANAGERS.map((p) => ({ value: p, label: p }))}
    />
  );
}

export function CommandBlock({ commands }: { commands: Record<PackageManager, Snippet> }) {
  const { pm, set } = usePrefs();
  const current = commands[pm];
  return (
    <div className="overflow-hidden rounded-lk-card border border-lk-border bg-lk-code">
      <div className="flex h-10 items-center justify-between gap-2 border-b border-lk-border pl-3 pr-2">
        <span className="flex items-center gap-2">
          <Terminal size={13} className="text-lk-muted" aria-hidden />
          <PackageManagerTabs value={pm} onChange={(v) => set("pm", v)} />
        </span>
        <CopyButton text={current.code} label="Copy command" />
      </div>
      <Highlighted html={current.html} />
    </div>
  );
}

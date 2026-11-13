"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Check, Copy } from "lucide-react";
import { SiFlutter, SiReact } from "react-icons/si";
import { cn } from "@/lib/utils";
import { copyText } from "@/components/mdx/code-view";
import type { BadgeKind, Framework } from "@/lib/mobile/types";

/* ------------------------------------------------------------------ */
/* Badge — New / Pro / Beta. The only coloured chrome on the site.    */
/* ------------------------------------------------------------------ */

const badgeStyles: Record<BadgeKind, string> = {
  new: "text-lk-new border-lk-new/30 bg-lk-new/10",
  pro: "text-lk-pro border-lk-pro/30 bg-lk-pro/10",
  beta: "text-lk-beta border-lk-beta/30 bg-lk-beta/10",
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[18px] shrink-0 items-center rounded-[5px] border px-1.5 text-[10.5px] font-medium capitalize leading-none",
        badgeStyles[kind],
        className
      )}
    >
      {kind}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented — tabs or radio group with a sliding pill.               */
/* Arrow keys move selection (roving tabindex).                       */
/* ------------------------------------------------------------------ */

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  /** Accessible name when the label is icon-only. */
  ariaLabel?: string;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = "md",
  role = "tablist",
  label,
  className,
  controls,
}: {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (v: T) => void;
  size?: "sm" | "md";
  role?: "tablist" | "radiogroup";
  label: string;
  className?: string;
  /** id prefix of the panels (tablist only) */
  controls?: string;
}) {
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = options.filter((o) => !o.disabled);

  const onKey = (e: KeyboardEvent) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const i = enabled.findIndex((o) => o.value === value);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % enabled.length;
    if (e.key === "ArrowLeft") next = (i - 1 + enabled.length) % enabled.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = enabled.length - 1;
    const target = enabled[next];
    onChange(target.value);
    refs.current[options.indexOf(target)]?.focus();
  };

  const item = role === "tablist" ? "tab" : "radio";

  return (
    <div
      role={role}
      aria-label={label}
      onKeyDown={onKey}
      className={cn("inline-flex items-center gap-0.5 rounded-lk border border-lk-border bg-lk-surface p-0.5", className)}
    >
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role={item}
            aria-selected={item === "tab" ? selected : undefined}
            aria-checked={item === "radio" ? selected : undefined}
            aria-controls={controls ? `${controls}-${o.value}` : undefined}
            aria-label={o.ariaLabel}
            tabIndex={selected ? 0 : -1}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={cn(
              "lk-focus lk-transition relative inline-flex items-center justify-center gap-1.5 rounded-[6px] font-medium",
              size === "sm" ? "h-6 px-2 text-[12px]" : "h-7 px-2.5 text-[13px]",
              selected ? "text-lk-fg" : "text-lk-muted hover:text-lk-fg",
              "disabled:pointer-events-none disabled:opacity-40"
            )}
          >
            {selected && (
              <motion.span
                layoutId={`seg-${id}`}
                aria-hidden
                className="absolute inset-0 rounded-[6px] border border-lk-border-strong bg-lk-bg shadow-sm dark:bg-lk-surface-3"
                transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
              />
            )}
            <span className="relative inline-flex items-center gap-1.5">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icon button                                                        */
/* ------------------------------------------------------------------ */

export function IconButton({
  label,
  children,
  className,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "lk-focus lk-transition inline-flex size-8 shrink-0 items-center justify-center rounded-lk text-lk-muted",
        "hover:bg-lk-surface-2 hover:text-lk-fg active:bg-lk-surface-3",
        "disabled:pointer-events-none disabled:opacity-40",
        active && "bg-lk-surface-3 text-lk-fg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* CopyButton — idle / copied ✓ / disabled                            */
/* ------------------------------------------------------------------ */

export function CopyButton({
  text,
  label = "Copy",
  className,
  showLabel = false,
  disabled,
}: {
  text: string | (() => string);
  label?: string;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    if (await copyText(typeof text === "function" ? text() : text)) setCopied(true);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={disabled}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      className={cn(
        "lk-focus lk-transition inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[6px] text-lk-muted",
        "hover:bg-lk-surface-2 hover:text-lk-fg active:scale-95 disabled:pointer-events-none disabled:opacity-40",
        showLabel ? "h-7 px-2 text-[12.5px] font-medium" : "size-7",
        className
      )}
    >
      {copied ? <Check size={14} strokeWidth={2.5} className="text-lk-success" /> : <Copy size={14} />}
      {showLabel && <span>{copied ? "Copied" : label}</span>}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Registry chip — mono name + copy                                   */
/* ------------------------------------------------------------------ */

export function RegistryChip({ name, className }: { name: string; className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex h-8 min-w-0 items-center gap-1 rounded-lk border border-lk-border bg-lk-surface pl-2.5 pr-0.5",
        className
      )}
    >
      <span className="truncate font-mono text-[12px] text-lk-fg" title={name}>
        {name}
      </span>
      <CopyButton text={name} label={`Copy ${name}`} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                            */
/* ------------------------------------------------------------------ */

export function Tip({
  label,
  children,
  side = "right",
  disabled,
}: {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  disabled?: boolean;
}) {
  if (disabled) return <>{children}</>;
  return (
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={8}
          className="z-[200] rounded-[6px] border border-lk-border bg-lk-surface px-2 py-1 text-[12px] text-lk-fg shadow-lg"
        >
          {label}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

export const TooltipProvider = TooltipPrimitive.Provider;

/* ------------------------------------------------------------------ */
/* Framework glyphs                                                   */
/* ------------------------------------------------------------------ */

export function FrameworkIcon({ framework, size = 13 }: { framework: Framework; size?: number }) {
  return framework === "flutter" ? <SiFlutter size={size} aria-hidden /> : <SiReact size={size} aria-hidden />;
}

/* ------------------------------------------------------------------ */
/* Skeleton block                                                     */
/* ------------------------------------------------------------------ */

export function SkeletonBlock({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-lk bg-lk-surface-2", className)} />;
}

/* ------------------------------------------------------------------ */
/* Tag list                                                           */
/* ------------------------------------------------------------------ */

export function TagList({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul aria-label="Tags" className={cn("m-0 flex list-none flex-wrap gap-1.5 p-0", className)}>
      {tags.map((t) => (
        <li
          key={t}
          className="inline-flex h-6 items-center rounded-[6px] border border-lk-border px-2 text-[12px] text-lk-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

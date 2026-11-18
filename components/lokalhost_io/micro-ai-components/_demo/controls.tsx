"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* Demo-only chrome shared by the Micro AI UI previews. Not part of the registry. */

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function DemoBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}>{children}</div>;
}

export function DemoButton({
  children,
  onClick,
  active,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 font-sans text-[12.5px] font-medium shadow-sm transition-colors disabled:opacity-50",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
        ring,
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  label: string;
}) {
  const id = React.useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex h-8 items-center rounded-lg border border-border bg-muted/50 p-0.5 font-sans">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn("relative h-full rounded-md px-2.5 text-[12px] font-medium capitalize transition-colors", value === o ? "text-foreground" : "text-muted-foreground hover:text-foreground", ring)}
        >
          {value === o && (
            <motion.span layoutId={`${id}-seg`} className="absolute inset-0 rounded-md border border-border bg-background shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
          )}
          <span className="relative">{o}</span>
        </button>
      ))}
    </div>
  );
}

export function DemoFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex w-full flex-col gap-5 font-sans", className)}>{children}</div>;
}

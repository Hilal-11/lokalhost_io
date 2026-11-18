"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronRight, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Json = string | number | boolean | null | undefined | Json[] | { [key: string]: Json };

const LINE_H = 20;

function Primitive({ value }: { value: Json }) {
  if (value === null || value === undefined) return <span className="italic text-muted-foreground/70">{String(value)}</span>;
  if (typeof value === "string")
    return <span className="text-muted-foreground [overflow-wrap:anywhere]">&quot;{value}&quot;</span>;
  if (typeof value === "number") return <span className="text-foreground tabular-nums">{value}</span>;
  if (typeof value === "boolean") return <span className="font-medium text-foreground">{String(value)}</span>;
  return null;
}

function Node({ name, value, depth, defaultOpenDepth, last }: { name?: string; value: Json; depth: number; defaultOpenDepth: number; last: boolean }) {
  const reduce = useReducedMotion();
  const isObj = value !== null && typeof value === "object";
  const [open, setOpen] = React.useState(depth < defaultOpenDepth);
  const comma = last ? "" : ",";
  const key = name !== undefined && (
    <>
      <span className="text-foreground">&quot;{name}&quot;</span>
      <span className="text-muted-foreground/70">: </span>
    </>
  );

  if (!isObj) {
    return (
      <div className="pl-4" style={{ minHeight: LINE_H }}>
        {key}
        <Primitive value={value} />
        <span className="text-muted-foreground/60">{comma}</span>
      </div>
    );
  }

  const entries: [string | undefined, Json][] = Array.isArray(value)
    ? value.map((v) => [undefined, v])
    : Object.entries(value as Record<string, Json>);
  const [o, c] = Array.isArray(value) ? ["[", "]"] : ["{", "}"];

  return (
    <div className={depth > 0 ? "pl-4" : undefined}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group/json -ml-4 inline-flex items-center rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ minHeight: LINE_H }}
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex w-4 justify-center text-muted-foreground/60 group-hover/json:text-foreground">
          <ChevronRight className="size-3" />
        </motion.span>
        {key}
        <span className="text-muted-foreground/70">{o}</span>
        {!open && (
          <span className="text-muted-foreground/60">
            {" "}
            {entries.length} {Array.isArray(value) ? "items" : "keys"} {c}
            {comma}
          </span>
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ gridTemplateRows: "0fr", opacity: 0 }}
            animate={{ gridTemplateRows: "1fr", opacity: 1 }}
            exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.12 } }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
            className="grid"
          >
            <div className="min-h-0 overflow-hidden">
              {entries.map(([k, v], i) => (
                <Node key={k ?? i} name={k} value={v} depth={depth + 1} defaultOpenDepth={defaultOpenDepth} last={i === entries.length - 1} />
              ))}
              <div style={{ minHeight: LINE_H }} className="text-muted-foreground/70">
                {c}
                {comma}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface JsonViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Any JSON-serialisable value. */
  value: unknown;
  /** Section label, e.g. "Input". */
  label?: string;
  /** Nested levels expanded by default. Defaults to 2. */
  defaultOpenDepth?: number;
  /** Lines shown before "Show more". Defaults to 12. */
  maxLines?: number;
}

export function JsonViewer({ value, label, defaultOpenDepth = 2, maxLines = 12, className, ...props }: JsonViewerProps) {
  const [copied, setCopied] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [overflows, setOverflows] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const text = React.useMemo(() => {
    try {
      return typeof value === "string" ? value : JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }, [value]);

  React.useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > maxLines * LINE_H + 16);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el.firstElementChild ?? el);
    return () => ro.disconnect();
  }, [value, maxLines]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* blocked */
    }
  };

  const collapsed = overflows && !expanded;

  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-muted/30", className)} {...props}>
      <div className="flex h-8 items-center justify-between border-b border-border pl-3 pr-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy ${label ?? "JSON"}`}
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={copied ? "y" : "n"} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }} className="flex">
              {copied ? <Check className="size-3.5" strokeWidth={2.5} /> : <Copy className="size-3" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
      <div className="relative">
        <div
          ref={bodyRef}
          className="overflow-x-auto px-3 py-2 font-mono text-[12px]"
          style={{ maxHeight: collapsed ? maxLines * LINE_H + 16 : undefined, lineHeight: `${LINE_H}px` }}
        >
          <div className="pl-4">
            {typeof value === "string" ? (
              <pre className="-ml-4 whitespace-pre-wrap text-muted-foreground">{value}</pre>
            ) : (
              <Node value={value as Json} depth={0} defaultOpenDepth={defaultOpenDepth} last />
            )}
          </div>
        </div>
        {overflows && (
          <div className={cn("flex justify-center pb-1.5", collapsed && "absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent pt-8")}>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="h-6 rounded-full border border-border bg-background px-2.5 text-[11.5px] font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JsonViewer;

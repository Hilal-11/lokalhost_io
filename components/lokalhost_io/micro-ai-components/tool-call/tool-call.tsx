"use client";

import * as React from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, ChevronDown, RotateCw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerText } from "../shimmer-text/shimmer-text";
import { JsonViewer } from "./json-viewer";

export { JsonViewer } from "./json-viewer";
export type { JsonViewerProps } from "./json-viewer";

const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
const SOFT = { type: "spring", stiffness: 260, damping: 26 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type ToolCallStatus = "pending" | "awaiting-approval" | "running" | "success" | "error" | "cancelled";

/* ------------------------------------------------------------------ */
/* Status glyph                                                       */
/* ------------------------------------------------------------------ */

export function ToolStatusIcon({ status, className }: { status: ToolCallStatus; className?: string }) {
  const reduce = useReducedMotion();
  const t = { duration: 0.18, ease: EASE };
  return (
    <span className={cn("relative flex size-[18px] shrink-0 items-center justify-center", className)} aria-hidden>
      <AnimatePresence mode="wait" initial={false}>
        {status === "pending" && (
          <motion.svg key="pending" viewBox="0 0 18 18" className="size-[18px]" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={t}>
            <circle cx="9" cy="9" r="7" fill="none" strokeWidth="1.5" className="stroke-muted-foreground/50" />
          </motion.svg>
        )}
        {status === "awaiting-approval" && (
          <motion.svg key="await" viewBox="0 0 18 18" className="size-[18px]" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={t}>
            <circle cx="9" cy="9" r="7" fill="none" strokeWidth="1.5" className="stroke-foreground" />
            <motion.circle cx="9" cy="9" r="2.5" className="fill-foreground" animate={reduce ? undefined : { opacity: [1, 0.35, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.svg>
        )}
        {status === "running" && (
          <motion.svg
            key="running"
            viewBox="0 0 18 18"
            className="size-[18px]"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={reduce ? { opacity: [1, 0.4, 1], scale: 1 } : { opacity: 1, scale: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={reduce ? { duration: 1.2, repeat: Infinity } : { rotate: { duration: 0.8, repeat: Infinity, ease: "linear" }, opacity: t, scale: t }}
          >
            <circle cx="9" cy="9" r="7" fill="none" strokeWidth="1.5" className="stroke-foreground/15" />
            <path d="M9 2 a7 7 0 0 1 7 7" fill="none" strokeWidth="1.5" strokeLinecap="round" className="stroke-foreground" />
          </motion.svg>
        )}
        {status === "success" && (
          <motion.svg key="success" viewBox="0 0 18 18" className="size-[18px]" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={SPRING}>
            <motion.circle cx="9" cy="9" r="8" className="fill-foreground" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={SPRING} style={{ transformOrigin: "center" }} />
            <motion.path
              d="M5.5 9.2 7.8 11.4 12.5 6.6"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-background"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.28, delay: 0.08, ease: EASE }}
            />
          </motion.svg>
        )}
        {status === "error" && (
          <motion.svg key="error" viewBox="0 0 18 18" className="size-[18px]" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={SPRING}>
            <circle cx="9" cy="9" r="8" className="fill-destructive/15" />
            {["M6.3 6.3 11.7 11.7", "M11.7 6.3 6.3 11.7"].map((d, i) => (
              <motion.path key={d} d={d} fill="none" strokeWidth="1.8" strokeLinecap="round" className="stroke-destructive" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2, delay: 0.06 + i * 0.1 }} />
            ))}
          </motion.svg>
        )}
        {status === "cancelled" && (
          <motion.svg key="cancelled" viewBox="0 0 18 18" className="size-[18px]" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={t}>
            <circle cx="9" cy="9" r="7" fill="none" strokeWidth="1.5" strokeDasharray="2.5 2.5" className="stroke-muted-foreground/60" />
            <motion.path d="M6 9h6" strokeWidth="1.6" strokeLinecap="round" className="stroke-muted-foreground" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2 }} />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Duration                                                           */
/* ------------------------------------------------------------------ */

type TimeLike = number | Date | undefined;
const toMs = (t: TimeLike) => (t === undefined ? undefined : typeof t === "number" ? t : t.getTime());

export function formatDuration(ms: number) {
  if (ms < 1000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60_000);
  const s = Math.round((ms % 60_000) / 1000);
  return `${m}m ${s}s`;
}

function useDuration(startedAt: TimeLike, endedAt: TimeLike, live: boolean) {
  const start = toMs(startedAt);
  const end = toMs(endedAt);
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!live || start === undefined || end !== undefined) return;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [live, start, end]);
  if (start === undefined) return undefined;
  return Math.max(0, (end ?? (live ? now : Date.now())) - start);
}

/* ------------------------------------------------------------------ */
/* ToolCall                                                           */
/* ------------------------------------------------------------------ */

export interface ToolCallProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Machine name, e.g. "search_web". Shown in mono. */
  name: string;
  /** Human label, e.g. "Searching the web". Defaults to `name`. */
  title?: React.ReactNode;
  /** Optional icon shown before the title. */
  icon?: LucideIcon;
  /** Lifecycle. Defaults to "pending". */
  status?: ToolCallStatus;
  /** Arguments the model passed. */
  input?: unknown;
  /** What the tool returned. */
  output?: unknown;
  /** Error message for status "error". */
  error?: string;
  /** Start time (ms epoch or Date). */
  startedAt?: number | Date;
  /** End time (ms epoch or Date). */
  endedAt?: number | Date;
  /** Approve a call awaiting approval. May return a promise. */
  onApprove?: () => void | Promise<unknown>;
  /** Deny a call awaiting approval. */
  onDeny?: () => void;
  /** Retry an errored call. */
  onRetry?: () => void;
  /** Short explanation of the action shown in approval mode. */
  approvalDescription?: React.ReactNode;
  /** Custom output UI (e.g. a search result list). Defaults to the JSON viewer. */
  renderOutput?: (output: unknown) => React.ReactNode;
  /** Start expanded. Defaults to false. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const STATUS_WORD: Record<ToolCallStatus, string> = {
  pending: "is queued",
  "awaiting-approval": "needs your approval",
  running: "is running",
  success: "succeeded",
  error: "failed",
  cancelled: "was cancelled",
};

export const ToolCall = React.forwardRef<HTMLDivElement, ToolCallProps>(
  (
    {
      name,
      title,
      icon: Icon,
      status = "pending",
      input,
      output,
      error,
      startedAt,
      endedAt,
      onApprove,
      onDeny,
      onRetry,
      approvalDescription,
      renderOutput,
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      className,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const reduce = useReducedMotion();
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = openProp ?? internalOpen;
    const setOpen = (v: boolean) => {
      if (openProp === undefined) setInternalOpen(v);
      onOpenChange?.(v);
    };
    const [approving, setApproving] = React.useState(false);
    const contentId = React.useId();
    const awaiting = status === "awaiting-approval";
    const ms = useDuration(startedAt, endedAt, status === "running");
    const label = title ?? name;

    // shake once on error
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    React.useImperativeHandle(ref, () => cardRef.current as HTMLDivElement);
    React.useEffect(() => {
      if (status === "error" && !reduce && cardRef.current) {
        void animate(cardRef.current, { x: [0, -4, 4, -3, 3, 0] }, { duration: 0.36 });
      }
      if (status !== "awaiting-approval") setApproving(false);
    }, [status, reduce]);

    const approve = async () => {
      setApproving(true);
      try {
        await onApprove?.();
      } catch {
        setApproving(false);
      }
    };

    const hasBody = input !== undefined || output !== undefined || !!error;
    const readable = typeof label === "string" ? label : name.replace(/_/g, " ");
    const announcement = `${readable} ${STATUS_WORD[status]}${status === "success" && ms !== undefined ? ` in ${(ms / 1000).toFixed(1)} seconds` : ""}`;

    return (
      <div
        ref={cardRef}
        data-status={status}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!awaiting || e.defaultPrevented) return;
          const target = e.target as HTMLElement;
          if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") return;
          if (e.key === "Enter" && target.dataset.toolHeader === undefined) {
            e.preventDefault();
            void approve();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onDeny?.();
          }
        }}
        className={cn(
          "relative w-full rounded-xl border bg-background font-sans text-sm shadow-sm transition-colors duration-200",
          awaiting ? "border-foreground/30" : status === "error" ? "border-destructive/30" : "border-border",
          className
        )}
        {...props}
      >
        {awaiting && !reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-xl ring-2 ring-foreground/15"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <button
          type="button"
          data-tool-header=""
          aria-expanded={open}
          aria-controls={contentId}
          disabled={!hasBody}
          onClick={() => setOpen(!open)}
          className={cn("group/tool flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left", ring, !hasBody && "cursor-default")}
        >
          <ToolStatusIcon status={status} />
          {Icon && <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} />}
          <span className="flex min-w-0 flex-1 items-baseline gap-2">
            <span className="truncate text-[13.5px] font-medium text-foreground">
              {status === "running" ? <ShimmerText>{label}</ShimmerText> : label}
            </span>
            <code className="hidden truncate font-mono text-[11.5px] text-muted-foreground sm:inline">{name}</code>
          </span>
          {ms !== undefined && status !== "pending" && status !== "awaiting-approval" && (
            <span className="shrink-0 text-[12px] tabular-nums text-muted-foreground">{formatDuration(ms)}</span>
          )}
          {hasBody && (
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING} className="flex shrink-0 text-muted-foreground group-hover/tool:text-foreground">
              <ChevronDown className="size-4" />
            </motion.span>
          )}
        </button>
        <span className="sr-only" aria-live="polite">
          {announcement}
        </span>

        {/* approval */}
        <AnimatePresence initial={false}>
          {awaiting && (
            <motion.div
              initial={{ gridTemplateRows: "0fr", opacity: 0 }}
              animate={{ gridTemplateRows: "1fr", opacity: 1 }}
              exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.15 } }}
              transition={reduce ? { duration: 0 } : SOFT}
              className="grid"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="flex flex-col gap-3 px-3 pb-3 sm:flex-row sm:items-center">
                  <p className="flex-1 text-[13px] leading-5 text-muted-foreground">
                    {approvalDescription ?? "This action needs your approval before it runs."}
                  </p>
                  <div className="flex shrink-0 justify-end gap-1.5">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={onDeny}
                      disabled={approving}
                      aria-label={`Deny ${readable}`}
                      className={cn("h-8 rounded-lg px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50", ring)}
                    >
                      Deny
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => void approve()}
                      disabled={approving}
                      aria-label={`Approve ${readable}`}
                      className={cn(
                        "relative flex h-8 min-w-[84px] items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-foreground px-3 text-[13px] font-medium text-background shadow-sm transition-colors hover:bg-foreground/90",
                        ring
                      )}
                    >
                      {!reduce && (
                        <motion.span
                          aria-hidden
                          className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-background/30 to-transparent"
                          initial={{ x: "-150%" }}
                          animate={{ x: "250%" }}
                          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
                        />
                      )}
                      {approving ? (
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} className="size-3.5 rounded-full border-2 border-background/30 border-t-background" />
                      ) : (
                        "Approve"
                      )}
                      <kbd className="hidden rounded border border-background/25 px-1 font-mono text-[10px] text-background/70 sm:inline">↵</kbd>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* error */}
        <AnimatePresence initial={false}>
          {status === "error" && (
            <motion.div
              initial={{ gridTemplateRows: "0fr", opacity: 0 }}
              animate={{ gridTemplateRows: "1fr", opacity: 1 }}
              exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.15 } }}
              transition={reduce ? { duration: 0 } : SOFT}
              className="grid"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/[0.06] px-2.5 py-2 text-[12.5px] text-destructive">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  <span className="flex-1 [overflow-wrap:anywhere]">{error ?? "The tool call failed."}</span>
                  {onRetry && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={onRetry}
                      className={cn("inline-flex h-7 items-center gap-1 rounded-md border border-destructive/30 bg-background px-2 text-[12px] font-medium transition-colors hover:bg-destructive/10", ring)}
                    >
                      <RotateCw className="size-3" /> Retry
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* body */}
        <motion.div
          id={contentId}
          initial={false}
          animate={{ gridTemplateRows: open && hasBody ? "1fr" : "0fr", opacity: open && hasBody ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : SOFT}
          className="grid"
          aria-hidden={!open}
          inert={!open || undefined}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-2 border-t border-border p-3">
              {input !== undefined && <JsonViewer label="Input" value={input} />}
              {output !== undefined &&
                (renderOutput ? (
                  <div>
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Output</p>
                    {renderOutput(output)}
                  </div>
                ) : (
                  <JsonViewer label="Output" value={output} />
                ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);
ToolCall.displayName = "ToolCall";

/* ------------------------------------------------------------------ */
/* ToolCallGroup                                                      */
/* ------------------------------------------------------------------ */

function RollingNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const prev = React.useRef(value);
  const dir = value >= prev.current ? 1 : -1;
  React.useEffect(() => {
    prev.current = value;
  }, [value]);
  return (
    <span className="relative inline-flex h-[1.25em] overflow-hidden tabular-nums">
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.span
          key={value}
          custom={dir}
          variants={{
            enter: (d: number) => ({ y: reduce ? 0 : `${d * 100}%`, opacity: 0 }),
            center: { y: 0, opacity: 1 },
            exit: (d: number) => ({ y: reduce ? 0 : `${d * -100}%`, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: EASE }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export interface ToolCallGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the header label. Receives the number of tool calls. */
  label?: (count: number) => React.ReactNode;
  /** Start collapsed. Defaults to false (open). */
  defaultCollapsed?: boolean;
}

export const ToolCallGroup = React.forwardRef<HTMLDivElement, ToolCallGroupProps>(
  ({ label, defaultCollapsed = false, className, children, ...props }, ref) => {
    const reduce = useReducedMotion();
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const items = React.Children.toArray(children).filter(React.isValidElement);
    const count = items.length;
    const anyRunning = items.some((c) => (c.props as { status?: ToolCallStatus }).status === "running");
    const id = React.useId();

    return (
      <div ref={ref} className={cn("w-full font-sans", className)} {...props}>
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={id}
          onClick={() => setCollapsed((c) => !c)}
          className={cn("group/g -mx-1.5 mb-2 inline-flex h-8 items-center gap-1.5 rounded-lg px-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground", ring)}
        >
          {anyRunning ? <ShimmerText>Using tools…</ShimmerText> : label ? label(count) : (
            <span className="inline-flex items-center gap-1">
              Used <RollingNumber value={count} /> {count === 1 ? "tool" : "tools"}
            </span>
          )}
          {anyRunning && (
            <span className="tabular-nums text-muted-foreground/70">
              <RollingNumber value={count} />
            </span>
          )}
          <motion.span animate={{ rotate: collapsed ? -90 : 0 }} transition={SPRING} className="flex">
            <ChevronDown className="size-3.5" />
          </motion.span>
        </button>
        <motion.div
          id={id}
          initial={false}
          animate={{ gridTemplateRows: collapsed ? "0fr" : "1fr", opacity: collapsed ? 0 : 1 }}
          transition={reduce ? { duration: 0 } : SOFT}
          className="grid"
          inert={collapsed || undefined}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="flex flex-col gap-2 p-px">
              <AnimatePresence initial={false}>
                {items.map((child, i) => (
                  <motion.div
                    key={child.key ?? i}
                    layout={!reduce}
                    initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE, delay: i * 0.06 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  >
                    {child}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
);
ToolCallGroup.displayName = "ToolCallGroup";

export default ToolCall;

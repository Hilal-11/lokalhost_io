"use client";

import * as React from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerText } from "../shimmer-text/shimmer-text";

const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
const SOFT = { type: "spring", stiffness: 260, damping: 26 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type PlanStepStatus = "todo" | "active" | "done" | "failed" | "skipped";

export interface PlanStep {
  /** Stable id — keep it stable across re-plans so animations track the right row. */
  id: string;
  title: string;
  /** Muted helper text, clamped to two lines. */
  description?: string;
  status: PlanStepStatus;
  /** Nested steps. The active step expands them automatically. */
  substeps?: PlanStep[];
  /** ms epoch or Date. */
  startedAt?: number | Date;
  endedAt?: number | Date;
  /** Extra UI under the step (e.g. an error + "Retry from here", or a ToolCall). */
  meta?: React.ReactNode;
}

export interface AgentPlanProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Plan title, e.g. "Building your landing page". */
  title?: React.ReactNode;
  steps: PlanStep[];
  /** Makes rows clickable. */
  onStepClick?: (step: PlanStep) => void;
  /** Show the collapse button in the header. Defaults to true. */
  collapsible?: boolean;
  /** Start collapsed. */
  defaultCollapsed?: boolean;
  /** "vertical" timeline or a "compact" dot row. Defaults to "vertical". */
  variant?: "vertical" | "compact";
}

const toMs = (t?: number | Date) => (t === undefined ? undefined : typeof t === "number" ? t : t.getTime());

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}

function useNow(live: boolean) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, [live]);
  return now;
}

const STATUS_TEXT: Record<PlanStepStatus, string> = {
  todo: "not started",
  active: "in progress",
  done: "completed",
  failed: "failed",
  skipped: "skipped",
};

/* ------------------------------------------------------------------ */
/* Pieces                                                             */
/* ------------------------------------------------------------------ */

function RollingNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const prev = React.useRef(value);
  const dir = value >= prev.current ? 1 : -1;
  React.useEffect(() => {
    prev.current = value;
  }, [value]);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom tabular-nums">
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

export function StepNode({ status, size = 20 }: { status: PlanStepStatus; size?: number }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    if (status === "failed" && !reduce && ref.current) void animate(ref.current, { x: [0, -3, 3, -2, 2, 0] }, { duration: 0.35 });
  }, [status, reduce]);

  return (
    <span ref={ref} className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
      <AnimatePresence mode="wait" initial={false}>
        {status === "todo" && (
          <motion.span key="todo" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }} className="size-[60%] rounded-full border-[1.5px] border-muted-foreground/40 bg-background" />
        )}
        {status === "active" && (
          <motion.span key="active" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={SPRING} className="relative flex size-full items-center justify-center">
            {!reduce && (
              <motion.span
                className="absolute inset-0 rounded-full bg-foreground/25"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <span className="relative flex size-full items-center justify-center rounded-full border-[1.5px] border-foreground bg-background">
              <span className="size-[40%] rounded-full bg-foreground" />
            </span>
          </motion.span>
        )}
        {status === "done" && (
          <motion.span
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: reduce ? 1 : [0.8, 1.1, 1], opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="flex size-full items-center justify-center rounded-full bg-foreground text-background"
          >
            <svg viewBox="0 0 16 16" className="size-[62%]">
              <motion.path d="M3.5 8.4 6.6 11.4 12.5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.28, delay: 0.06, ease: EASE }} />
            </svg>
          </motion.span>
        )}
        {status === "failed" && (
          <motion.span key="failed" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING} className="flex size-full items-center justify-center rounded-full border-[1.5px] border-destructive bg-background text-destructive">
            <svg viewBox="0 0 16 16" className="size-[56%]">
              {["M4.5 4.5 11.5 11.5", "M11.5 4.5 4.5 11.5"].map((d, i) => (
                <motion.path key={d} d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.18, delay: 0.05 + i * 0.09 }} />
              ))}
            </svg>
          </motion.span>
        )}
        {status === "skipped" && (
          <motion.span key="skipped" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="size-[70%] rounded-full border-[1.5px] border-dashed border-muted-foreground/50" />
        )}
      </AnimatePresence>
    </span>
  );
}

function StepTitle({ step, small }: { step: PlanStep; small?: boolean }) {
  const cls = cn(small ? "text-[13px]" : "text-[13.5px] font-medium");
  if (step.status === "active") return <ShimmerText className={cls}>{step.title}</ShimmerText>;
  return (
    <span
      className={cn(
        cls,
        step.status === "todo" && "text-muted-foreground",
        step.status === "done" && "text-foreground",
        step.status === "failed" && "text-destructive",
        step.status === "skipped" && "text-muted-foreground/70 line-through decoration-muted-foreground/50"
      )}
    >
      {step.title}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Vertical row                                                       */
/* ------------------------------------------------------------------ */

function StepRow({ step, isLast, onStepClick, now }: { step: PlanStep; isLast: boolean; onStepClick?: (s: PlanStep) => void; now: number }) {
  const reduce = useReducedMotion();
  const subs = step.substeps ?? [];
  const [override, setOverride] = React.useState<boolean | null>(null);
  // active steps auto-expand, finished steps auto-collapse — until the user decides
  React.useEffect(() => setOverride(null), [step.status]);
  const expanded = override ?? step.status === "active";
  const filled = step.status === "done" || step.status === "skipped";

  const start = toMs(step.startedAt);
  const end = toMs(step.endedAt);
  const duration = start !== undefined ? (end ?? (step.status === "active" ? now : undefined)) : undefined;

  return (
    <motion.li
      layout={!reduce}
      role="listitem"
      aria-current={step.status === "active" ? "step" : undefined}
      initial={{ opacity: 0, x: reduce ? 0 : -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ ...SOFT, opacity: { duration: 0.24 } }}
      className="relative flex gap-3"
    >
      {/* rail */}
      <div className="relative flex w-5 shrink-0 flex-col items-center pt-2.5">
        <StepNode status={step.status} />
        {!isLast && (
          <span className="relative mt-1 w-0.5 flex-1 overflow-hidden rounded-full bg-border">
            <motion.span
              className="absolute inset-0 origin-top rounded-full bg-foreground"
              initial={false}
              animate={{ scaleY: filled ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
            />
          </span>
        )}
      </div>

      <div className={cn("min-w-0 flex-1", !isLast && "pb-2")}>
        <div
          role={onStepClick ? "button" : undefined}
          tabIndex={onStepClick ? 0 : undefined}
          onClick={onStepClick ? () => onStepClick(step) : undefined}
          onKeyDown={
            onStepClick
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onStepClick(step);
                  }
                }
              : undefined
          }
          className={cn("-mx-2 flex items-start gap-2 rounded-lg px-2 py-2 transition-colors duration-150 hover:bg-accent/50", onStepClick && cn("cursor-pointer", ring))}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <StepTitle step={step} />
              <span className="sr-only">, {STATUS_TEXT[step.status]}</span>
            </div>
            {step.description && <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-5 text-muted-foreground">{step.description}</p>}
          </div>
          {duration !== undefined && start !== undefined && (
            <span className="shrink-0 pt-px text-[12px] tabular-nums text-muted-foreground">{fmt(duration - start)}</span>
          )}
          {subs.length > 0 && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={expanded ? "Hide substeps" : "Show substeps"}
              onClick={(e) => {
                e.stopPropagation();
                setOverride(!expanded);
              }}
              className={cn("-my-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", ring)}
            >
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={SPRING} className="flex">
                <ChevronDown className="size-3.5" />
              </motion.span>
            </button>
          )}
        </div>

        {subs.length > 0 && (
          <motion.div
            initial={false}
            animate={{ gridTemplateRows: expanded ? "1fr" : "0fr", opacity: expanded ? 1 : 0 }}
            transition={reduce ? { duration: 0 } : SOFT}
            className="grid"
            inert={!expanded || undefined}
          >
            <div className="min-h-0 overflow-hidden">
              <motion.ul
                role="list"
                initial={false}
                animate={expanded ? "show" : "hide"}
                variants={{ show: { transition: { staggerChildren: 0.04 } }, hide: {} }}
                className="flex flex-col gap-1 pb-1 pl-1 pt-0.5"
              >
                {subs.map((s) => (
                  <motion.li
                    key={s.id}
                    role="listitem"
                    aria-current={s.status === "active" ? "step" : undefined}
                    variants={{ show: { opacity: 1, y: 0 }, hide: { opacity: 0, y: reduce ? 0 : -4 } }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="flex items-center gap-2"
                  >
                    <StepNode status={s.status} size={14} />
                    <StepTitle step={s} small />
                    <span className="sr-only">, {STATUS_TEXT[s.status]}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {step.meta && (
            <motion.div
              initial={{ gridTemplateRows: "0fr", opacity: 0 }}
              animate={{ gridTemplateRows: "1fr", opacity: 1 }}
              exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.15 } }}
              transition={reduce ? { duration: 0 } : SOFT}
              className="grid"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-2 pt-1">{step.meta}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Compact                                                            */
/* ------------------------------------------------------------------ */

function CompactPlan({ steps }: { steps: PlanStep[] }) {
  const reduce = useReducedMotion();
  const active = steps.find((s) => s.status === "active" || s.status === "failed") ?? [...steps].reverse().find((s) => s.status === "done");
  return (
    <div className="flex flex-col gap-2.5 px-4 pb-4">
      <ol role="list" className="flex items-center">
        <AnimatePresence initial={false}>
          {steps.map((s, i) => (
            <motion.li
              key={s.id}
              layout={!reduce}
              role="listitem"
              aria-current={s.status === "active" ? "step" : undefined}
              aria-label={`${s.title}, ${STATUS_TEXT[s.status]}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              className={cn("flex items-center", i < steps.length - 1 && "flex-1")}
            >
              <StepNode status={s.status} size={16} />
              {i < steps.length - 1 && (
                <span className="relative mx-1 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                  <motion.span
                    className="absolute inset-0 origin-left rounded-full bg-foreground"
                    initial={false}
                    animate={{ scaleX: s.status === "done" || s.status === "skipped" ? 1 : 0 }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                  />
                </span>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div className="relative h-5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {active && (
            <motion.div
              key={active.id + active.status}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.15 } }}
              transition={{ duration: 0.22, ease: EASE }}
              className="truncate"
            >
              <StepTitle step={active} small />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

export const AgentPlan = React.forwardRef<HTMLDivElement, AgentPlanProps>(
  ({ title = "Plan", steps, onStepClick, collapsible = true, defaultCollapsed = false, variant = "vertical", className, ...props }, ref) => {
    const reduce = useReducedMotion();
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
    const total = steps.length;
    const finished = steps.filter((s) => s.status === "done" || s.status === "skipped").length;
    const allDone = total > 0 && finished === total;
    const running = steps.some((s) => s.status === "active");
    const now = useNow(running);
    const bodyId = React.useId();

    const starts = steps.map((s) => toMs(s.startedAt)).filter((n): n is number => n !== undefined);
    const ends = steps.map((s) => toMs(s.endedAt)).filter((n): n is number => n !== undefined);
    const elapsed = starts.length ? (running ? now : Math.max(...ends, Math.min(...starts))) - Math.min(...starts) : undefined;

    // one-time celebration flash
    const [flash, setFlash] = React.useState(false);
    const wasDone = React.useRef(allDone);
    React.useEffect(() => {
      if (allDone && !wasDone.current) {
        setFlash(true);
        const t = window.setTimeout(() => setFlash(false), 900);
        wasDone.current = true;
        return () => window.clearTimeout(t);
      }
      wasDone.current = allDone;
    }, [allDone]);

    return (
      <div ref={ref} className={cn("w-full rounded-xl border border-border bg-background font-sans text-sm shadow-sm", className)} {...props}>
        {/* header */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[14px] font-semibold tracking-tight text-foreground">{title}</h3>
              <AnimatePresence>
                {allDone && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="flex size-[18px] items-center justify-center rounded-full bg-success text-background"
                    aria-label="All steps complete"
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-muted-foreground">
              <RollingNumber value={finished} /> of <RollingNumber value={total} />
              {elapsed !== undefined && (
                <>
                  <span aria-hidden className="px-1 text-muted-foreground/50">·</span>
                  <span className="tabular-nums">{fmt(elapsed)}</span>
                </>
              )}
            </p>
          </div>
          {collapsible && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              aria-expanded={!collapsed}
              aria-controls={bodyId}
              aria-label={collapsed ? "Expand plan" : "Collapse plan"}
              onClick={() => setCollapsed((c) => !c)}
              className={cn("flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", ring)}
            >
              <motion.span animate={{ rotate: collapsed ? -90 : 0 }} transition={SPRING} className="flex">
                <ChevronDown className="size-4" />
              </motion.span>
            </motion.button>
          )}
        </div>

        {/* progress */}
        <div className="px-4 pb-3">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={finished}
            aria-label="Plan progress"
            className="h-1 overflow-hidden rounded-full bg-muted"
          >
            <motion.div
              className={cn("h-full origin-left rounded-full transition-colors duration-500", flash ? "bg-success" : "bg-foreground")}
              initial={false}
              animate={{ scaleX: total ? finished / total : 0 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 22 }}
            />
          </div>
        </div>

        <motion.div
          id={bodyId}
          initial={false}
          animate={{ gridTemplateRows: collapsed ? "0fr" : "1fr", opacity: collapsed ? 0 : 1 }}
          transition={reduce ? { duration: 0 } : SOFT}
          className="grid"
          inert={collapsed || undefined}
        >
          <div className="min-h-0 overflow-hidden">
            {variant === "compact" ? (
              <CompactPlan steps={steps} />
            ) : (
              <ol role="list" className="flex flex-col px-4 pb-3">
                <AnimatePresence initial={false}>
                  {steps.map((s, i) => (
                    <StepRow key={s.id} step={s} isLast={i === steps.length - 1} onStepClick={onStepClick} now={now} />
                  ))}
                </AnimatePresence>
              </ol>
            )}
          </div>
        </motion.div>
      </div>
    );
  }
);
AgentPlan.displayName = "AgentPlan";

export default AgentPlan;

"use client";

import * as React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Brain, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerText } from "../shimmer-text/shimmer-text";

export { ShimmerText } from "../shimmer-text/shimmer-text";

/* ------------------------------------------------------------------ */
/* Motion tokens                                                      */
/* ------------------------------------------------------------------ */

const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
const SOFT = { type: "spring", stiffness: 260, damping: 26 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type ReasoningStepStatus = "pending" | "active" | "done";

export interface ReasoningStep {
  /** Stable id. Falls back to the title. */
  id?: string;
  /** Short label, e.g. "Searching docs". */
  title: string;
  /** Step state. */
  status: ReasoningStepStatus;
}

export interface ReasoningProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** True while the model is still thinking. Drives the live timer and the shimmer. */
  isStreaming?: boolean;
  /** Uncontrolled initial open state. Defaults to `isStreaming`. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Called when the panel opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Final thinking duration in seconds. If omitted, the measured time is used. */
  duration?: number;
  /** Collapse 600ms after thinking ends. Disabled for an instance once the user toggles it. Defaults to true. */
  autoCollapse?: boolean;
  /** Render a mini step list instead of raw text. */
  steps?: ReasoningStep[];
}

interface ReasoningContextValue {
  isStreaming: boolean;
  open: boolean;
  setOpen: (open: boolean, byUser?: boolean) => void;
  seconds: number;
  finished: boolean;
  steps?: ReasoningStep[];
  contentId: string;
}

const ReasoningContext = React.createContext<ReasoningContextValue | null>(null);

function useReasoning() {
  const ctx = React.useContext(ReasoningContext);
  if (!ctx) throw new Error("Reasoning.* must be used inside <Reasoning>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

const ReasoningRoot = React.forwardRef<HTMLDivElement, ReasoningProps>(
  (
    {
      isStreaming = false,
      defaultOpen,
      open: openProp,
      onOpenChange,
      duration,
      autoCollapse = true,
      steps,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? isStreaming);
    const controlled = openProp !== undefined;
    const open = controlled ? openProp : internalOpen;

    const userToggled = React.useRef(false);
    const startedAt = React.useRef<number | null>(isStreaming ? Date.now() : null);
    const [elapsed, setElapsed] = React.useState(0);
    const [finished, setFinished] = React.useState(!isStreaming && duration !== undefined);
    const wasStreaming = React.useRef(isStreaming);
    const contentId = React.useId();

    const setOpen = React.useCallback(
      (next: boolean, byUser = false) => {
        if (byUser) userToggled.current = true;
        if (!controlled) setInternalOpen(next);
        onOpenChange?.(next);
      },
      [controlled, onOpenChange]
    );

    // live timer
    React.useEffect(() => {
      if (!isStreaming) return;
      if (startedAt.current === null) startedAt.current = Date.now();
      const tick = () => setElapsed(Math.floor((Date.now() - (startedAt.current ?? Date.now())) / 1000));
      tick();
      const id = window.setInterval(tick, 250);
      return () => window.clearInterval(id);
    }, [isStreaming]);

    // streaming transitions
    React.useEffect(() => {
      if (isStreaming && !wasStreaming.current) {
        // a new thinking run (e.g. replay)
        startedAt.current = Date.now();
        setElapsed(0);
        setFinished(false);
        userToggled.current = false;
        setOpen(true);
      }
      if (!isStreaming && wasStreaming.current) {
        setFinished(true);
        if (startedAt.current !== null) {
          setElapsed(Math.round((Date.now() - startedAt.current) / 1000));
        }
        if (autoCollapse && !userToggled.current) {
          const t = window.setTimeout(() => setOpen(false), 600);
          wasStreaming.current = isStreaming;
          return () => window.clearTimeout(t);
        }
      }
      wasStreaming.current = isStreaming;
    }, [isStreaming, autoCollapse, setOpen]);

    const seconds = !isStreaming && duration !== undefined ? Math.round(duration) : elapsed;

    return (
      <ReasoningContext.Provider
        value={{ isStreaming, open, setOpen, seconds, finished, steps, contentId }}
      >
        <Collapsible.Root open={open} onOpenChange={(o) => setOpen(o, true)} asChild>
          <div
            ref={ref}
            data-state={open ? "open" : "closed"}
            data-streaming={isStreaming || undefined}
            className={cn("w-full font-sans text-sm", className)}
            {...props}
          >
            {children}
            <span className="sr-only" aria-live="polite">
              {finished ? "Finished thinking" : ""}
            </span>
          </div>
        </Collapsible.Root>
      </ReasoningContext.Provider>
    );
  }
);
ReasoningRoot.displayName = "Reasoning";

/* ------------------------------------------------------------------ */
/* Trigger                                                            */
/* ------------------------------------------------------------------ */

export interface ReasoningTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label while thinking. Defaults to "Thinking…". */
  thinkingLabel?: string;
  /** Custom done label. Receives the duration in seconds. */
  doneLabel?: (seconds: number) => string;
  /** Hide the live timer. */
  hideTimer?: boolean;
}

const defaultDoneLabel = (s: number) => (s < 2 ? "Thought for a few seconds" : `Thought for ${s}s`);

const ReasoningTrigger = React.forwardRef<HTMLButtonElement, ReasoningTriggerProps>(
  ({ thinkingLabel = "Thinking…", doneLabel = defaultDoneLabel, hideTimer, className, ...props }, ref) => {
    const { isStreaming, open, seconds } = useReasoning();
    const reduce = useReducedMotion();

    return (
      <Collapsible.Trigger asChild>
        <button
          ref={ref}
          type="button"
          className={cn(
            "group/trigger -mx-1.5 inline-flex h-8 items-center gap-2 rounded-lg px-1.5 text-[13px] font-medium",
            "text-muted-foreground transition-colors duration-150 hover:text-foreground",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
          {...props}
        >
          <motion.span
            aria-hidden
            className="flex size-4 items-center justify-center"
            animate={isStreaming && !reduce ? { rotate: [-8, 8, -8] } : { rotate: 0 }}
            transition={isStreaming && !reduce ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : SPRING}
          >
            <Brain className="size-4" strokeWidth={1.75} />
          </motion.span>

          <span className="relative inline-flex items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {isStreaming ? (
                <motion.span
                  key="thinking"
                  className="inline-flex items-center gap-1.5"
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  <ShimmerText>{thinkingLabel}</ShimmerText>
                  {!hideTimer && (
                    <span aria-hidden className="tabular-nums text-muted-foreground/70">
                      {seconds}s
                    </span>
                  )}
                </motion.span>
              ) : (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  {doneLabel(seconds)}
                </motion.span>
              )}
            </AnimatePresence>
          </span>

          <motion.span
            aria-hidden
            animate={{ rotate: open ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : SPRING}
            className="flex size-4 items-center justify-center text-muted-foreground/70 group-hover/trigger:text-foreground"
          >
            <ChevronDown className="size-3.5" />
          </motion.span>
        </button>
      </Collapsible.Trigger>
    );
  }
);
ReasoningTrigger.displayName = "Reasoning.Trigger";

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */

const PULSE_CSS = `
@keyframes lk-reasoning-pulse { 0% { transform: translateY(-100%); } 100% { transform: translateY(400%); } }
.lk-reasoning-pulse { animation: lk-reasoning-pulse 1.6s cubic-bezier(0.4,0,0.2,1) infinite; }
@media (prefers-reduced-motion: reduce) { .lk-reasoning-pulse { animation: none; opacity: 0; } }
`;

export interface ReasoningContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Max height of the scroll area in px. Defaults to 240. */
  maxHeight?: number;
}

const ReasoningContent = React.forwardRef<HTMLDivElement, ReasoningContentProps>(
  ({ maxHeight = 240, className, children, ...props }, ref) => {
    const { open, isStreaming, steps } = useReasoning();
    const reduce = useReducedMotion();
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const stick = React.useRef(true);
    const [scrolled, setScrolled] = React.useState(false);

    // follow the bottom while streaming, unless the user scrolled up
    React.useLayoutEffect(() => {
      const el = scrollRef.current;
      if (!el || !isStreaming || !stick.current) return;
      el.scrollTop = el.scrollHeight;
    }, [children, steps, isStreaming]);

    const onScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      setScrolled(el.scrollTop > 4);
    };

    return (
      <Collapsible.Content forceMount asChild>
        <motion.div
          ref={ref}
          initial={false}
          animate={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : SOFT}
          className={cn("grid", className)}
          aria-hidden={!open}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          <style href="lk-reasoning-pulse" precedence="default">
            {PULSE_CSS}
          </style>
          <div className="min-h-0 overflow-hidden">
            <motion.div
              animate={{ y: open || reduce ? 0 : -4 }}
              transition={reduce ? { duration: 0 } : SOFT}
              className="relative mt-1.5 pl-4"
            >
              {/* rail */}
              <span aria-hidden className="absolute bottom-1 left-[7px] top-1 w-0.5 overflow-hidden rounded-full bg-border">
                {isStreaming && (
                  <span className="lk-reasoning-pulse absolute inset-x-0 top-0 h-1/4 rounded-full bg-gradient-to-b from-transparent via-foreground/50 to-transparent" />
                )}
              </span>

              <div
                ref={scrollRef}
                onScroll={onScroll}
                tabIndex={open ? 0 : -1}
                className="overflow-y-auto overscroll-contain pl-2 pr-1 outline-none [scrollbar-width:thin]"
                style={{
                  maxHeight,
                  maskImage: scrolled ? "linear-gradient(to bottom, transparent 0, #000 28px)" : undefined,
                  WebkitMaskImage: scrolled ? "linear-gradient(to bottom, transparent 0, #000 28px)" : undefined,
                }}
              >
                {steps && steps.length > 0 ? (
                  <ReasoningSteps steps={steps} />
                ) : (
                  <div className="whitespace-pre-wrap py-1 text-[13px] leading-relaxed text-muted-foreground">
                    {children}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Collapsible.Content>
    );
  }
);
ReasoningContent.displayName = "Reasoning.Content";

function ReasoningSteps({ steps }: { steps: ReasoningStep[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="flex flex-col gap-1.5 py-1">
      <AnimatePresence initial={false}>
        {steps.map((step) => (
          <motion.li
            key={step.id ?? step.title}
            layout={!reduce}
            initial={{ opacity: 0, x: reduce ? 0 : -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="flex items-center gap-2 text-[13px]"
          >
            <span className="flex size-4 shrink-0 items-center justify-center">
              {step.status === "done" ? (
                <motion.span
                  initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING}
                  className="flex size-4 items-center justify-center rounded-full bg-foreground text-background"
                >
                  <Check className="size-2.5" strokeWidth={3} />
                </motion.span>
              ) : step.status === "active" ? (
                <span className="relative flex size-2">
                  {!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-foreground/40" />}
                  <span className="relative size-2 rounded-full bg-foreground" />
                </span>
              ) : (
                <span className="size-2 rounded-full border border-muted-foreground/50" />
              )}
            </span>
            {step.status === "active" ? (
              <ShimmerText>{step.title}</ShimmerText>
            ) : (
              <span className={step.status === "done" ? "text-foreground/80" : "text-muted-foreground/70"}>
                {step.title}
              </span>
            )}
            <span className="sr-only">
              {step.status === "done" ? "completed" : step.status === "active" ? "in progress" : "pending"}
            </span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

type ReasoningComponent = typeof ReasoningRoot & {
  Trigger: typeof ReasoningTrigger;
  Content: typeof ReasoningContent;
};

export const Reasoning = ReasoningRoot as ReasoningComponent;
Reasoning.Trigger = ReasoningTrigger;
Reasoning.Content = ReasoningContent;

export { ReasoningTrigger, ReasoningContent };

export interface ReasoningPanelProps extends Omit<ReasoningProps, "children"> {
  /** The reasoning text (streamed or complete). */
  reasoning?: string;
}

/** Simple default: trigger + content in one line. */
export default function ReasoningPanel({ reasoning, ...props }: ReasoningPanelProps) {
  return (
    <Reasoning {...props}>
      <Reasoning.Trigger />
      <Reasoning.Content>{reasoning}</Reasoning.Content>
    </Reasoning>
  );
}

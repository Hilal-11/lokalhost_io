"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";

export interface BranchSwitcherProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 1-based index of the visible version. */
  current: number;
  /** Number of versions. */
  total: number;
  /** Called with the new 1-based index. */
  onChange?: (next: number) => void;
}

/** "‹ 2 / 3 ›" — switches between regenerated or edited versions of a message. */
export const BranchSwitcher = React.forwardRef<HTMLDivElement, BranchSwitcherProps>(
  ({ current, total, onChange, className, onKeyDown, ...props }, ref) => {
    const reduce = useReducedMotion();
    const prev = React.useRef(current);
    const direction = current >= prev.current ? 1 : -1;
    React.useEffect(() => {
      prev.current = current;
    }, [current]);

    if (total <= 1) return null;

    const go = (n: number) => {
      const next = Math.min(total, Math.max(1, n));
      if (next !== current) onChange?.(next);
    };

    const btn = cn(
      "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-35",
      ring
    );

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`Version ${current} of ${total}`}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            go(current - 1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            go(current + 1);
          }
        }}
        className={cn("inline-flex items-center gap-0.5 font-sans text-[12.5px] text-muted-foreground", className)}
        {...props}
      >
        <motion.button type="button" whileTap={{ scale: 0.9 }} className={btn} disabled={current <= 1} onClick={() => go(current - 1)} aria-label="Previous version">
          <ChevronLeft className="size-4" />
        </motion.button>
        <span className="flex min-w-[38px] items-center justify-center tabular-nums" aria-live="polite">
          <span className="relative inline-flex h-5 items-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span
                key={current}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ y: reduce ? 0 : d * 12, opacity: 0 }),
                  center: { y: 0, opacity: 1 },
                  exit: (d: number) => ({ y: reduce ? 0 : d * -12, opacity: 0, transition: { duration: 0.15 } }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22, ease: EASE }}
                className="inline-block text-foreground"
              >
                {current}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="px-0.5 text-muted-foreground/60">/</span>
          <span>{total}</span>
        </span>
        <motion.button type="button" whileTap={{ scale: 0.9 }} className={btn} disabled={current >= total} onClick={() => go(current + 1)} aria-label="Next version">
          <ChevronRight className="size-4" />
        </motion.button>
      </div>
    );
  }
);
BranchSwitcher.displayName = "BranchSwitcher";

export interface BranchContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The visible version. Changing it crossfades the content. */
  current: number;
}

/** Wrap a message body so switching versions crossfades instead of snapping. */
export function BranchContent({ current, className, children }: BranchContentProps) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("grid", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, filter: reduce ? "none" : "blur(2px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.26, ease: EASE }}
          className="[grid-area:1/1]"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default BranchSwitcher;

"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* ShimmerText — a light band sweeping across text.                   */
/* Pure CSS (background-clip + background-position), GPU-cheap.       */
/* ------------------------------------------------------------------ */

const SHIMMER_CSS = `
@keyframes lk-shimmer-sweep {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
.lk-shimmer {
  --lk-shimmer-base: var(--muted-foreground);
  --lk-shimmer-highlight: var(--foreground);
  color: transparent;
  background-image: linear-gradient(
    90deg,
    var(--lk-shimmer-base) 0%,
    var(--lk-shimmer-base) 40%,
    var(--lk-shimmer-highlight) 50%,
    var(--lk-shimmer-base) 60%,
    var(--lk-shimmer-base) 100%
  );
  background-size: 200% 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  animation: lk-shimmer-sweep var(--lk-shimmer-duration, 1.8s) linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  .lk-shimmer { animation: none; color: var(--lk-shimmer-base); background: none; }
}
`;

/** Renders the shimmer keyframes once. React 19 hoists + dedupes styles with the same href. */
export function ShimmerStyles() {
  return (
    <style href="lk-shimmer" precedence="default">
      {SHIMMER_CSS}
    </style>
  );
}

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Turn the sweep on/off. When false the text renders in plain `currentColor`. Defaults to true. */
  active?: boolean;
  /** One sweep duration in seconds. Defaults to 1.8. */
  duration?: number;
  /** Render as a different element. Defaults to "span". */
  as?: "span" | "p" | "div";
}

export const ShimmerText = React.forwardRef<HTMLSpanElement, ShimmerTextProps>(
  ({ active = true, duration = 1.8, as = "span", className, style, children, ...props }, ref) => {
    const reduce = useReducedMotion();
    const Comp = as as "span";
    const on = active && !reduce;
    return (
      <>
        <ShimmerStyles />
        <Comp
          ref={ref}
          data-shimmer={on || undefined}
          className={cn(on && "lk-shimmer", "inline-block", className)}
          style={on ? ({ "--lk-shimmer-duration": `${duration}s`, ...style } as React.CSSProperties) : style}
          {...props}
        >
          {children}
        </Comp>
      </>
    );
  }
);
ShimmerText.displayName = "ShimmerText";

export default ShimmerText;

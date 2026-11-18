"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type Viewport = "desktop" | "tablet" | "mobile";
export const VIEWPORT_WIDTH: Record<Viewport, number | null> = { desktop: null, tablet: 768, mobile: 390 };

const HEIGHT_MESSAGE = "lk-block-height";

/**
 * Iframe preview for one block. Width follows the viewport toggle; height follows
 * the block itself (the preview page posts its scrollHeight), so there's no
 * inner scrollbar on desktop. `fill` makes it take all available height instead.
 */
export function BlockFrame({
  src,
  id,
  title,
  viewport,
  initialHeight = 720,
  fill = false,
  reloadKey = 0,
}: {
  src: string;
  id: string;
  title: string;
  viewport: Viewport;
  initialHeight?: number;
  fill?: boolean;
  reloadKey?: number;
}) {
  const reduce = useReducedMotion();
  const [height, setHeight] = React.useState(initialHeight);
  const [loaded, setLoaded] = React.useState(false);
  const width = VIEWPORT_WIDTH[viewport];

  React.useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const data = e.data as { type?: string; id?: string; height?: number };
      if (data?.type === HEIGHT_MESSAGE && data.id === id && typeof data.height === "number") {
        setHeight(Math.max(240, Math.ceil(data.height)));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [id]);

  React.useEffect(() => setLoaded(false), [reloadKey, src]);

  return (
    <div
      className={cn(
        "relative flex w-full justify-center overflow-hidden bg-neutral-100/70 dark:bg-neutral-900/40",
        viewport !== "desktop" && "py-4",
        fill && "h-full"
      )}
    >
      {/* dotted canvas behind narrow viewports */}
      {viewport !== "desktop" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-neutral-300/70 dark:text-neutral-800"
          style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />
      )}
      <motion.div
        initial={false}
        animate={{ width: width ?? "100%" }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 32 }}
        className={cn(
          "relative max-w-full overflow-hidden bg-white dark:bg-neutral-950",
          viewport !== "desktop" && "rounded-xl border border-neutral-200 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.2)] dark:border-neutral-800",
          fill && "h-full"
        )}
      >
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col gap-3 bg-white p-8 dark:bg-neutral-950" aria-hidden>
            <div className="h-3 w-1/4 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-6 w-2/3 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-6 w-1/2 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 h-40 w-full animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-900" />
          </div>
        )}
        <iframe
          key={reloadKey}
          src={src}
          title={title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="block w-full border-0 bg-white dark:bg-neutral-950"
          style={{ height: fill ? "100%" : height }}
        />
      </motion.div>
    </div>
  );
}

import React from 'react'
import { cn } from "@/lib/utils"

/* ── Shimmer pulse primitive ── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800/60",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/5 before:to-transparent",
        "before:animate-[shimmer_1.6s_ease-in-out_infinite]",
        className
      )}
    />
  )
}

/* ── Single card skeleton — mirrors the actual template/design card ── */
function TemplateCardSkeleton() {
  return (
    <div className="w-full h-auto flex flex-wrap border-t border-dashed border-neutral-200 dark:border-neutral-800">

      {/* ── Left info column ── */}
      <div className="xl:w-[30%] lg:w-[40%] md:w-[50%] w-full px-6 border-r border-dashed border-neutral-200 dark:border-neutral-800 py-5">

        {/* title */}
        <Skeleton className="h-8 w-4/5 mb-2" />
        <Skeleton className="h-8 w-3/5 mb-5" />

        {/* description lines */}
        <Skeleton className="h-3.5 w-full mb-2" />
        <Skeleton className="h-3.5 w-full mb-2" />
        <Skeleton className="h-3.5 w-3/4 mb-6" />

        {/* date + price row */}
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-7 w-24 rounded-sm" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>

        {/* tech stack icons */}
        <div className="flex gap-1.5 mb-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-[30px] h-[30px] rounded-sm flex-shrink-0" />
          ))}
        </div>

        {/* view button */}
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>

      {/* ── Right images column ── */}
      <div className="xl:w-[70%] lg:w-[60%] md:w-[50%] w-full p-14">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 h-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(
                "rounded-lg",
                i === 0 ? "h-[180px]" : "h-[180px]",
                // stagger the shimmer timing
                i === 1 && "before:[animation-delay:0.2s]",
                i === 2 && "before:[animation-delay:0.4s]",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main export ── */
function TemplateShimmerLoadingUI() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      {Array.from({ length: 3 }).map((_, i) => (
        <TemplateCardSkeleton key={i} />
      ))}
    </>
  )
}

export default TemplateShimmerLoadingUI
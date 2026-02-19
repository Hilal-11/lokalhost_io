// import { allComponentsConfig } from './componentsAllConfig';
// import Link from 'next/link';
// function componentsAll() {
//   return (
//     <div className="w-full h-auto py-6 lg:py-10 px-5 lg:px-8 relative">

//         <div className="w-full border-t-1 border-dashed border-neutral-400 dark:border-neutral-700 absolute top-0 left-0"></div>

        
//         <div className='w-full h-full flex flex-wrap justify-between gap-7 lg:gap-10'>
//             {
//                 allComponentsConfig?.map((component) => (
//                     <Link href={component?.src} key={component.id} className='font-sans font-medium text-[15px] text-neutral-800 dark:text-neutral-200 no-underline hover:text-neutral-600 dark:hover:text-neutral-400 hover:underline'>{component.name}</Link>
//                 ))
//             }
//         </div>
//         <div className="w-full border-t-1 border-dashed border-neutral-400 dark:border-neutral-700 absolute bottom-0 left-0"></div>
//     </div>
//   )
// }

// export default componentsAll


"use client"
import React from 'react'
import { BgLightGrid1, BgLightGrid2 , BgDarkGradient1 , BgLightGradient1 , BgLightGradient2 , BgLightGradient3, BgLightGradient4, BgLightGradient6, BgLightGradient5, BgDarkGradient2, BgDarkGradient3 } from '@/components/BackgroundPatterns/backgrounds';
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { cn } from "@/lib/utils";

// ─── Individual skeleton placeholders — each hints at a different component ───

const SkeletonCard = () => (
  <div className="flex flex-col gap-2.5 w-full px-4">
    <div className="h-2 w-1/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    <div className="h-24 w-full rounded-lg bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800" />
    <div className="flex gap-2">
      <div className="h-2 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-2 w-1/3 rounded-full bg-neutral-100 dark:bg-neutral-800/40" />
    </div>
  </div>
);

const SkeletonButton = () => (
  <div className="flex flex-col gap-3 items-center w-full px-4">
    <div className="h-2 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    <div className="flex gap-2 w-full justify-center">
      <div className="h-9 w-28 rounded-lg bg-neutral-800 dark:bg-neutral-700" />
      <div className="h-9 w-20 rounded-lg bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
    </div>
    <div className="flex gap-1.5 justify-center">
      <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-7 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-7 w-7 rounded-full bg-neutral-800 dark:bg-neutral-700" />
    </div>
  </div>
);

const SkeletonChart = () => (
  <div className="flex flex-col gap-2 w-full px-4">
    <div className="h-2 w-1/4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    <div className="flex items-end gap-1.5 h-20 w-full">
      {[40, 65, 45, 80, 55, 70, 50, 90, 60, 75].map((h, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-sm",
            i === 7 ? "bg-neutral-700 dark:bg-neutral-500" : "bg-neutral-200 dark:bg-neutral-800"
          )}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
    <div className="flex justify-between">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-1.5 w-4 rounded-full bg-neutral-100 dark:bg-neutral-800/40" />
      ))}
    </div>
  </div>
);

const SkeletonForm = () => (
  <div className="flex flex-col gap-2.5 w-full px-4">
    <div className="h-1.5 w-1/4 rounded-full bg-neutral-300 dark:bg-neutral-700" />
    <div className="h-8 w-full rounded-md bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800" />
    <div className="h-1.5 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700 mt-1" />
    <div className="h-8 w-full rounded-md bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800" />
    <div className="h-7 w-full rounded-md bg-neutral-800 dark:bg-neutral-700 mt-1" />
  </div>
);

const SkeletonTable = () => (
  <div className="flex flex-col gap-0 w-full px-4 overflow-hidden">
    <div className="flex gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
      {[2, 3, 2].map((w, i) => (
        <div key={i} className={`h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 flex-${w}`} style={{ flex: w }} />
      ))}
    </div>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex gap-2 py-2 border-b border-neutral-100 dark:border-neutral-800/50">
        <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800" style={{ flex: 2 }} />
        <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/40" style={{ flex: 3 }} />
        <div className="h-5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" style={{ flex: 2 }} />
      </div>
    ))}
  </div>
);

const SkeletonModal = () => (
  <div className="flex flex-col w-full px-4">
    <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="h-2 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="h-1.5 w-4/5 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="h-1.5 w-2/3 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
      </div>
      <div className="px-4 pb-3 flex gap-2 justify-end">
        <div className="h-6 w-14 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <div className="h-6 w-14 rounded-md bg-neutral-800 dark:bg-neutral-600" />
      </div>
    </div>
  </div>
);

const SkeletonNavbar = () => (
  <div className="flex flex-col gap-3 w-full px-2">
    <div className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-neutral-800 dark:bg-neutral-600" />
        <div className="h-2 w-16 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <div className="hidden md:flex gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-1.5 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
      <div className="h-6 w-16 rounded-full bg-neutral-800 dark:bg-neutral-700" />
    </div>
    <div className="flex flex-col gap-1.5 px-2">
      <div className="h-1.5 w-2/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-1.5 w-3/5 rounded-full bg-neutral-100 dark:bg-neutral-800/50" />
    </div>
  </div>
);

const SkeletonBadge = () => (
  <div className="flex flex-col gap-3 w-full items-center px-4">
    <div className="flex flex-wrap gap-2 justify-center">
      {["rounded-full bg-neutral-800 dark:bg-neutral-700 w-16", "rounded-full bg-neutral-200 dark:bg-neutral-800 w-20", "rounded-full bg-neutral-300 dark:bg-neutral-800 w-14"].map((cls, i) => (
        <div key={i} className={`h-5 ${cls}`} />
      ))}
    </div>
    <div className="flex flex-wrap gap-2 justify-center">
      {["rounded-md bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 w-24", "rounded-md bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 w-16"].map((cls, i) => (
        <div key={i} className={`h-6 ${cls}`} />
      ))}
    </div>
    <div className="flex gap-1.5 flex-wrap justify-center">
      {[12, 16, 10, 14].map((w, i) => (
        <div key={i} className="h-4 rounded-full bg-neutral-200 dark:bg-neutral-800" style={{ width: `${w * 4}px` }} />
      ))}
    </div>
  </div>
);

const SkeletonToast = () => (
  <div className="flex flex-col gap-2 w-full px-3">
    {[
      "border-l-4 border-emerald-400 bg-white dark:bg-neutral-900",
      "border-l-4 border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900",
      "border-l-4 border-neutral-600 dark:border-neutral-500 bg-white dark:bg-neutral-900",
    ].map((cls, i) => (
      <div key={i} className={cn("w-full rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 flex items-center gap-2.5 shadow-sm", cls)}>
        <div className="w-3.5 h-3.5 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-1.5 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-3/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonPricing = () => (
  <div className="flex gap-2.5 w-full px-3">
    {[false, true].map((highlighted, i) => (
      <div key={i} className={cn("flex-1 rounded-xl p-3 flex flex-col gap-2 border", highlighted ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-800 dark:border-neutral-200" : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800")}>
        <div className={cn("h-1.5 w-1/2 rounded-full", highlighted ? "bg-neutral-600 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-700")} />
        <div className={cn("h-4 w-3/4 rounded-md", highlighted ? "bg-neutral-700 dark:bg-neutral-300" : "bg-neutral-200 dark:bg-neutral-800")} />
        <div className="flex flex-col gap-1 mt-1">
          {[...Array(3)].map((_, j) => (
            <div key={j} className={cn("h-1.5 rounded-full", highlighted ? "bg-neutral-700 dark:bg-neutral-300" : "bg-neutral-100 dark:bg-neutral-800/50", j === 0 ? "w-4/5" : j === 1 ? "w-3/5" : "w-2/3")} />
          ))}
        </div>
        <div className={cn("h-6 w-full rounded-lg mt-1", highlighted ? "bg-white dark:bg-neutral-900" : "bg-neutral-800 dark:bg-neutral-700")} />
      </div>
    ))}
  </div>
);

const SkeletonAvatar = () => (
  <div className="flex flex-col gap-3 items-center w-full px-4">
    <div className="flex items-center -space-x-2">
      {["bg-neutral-300 dark:bg-neutral-700", "bg-neutral-400 dark:bg-neutral-600", "bg-neutral-600 dark:bg-neutral-500", "bg-neutral-800 dark:bg-neutral-400"].map((cls, i) => (
        <div key={i} className={cn("w-9 h-9 rounded-full border-2 border-white dark:border-neutral-900", cls)} />
      ))}
      <div className="w-9 h-9 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <span className="text-[8px] font-mono font-bold text-neutral-500">+8</span>
      </div>
    </div>
    <div className="flex gap-3 items-center">
      <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="h-1.5 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
      </div>
    </div>
  </div>
);

const SkeletonInput = () => (
  <div className="flex flex-col gap-2.5 w-full px-4">
    {[
      { label: "w-1/4", style: "rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950" },
      { label: "w-1/3", style: "rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900" },
    ].map(({ label, style }, i) => (
      <div key={i} className="flex flex-col gap-1">
        <div className={cn("h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700", label)} />
        <div className={cn("h-8 w-full px-3 flex items-center gap-2", style)}>
          <div className="h-1.5 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    ))}
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0" />
      <div className="h-1.5 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    </div>
  </div>
);

// ─── Skeleton map ─────────────────────────────────────────────────────────────
const SKELETONS = [
  { component: SkeletonCard,    label: "Card"      },
  { component: SkeletonButton,  label: "Button"    },
  { component: SkeletonChart,   label: "Chart"     },
  { component: SkeletonForm,    label: "Form"      },
  { component: SkeletonTable,   label: "Table"     },
  { component: SkeletonModal,   label: "Modal"     },
  { component: SkeletonNavbar,  label: "Navbar"    },
  { component: SkeletonBadge,   label: "Badge"     },
  { component: SkeletonToast,   label: "Toast"     },
  { component: SkeletonPricing, label: "Pricing"   },
  { component: SkeletonAvatar,  label: "Avatar"    },
  { component: SkeletonInput,   label: "Input"     },
];

// ─── Main component ───────────────────────────────────────────────────────────
function ComponentsList() {
  return (
    <div className="w-full container max-w-[1580px] relative pb-8">
      <div className="w-full">

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 py-5 gap-5">
          {SKELETONS.map(({ component: Skeleton, label }, index) => (
            <div
              key={index}
              className={cn(
                "group relative w-full lg:h-[260px] h-[250px] rounded-xl",
                "bg-white dark:bg-neutral-950",
                "border border-neutral-200 dark:border-neutral-800",
                "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]",
                "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
                "overflow-hidden flex flex-col",
                "transition-all duration-300",
                "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)]",
                "dark:hover:shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
                "hover:border-neutral-300 dark:hover:border-neutral-700",
                "hover:-translate-y-0.5"
              )}
            >
              {/* skeleton preview area */}
              <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                {/* subtle inner bg texture */}
                <div
                  className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(0,0,0,1) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <Skeleton />

                {/* Coming Soon overlay — appears on hover */}
                <div className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center gap-2",
                  "bg-white/80 dark:bg-neutral-950/85 backdrop-blur-[2px]",
                  "opacity-0 group-hover:opacity-100",
                  "transition-all duration-300"
                )}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>

              {/* Label footer */}
              <div className="shrink-0 h-[44px] px-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-500">
                  {label}
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                    Soon
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}
export default ComponentsList


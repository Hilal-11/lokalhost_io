"use client"
import React from 'react'
import { BgLightGrid1, BgLightGrid2 , BgDarkGradient1 , BgLightGradient1 , BgLightGradient2 , BgLightGradient3, BgLightGradient4, BgLightGradient6, BgLightGradient5, BgDarkGradient2, BgDarkGradient3 } from '@/components/BackgroundPatterns/backgrounds';
import { ComingSoon } from '../MicroComponents/ComingSoon';
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
function ComponentsShowcase() {
  return (
    <div className="w-full pt-20 max-h-[1024px] lg:max-h-[870px] overflow-hidden relative pb-16">
      <div className="w-full">

        {/* ── Header ── */}
        <div className="w-full max-w-xl mx-auto px-4 text-center">
          <h1 className="font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 tracking-tight">
            20+ Premium UI Components by{" "}
            <span className="font-sans text-neutral-500 dark:text-neutral-500">lokalhost.io</span>
          </h1>
          <p className="text-sm font-sans font-medium text-neutral-500 dark:text-neutral-400">
            Free, production-ready components for React and Next.js — drop them in and ship.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:px-10 py-10 gap-5 mask-b-from-20% to-95%">
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

      {/* ── CTA button ── */}
      <div className="absolute bottom-0 w-full flex justify-center">
        <Link
          href="/docs"
          className={cn(
            "flex gap-2 items-center justify-center relative bottom-2",
            "font-sans font-medium text-sm px-8 py-2.5 rounded-lg",
            "border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-700",
            "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
            "text-neutral-100",
            "shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]",
            "hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
            "transition-all duration-200"
          )}
        >
          Explore All Components
          <HiOutlineExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
export default ComponentsShowcase;



// SaaS Landing page
const SkeletonSaaS = () => (
  <div className="flex flex-col w-full h-full px-3 py-2 gap-1.5 overflow-hidden">
    {/* navbar */}
    <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-3.5 h-3.5 rounded bg-neutral-800 dark:bg-neutral-400" />
        <div className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <div className="flex gap-2">
        <div className="h-1.5 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-1.5 w-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-12 rounded bg-neutral-800 dark:bg-neutral-600" />
      </div>
    </div>
    {/* hero */}
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2">
      <div className="h-1.5 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-6 w-4/5 rounded-lg bg-neutral-800 dark:bg-neutral-300" />
      <div className="h-1.5 w-3/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-1.5 w-2/5 rounded-full bg-neutral-100 dark:bg-neutral-800/50" />
      <div className="flex gap-2 mt-1">
        <div className="h-6 w-20 rounded-lg bg-neutral-800 dark:bg-neutral-600" />
        <div className="h-6 w-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
      </div>
    </div>
    {/* feature cards row */}
    <div className="flex gap-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex-1 h-12 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-1.5 flex flex-col gap-1">
          <div className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-1 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-1 w-3/5 rounded-full bg-neutral-100 dark:bg-neutral-800/50" />
        </div>
      ))}
    </div>
  </div>
);

// Portfolio / Personal site
const SkeletonPortfolio = () => (
  <div className="flex flex-col w-full h-full px-3 py-2 gap-1.5 overflow-hidden">
    <div className="flex items-center justify-between px-2 py-1.5">
      <div className="h-1.5 w-16 rounded-full bg-neutral-800 dark:bg-neutral-300 font-mono" />
      <div className="flex gap-3">
        {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />)}
      </div>
    </div>
    {/* split hero */}
    <div className="flex-1 grid grid-cols-2 gap-2">
      <div className="flex flex-col justify-center gap-2">
        <div className="h-1.5 w-3/4 rounded-full bg-neutral-800 dark:bg-neutral-200" />
        <div className="h-1.5 w-full rounded-full bg-neutral-800 dark:bg-neutral-200" />
        <div className="h-1.5 w-1/2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <div className="h-1.5 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-5 w-14 rounded-full bg-neutral-900 dark:bg-neutral-200" />
          <div className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
          <div className="h-5 w-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-700 dark:to-neutral-500" />
        <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow" />
      </div>
    </div>
    {/* project row */}
    <div className="flex gap-1.5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex-1 h-10 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800" />
      ))}
    </div>
  </div>
);

// Dashboard / Admin
const SkeletonDashboard = () => (
  <div className="flex w-full h-full overflow-hidden">
    {/* sidebar */}
    <div className="w-10 bg-neutral-900 dark:bg-neutral-950 flex flex-col items-center py-2 gap-3 shrink-0">
      <div className="w-5 h-5 rounded-md bg-neutral-700" />
      <div className="w-full h-px bg-neutral-800" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className={cn("w-4 h-4 rounded", i === 1 ? "bg-neutral-500" : "bg-neutral-800")} />
      ))}
    </div>
    {/* main */}
    <div className="flex-1 flex flex-col p-2 gap-2 bg-neutral-50 dark:bg-neutral-900">
      {/* top bar */}
      <div className="flex items-center justify-between">
        <div className="h-2 w-20 rounded-full bg-neutral-800 dark:bg-neutral-300" />
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
      {/* stat cards */}
      <div className="grid grid-cols-4 gap-1.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-md bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 p-1.5 flex flex-col gap-1">
            <div className="h-1 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-2.5 w-3/4 rounded bg-neutral-800 dark:bg-neutral-300" />
          </div>
        ))}
      </div>
      {/* chart area */}
      <div className="flex-1 rounded-md bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 p-2 flex flex-col gap-1.5">
        <div className="h-1.5 w-1/4 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="flex-1 flex items-end gap-1">
          {[50, 70, 40, 85, 60, 75, 55, 90, 65].map((h, i) => (
            <div key={i} className={cn("flex-1 rounded-sm", i === 7 ? "bg-neutral-700 dark:bg-neutral-500" : "bg-neutral-100 dark:bg-neutral-800")} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Blog / Editorial
const SkeletonBlog = () => (
  <div className="flex flex-col w-full h-full px-3 py-2 gap-2 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="h-1.5 w-20 rounded-full bg-neutral-800 dark:bg-neutral-300" />
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />)}
      </div>
    </div>
    {/* featured article */}
    <div className="h-16 rounded-xl bg-neutral-800 dark:bg-neutral-800 relative overflow-hidden flex flex-col justify-end p-2">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950" />
      <div className="relative flex flex-col gap-1">
        <div className="h-1.5 w-1/3 rounded-full bg-neutral-500" />
        <div className="h-2 w-3/4 rounded bg-white/80" />
      </div>
    </div>
    {/* article grid */}
    <div className="flex-1 grid grid-cols-3 gap-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-1 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-1 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-1 w-1/2 rounded-full bg-neutral-100 dark:bg-neutral-800/50" />
        </div>
      ))}
    </div>
  </div>
);

// E-commerce / Store
const SkeletonStore = () => (
  <div className="flex flex-col w-full h-full px-3 py-2 gap-2 overflow-hidden">
    <div className="flex items-center justify-between px-1">
      <div className="h-1.5 w-14 rounded-full bg-neutral-800 dark:bg-neutral-300" />
      <div className="flex gap-1.5 items-center">
        <div className="h-4 w-16 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 relative">
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-400" />
        </div>
      </div>
    </div>
    {/* banner */}
    <div className="h-12 rounded-xl bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-800 dark:to-neutral-700 flex items-center px-3 gap-3">
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-24 rounded-full bg-white/80" />
        <div className="h-1 w-16 rounded-full bg-white/40" />
      </div>
      <div className="ml-auto h-5 w-12 rounded bg-white/20 border border-white/30" />
    </div>
    {/* product grid */}
    <div className="flex-1 grid grid-cols-3 gap-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 overflow-hidden">
          <div className="h-12 bg-neutral-100 dark:bg-neutral-800" />
          <div className="px-1.5 pb-1.5 flex flex-col gap-1">
            <div className="h-1 w-full rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <div className="h-1.5 w-2/3 rounded-full bg-neutral-800 dark:bg-neutral-400" />
            <div className="h-4 w-full rounded bg-neutral-900 dark:bg-neutral-600 mt-0.5" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Documentation site
const SkeletonDocs = () => (
  <div className="flex w-full h-full overflow-hidden">
    {/* left sidebar */}
    <div className="w-16 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 flex flex-col py-2 px-2 gap-2 shrink-0">
      <div className="h-1.5 w-full rounded-full bg-neutral-800 dark:bg-neutral-300" />
      <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 mt-1" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className={cn("h-1.5 rounded-full", i === 2 ? "w-full bg-neutral-700 dark:bg-neutral-400" : "w-4/5 bg-neutral-200 dark:bg-neutral-800")} />
      ))}
    </div>
    {/* content */}
    <div className="flex-1 flex flex-col p-3 gap-2 overflow-hidden">
      <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800 mb-0.5" />
      <div className="h-3 w-1/2 rounded bg-neutral-800 dark:bg-neutral-200" />
      <div className="flex flex-col gap-1.5">
        {[4, 5, 3, 5, 4].map((w, i) => (
          <div key={i} className={`h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800`} style={{ width: `${w * 17}%` }} />
        ))}
      </div>
      {/* code block */}
      <div className="rounded-lg bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 p-2 flex flex-col gap-1.5">
        {[["bg-purple-400/40 w-1/4", "bg-neutral-600 w-2/5"], ["bg-blue-400/40 w-1/3", "bg-neutral-600 w-1/2"], ["bg-neutral-600 w-1/4"]].map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((cls, j) => <div key={j} className={cn("h-1.5 rounded-full", cls)} />)}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        {[4, 5].map((w, i) => (
          <div key={i} className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/50" style={{ width: `${w * 17}%` }} />
        ))}
      </div>
    </div>
  </div>
);

// Startup / Marketing
const SkeletonMarketing = () => (
  <div className="flex flex-col w-full h-full px-3 py-2 gap-2 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-neutral-800 dark:bg-neutral-400" />
        <div className="h-1.5 w-14 rounded-full bg-neutral-800 dark:bg-neutral-300" />
      </div>
      <div className="h-5 w-16 rounded-full bg-neutral-900 dark:bg-neutral-600" />
    </div>
    {/* hero centered */}
    <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-2">
      <div className="h-4 w-4 rounded-full bg-amber-400/30 border border-amber-300 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      </div>
      <div className="h-5 w-4/5 rounded-lg bg-neutral-900 dark:bg-neutral-200" />
      <div className="h-5 w-3/5 rounded-lg bg-neutral-800 dark:bg-neutral-300" />
      <div className="h-1.5 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-1.5 w-2/3 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
      <div className="flex gap-2 mt-1">
        <div className="h-6 w-24 rounded-lg bg-neutral-900 dark:bg-neutral-600" />
        <div className="h-6 w-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
      </div>
    </div>
    {/* logos row */}
    <div className="flex items-center justify-center gap-3">
      <div className="h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      {[...Array(4)].map((_, i) => <div key={i} className="h-3 w-8 rounded bg-neutral-100 dark:bg-neutral-800" />)}
    </div>
  </div>
);

// Agency / Creative
const SkeletonAgency = () => (
  <div className="flex flex-col w-full h-full px-3 py-2 gap-1.5 overflow-hidden bg-neutral-900 dark:bg-neutral-950 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="h-1.5 w-16 rounded-full bg-white/60" />
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => <div key={i} className="h-1.5 w-8 rounded-full bg-white/20" />)}
      </div>
    </div>
    {/* hero asymmetric */}
    <div className="flex-1 grid grid-cols-5 gap-2">
      <div className="col-span-3 flex flex-col justify-center gap-2">
        <div className="h-5 w-full rounded-lg bg-white/80" />
        <div className="h-5 w-4/5 rounded-lg bg-white/60" />
        <div className="h-1.5 w-3/4 rounded-full bg-white/20 mt-1" />
        <div className="h-1.5 w-2/3 rounded-full bg-white/20" />
        <div className="h-6 w-20 rounded-lg bg-white/90 mt-1" />
      </div>
      <div className="col-span-2 flex flex-col gap-1.5">
        <div className="flex-1 rounded-xl bg-white/5 border border-white/10" />
        <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
      </div>
    </div>
    {/* bottom marquee hint */}
    <div className="h-5 rounded-md bg-white/5 border border-white/10 flex items-center px-2 gap-2">
      {[...Array(5)].map((_, i) => <div key={i} className="h-1 flex-1 rounded-full bg-white/20" />)}
    </div>
  </div>
);

// App Landing
const SkeletonAppLanding = () => (
  <div className="flex flex-col w-full h-full px-3 py-2 gap-2 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-xl bg-neutral-800 dark:bg-neutral-500" />
        <div className="h-1.5 w-12 rounded-full bg-neutral-800 dark:bg-neutral-300" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[8px] font-mono" />
        <div className="h-5 w-5 rounded-full bg-neutral-800 dark:bg-neutral-600" />
      </div>
    </div>
    <div className="flex-1 flex gap-3 items-center">
      {/* copy */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3.5 w-3.5 rounded-full bg-emerald-400/30 border border-emerald-400" />
          <div className="h-1.5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-3 w-full rounded bg-neutral-900 dark:bg-neutral-200" />
        <div className="h-3 w-4/5 rounded bg-neutral-800 dark:bg-neutral-300" />
        <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 mt-1" />
        <div className="h-1.5 w-3/4 rounded-full bg-neutral-100 dark:bg-neutral-800/50" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-5 w-5 rounded bg-neutral-800 dark:bg-neutral-700" />
          <div className="h-5 w-5 rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
        </div>
      </div>
      {/* phone mockup */}
      <div className="w-16 shrink-0 flex flex-col">
        <div className="w-full h-28 rounded-2xl border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex flex-col p-1.5 gap-1 shadow-lg">
          <div className="mx-auto w-6 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-1.5 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-8 w-full rounded-lg bg-neutral-800 dark:bg-neutral-700 mt-0.5" />
            <div className="h-1.5 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Template metadata ─────────────────────────────────────────────────────
const TEMPLATES = [
  { component: SkeletonSaaS,       label: "SaaS Landing",    tag: "Landing"   },
  { component: SkeletonPortfolio,  label: "Portfolio",       tag: "Personal"  },
  { component: SkeletonDashboard,  label: "Admin Dashboard", tag: "App"       },
  { component: SkeletonBlog,       label: "Blog / Editorial",tag: "Content"   },
  { component: SkeletonStore,      label: "E-Commerce",      tag: "Store"     },
  { component: SkeletonDocs,       label: "Documentation",   tag: "Docs"      },
  { component: SkeletonMarketing,  label: "Startup / Marketing", tag: "Marketing" },
  { component: SkeletonAgency,     label: "Agency / Creative",   tag: "Creative"  },
  { component: SkeletonAppLanding, label: "App Landing",     tag: "Mobile"    },
];

// ─── Main export ──────────────────────────────────────────────────────────────
export const TemplatesBlockList = () => {
  return (
    <div className="w-full pt-20 max-h-[1024px] lg:max-h-[870px] overflow-hidden relative pb-16">
      <div className="w-full">

        {/* ── Header ── */}
        <div className="w-full max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Free to use
            </span>
          </div>
          <h1 className="font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 tracking-tight">
            Pro Templates by{" "}
            <span className="font-mono text-neutral-500 dark:text-neutral-500">lokalhost.io</span>
          </h1>
          <p className="text-sm font-sans font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Professional, clean, and modern full-page templates — built with React &amp; Next.js. Drop in, customize, ship.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 lg:px-10 py-10 gap-5 mask-b-from-20% to-95%">
          {TEMPLATES.map(({ component: Skeleton, label, tag }, index) => (
            <div
              key={index}
              className={cn(
                "group relative w-full h-[280px] rounded-xl overflow-hidden flex flex-col",
                "bg-white dark:bg-neutral-950",
                "border border-neutral-200 dark:border-neutral-800",
                "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]",
                "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
                "hover:shadow-[0_4px_20px_rgba(0,0,0,0.09),0_1px_4px_rgba(0,0,0,0.05)]",
                "dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.55)]",
                "hover:border-neutral-300 dark:hover:border-neutral-700",
                "hover:-translate-y-1",
                "transition-all duration-300 ease-out"
              )}
            >
              {/* ── Preview area ── */}
              <div className="flex-1 relative overflow-hidden">

                {/* dot grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.018] dark:opacity-[0.035] pointer-events-none z-0"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(0,0,0,1) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />

                {/* skeleton content */}
                <div className="relative z-10 w-full h-full">
                  <Skeleton />
                </div>

                {/* Coming Soon hover overlay */}
                <div className={cn(
                  "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3",
                  "bg-white/85 dark:bg-neutral-950/90 backdrop-blur-[3px]",
                  "opacity-0 group-hover:opacity-100",
                  "transition-all duration-300"
                )}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600">
                      {label}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Footer strip ── */}
              <div className="shrink-0 h-[48px] px-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/80 dark:bg-neutral-900/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {/* mini browser dots */}
                  <div className="flex gap-1 shrink-0">
                    {["bg-neutral-300 dark:bg-neutral-700", "bg-neutral-200 dark:bg-neutral-800", "bg-neutral-200 dark:bg-neutral-800"].map((cls, i) => (
                      <span key={i} className={cn("w-1.5 h-1.5 rounded-full", cls)} />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-semibold text-neutral-600 dark:text-neutral-400 truncate">
                    {label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Soon</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">{tag}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA button ── */}
      <div className="absolute bottom-0 w-full flex justify-center">
        <Link
          href="/templates"
          className={cn(
            "flex gap-2 items-center justify-center relative bottom-2",
            "font-sans font-medium text-sm px-8 py-2.5 rounded-lg",
            "border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-700",
            "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
            "text-neutral-100",
            "shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]",
            "hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
            "transition-all duration-200"
          )}
        >
          Browse PRO Templates
          <HiOutlineExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

"use client";
import React from "react";
import Link from "next/link";
import { PiTerminalFill } from "react-icons/pi";
import { HiArrowRight, HiLightningBolt } from "react-icons/hi";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import { cn } from "@/lib/utils";
// ─── Corner bracket decoration ────────────────────────────────────────────────
function CornerBracket({ className = "" }: { className?: string }) {
  return (
    <span className={`absolute w-3 h-3 ${className}`}>
      <span className="absolute top-0 left-0 w-full h-px bg-neutral-400 dark:bg-neutral-600" />
      <span className="absolute top-0 left-0 w-px h-full bg-neutral-400 dark:bg-neutral-600" />
    </span>
  );
}
function CornerBracketInvert({ className = "" }: { className?: string }) {
  return (
    <span className={`absolute w-3 h-3 ${className}`}>
      <span className="absolute bottom-0 right-0 w-full h-px bg-neutral-400 dark:bg-neutral-600" />
      <span className="absolute bottom-0 right-0 w-px h-full bg-neutral-400 dark:bg-neutral-600" />
    </span>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-sm">
      <span className="w-1 h-1 rounded-full bg-emerald-400" />
      <span className="text-[10px] font-mono font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-[11px] font-mono font-bold text-neutral-800 dark:text-neutral-200">
        {value}
      </span>
    </div>
  );
}

// ─── Main CTA ─────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <div className="w-full container max-w-[1580px] mx-auto py-20 px-4">
      <div
        className={cn(
            "relative overflow-hidden rounded-2xl",
            "bg-neutral-50 dark:bg-neutral-900",
            "border border-neutral-200/60 dark:border-neutral-800/60",
            "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.04),0px_8px_16px_-4px_rgba(0,0,0,0.06),0px_24px_40px_-8px_rgba(0,0,0,0.08)]",
            "dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.04),0px_8px_32px_-4px_rgba(0,0,0,0.4)]",
            "lg:min-h-[380px]"
        )}
        >
        {/* ── Background grid pattern ── */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* ── Subtle radial glow center-left ── */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-neutral-200 dark:bg-neutral-700/30 blur-[80px] opacity-40 dark:opacity-20 pointer-events-none" />

        {/* ── Corner brackets ── */}
        <CornerBracket className="top-4 left-4" />
        <CornerBracket className="top-4 right-4 rotate-90" />
        <CornerBracketInvert className="bottom-4 left-4 rotate-[270deg]" />
        <CornerBracketInvert className="bottom-4 right-4" />

        {/* ── Inner grid ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:min-h-[380px]">

          {/* ════ LEFT: Copy + CTAs ════════════════════════════════════════ */}
          <div className="flex flex-col justify-center gap-7 px-8 py-12 lg:px-12 lg:py-14">

            {/* Badge */}
            <div className="flex items-center gap-2 w-fit">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-sm">
                <HiLightningBolt className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Available for work
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl lg:text-[2.6rem] font-sans font-bold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
                Need something{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">custom built?</span>
                  {/* underline accent */}
                  <span className="absolute bottom-0.5 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-neutral-400 to-neutral-300 dark:from-neutral-500 dark:to-neutral-700" />
                </span>
              </h2>
              <p className="text-sm font-sans font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[400px]">
                I'm available for client work — UI systems, full-stack apps, backend
                services, and scalable production solutions. Let's build something great.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center flex-wrap gap-3">

              {/* Primary — dark */}
              <Link
                href="/custom-work"
                className="
                  group relative flex items-center gap-2.5
                  px-5 py-2.5 rounded-lg overflow-hidden
                  border-t border-l border-r border-neutral-950 dark:border-neutral-700
                  bg-gradient-to-b from-neutral-700 to-neutral-900
                  dark:from-neutral-800 dark:to-neutral-950
                  text-neutral-100 text-sm font-sans font-semibold
                  shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]
                  hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_6px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]
                  hover:-translate-y-0.5
                  active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.2)]
                  active:scale-[0.98]
                  transition-all duration-200 ease-out
                "
              >
                Hire for Custom Work
                <HiArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              {/* Secondary — light */}
              <Link
                href="/templates"
                className="
                  group relative flex items-center gap-2.5
                  px-5 py-2.5 rounded-lg overflow-hidden
                  border-t border-l border-r border-neutral-50 dark:border-neutral-600
                  bg-gradient-to-b from-neutral-100 to-neutral-200
                  dark:from-neutral-700 dark:to-neutral-800
                  text-neutral-700 dark:text-neutral-200 text-sm font-sans font-semibold
                  shadow-[0_1px_2px_rgba(0,0,0,0.08),0_3px_6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]
                  dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.07)]
                  hover:shadow-[0_2px_6px_rgba(0,0,0,0.1),0_6px_14px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]
                  hover:-translate-y-0.5
                  active:translate-y-0 active:scale-[0.98]
                  transition-all duration-200 ease-out
                "
              >
                Browse Templates
              </Link>
            </div>

            {/* Trust stats row */}
            <div className="flex items-center flex-wrap gap-2">
              <StatPill label="Response" value="&lt; 24h" />
              <StatPill label="Projects" value="12+" />
              <StatPill label="License" value="MIT" />
            </div>
          </div>

          {/* ════ RIGHT: Terminal icon visual ════════════════════════════ */}
          <div className="relative flex items-center justify-center overflow-hidden lg:border-l border-t lg:border-t-0 border-neutral-200/60 dark:border-neutral-800/60 min-h-[240px] lg:min-h-0">

            {/* Radial bg glow behind icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full bg-neutral-200 dark:bg-neutral-700/20 blur-[60px] opacity-60 dark:opacity-30" />
            </div>

            {/* Striped pattern (your existing component) */}
            <StripedPattern
              direction="left"
              className="absolute inset-0 mask-l-from-50% mask-l-to-80% mask-t-from-20% to-90% opacity-30"
            />

            {/* Concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[180, 240, 300].map((size, i) => (
                <span
                  key={size}
                  className="absolute rounded-full border border-dashed border-neutral-300 dark:border-neutral-700/60"
                  style={{
                    width: size,
                    height: size,
                    opacity: 1 - i * 0.25,
                    animation: `spin ${20 + i * 8}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
                  }}
                />
              ))}
            </div>

            {/* Terminal icon */}
            <div className="relative z-10 flex items-center justify-center">
              {/* outer glow box */}
              <div className={cn(
                "relative flex items-center justify-center",
                "w-36 h-36 lg:w-44 lg:h-44 rounded-3xl",
                "bg-white dark:bg-neutral-950",
                "border border-neutral-200 dark:border-neutral-800",
                "shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
                "dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]"
                )}>
                {/* inner shine */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/80 to-transparent dark:from-white/[0.03] dark:to-transparent pointer-events-none" />

                <PiTerminalFill className="w-20 h-20 lg:w-24 lg:h-24 text-neutral-800 dark:text-neutral-200 relative z-10" />

                {/* blinking cursor dot bottom-right */}
                <span className="absolute bottom-4 right-4 flex items-center gap-1">
                  <span className="w-1 h-4 rounded-sm bg-neutral-800 dark:bg-neutral-300 animate-pulse" />
                </span>
              </div>

              {/* floating label chips */}
              <div
                className={cn(
                  "absolute -top-3 -right-6",
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                  "bg-neutral-900 dark:bg-neutral-100",
                  "shadow-md"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-neutral-100 dark:text-neutral-900 uppercase tracking-widest">
                  Open for work
                </span>
              </div>

              <div
                className={cn(
                  "absolute -bottom-3 -left-6",
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                  "border border-neutral-200 dark:border-neutral-800",
                  "bg-white dark:bg-neutral-950",
                  "shadow-md"
                )}
              >
                <span className="text-[9px] font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  lokalhost.io
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom status bar ─────────────────────────────────────────────── */}
        <div className="relative z-10 border-t border-neutral-200/60 dark:border-neutral-800/60 px-8 lg:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {["UI Systems", "Full-Stack", "Backend", "Open Source"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-600">
              Currently available
            </span>
          </div>
        </div>

      </div>

      {/* ── spin keyframe (add to global CSS or tailwind config instead) ── */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CTA;
"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = ["Identity", "Project", "Scope", "Schedule"];

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="px-6 pt-6 pb-2 select-none">

      {/* ── Top row: label + counter ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {/* Tiny decorative dash */}
          <span className="block w-4 h-[1.5px] bg-neutral-900 dark:bg-neutral-100" />
          <span className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-neutral-500 dark:text-neutral-400">
            Custom Work Enquiry
          </span>
        </div>

        <span className="tabular-nums text-[11px] font-semibold bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 px-2.5 py-0.5 rounded-full">
          {currentStep + 1} / {STEPS.length}
        </span>
      </div>

      {/* ── Step nodes + connector line ── */}
      <div className="relative flex items-center justify-between">

        {/* Background connector */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-neutral-200 dark:bg-neutral-800 mx-5 z-0" />

        {/* Filled progress connector */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[1.5px] bg-neutral-900 dark:bg-neutral-100 mx-5 z-0 transition-all duration-500 ease-out"
          style={{
            width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 2.5rem)`,
          }}
        />

        {STEPS.map((label, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;
          const isPending = i > currentStep;

          return (
            <div
              key={label}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              {/* Node */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-[1.5px]",
                  isCompleted &&
                    "bg-neutral-900 dark:bg-neutral-100 border-neutral-900 dark:border-neutral-100",
                  isActive &&
                    "bg-white dark:bg-neutral-950 border-neutral-900 dark:border-neutral-100 shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]",
                  isPending &&
                    "bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700"
                )}
              >
                {isCompleted ? (
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    className="text-white dark:text-neutral-900"
                  />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100 block" />
                ) : (
                  <span className="text-[10px] font-bold tabular-nums text-neutral-400 dark:text-neutral-600">
                    {i + 1}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10.5px] font-semibold tracking-wide transition-all duration-200",
                  isCompleted && "text-neutral-500 dark:text-neutral-400",
                  isActive &&
                    "text-neutral-900 dark:text-neutral-100 underline underline-offset-2 decoration-dotted",
                  isPending && "text-neutral-400 dark:text-neutral-600"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Bottom divider ── */}
      <div className="mt-5 h-px bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}
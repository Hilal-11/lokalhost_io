"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check, Infinity as InfinityIcon, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_DISPLAY, inr } from "@/lib/plans";
import { loginUrlForPlan, type PaidPlanId } from "@/lib/safe-redirect";

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950";

const INCLUDES = [
  "Every Pro block and full landing page",
  "Copy, download or install by CLI",
  "Login, signup and auth screens",
  "All future blocks while your access is active",
];

/** Shown in the Code tab of a Pro block for visitors without access. */
export function BlockPaywall({ loggedIn, returnTo }: { loggedIn: boolean; returnTo: string }) {
  const reduce = useReducedMotion();
  const plans: PaidPlanId[] = ["pro_monthly", "pro_yearly"];
  const href = (id: PaidPlanId) => (loggedIn ? `/pricing?plan=${id}` : loginUrlForPlan(id));

  return (
    <div className="flex flex-col items-center px-4 py-12 font-sans sm:py-16">
      <span className="flex size-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        <Lock className="size-4" />
      </span>
      <h3 className="mt-4 text-center text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
        This block is part of Lokalhost Pro
      </h3>
      <p className="mt-2 max-w-md text-center text-[14px] leading-6 text-neutral-500 dark:text-neutral-400">
        Get the code for every block, landing page and auth screen — including everything we ship next.
      </p>

      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-2">
        {plans.map((id, i) => {
          const p = PLAN_DISPLAY[id];
          const featured = id === "pro_yearly";
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "flex flex-col rounded-2xl border p-5",
                featured
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.5)] dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] font-semibold">{p.title}</p>
                {p.badge && (
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide",
                      featured ? "border-white/20 text-white/80 dark:border-neutral-900/20 dark:text-neutral-700" : "border-neutral-200 text-neutral-500 dark:border-neutral-800"
                    )}
                  >
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight tabular-nums">{inr(p.price)}</span>
                {p.compareAt && (
                  <span className={cn("text-sm tabular-nums line-through", featured ? "text-white/50 dark:text-neutral-500" : "text-neutral-400")}>
                    {inr(p.compareAt)}
                  </span>
                )}
              </div>
              <p className={cn("mt-1 text-[12.5px]", featured ? "text-white/60 dark:text-neutral-600" : "text-neutral-500 dark:text-neutral-400")}>
                per {p.per}
              </p>
              <Link
                href={href(id)}
                className={cn(
                  "mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl text-[13.5px] font-medium transition-[filter,transform] active:scale-[0.98]",
                  featured
                    ? "bg-white text-neutral-900 hover:brightness-95 dark:bg-neutral-900 dark:text-white"
                    : "border border-neutral-200 bg-neutral-50 text-neutral-900 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
                  ring
                )}
              >
                {featured ? <Sparkles className="size-4" /> : <InfinityIcon className="size-4" />}
                Get {p.short.toLowerCase()} access
              </Link>
            </motion.div>
          );
        })}
      </div>

      <ul className="mt-8 grid max-w-2xl gap-x-8 gap-y-2 sm:grid-cols-2">
        {INCLUDES.map((t) => (
          <li key={t} className="flex items-center gap-2 text-[13px] text-neutral-600 dark:text-neutral-400">
            <Check className="size-3.5 shrink-0 text-neutral-900 dark:text-neutral-100" strokeWidth={2.5} />
            {t}
          </li>
        ))}
      </ul>

      {!loggedIn && (
        <p className="mt-6 text-[13px] text-neutral-500 dark:text-neutral-400">
          Already Pro?{" "}
          <Link href={`/login?next=${encodeURIComponent(returnTo)}`} className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900 dark:text-neutral-100 dark:decoration-neutral-700">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}

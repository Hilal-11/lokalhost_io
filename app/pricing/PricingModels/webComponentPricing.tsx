import React from 'react'
import { MdDone } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import { HiShieldCheck, HiLockClosed, HiCreditCard } from "react-icons/hi";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import { cn } from "@/lib/utils";

interface PricingConfig {
  id: string;
  plan: string;
  planDescription?: string;
  subscription_amount: string;
  save_price?: string;
  save_price_value?: string;
  features: string[];
  butttonContent?: string;
  popular?: boolean;
}

// ─── Trust badge row ──────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: HiShieldCheck,       label: "Secure checkout"       },
  { icon: HiLockClosed,        label: "SSL encrypted"         },
  { icon: HiCreditCard,        label: "No hidden fees"        },
  { icon: MdOutlineCancel,     label: "Cancel anytime"        },
];

function WebComponentPricing({ webComponentsPricingConfig }: { webComponentsPricingConfig: PricingConfig[] }) {
  return (
    <div className="flex flex-col items-center gap-10 w-full pt-10">

      {/* ── Cards grid ── */}
      <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3 grid-cols-1 items-start w-full gap-4">
        {webComponentsPricingConfig.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative px-4 py-6 w-full h-auto rounded-xl",
              "ring-1 ring-neutral-200 dark:ring-neutral-800",
              "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
              "transition-all duration-300",
              plan.popular
                ? "pricing_model_recommanded text-neutral-200 scale-[1.02] shadow-[0px_8px_32px_rgba(0,0,0,0.2)]"
                : "bg-neutral-50 dark:bg-neutral-900 hover:-translate-y-0.5 hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)]"
            )}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <p className="flex items-center justify-center gap-1.5 pramiun_pricing_btn px-6 py-[3px] text-sm rounded-full border-2 text-neutral-800 font-sans font-semibold">
                  <BsStars className="w-3.5 h-3.5" />
                  Most Popular
                </p>
              </div>
            )}

            {/* Plan name + price */}
            <div className={cn("flex flex-col gap-0", plan.popular ? "text-neutral-200" : "text-neutral-800 dark:text-neutral-200")}>
              <div className="flex items-center justify-between">
                <h2 className="font-sans font-semibold text-lg">{plan.plan}</h2>
                {plan.popular && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 border border-white/20">
                    Best Value
                  </span>
                )}
              </div>

              <div className="flex items-end gap-2 pt-3 pb-1">
                <span className="text-4xl font-bold font-sans leading-none">{plan.subscription_amount}$</span>
                {plan.save_price_value && (
                  <span className="text-xl font-sans text-neutral-500 line-through mb-0.5">{plan.save_price_value}$</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {plan.save_price && (
                  <span className={cn("font-sans text-xs", plan.popular ? "text-neutral-300" : "text-neutral-500 dark:text-neutral-400")}>
                    {plan.save_price}
                  </span>
                )}
                {plan.save_price_value && (
                  <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    Save {Math.round((1 - Number(plan.subscription_amount) / Number(plan.save_price_value)) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {plan.planDescription && (
              <p className={cn("text-center font-sans text-sm mt-5 leading-relaxed", plan.popular ? "text-neutral-300" : "text-neutral-500 dark:text-neutral-400")}>
                {plan.planDescription}
              </p>
            )}

            {/* Features box */}
            <div className={cn(
              "mt-6 relative overflow-hidden rounded-xl pb-4",
              "shadow-[0px_1px_3px_rgba(0,0,0,0.08),0px_0px_0px_1px_rgba(25,28,33,0.06)]",
              plan.popular ? "bg-white/5 border border-white/10" : "bg-white dark:bg-neutral-800"
            )}>
              {plan.popular && <StripedPattern direction="left" className="mask-l-from-50% mask-l-to-80% mask-t-from-20% to-90%" />}

              <div className="pt-4 px-4">
                <p className={cn("font-mono text-[10px] font-bold uppercase tracking-widest mb-4", plan.popular ? "text-neutral-400" : "text-neutral-400 dark:text-neutral-500")}>
                  What&apos;s included
                </p>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className={cn("flex gap-2.5 font-sans font-medium text-sm items-start", plan.popular ? "text-neutral-200" : "text-neutral-700 dark:text-neutral-300")}>
                      <span className={cn(
                        "shrink-0 flex items-center justify-center w-[18px] h-[18px] rounded-full mt-0.5",
                        plan.popular
                          ? "bg-white/20 text-white"
                          : "bg-gradient-to-b from-neutral-700 to-neutral-900 text-neutral-200 shadow-sm"
                      )}>
                        <MdDone className="w-3 h-3" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA button */}
              <div className="w-full px-4 mt-6">
                <button className={cn(
                  "w-full py-2.5 rounded-xl font-sans font-semibold text-sm transition-all duration-200 active:scale-[0.98]",
                  plan.popular
                    ? "pramiun_pricing_btn text-neutral-800 shadow-md hover:brightness-105 z-20 relative"
                    : "bg-gradient-to-b from-neutral-700 to-neutral-900 text-neutral-100 hover:from-neutral-600 hover:to-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]"
                )}>
                  {plan.butttonContent ?? "Get Started"}
                </button>
              </div>
            </div>

            {/* Per-card micro-reassurance */}
            <p className={cn("text-center text-[10px] font-sans mt-3", plan.popular ? "text-neutral-400" : "text-neutral-400 dark:text-neutral-600")}>
              No credit card required to start
            </p>
          </div>
        ))}
      </div>

      {/* ── Trust badges row ─────────────────────────────────────────────────── */}
      <div className="flex items-center flex-wrap justify-center gap-4 w-full">
        {TRUST_BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-600">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs font-mono font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-800 to-transparent" />

      {/* ── Bottom reassurance strip ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 pb-2 text-center">

        {/* Pause / cancel */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
            Pause or cancel your subscription anytime — no questions asked.
          </span>
        </div>

        {/* Support contact */}
        <div className="flex items-center gap-1.5 text-sm font-sans text-neutral-500 dark:text-neutral-400">
          <RiCustomerService2Line className="w-4 h-4 shrink-0 text-neutral-400 dark:text-neutral-600" />
          <span>Questions?</span>
          <a
            href="mailto:hilalahmadcodedev123@gmail.com"
            className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300 underline underline-offset-2 decoration-dashed decoration-neutral-400 dark:decoration-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            hilalahmadcodedev123@gmail.com
          </a>
          <span className="text-neutral-300 dark:text-neutral-700 mx-1">·</span>
          <span>or</span>
          <button className="font-sans font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors underline underline-offset-2 decoration-dashed decoration-neutral-400 dark:decoration-neutral-600">
            Chat with us
          </button>
        </div>

        {/* Legal fine print */}
        <p className="text-[10px] font-sans text-neutral-400 dark:text-neutral-600 max-w-sm leading-relaxed">
          By purchasing you agree to our{" "}
          <a href="/terms" className="underline underline-offset-1 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">Terms of Service</a>
          {" "}and{" "}
          <a href="/privacy" className="underline underline-offset-1 hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">Privacy Policy</a>.
          {" "}Prices are in USD. Taxes may apply.
        </p>
      </div>

    </div>
  );
}

export default WebComponentPricing;
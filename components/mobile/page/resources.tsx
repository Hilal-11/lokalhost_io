"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PreviewId } from "@/lib/mobile/types";
import { PhoneThumb, cardShell, stretch } from "../overview/cards";
import { Badge } from "../ui/primitives";

/* Mock data — replace with your CMS / Supabase query. */

const TEMPLATES: { name: string; description: string; screens: number; previews: PreviewId[]; tier: "free" | "pro"; href: string }[] = [
  {
    name: "Commerce Starter",
    description: "Catalog, product detail, bag, checkout and order tracking.",
    screens: 14,
    previews: ["product", "cart", "checkout"],
    tier: "pro",
    href: "/mobile/screens/cart-checkout",
  },
  {
    name: "Social Kit",
    description: "Feed, stories, profile, chat and notifications.",
    screens: 18,
    previews: ["home-feed", "chat-thread", "profile"],
    tier: "pro",
    href: "/mobile/screens/home-feed",
  },
  {
    name: "Auth & Onboarding",
    description: "Welcome pager, sign in, sign up, OTP and permissions.",
    screens: 8,
    previews: ["onboarding-1", "auth-sign-in", "auth-otp"],
    tier: "free",
    href: "/mobile/screens/onboarding",
  },
];

export function TemplateGrid() {
  return (
    <div className="not-prose grid gap-4 md:grid-cols-2">
      {TEMPLATES.map((t) => (
        <div key={t.name} className={cardShell}>
          <div className="flex h-[220px] items-start justify-center gap-3 overflow-hidden border-b border-lk-border pt-5 lk-dots">
            {t.previews.map((p, i) => (
              <PhoneThumb key={p} preview={p} scale={0.3} className={i === 1 ? "lk-transition -mt-1 group-hover:-translate-y-1" : "mt-4"} />
            ))}
          </div>
          <div className="flex flex-col gap-1 p-4">
            <div className="flex items-center gap-2">
              <Link href={t.href} className={`${stretch} text-[14.5px] font-medium text-lk-fg`}>
                {t.name}
              </Link>
              {t.tier === "pro" && <Badge kind="pro" />}
              <ArrowUpRight size={14} className="lk-transition ml-auto text-lk-subtle opacity-0 group-hover:opacity-100" aria-hidden />
            </div>
            <span className="text-[13px] text-lk-muted">{t.description}</span>
            <span className="mt-1 text-[12px] text-lk-subtle">{t.screens} screens · React Native + Flutter</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const SHOWCASE: { app: string; by: string; preview: PreviewId; stack: string }[] = [
  { app: "Lumen", by: "Your app here", preview: "auth-sign-in", stack: "Expo" },
  { app: "Tote", by: "Your app here", preview: "product", stack: "Flutter" },
  { app: "Pulse", by: "Your app here", preview: "stats-grid", stack: "React Native" },
  { app: "Circle", by: "Your app here", preview: "chat-list", stack: "Expo" },
];

export function ShowcaseGrid() {
  return (
    <div className="not-prose grid grid-cols-2 gap-3 lg:grid-cols-4">
      {SHOWCASE.map((s) => (
        <figure key={s.app} className="m-0 flex flex-col gap-2 rounded-lk-card border border-lk-border p-3">
          <div className="flex justify-center rounded-lk bg-lk-bg-subtle py-3">
            <PhoneThumb preview={s.preview} scale={0.32} />
          </div>
          <figcaption className="flex items-center justify-between px-0.5 text-[12.5px]">
            <span className="font-medium text-lk-fg">{s.app}</span>
            <span className="text-lk-subtle">{s.stack}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

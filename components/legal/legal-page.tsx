import Link from "next/link";
import type { ReactNode } from "react";

export const LEGAL_LINKS = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping & Delivery", href: "/shipping-policy" },
  { label: "Contact", href: "/contact" },
];

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

/** Shared shell for the policy pages Razorpay requires. Text marked [PLACEHOLDER] must be filled in before going live. */
export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: ReactNode; sections: LegalSection[] }) {
  return (
    <main className="bg-white px-5 py-16 dark:bg-neutral-950">
      <article className="mx-auto w-full max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">Last updated: {updated}</p>
        <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{title}</h1>
        <div className="mt-4 font-sans text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{intro}</div>

        {sections.map((s) => (
          <section key={s.heading} className="mt-8">
            <h2 className="font-sans text-lg font-semibold text-neutral-900 dark:text-neutral-100">{s.heading}</h2>
            <div className="mt-2 space-y-3 font-sans text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{s.body}</div>
          </section>
        ))}

        <nav aria-label="Policies" className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-dashed border-neutral-200 pt-6 dark:border-neutral-800">
          {LEGAL_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-mono text-xs text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline dark:hover:text-neutral-200">
              {l.label}
            </Link>
          ))}
        </nav>
      </article>
    </main>
  );
}

export const SUPPORT_EMAIL = "hilalahmadcodedev123@gmail.com";

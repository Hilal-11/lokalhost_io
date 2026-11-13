import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBillingStatus, type BillingStatus } from "@/lib/billing";
import { BillingActions } from "./billing-actions";

export const metadata: Metadata = { title: "Billing | Lokalhost.io", robots: { index: false } };
export const dynamic = "force-dynamic";

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtMoney = (paise: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(paise / 100);

const card = "rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900";

function planSummary(s: BillingStatus) {
  if (!s.hasAccess) return { title: "Free", line: "You're on the free plan. Upgrade to unlock every premium component, template and mobile kit." };
  if (s.planId === "pro_monthly") {
    if (s.status === "pending") return { title: "Pro Monthly", line: `Your last renewal payment is being retried. Access continues until ${fmtDate(s.periodEnd)}.` };
    return s.cancelAtPeriodEnd
      ? { title: "Pro Monthly", line: `Cancelled — access continues until ${fmtDate(s.periodEnd)}.` }
      : { title: "Pro Monthly", line: `Renews automatically on ${fmtDate(s.periodEnd)}.` };
  }
  return { title: "Pro Yearly", line: `Access until ${fmtDate(s.endsAt)}. No auto-renewal — extend whenever you like.` };
}

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/billing");

  let status: BillingStatus | null = null;
  let payments: { id: string; provider_payment_id: string; amount: number; currency: string; status: string; method: string | null; created_at: string; subscription_id: string | null }[] = [];
  try {
    status = await getBillingStatus(user.id);
    // RLS-scoped: the user's own client can only ever read their own rows.
    const { data } = await supabase
      .from("payments")
      .select("id, provider_payment_id, amount, currency, status, method, created_at, subscription_id")
      .order("created_at", { ascending: false })
      .limit(50);
    payments = data ?? [];
  } catch {
    status = null;
  }

  const summary = status ? planSummary(status) : null;
  const stackedYearly = status?.planId === "pro_monthly" && status.endsAt && status.periodEnd && new Date(status.endsAt) > new Date(new Date(status.periodEnd).getTime() + 2 * 86_400_000);

  return (
    <main className="min-h-[70vh] bg-white px-5 py-16 dark:bg-neutral-950">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <header>
          <h1 className="font-sans text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Billing</h1>
          <p className="mt-1 font-sans text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
        </header>

        {!status || !summary ? (
          <section className={card} role="alert">
            <p className="font-sans text-sm text-neutral-700 dark:text-neutral-300">
              We couldn&apos;t load your billing details right now. Please refresh in a moment.
            </p>
          </section>
        ) : (
          <>
            <section className={card} aria-labelledby="plan-heading">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">Current plan</p>
                  <h2 id="plan-heading" className="mt-1 flex items-center gap-2 font-sans text-xl font-bold text-neutral-900 dark:text-neutral-50">
                    {summary.title}
                    {status.hasAccess && (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-500">Active</span>
                    )}
                  </h2>
                  <p className="mt-2 font-sans text-sm text-neutral-600 dark:text-neutral-400">{summary.line}</p>
                  {stackedYearly && (
                    <p className="mt-1 font-sans text-sm text-neutral-600 dark:text-neutral-400">
                      Your yearly plan starts after that and runs until {fmtDate(status.endsAt)}.
                    </p>
                  )}
                </div>
              </div>
              <BillingActions status={status} />
            </section>

            <section className={card} aria-labelledby="history-heading">
              <h2 id="history-heading" className="font-sans text-base font-bold text-neutral-900 dark:text-neutral-50">Payment history</h2>
              {payments.length === 0 ? (
                <p className="mt-3 font-sans text-sm text-neutral-500 dark:text-neutral-400">
                  No payments yet. {!status.hasAccess && <Link href="/pricing" className="underline underline-offset-2">See plans</Link>}
                </p>
              ) : (
                <ul className="mt-3 divide-y divide-neutral-200 dark:divide-neutral-800">
                  {payments.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {p.subscription_id ? "Pro Monthly" : "Pro Yearly"} · {fmtDate(p.created_at)}
                        </p>
                        <p className="truncate font-mono text-[11px] text-neutral-400">{p.provider_payment_id}{p.method ? ` · ${p.method}` : ""}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-sans text-sm font-semibold text-neutral-900 dark:text-neutral-100">{fmtMoney(p.amount, p.currency)}</p>
                        <p className={`font-mono text-[10px] uppercase ${p.status === "captured" ? "text-emerald-500" : p.status === "refunded" ? "text-amber-500" : "text-red-500"}`}>
                          {p.status === "captured" ? "Paid" : p.status}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        <p className="font-sans text-xs text-neutral-400 dark:text-neutral-500">
          Questions about a charge? See the <Link href="/refund-policy" className="underline underline-offset-2">refund policy</Link> or{" "}
          <Link href="/contact" className="underline underline-offset-2">contact us</Link>.
        </p>
      </div>
    </main>
  );
}

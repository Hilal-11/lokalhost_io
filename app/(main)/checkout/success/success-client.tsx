"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Clock } from "lucide-react";
import { BILLING_KEY, formatDate, type BillingState } from "@/hooks/use-billing";

const POLL_MS = 2000;
const TIMEOUT_MS = 60_000;

type Phase = "activating" | "active" | "delayed";

const primary =
  "inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";
const secondary =
  "inline-flex items-center justify-center rounded-xl border border-neutral-200 px-5 py-2.5 font-sans text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-600";

export function SuccessClient({ supportEmail }: { supportEmail: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<Phase>("activating");
  const [endsAt, setEndsAt] = useState<string | null>(null);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const started = Date.now();

    const tick = async () => {
      try {
        const res = await fetch("/api/billing/status", { cache: "no-store" });
        if (res.status === 401) {
          router.replace("/login?next=/checkout/success");
          return;
        }
        if (res.ok) {
          const s = (await res.json()) as BillingState;
          if (s.hasAccess) {
            if (stopped) return;
            setEndsAt(s.endsAt);
            setPhase("active");
            queryClient.invalidateQueries({ queryKey: BILLING_KEY });
            return;
          }
        }
      } catch {
        /* transient — keep polling */
      }
      if (stopped) return;
      if (Date.now() - started >= TIMEOUT_MS) setPhase("delayed");
      else timer = setTimeout(tick, POLL_MS);
    };
    tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [queryClient, router]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 py-20 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-neutral-50 p-8 text-center dark:border-neutral-800 dark:bg-neutral-900" aria-live="polite">
        {phase === "activating" && (
          <>
            <Loader2 className="mx-auto h-9 w-9 animate-spin text-neutral-500" aria-hidden />
            <h1 className="mt-5 font-sans text-xl font-bold text-neutral-900 dark:text-neutral-50">Activating your access…</h1>
            <p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">
              Payment received. This usually takes a few seconds — keep this page open.
            </p>
          </>
        )}

        {phase === "active" && (
          <>
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Check className="h-6 w-6" aria-hidden />
            </span>
            <h1 className="mt-5 font-sans text-xl font-bold text-neutral-900 dark:text-neutral-50">You&apos;re Pro 🎉</h1>
            <p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">
              Everything premium is unlocked{endsAt ? ` until ${formatDate(endsAt)}` : ""}.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link href="/docs" className={primary}>Browse components</Link>
              <Link href="/account/billing" className={secondary}>Billing &amp; receipts</Link>
            </div>
            <p className="mt-4 font-sans text-xs text-neutral-400 dark:text-neutral-500">
              Templates are in <Link href="/templates" className="underline underline-offset-2">Templates</Link>, mobile kits in{" "}
              <Link href="/mobile" className="underline underline-offset-2">Mobile</Link>.
            </p>
          </>
        )}

        {phase === "delayed" && (
          <>
            <Clock className="mx-auto h-9 w-9 text-amber-500" aria-hidden />
            <h1 className="mt-5 font-sans text-xl font-bold text-neutral-900 dark:text-neutral-50">Still confirming your payment</h1>
            <p className="mt-2 font-sans text-sm text-neutral-500 dark:text-neutral-400">
              Your bank is taking longer than usual. If you were charged, access activates automatically — nothing is lost.
              You can check again from your billing page, or write to{" "}
              <a href={`mailto:${supportEmail}`} className="underline underline-offset-2">{supportEmail}</a> with your payment ID.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button type="button" onClick={() => window.location.reload()} className={primary}>Check again</button>
              <Link href="/account/billing" className={secondary}>Go to billing</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

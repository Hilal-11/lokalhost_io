"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaidPlanId } from "@/lib/safe-redirect";

export interface BillingState {
  loggedIn: boolean;
  hasAccess: boolean;
  planId: PaidPlanId | null;
  status: string | null;
  endsAt: string | null;
  cancelAtPeriodEnd: boolean;
  periodEnd: string | null;
  /** Which Razorpay keys the server is using. */
  mode?: "test" | "live";
}

const LOGGED_OUT: BillingState = {
  loggedIn: false, hasAccess: false, planId: null, status: null, endsAt: null, cancelAtPeriodEnd: false, periodEnd: null,
};

export const BILLING_KEY = ["billing-status"] as const;

async function fetchStatus(): Promise<BillingState> {
  const res = await fetch("/api/billing/status", { cache: "no-store", credentials: "same-origin" });
  if (res.status === 401) return LOGGED_OUT;
  if (!res.ok) throw new Error("status unavailable");
  return { loggedIn: true, ...(await res.json()) };
}

/** Who is this visitor, billing-wise? Drives every buy button and the Pro badge. */
export function useBillingStatus() {
  return useQuery({ queryKey: BILLING_KEY, queryFn: fetchStatus, staleTime: 30_000, retry: 1 });
}

export function formatDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ───────────────────────── Razorpay Checkout ───────────────────────── */

type RazorpayInstance = { open: () => void; on: (event: string, cb: (res: { error?: { description?: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadCheckoutScript() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("Could not load the payment window. Check your connection and try again."));
    };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

/** Turn Razorpay's bank-speak into something a buyer can act on. */
function friendlyFailure(description: string | undefined) {
  const d = (description ?? "").trim();
  if (!d) return "The payment didn't go through. You weren't charged.";
  if (/token|credential/i.test(d)) return "Your bank declined saving this card for payments. Try another card or UPI. You weren't charged.";
  return `${d.replace(/\.$/, "")}. You weren't charged.`;
}

export type CheckoutPhase = "idle" | "starting" | "paying" | "confirming";

export interface CheckoutUi {
  phase: CheckoutPhase;
  /** Plan currently in flight. */
  plan: PaidPlanId | null;
  error: string | null;
  /** Neutral message, e.g. the payment window was closed. */
  notice: string | null;
  start: (planId: PaidPlanId) => void;
  reset: () => void;
}

/**
 * Runs one purchase: create the order/subscription → Razorpay → verify → /checkout/success.
 * `onPaymentWindow(true)` fires right before Razorpay opens (hide your own modal — two
 * focus-trapping overlays can't coexist) and `(false)` when it closes without a payment.
 */
export function useCheckout(onPaymentWindow?: (open: boolean) => void): CheckoutUi {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<CheckoutPhase>("idle");
  const [plan, setPlan] = useState<PaidPlanId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const busy = useRef(false);
  const windowCb = useRef(onPaymentWindow);
  windowCb.current = onPaymentWindow;

  const reset = useCallback(() => {
    if (busy.current) return;
    setError(null);
    setNotice(null);
  }, []);

  const start = useCallback(
    async (planId: PaidPlanId) => {
      if (busy.current) return; // no double submit
      busy.current = true;
      setPlan(planId);
      setPhase("starting");
      setError(null);
      setNotice(null);
      const finish = (next: { error?: string; notice?: string } = {}) => {
        busy.current = false;
        setPhase("idle");
        setError(next.error ?? null);
        setNotice(next.notice ?? null);
      };

      try {
        const res = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        });
        const session = await res.json().catch(() => ({}));
        if (!res.ok) {
          // 401 (session expired) or "already Pro": refresh state so the dialog shows the right view.
          if (res.status === 401 || res.status === 409) queryClient.invalidateQueries({ queryKey: BILLING_KEY });
          throw new Error(
            res.status === 401 ? "Your session expired. Please sign in again." : session.error ?? "We couldn't start the payment. Please try again.",
          );
        }

        await loadCheckoutScript();
        if (!window.Razorpay) throw new Error("Could not load the payment window. Please try again.");

        let failure: string | null = null;
        let paid = false;
        const rzp = new window.Razorpay({
          key: session.keyId,
          name: session.name,
          description: session.description,
          ...(session.kind === "order"
            ? { order_id: session.orderId, amount: session.amount, currency: session.currency }
            : { subscription_id: session.subscriptionId }),
          prefill: session.prefill,
          theme: { color: "#171717" },
          handler: async (payment: Record<string, string>) => {
            paid = true;
            setPhase("confirming");
            windowCb.current?.(false); // bring our dialog back to show "confirming"
            try {
              await fetch("/api/billing/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payment),
                keepalive: true,
              });
            } catch {
              /* the success page keeps polling; the webhook activates access */
            }
            queryClient.invalidateQueries({ queryKey: BILLING_KEY });
            router.push(`/checkout/success?plan=${planId}`);
          },
          modal: {
            ondismiss: () => {
              if (paid) return;
              windowCb.current?.(false);
              finish(failure ? { error: failure } : { notice: "Payment cancelled — you weren't charged." });
            },
          },
        });
        rzp.on("payment.failed", (r) => {
          failure = friendlyFailure(r?.error?.description);
        });
        setPhase("paying");
        windowCb.current?.(true);
        rzp.open();
      } catch (e) {
        finish({ error: e instanceof Error ? e.message : "Something went wrong. Please try again." });
      }
    },
    [queryClient, router],
  );

  return { phase, plan, error, notice, start, reset };
}

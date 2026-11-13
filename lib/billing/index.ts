import "server-only";
import { randomUUID } from "node:crypto";
import { serverEnv } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isPaidPlanId, type PaidPlanId } from "@/lib/safe-redirect";
import { grantForOrder, grantForSubscriptionCharge, revokeForPayment } from "./entitlements";
import { billingLog, errorMessage } from "./log";
import type { BillingProvider, WebhookEvent } from "./provider";
import { createRazorpayProvider } from "./razorpay";

let provider: BillingProvider | null = null;
export function getProvider(): BillingProvider {
  return (provider ??= createRazorpayProvider());
}

/** Error with an HTTP status and a message that is safe to show to the user. */
export class BillingError extends Error {
  constructor(public status: number, public code: string, message: string, public extra: Record<string, unknown> = {}) {
    super(message);
  }
}

const LIVE_SUB = ["authenticated", "active", "pending"];
const TERMINAL_SUB = ["cancelled", "completed", "expired"];
const REUSE_WINDOW_MS = 30 * 60 * 1000;

/* ───────────────────────────── status ───────────────────────────── */

export interface BillingStatus {
  hasAccess: boolean;
  planId: PaidPlanId | null;
  status: string | null;
  /** When all paid access ends (includes stacked yearly time). */
  endsAt: string | null;
  cancelAtPeriodEnd: boolean;
  /** End of the current monthly billing period, when on monthly. */
  periodEnd: string | null;
}

export async function getBillingStatus(userId: string): Promise<BillingStatus> {
  const db = supabaseAdmin();
  const now = new Date();
  const [{ data: ents, error: e1 }, { data: subs, error: e2 }] = await Promise.all([
    db.from("entitlements").select("source_type, starts_at, ends_at")
      .eq("user_id", userId).is("revoked_at", null).gt("ends_at", now.toISOString()),
    db.from("subscriptions").select("status, current_period_end, cancel_at_period_end")
      .eq("user_id", userId).in("status", LIVE_SUB).order("created_at", { ascending: false }).limit(1),
  ]);
  if (e1 || e2) throw new Error(`status query failed: ${(e1 ?? e2)!.message}`);

  const live = ents ?? [];
  const current = live
    .filter((e) => new Date(e.starts_at) <= now)
    .sort((a, b) => +new Date(b.ends_at) - +new Date(a.ends_at))[0];
  const endsAt = live.length ? live.map((e) => e.ends_at).sort().at(-1)! : null;
  const sub = subs?.[0];

  if (!current) {
    return { hasAccess: false, planId: null, status: sub?.status ?? null, endsAt, cancelAtPeriodEnd: false, periodEnd: null };
  }
  const onMonthly = current.source_type === "subscription";
  return {
    hasAccess: true,
    planId: onMonthly ? "pro_monthly" : "pro_yearly",
    status: onMonthly ? sub?.status ?? "cancelled" : "active",
    endsAt,
    // a monthly period whose subscription is no longer live will not renew either
    cancelAtPeriodEnd: onMonthly ? (sub ? sub.cancel_at_period_end : true) : false,
    periodEnd: onMonthly ? sub?.current_period_end ?? current.ends_at : null,
  };
}

/* ───────────────────────────── checkout ───────────────────────────── */

export interface CheckoutSession {
  keyId: string;
  kind: "order" | "subscription";
  orderId?: string;
  subscriptionId?: string;
  planId: PaidPlanId;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name: string; email: string };
}

export async function createCheckout(
  user: { id: string; email?: string | null; name?: string | null },
  planId: unknown,
): Promise<CheckoutSession> {
  if (!isPaidPlanId(planId)) throw new BillingError(400, "INVALID_PLAN", "Unknown plan.");
  const db = supabaseAdmin();
  const p = getProvider();

  // Price always comes from our DB, never from the client.
  const { data: plan, error } = await db.from("plans").select("*").eq("id", planId).eq("is_active", true).maybeSingle();
  if (error) throw new Error(`plan query failed: ${error.message}`);
  if (!plan) throw new BillingError(400, "INVALID_PLAN", "This plan is not available.");

  const status = await getBillingStatus(user.id);
  const base = {
    keyId: p.publicKey,
    planId,
    amount: plan.amount as number,
    currency: plan.currency as string,
    name: "lokalhost Pro",
    prefill: { name: user.name ?? "", email: user.email ?? "" },
  };
  const since = new Date(Date.now() - REUSE_WINDOW_MS).toISOString();

  if (plan.billing_type === "recurring") {
    // Monthly is blocked while ANY paid access is live (current or stacked).
    if (status.endsAt) {
      throw new BillingError(409, "ALREADY_PRO", "You already have Pro access.", { endsAt: status.endsAt });
    }
    const { data: liveSub } = await db.from("subscriptions").select("id")
      .eq("user_id", user.id).in("status", LIVE_SUB).limit(1);
    if (liveSub?.length) throw new BillingError(409, "ALREADY_SUBSCRIBED", "You already have an active subscription.");

    // Double-click safety: reuse a just-created, unpaid subscription.
    const { data: recent } = await db.from("subscriptions").select("provider_subscription_id")
      .eq("user_id", user.id).eq("plan_id", planId).eq("status", "created").gt("created_at", since)
      .order("created_at", { ascending: false }).limit(1);
    if (recent?.length) {
      return { ...base, kind: "subscription", subscriptionId: recent[0].provider_subscription_id, description: "Monthly — renews automatically" };
    }

    const providerPlanId = (plan.provider_plan_id as string | null) ?? serverEnv().RAZORPAY_PLAN_ID_MONTHLY;
    if (!providerPlanId) throw new BillingError(503, "PLAN_NOT_CONFIGURED", "Monthly billing is not available right now. Please choose yearly or try again later.");

    let sub;
    try {
      sub = await p.createSubscription({ planId: providerPlanId, notes: { user_id: user.id, plan_id: planId } });
    } catch (e) {
      billingLog("error", "checkout.subscription_create_failed", { user_id: user.id, error: errorMessage(e) });
      throw new BillingError(502, "PROVIDER_ERROR", "We couldn't start the subscription. Please try again in a moment.");
    }
    const { error: insErr } = await db.from("subscriptions").insert({
      user_id: user.id, plan_id: planId, provider: p.name, provider_subscription_id: sub.id, status: "created",
    });
    if (insErr) throw new Error(`subscription insert failed: ${insErr.message}`);
    billingLog("info", "checkout.subscription_created", { user_id: user.id, provider_subscription_id: sub.id });
    return { ...base, kind: "subscription", subscriptionId: sub.id, description: "Monthly — renews automatically" };
  }

  // One-time yearly order. Allowed anytime; it stacks after existing access.
  const { data: recent } = await db.from("orders").select("provider_order_id")
    .eq("user_id", user.id).eq("plan_id", planId).eq("status", "created").gt("created_at", since)
    .order("created_at", { ascending: false }).limit(1);
  if (recent?.length) {
    return { ...base, kind: "order", orderId: recent[0].provider_order_id, description: "1 year of Pro — one-time payment" };
  }

  const receipt = randomUUID();
  let order;
  try {
    order = await p.createOrder({ amount: plan.amount, currency: plan.currency, receipt, notes: { user_id: user.id, plan_id: planId } });
  } catch (e) {
    billingLog("error", "checkout.order_create_failed", { user_id: user.id, error: errorMessage(e) });
    throw new BillingError(502, "PROVIDER_ERROR", "We couldn't start the payment. Please try again in a moment.");
  }
  const { error: insErr } = await db.from("orders").insert({
    user_id: user.id, plan_id: planId, provider: p.name, provider_order_id: order.id, receipt,
    amount: plan.amount, currency: plan.currency, status: "created",
  });
  if (insErr) throw new Error(`order insert failed: ${insErr.message}`);
  billingLog("info", "checkout.order_created", { user_id: user.id, provider_order_id: order.id });
  return { ...base, kind: "order", orderId: order.id, description: "1 year of Pro — one-time payment" };
}

/* ───────────────────────────── verify ───────────────────────────── */

export interface VerifyInput {
  razorpay_payment_id?: unknown;
  razorpay_order_id?: unknown;
  razorpay_subscription_id?: unknown;
  razorpay_signature?: unknown;
}

const str = (v: unknown) => (typeof v === "string" && v.length > 0 && v.length < 128 ? v : null);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Called by the browser after Checkout succeeds. Idempotent; the webhook does the same work. */
export async function verifyCheckout(userId: string, body: VerifyInput): Promise<{ active: boolean }> {
  const paymentId = str(body.razorpay_payment_id);
  const signature = str(body.razorpay_signature);
  const orderId = str(body.razorpay_order_id);
  const subscriptionId = str(body.razorpay_subscription_id);
  if (!paymentId || !signature || (!orderId && !subscriptionId)) {
    throw new BillingError(400, "BAD_REQUEST", "Missing payment details.");
  }
  const db = supabaseAdmin();
  const p = getProvider();

  if (subscriptionId) {
    if (!p.verifyCheckoutSignature({ kind: "subscription", subscriptionId, paymentId, signature })) {
      billingLog("warn", "verify.bad_signature", { user_id: userId, kind: "subscription" });
      throw new BillingError(400, "BAD_SIGNATURE", "Payment could not be verified.");
    }
    const { data: row } = await db.from("subscriptions").select("id, user_id, status")
      .eq("provider_subscription_id", subscriptionId).maybeSingle();
    if (!row || row.user_id !== userId) throw new BillingError(404, "NOT_FOUND", "Subscription not found.");
    if (row.status === "created") {
      await db.from("subscriptions").update({ status: "authenticated" }).eq("id", row.id).eq("status", "created");
    }
    // Grant only once the provider says the subscription is active with a billing period.
    // Activation usually lands within a second or two; otherwise the webhook grants it.
    for (let attempt = 0; attempt < 3; attempt++) {
      const sub = await p.fetchSubscription(subscriptionId);
      if (sub.status === "active" && sub.currentStart && sub.currentEnd) {
        const payment = await p.fetchPayment(paymentId);
        if (payment.status !== "captured") break;
        const res = await grantForSubscriptionCharge(row.id, payment, sub.currentStart, sub.currentEnd);
        return { active: res.ok };
      }
      if (attempt < 2) await sleep(1200);
    }
    return { active: false };
  }

  if (!p.verifyCheckoutSignature({ kind: "order", orderId: orderId!, paymentId, signature })) {
    billingLog("warn", "verify.bad_signature", { user_id: userId, kind: "order" });
    throw new BillingError(400, "BAD_SIGNATURE", "Payment could not be verified.");
  }
  const { data: order } = await db.from("orders").select("id, user_id, amount, currency")
    .eq("provider_order_id", orderId!).maybeSingle();
  if (!order || order.user_id !== userId) throw new BillingError(404, "NOT_FOUND", "Order not found.");

  let payment = await p.fetchPayment(paymentId);
  if (payment.orderId !== orderId) throw new BillingError(400, "BAD_REQUEST", "Payment does not match this order.");
  if (payment.status === "authorized") payment = await captureFallback(p, payment, order.amount, order.currency);
  if (payment.status !== "captured") return { active: false };
  const res = await grantForOrder(p, order.id, payment);
  return { active: res.ok };
}

/** If auto-capture is off in the dashboard, capture ourselves so the payment is not auto-refunded. */
async function captureFallback(p: BillingProvider, payment: Awaited<ReturnType<BillingProvider["fetchPayment"]>>, amount: number, currency: string) {
  if (payment.amount !== amount || payment.currency.toUpperCase() !== currency.toUpperCase()) return payment;
  try {
    const captured = await p.capturePayment(payment.id, amount, currency);
    billingLog("warn", "payment.captured_via_api", { payment_id: payment.id });
    return captured;
  } catch (e) {
    billingLog("warn", "payment.capture_failed", { payment_id: payment.id, error: errorMessage(e) });
    return p.fetchPayment(payment.id); // it may have been captured concurrently
  }
}

/* ───────────────────────────── cancel ───────────────────────────── */

export async function cancelSubscription(userId: string): Promise<{ accessUntil: string | null }> {
  const db = supabaseAdmin();
  const { data: sub } = await db.from("subscriptions")
    .select("id, provider_subscription_id, current_period_end, cancel_at_period_end, status")
    .eq("user_id", userId).in("status", LIVE_SUB).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!sub) throw new BillingError(404, "NO_SUBSCRIPTION", "You don't have an active subscription.");
  if (!sub.cancel_at_period_end) {
    try {
      // "authenticated" (not yet charged) subscriptions can only be cancelled immediately.
      await getProvider().cancelSubscription(sub.provider_subscription_id, { atCycleEnd: sub.status !== "authenticated" });
    } catch (e) {
      billingLog("error", "cancel.failed", { user_id: userId, subscription_id: sub.id, error: errorMessage(e) });
      throw new BillingError(502, "PROVIDER_ERROR", "We couldn't cancel the subscription. Please try again.");
    }
    await db.from("subscriptions").update({ cancel_at_period_end: true }).eq("id", sub.id);
    billingLog("info", "cancel.scheduled", { user_id: userId, subscription_id: sub.id });
  }
  return { accessUntil: sub.current_period_end };
}

/* ───────────────────────────── webhook ───────────────────────────── */

async function setSubscriptionStatus(event: WebhookEvent, status: string, extra: Record<string, unknown> = {}) {
  const s = event.subscription;
  if (!s) return "ignored: no subscription";
  const db = supabaseAdmin();
  const { data: row } = await db.from("subscriptions")
    .select("id, user_id, status, current_period_end").eq("provider_subscription_id", s.id).maybeSingle();
  if (!row) return "ignored: unknown subscription";
  if (s.notes.user_id && row.user_id && s.notes.user_id !== row.user_id) {
    billingLog("warn", "webhook.user_mismatch", { subscription_id: row.id });
  }
  // Late / out-of-order events never resurrect a finished subscription.
  if (TERMINAL_SUB.includes(row.status) && !TERMINAL_SUB.includes(status)) return "ignored: subscription already ended";
  // "authenticated" must not downgrade a subscription that is already active.
  if (status === "authenticated" && row.status !== "created") return "ignored: already past authenticated";

  const patch: Record<string, unknown> = { status, ...extra };
  if (s.currentStart && s.currentEnd && (!row.current_period_end || s.currentEnd > new Date(row.current_period_end))) {
    patch.current_period_start = s.currentStart.toISOString();
    patch.current_period_end = s.currentEnd.toISOString();
  }
  const { error } = await db.from("subscriptions").update(patch).eq("id", row.id);
  if (error) throw new Error(`subscription update failed: ${error.message}`);
  return `subscription ${status}`;
}

/** Returns a short note for logs. Throws on transient failures so the provider retries. */
export async function processWebhook(event: WebhookEvent): Promise<string> {
  const db = supabaseAdmin();
  const p = getProvider();

  switch (event.type) {
    case "order.paid":
    case "payment.captured":
    case "payment.authorized": {
      if (!event.payment || !event.orderId) return "ignored: not an order payment";
      const { data: order } = await db.from("orders").select("id, user_id, amount, currency")
        .eq("provider_order_id", event.orderId).maybeSingle();
      if (!order) return "ignored: unknown order"; // e.g. a subscription's internal order
      let payment = event.payment;
      if (payment.status === "authorized") payment = await captureFallback(p, payment, order.amount, order.currency);
      if (payment.status !== "captured") return `ignored: payment ${payment.status}`;
      const res = await grantForOrder(p, order.id, payment);
      return res.ok ? `order granted=${res.granted}` : `rejected: ${res.reason}`;
    }

    case "payment.failed": {
      if (!event.payment) return "ignored: no payment";
      const pay = event.payment;
      const { data: order } = pay.orderId
        ? await db.from("orders").select("id, user_id").eq("provider_order_id", pay.orderId).maybeSingle()
        : { data: null };
      if (!order) return "ignored: unknown order";
      // ignoreDuplicates: a failure event must never overwrite a captured payment row
      await db.from("payments").upsert({
        user_id: order.user_id, provider: p.name, provider_payment_id: pay.id, order_id: order.id,
        amount: pay.amount, currency: pay.currency, status: "failed", method: pay.method,
        raw: { error: pay.errorDescription },
      }, { onConflict: "provider_payment_id", ignoreDuplicates: true });
      billingLog("info", "payment.failed", { payment_id: pay.id, user_id: order.user_id });
      return "payment failure recorded";
    }

    case "subscription.authenticated":
      return setSubscriptionStatus(event, "authenticated");
    case "subscription.activated":
      return setSubscriptionStatus(event, "active");
    case "subscription.pending":
      // Payment retrying: keep access (grace is in the entitlement). TODO(email): notify the user.
      return setSubscriptionStatus(event, "pending");
    case "subscription.halted":
      return setSubscriptionStatus(event, "halted");
    case "subscription.cancelled":
      return setSubscriptionStatus(event, "cancelled", { cancelled_at: new Date().toISOString() });
    case "subscription.completed":
      return setSubscriptionStatus(event, "completed");

    case "subscription.charged": {
      const s = event.subscription;
      const pay = event.payment;
      if (!s || !pay) return "ignored: incomplete charge event";
      if (!s.currentStart || !s.currentEnd) return "ignored: no billing period";
      const { data: row } = await db.from("subscriptions").select("id").eq("provider_subscription_id", s.id).maybeSingle();
      if (!row) return "ignored: unknown subscription";
      const res = await grantForSubscriptionCharge(row.id, pay, s.currentStart, s.currentEnd);
      return res.ok ? `subscription granted=${res.granted}` : `rejected: ${res.reason}`;
    }

    case "refund.processed": {
      if (!event.refundPaymentId) return "ignored: no payment id";
      const revoked = await revokeForPayment(event.refundPaymentId);
      return `revoked ${revoked}`;
    }

    default:
      return "ignored: unhandled event";
  }
}

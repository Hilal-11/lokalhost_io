import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { billingLog, errorMessage } from "./log";
import type { BillingProvider, ProviderPayment } from "./provider";

/**
 * The ONLY place access is granted or revoked. Each function is a thin wrapper
 * around an atomic Postgres function (advisory lock per user, ON CONFLICT on
 * provider_payment_id), so the webhook, the verify route and reconciliation can
 * all call them repeatedly and concurrently.
 */

export type GrantResult =
  | { ok: true; granted: boolean; userId: string; startsAt: string; endsAt: string }
  | { ok: false; reason: string };

interface RpcGrant {
  ok: boolean;
  reason?: string;
  granted?: boolean;
  user_id?: string;
  starts_at?: string;
  ends_at?: string;
  subscriptions_to_cancel?: { id: string; provider_subscription_id: string }[];
}

function paymentRaw(p: ProviderPayment) {
  return { id: p.id, status: p.status, method: p.method, order_id: p.orderId, invoice_id: p.invoiceId };
}

function toResult(kind: string, data: RpcGrant, paymentId: string): GrantResult {
  if (!data.ok) {
    billingLog("error", `${kind}.rejected`, { reason: data.reason, payment_id: paymentId });
    return { ok: false, reason: data.reason ?? "unknown" };
  }
  billingLog("info", `${kind}.ok`, { granted: !!data.granted, payment_id: paymentId, user_id: data.user_id, ends_at: data.ends_at });
  return { ok: true, granted: !!data.granted, userId: data.user_id!, startsAt: data.starts_at!, endsAt: data.ends_at! };
}

/** Yearly order: stacks after any live access, and schedules a live monthly subscription to cancel at cycle end. */
export async function grantForOrder(provider: BillingProvider, orderId: string, payment: ProviderPayment): Promise<GrantResult> {
  const db = supabaseAdmin();
  const { data, error } = await db.rpc("grant_for_order", {
    p_order_id: orderId,
    p_provider_payment_id: payment.id,
    p_amount: payment.amount,
    p_currency: payment.currency,
    p_method: payment.method,
    p_raw: paymentRaw(payment),
  });
  if (error) throw new Error(`grant_for_order failed: ${error.message}`);
  const res = data as RpcGrant;

  if (res.ok) {
    for (const sub of res.subscriptions_to_cancel ?? []) {
      try {
        await provider.cancelSubscription(sub.provider_subscription_id, { atCycleEnd: true });
        await db.from("subscriptions").update({ cancel_at_period_end: true }).eq("id", sub.id);
        billingLog("info", "subscription.cancel_scheduled", { subscription_id: sub.id, reason: "yearly_purchase" });
      } catch (e) {
        // Not fatal for the grant: the next call (webhook / verify / cron) retries, since the flag stays false.
        billingLog("error", "subscription.cancel_failed", { subscription_id: sub.id, error: errorMessage(e) });
      }
    }
  }
  return toResult("grant.order", res, payment.id);
}

/** Monthly charge: access mirrors the provider's billing period (+1 day grace, applied in SQL). */
export async function grantForSubscriptionCharge(
  subscriptionId: string,
  payment: ProviderPayment,
  currentStart: Date,
  currentEnd: Date,
): Promise<GrantResult> {
  const { data, error } = await supabaseAdmin().rpc("grant_for_subscription_charge", {
    p_subscription_id: subscriptionId,
    p_provider_payment_id: payment.id,
    p_amount: payment.amount,
    p_currency: payment.currency,
    p_current_start: currentStart.toISOString(),
    p_current_end: currentEnd.toISOString(),
    p_method: payment.method,
    p_raw: paymentRaw(payment),
  });
  if (error) throw new Error(`grant_for_subscription_charge failed: ${error.message}`);
  return toResult("grant.subscription", data as RpcGrant, payment.id);
}

export async function revokeForPayment(providerPaymentId: string): Promise<number> {
  const { data, error } = await supabaseAdmin().rpc("revoke_for_payment", { p_provider_payment_id: providerPaymentId });
  if (error) throw new Error(`revoke_for_payment failed: ${error.message}`);
  const revoked = Number((data as { revoked?: number })?.revoked ?? 0);
  billingLog("info", "entitlement.revoked", { payment_id: providerPaymentId, revoked });
  return revoked;
}

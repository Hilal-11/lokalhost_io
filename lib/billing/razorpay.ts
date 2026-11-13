import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";
import { serverEnv } from "@/lib/env";
import type {
  BillingProvider,
  CheckoutSignatureInput,
  ProviderPayment,
  ProviderSubscription,
  WebhookEvent,
} from "./provider";

/* eslint-disable @typescript-eslint/no-explicit-any */

const toDate = (unix: unknown) => (typeof unix === "number" && unix > 0 ? new Date(unix * 1000) : null);

function mapSubscription(s: any): ProviderSubscription {
  return {
    id: String(s.id),
    status: String(s.status ?? ""),
    planId: s.plan_id ?? null,
    currentStart: toDate(s.current_start),
    currentEnd: toDate(s.current_end),
    notes: (s.notes && !Array.isArray(s.notes) ? s.notes : {}) as Record<string, string>,
  };
}

function mapPayment(p: any): ProviderPayment {
  return {
    id: String(p.id),
    status: String(p.status ?? ""),
    amount: Number(p.amount),
    currency: String(p.currency ?? ""),
    method: p.method ?? null,
    orderId: p.order_id ?? null,
    invoiceId: p.invoice_id ?? null,
    errorDescription: p.error_description ?? null,
  };
}

/** Constant-time comparison of a hex HMAC against a provided signature. */
export function hmacMatches(payload: string, secret: string, signature: string | null | undefined): boolean {
  if (!signature) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(payload).digest("hex"), "utf8");
  const given = Buffer.from(signature, "utf8");
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

/** total_count candidates: Razorpay caps how far a subscription may run; fall back if 120 is rejected. */
const TOTAL_COUNTS = [120, 60, 36, 12];

export function createRazorpayProvider(): BillingProvider {
  const env = serverEnv();
  const rzp = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });

  return {
    name: "razorpay",
    publicKey: env.RAZORPAY_KEY_ID,

    async createSubscription({ planId, notes }) {
      let lastError: unknown;
      for (const total_count of TOTAL_COUNTS) {
        try {
          const s = await rzp.subscriptions.create({ plan_id: planId, total_count, customer_notify: 1, notes } as any);
          return mapSubscription(s);
        } catch (e: any) {
          lastError = e;
          const msg = String(e?.error?.description ?? "").toLowerCase();
          // only retry when the rejection is about the count / end date
          if (!(msg.includes("total_count") || msg.includes("total count") || msg.includes("end") || msg.includes("exceed"))) break;
        }
      }
      throw lastError;
    },

    async createOrder({ amount, currency, receipt, notes }) {
      const o: any = await rzp.orders.create({ amount, currency, receipt, notes });
      return { id: String(o.id), amount: Number(o.amount), currency: String(o.currency) };
    },

    async cancelSubscription(id, { atCycleEnd }) {
      return mapSubscription(await rzp.subscriptions.cancel(id, atCycleEnd ? 1 : 0));
    },

    async fetchPayment(id) {
      return mapPayment(await rzp.payments.fetch(id));
    },

    async capturePayment(id, amount, currency) {
      return mapPayment(await rzp.payments.capture(id, amount, currency));
    },

    async fetchSubscription(id) {
      return mapSubscription(await rzp.subscriptions.fetch(id));
    },

    verifyCheckoutSignature(input: CheckoutSignatureInput) {
      const payload =
        input.kind === "order"
          ? `${input.orderId}|${input.paymentId}`
          : `${input.paymentId}|${input.subscriptionId}`;
      return hmacMatches(payload, env.RAZORPAY_KEY_SECRET, input.signature);
    },

    verifyWebhookSignature(rawBody, signature) {
      if (!env.RAZORPAY_WEBHOOK_SECRET) return false;
      return hmacMatches(rawBody, env.RAZORPAY_WEBHOOK_SECRET, signature);
    },

    parseWebhook(rawBody): WebhookEvent {
      const body = JSON.parse(rawBody);
      const p = body?.payload ?? {};
      const payment = p.payment?.entity ? mapPayment(p.payment.entity) : null;
      const subscription = p.subscription?.entity ? mapSubscription(p.subscription.entity) : null;
      return {
        type: String(body?.event ?? ""),
        payment,
        subscription,
        orderId: p.order?.entity?.id ?? payment?.orderId ?? null,
        refundPaymentId: p.refund?.entity?.payment_id ?? null,
      };
    },
  };
}

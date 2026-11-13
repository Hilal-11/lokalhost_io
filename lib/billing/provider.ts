import "server-only";

export interface ProviderSubscription {
  id: string;
  status: string;
  planId: string | null;
  currentStart: Date | null;
  currentEnd: Date | null;
  notes: Record<string, string>;
}

export interface ProviderPayment {
  id: string;
  /** created | authorized | captured | failed | refunded */
  status: string;
  /** smallest currency unit (paise) */
  amount: number;
  currency: string;
  method: string | null;
  orderId: string | null;
  invoiceId: string | null;
  errorDescription: string | null;
}

export interface ProviderOrder {
  id: string;
  amount: number;
  currency: string;
}

export interface WebhookEvent {
  type: string;
  payment: ProviderPayment | null;
  subscription: ProviderSubscription | null;
  orderId: string | null;
  /** payment id a refund belongs to */
  refundPaymentId: string | null;
}

export type CheckoutSignatureInput =
  | { kind: "order"; orderId: string; paymentId: string; signature: string }
  | { kind: "subscription"; subscriptionId: string; paymentId: string; signature: string };

/** Provider-agnostic surface. Razorpay today; Stripe can implement the same interface. */
export interface BillingProvider {
  readonly name: string;
  /** Public key the browser checkout needs. */
  readonly publicKey: string;
  createSubscription(input: { planId: string; notes: Record<string, string> }): Promise<ProviderSubscription>;
  createOrder(input: { amount: number; currency: string; receipt: string; notes: Record<string, string> }): Promise<ProviderOrder>;
  cancelSubscription(id: string, opts: { atCycleEnd: boolean }): Promise<ProviderSubscription>;
  fetchPayment(id: string): Promise<ProviderPayment>;
  capturePayment(id: string, amount: number, currency: string): Promise<ProviderPayment>;
  fetchSubscription(id: string): Promise<ProviderSubscription>;
  verifyCheckoutSignature(input: CheckoutSignatureInput): boolean;
  verifyWebhookSignature(rawBody: string, signature: string | null): boolean;
  parseWebhook(rawBody: string): WebhookEvent;
}

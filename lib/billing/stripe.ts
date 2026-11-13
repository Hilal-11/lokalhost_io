import "server-only";
import type { BillingProvider } from "./provider";

/** Placeholder so Stripe can be added behind the same interface later. */
export function createStripeProvider(): BillingProvider {
  throw new Error("Stripe provider is not implemented yet");
}

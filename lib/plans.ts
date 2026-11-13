import type { PaidPlanId } from "@/lib/safe-redirect";

/**
 * Display copy for the paid plans (checkout dialog, login banner).
 * DISPLAY ONLY — the amount actually charged always comes from the `plans` table on the server.
 */
export interface PlanDisplay {
  id: PaidPlanId;
  /** Short label for the plan toggle. */
  short: string;
  title: string;
  price: number; // rupees
  compareAt?: number; // rupees, struck through
  badge?: string;
  per: string;
  /** One plain sentence: what you pay and whether it renews. */
  explain: string;
}

export const PLAN_DISPLAY: Record<PaidPlanId, PlanDisplay> = {
  pro_yearly: {
    id: "pro_yearly",
    short: "Yearly",
    title: "1-Year Access",
    price: 7999,
    compareAt: 11988,
    badge: "Save 33%",
    per: "year",
    explain:
      "Pay a one-time fee of ₹7,999 for one year of access. This is not a subscription and will not auto-renew; you can buy another year when it expires.",
  },
  pro_monthly: {
    id: "pro_monthly",
    short: "Monthly",
    title: "Monthly Access",
    price: 999,
    per: "month",
    explain:
      "₹999 is charged today and then every month. Cancel anytime from your billing page — you keep access until the end of the paid month.",
  },
};

export const inr = (rupees: number) => `₹${rupees.toLocaleString("en-IN")}`;

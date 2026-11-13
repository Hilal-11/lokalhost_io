"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { isPaidPlanId, type PaidPlanId } from "@/lib/safe-redirect";
import { formatDate, useBillingStatus, type BillingState } from "@/hooks/use-billing";
import { useCheckoutDialog, type CheckoutItem } from "./checkout-dialog";

interface ButtonView {
  label: string;
  disabled: boolean;
}

/** The state table for the two paid buttons. */
export function planButtonView(planId: PaidPlanId, s: BillingState | undefined): ButtonView {
  const monthly = planId === "pro_monthly";
  const idle = { label: monthly ? "Get Monthly" : "Get Yearly", disabled: false };
  if (!s || !s.loggedIn || !s.hasAccess) return idle;

  if (s.planId === "pro_monthly") {
    if (s.cancelAtPeriodEnd) {
      return monthly ? { label: `Active until ${formatDate(s.periodEnd)}`, disabled: true } : { label: "Get Yearly", disabled: false };
    }
    return monthly ? { label: "Current plan", disabled: true } : { label: "Switch to Yearly", disabled: false };
  }
  // on yearly (or a manual grant)
  return monthly ? { label: `You're Pro until ${formatDate(s.endsAt)}`, disabled: true } : { label: "Extend 1 year", disabled: false };
}

/** Pricing-card CTA. "free" renders a plain link; paid plans open the checkout dialog. */
export function PlanButton({
  planId,
  className,
  href = "/docs",
  freeLabel = "Browse free components",
}: {
  planId: string;
  className?: string;
  href?: string;
  freeLabel?: string;
  /** kept for older call sites; no longer used */
  tone?: "light" | "dark";
}) {
  const { data: status } = useBillingStatus();
  const { open } = useCheckoutDialog();

  if (!isPaidPlanId(planId)) {
    return (
      <Link href={href} className={cn("flex items-center justify-center", className)}>
        {freeLabel}
      </Link>
    );
  }

  const view = planButtonView(planId, status);
  return (
    <button
      type="button"
      onClick={() => open(planId)}
      disabled={view.disabled}
      className={cn(
        "flex items-center justify-center gap-2 disabled:cursor-not-allowed",
        view.disabled && "opacity-70 active:scale-100",
        className,
      )}
    >
      {view.label}
    </button>
  );
}

/** "Unlock with Pro" from a locked premium item: opens the same dialog with the item shown. */
export function UnlockButton({
  item,
  planId = "pro_yearly",
  className,
  children,
}: {
  item?: CheckoutItem;
  planId?: PaidPlanId;
  className?: string;
  children: ReactNode;
}) {
  const { open } = useCheckoutDialog();
  return (
    <button type="button" onClick={() => open(planId, { item })} className={className}>
      {children}
    </button>
  );
}

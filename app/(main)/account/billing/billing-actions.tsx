"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlanButton } from "@/components/billing/plan-button";
import { BILLING_KEY, formatDate } from "@/hooks/use-billing";
import type { BillingStatus } from "@/lib/billing";

const primary =
  "rounded-xl bg-neutral-900 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";
const ghost =
  "rounded-xl border border-neutral-200 px-5 py-2.5 font-sans text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-400 disabled:opacity-60 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600";

export function BillingActions({ status }: { status: BillingStatus }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCancel = status.planId === "pro_monthly" && !status.cancelAtPeriodEnd;

  const cancel = async () => {
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not cancel. Please try again.");
      queryClient.invalidateQueries({ queryKey: BILLING_KEY });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not cancel. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-start gap-3">
        {!status.hasAccess && (
          <div>
            <PlanButton planId="pro_monthly" className={ghost} />
          </div>
        )}
        <div>
          <PlanButton planId="pro_yearly" className={primary} />
        </div>

        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button type="button" className={ghost} disabled={cancelling}>
                {cancelling ? <Loader2 className="inline h-4 w-4 animate-spin" aria-hidden /> : "Cancel subscription"}
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel your monthly plan?</AlertDialogTitle>
                <AlertDialogDescription>
                  You won&apos;t be charged again. Your Pro access continues until {formatDate(status.periodEnd)}, then your account
                  returns to the free plan. You can resubscribe anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep my plan</AlertDialogCancel>
                <AlertDialogAction onClick={cancel}>Cancel subscription</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {error && <p role="alert" className="mt-2 font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}

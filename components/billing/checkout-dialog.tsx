"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { PiTerminalFill } from "react-icons/pi";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { isPaidPlanId, type PaidPlanId } from "@/lib/safe-redirect";
import { PLAN_DISPLAY, inr } from "@/lib/plans";
import { formatDate, useBillingStatus, useCheckout, type BillingState } from "@/hooks/use-billing";
import { useUser } from "@/hooks/useUser";
import { signInWithGithub, signInWithGoogle, signInWithMagicLink } from "@/app/(main)/auth/actions";

/* ------------------------------------------------------------------ */
/* One dialog for every "buy" entry point on the site:                 */
/*   plan summary → account (sign in if needed) → Checkout → Razorpay  */
/* Open it with useCheckoutDialog().open(planId, { item }).            */
/* ------------------------------------------------------------------ */

export interface CheckoutItem {
  /** Premium item the visitor was trying to unlock (shown as the thumbnail). */
  name: string;
  image?: string | null;
}

interface Ctx {
  open: (planId?: PaidPlanId, opts?: { item?: CheckoutItem }) => void;
}

const CheckoutDialogContext = createContext<Ctx>({ open: () => {} });
export const useCheckoutDialog = () => useContext(CheckoutDialogContext);

/** Buying a plan is blocked only for monthly while any paid access is live. */
function blockedReason(planId: PaidPlanId, s: BillingState | undefined): string | null {
  if (!s?.loggedIn || planId !== "pro_monthly") return null;
  const until = s.endsAt ?? s.periodEnd;
  if (s.hasAccess || s.endsAt) return until ? `You're already Pro until ${formatDate(until)}.` : "You're already Pro.";
  return null;
}

function yearlyCta(s: BillingState | undefined) {
  if (!s?.loggedIn || !s.hasAccess) return "Checkout";
  if (s.planId === "pro_monthly" && !s.cancelAtPeriodEnd) return "Switch to yearly";
  return s.planId === "pro_yearly" ? "Extend 1 year" : "Checkout";
}

const field =
  "h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 font-sans text-sm font-medium text-neutral-900 outline-none transition " +
  "placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 " +
  "dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-700";
const primaryBtn =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 font-sans text-sm font-semibold text-white " +
  "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:bg-neutral-700 active:scale-[0.99] " +
  "disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";
const socialBtn =
  "inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white font-sans text-sm font-medium " +
  "text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700";
const hint = "text-center font-sans text-xs leading-relaxed text-neutral-500 dark:text-neutral-400";

function Thumb({ item }: { item?: CheckoutItem }) {
  return (
    <div className="relative h-[84px] w-[148px] shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-900 dark:border-neutral-700">
      {item?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[radial-gradient(120%_120%_at_0%_0%,#404040_0%,#171717_55%,#0a0a0a_100%)]">
          <PiTerminalFill className="text-2xl text-white" aria-hidden />
          <span className="font-sans text-[11px] font-bold tracking-tight text-white">
            lokalhost <span className="rounded bg-white px-1 text-neutral-900">Pro</span>
          </span>
        </div>
      )}
    </div>
  );
}

function DialogBody({
  planId,
  setPlanId,
  item,
  autoStart,
  checkout,
  returnTo,
  onClose,
}: {
  planId: PaidPlanId;
  setPlanId: (p: PaidPlanId) => void;
  item?: CheckoutItem;
  autoStart: boolean;
  checkout: ReturnType<typeof useCheckout>;
  returnTo: string;
  onClose: () => void;
}) {
  const { data: status, isLoading } = useBillingStatus();
  const { user } = useUser();
  const plan = PLAN_DISPLAY[planId];
  const blocked = blockedReason(planId, status);
  const busy = checkout.phase !== "idle";

  /* Returning from login with ?plan=…: go straight to payment, once. */
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoStart || autoStarted.current || !status) return;
    autoStarted.current = true;
    if (status.loggedIn && !blockedReason(planId, status)) checkout.start(planId);
  }, [autoStart, status, planId, checkout]);

  /* Magic link */
  const [email, setEmail] = useState("");
  const [linkState, setLinkState] = useState<{ sending: boolean; sent?: string; error?: string }>({ sending: false });
  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setLinkState({ sending: false, error: "Enter your email to continue." });
    setLinkState({ sending: true });
    const fd = new FormData();
    fd.set("email", email.trim());
    fd.set("next", returnTo);
    fd.set("plan", planId);
    const res = await signInWithMagicLink(fd);
    setLinkState(res && "error" in res && res.error ? { sending: false, error: res.error } : { sending: false, sent: email.trim() });
  };

  const showLiveWarning = status?.mode === "live" && process.env.NODE_ENV !== "production";

  return (
    <div className="flex flex-col gap-5">
      {status?.mode === "test" && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 font-sans text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
          <strong>Test mode</strong> — no real money moves. Card 4718 6091 0820 4366, any future expiry, any CVV.
        </p>
      )}
      {showLiveWarning && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-sans text-[11px] leading-relaxed text-red-600 dark:text-red-400">
          <strong>Live keys on a dev build</strong> — real money will be charged and Razorpay test cards are declined. Use test keys to try the flow.
        </p>
      )}

      {/* ── Summary ── */}
      <div className="flex items-center gap-4 pr-6">
        <Thumb item={item} />
        <div className="min-w-0">
          <DialogTitle className="font-sans text-base font-semibold leading-tight text-neutral-900 dark:text-neutral-50">
            {item ? `Unlock ${item.name}` : plan.title}
          </DialogTitle>
          {item && <p className="mt-0.5 font-sans text-xs text-neutral-500 dark:text-neutral-400">lokalhost Pro · {plan.title}</p>}
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="font-sans text-2xl font-bold leading-none text-neutral-900 dark:text-white">{inr(plan.price)}</span>
            {plan.compareAt && <span className="font-sans text-sm text-neutral-400 line-through">{inr(plan.compareAt)}</span>}
            <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400">/ {plan.per}</span>
          </p>
        </div>
      </div>

      {/* ── Plan toggle ── */}
      <div role="radiogroup" aria-label="Billing period" className="grid grid-cols-2 gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-950">
        {(["pro_yearly", "pro_monthly"] as const).map((id) => {
          const p = PLAN_DISPLAY[id];
          const active = id === planId;
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={busy}
              onClick={() => {
                checkout.reset();
                setPlanId(id);
              }}
              className={cn(
                "flex h-9 items-center justify-center gap-1.5 rounded-lg font-sans text-[13px] font-medium transition disabled:cursor-not-allowed",
                active
                  ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
              )}
            >
              {p.short} · {inr(p.price)}
              {p.badge && <span className="hidden rounded bg-emerald-500/15 min-[420px]:inline px-1 py-px font-mono text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">{p.badge}</span>}
            </button>
          );
        })}
      </div>

      <DialogDescription className="text-center font-sans text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
        {plan.explain}
      </DialogDescription>

      {/* ── Action area ── */}
      <div className="flex min-h-[132px] flex-col justify-center gap-3" aria-live="polite">
        {checkout.phase === "confirming" ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" aria-hidden />
            <p className="font-sans text-sm font-semibold text-neutral-900 dark:text-neutral-100">Payment received</p>
            <p className={hint}>Activating your access…</p>
          </div>
        ) : isLoading || !status ? (
          <div className="h-11 w-full animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        ) : !status.loggedIn ? (
          linkState.sent ? (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <Check className="mx-auto h-5 w-5 text-emerald-500" aria-hidden />
              <p className="mt-2 font-sans text-sm font-semibold text-neutral-900 dark:text-neutral-100">Check your inbox</p>
              <p className={cn(hint, "mt-1")}>
                We sent a sign-in link to {linkState.sent}. Open it on this device and you&apos;ll land right back at checkout.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={sendLink} className="flex flex-col gap-3" noValidate>
                <label htmlFor="checkout-email" className="sr-only">Email</label>
                <input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (linkState.error) setLinkState({ sending: false });
                  }}
                  className={field}
                />
                {linkState.error && <p role="alert" className="font-sans text-xs text-red-500">{linkState.error}</p>}
                <button type="submit" disabled={linkState.sending} className={primaryBtn}>
                  {linkState.sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                  Continue with email
                </button>
              </form>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Google", icon: <FcGoogle className="text-lg" />, action: signInWithGoogle },
                  { label: "GitHub", icon: <FaGithub className="text-lg" />, action: signInWithGithub },
                ].map(({ label, icon, action }) => (
                  <form key={label} action={action}>
                    <input type="hidden" name="next" value={returnTo} />
                    <input type="hidden" name="plan" value={planId} />
                    <button type="submit" className={socialBtn}>
                      {icon}
                      {label}
                    </button>
                  </form>
                ))}
              </div>
              <p className={hint}>
                Your Pro access is tied to this account. After signing in you&apos;ll come straight back to pay securely with Razorpay.
              </p>
            </>
          )
        ) : blocked ? (
          <>
            <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center font-sans text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
              {blocked} Monthly can&apos;t be added on top — but you can extend with a year anytime.
            </p>
            <button type="button" className={primaryBtn} onClick={() => setPlanId("pro_yearly")}>
              Extend with 1 year instead
            </button>
            <Link href="/account/billing" onClick={onClose} className={cn(hint, "underline underline-offset-2")}>
              Go to billing
            </Link>
          </>
        ) : (
          <>
            <label htmlFor="checkout-account" className="sr-only">Account</label>
            <input id="checkout-account" readOnly value={user?.email ?? ""} placeholder="Your account" className={cn(field, "cursor-default text-neutral-600 dark:text-neutral-300")} />
            {checkout.error && (
              <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-sans text-xs leading-relaxed text-red-600 dark:text-red-400">
                {checkout.error}
              </p>
            )}
            {!checkout.error && checkout.notice && <p className={hint}>{checkout.notice}</p>}
            <button type="button" disabled={busy} aria-busy={busy} onClick={() => checkout.start(planId)} className={primaryBtn}>
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Opening secure checkout…
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  {checkout.error ? "Try again" : planId === "pro_yearly" ? yearlyCta(status) : "Checkout"} · {inr(plan.price)}
                </>
              )}
            </button>
            <p className={hint}>
              Access is added to the account above.
              {planId === "pro_yearly" && status.planId === "pro_monthly" && !status.cancelAtPeriodEnd
                ? " Your monthly plan stops renewing, and the year starts when the paid month ends."
                : planId === "pro_yearly" && status.hasAccess
                  ? " The new year is added after your current access ends."
                  : ""}
            </p>
          </>
        )}
      </div>

      <p className="flex items-center justify-center gap-1.5 border-t border-dashed border-neutral-200 pt-4 font-sans text-[11px] text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        Secure payment via Razorpay · UPI, cards, netbanking
      </p>
    </div>
  );
}

export function CheckoutDialogProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [planId, setPlanId] = useState<PaidPlanId>("pro_yearly");
  const [item, setItem] = useState<CheckoutItem | undefined>();
  const [autoStart, setAutoStart] = useState(false);
  /** Bumped per open() so each visit gets a fresh body (resets the email form etc.). */
  const [session, setSession] = useState(0);

  // Razorpay's own overlay and this dialog can't both trap focus: hide ours while theirs is up.
  const checkout = useCheckout(
    useCallback((paymentWindowOpen: boolean) => {
      setIsOpen(!paymentWindowOpen);
      if (paymentWindowOpen) setAutoStart(false); // never auto-start twice
    }, []),
  );
  const resetCheckout = checkout.reset;

  const open = useCallback<Ctx["open"]>(
    (plan = "pro_yearly", opts) => {
      resetCheckout();
      setPlanId(plan);
      setItem(opts?.item);
      setAutoStart(false);
      setSession((n) => n + 1);
      setIsOpen(true);
    },
    [resetCheckout],
  );

  /* ?plan=pro_yearly on any page opens the dialog (this is how login hands the buyer back). */
  useEffect(() => {
    const url = new URL(window.location.href);
    const plan = url.searchParams.get("plan");
    if (!isPaidPlanId(plan) || pathname.startsWith("/login") || pathname.startsWith("/checkout")) return;
    url.searchParams.delete("plan");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    // Open once the page has finished hydrating: a modal marks the rest of the page
    // aria-hidden, which React would otherwise report as a hydration mismatch.
    const show = () => {
      setPlanId(plan);
      setItem(undefined);
      setAutoStart(true);
      setSession((n) => n + 1);
      setIsOpen(true);
    };
    let timer = 0;
    const afterLoad = () => {
      timer = window.setTimeout(show, 700);
    };
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
    return () => {
      window.removeEventListener("load", afterLoad);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  const ctx = useMemo(() => ({ open }), [open]);
  const locked = checkout.phase === "confirming" || checkout.phase === "starting";

  return (
    <CheckoutDialogContext.Provider value={ctx}>
      {children}
      <Dialog open={isOpen} onOpenChange={(next) => !locked && setIsOpen(next)}>
        <DialogContent
          showCloseButton={!locked}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto rounded-2xl border-neutral-200 bg-white p-6 shadow-2xl sm:max-w-[448px] dark:border-neutral-800 dark:bg-[#161616]"
        >
          {isOpen && (
            <DialogBody
              key={session}
              planId={planId}
              setPlanId={setPlanId}
              item={item}
              autoStart={autoStart}
              checkout={checkout}
              returnTo={pathname || "/pricing"}
              onClose={() => setIsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </CheckoutDialogContext.Provider>
  );
}

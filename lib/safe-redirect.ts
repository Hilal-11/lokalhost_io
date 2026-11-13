/**
 * Accept only same-origin relative paths for post-login redirects.
 * Rejects absolute URLs, protocol-relative ("//evil.com"), backslash tricks
 * and anything that would resolve to another origin.
 */
export function safeNext(input: string | null | undefined, fallback = "/"): string {
  if (!input || typeof input !== "string") return fallback;
  if (!input.startsWith("/") || input.startsWith("//")) return fallback;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    if (c < 32 || c === 127 || c === 92 /* backslash */) return fallback;
  }
  try {
    const base = "http://lk.invalid";
    const url = new URL(input, base);
    if (url.origin !== base) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}

export const PAID_PLAN_IDS = ["pro_monthly", "pro_yearly"] as const;
export type PaidPlanId = (typeof PAID_PLAN_IDS)[number];

export function isPaidPlanId(v: unknown): v is PaidPlanId {
  return typeof v === "string" && (PAID_PLAN_IDS as readonly string[]).includes(v);
}

/** Where a logged-out buyer is sent: login, then back to /pricing with checkout auto-opening. */
export function loginUrlForPlan(planId: PaidPlanId, next = "/pricing") {
  return `/login?next=${encodeURIComponent(next)}&plan=${planId}`;
}

/** Append ?plan= to a (validated) return path. */
export function withPlan(next: string, planId: string | null | undefined) {
  if (!isPaidPlanId(planId)) return next;
  const [path, hash = ""] = next.split("#");
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}plan=${planId}${hash ? `#${hash}` : ""}`;
}

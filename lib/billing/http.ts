import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { BillingError } from "./index";
import { billingLog, errorMessage } from "./log";

const NO_STORE = { "Cache-Control": "private, no-store" };

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new BillingError(401, "UNAUTHENTICATED", "Please sign in to continue.");
  return user;
}

/** Wraps a route body: known errors become clean JSON, everything else a generic 500 (details only in logs). */
export async function handle(route: string, fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof BillingError) {
      return json({ error: e.message, code: e.code, ...e.extra }, e.status);
    }
    billingLog("error", "route.error", { route, error: errorMessage(e) });
    return json({ error: "Something went wrong. Please try again.", code: "INTERNAL" }, 500);
  }
}

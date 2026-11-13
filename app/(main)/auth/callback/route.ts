import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { safeNext } from "@/lib/safe-redirect";

const NEXT_COOKIE = "lk_next";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const store = await cookies();
  // Only same-origin relative paths are honoured (no open redirects).
  const next = safeNext(searchParams.get("next") ?? store.get(NEXT_COOKIE)?.value, "/");
  store.delete(NEXT_COOKIE);

  const supabase = await createClient();
  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  }

  if (ok) return NextResponse.redirect(new URL(next, origin));

  const login = new URL("/login", origin);
  login.searchParams.set("error", "auth");
  if (next !== "/") login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

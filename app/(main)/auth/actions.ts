"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { safeNext, withPlan } from "@/lib/safe-redirect";

const NEXT_COOKIE = "lk_next";
const DEFAULT_AFTER_LOGIN = "/templates";

/** Origin of the current request, so OAuth returns to the site the user is actually on (prod or localhost). */
async function getURL() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) return `${h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")}://${host}`;
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000";
  return url.startsWith("http") ? url : `https://${url}`;
}

/** Validated return path from the login form (`next` + optional `plan`). */
function nextFrom(formData?: FormData) {
  const raw = formData?.get("next");
  const plan = formData?.get("plan");
  const next = safeNext(typeof raw === "string" ? raw : null, DEFAULT_AFTER_LOGIN);
  return safeNext(withPlan(next, typeof plan === "string" ? plan : null), DEFAULT_AFTER_LOGIN);
}

/**
 * Remember where to send the user after an OAuth / email round-trip.
 * A cookie survives the provider redirect even if the redirect allow-list strips query params.
 */
async function callbackUrl(next: string) {
  const store = await cookies();
  store.set(NEXT_COOKIE, next, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 30 });
  return `${await getURL()}/auth/callback?next=${encodeURIComponent(next)}`;
}

// ── Email + Password ───────────────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: { emailRedirectTo: await callbackUrl(nextFrom(formData)) },
  });
  if (error) return { error: error.message };
  return { success: "Check your email to confirm your account." };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };
  redirect(nextFrom(formData));
}

// ── Magic link ─────────────────────────────────────────────────────────────
export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email first." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: await callbackUrl(nextFrom(formData)) },
  });
  if (error) return { error: error.message };
  return { success: "Check your inbox — we sent you a sign-in link." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ── OAuth ──────────────────────────────────────────────────────────────────
async function oauth(provider: "github" | "google", formData?: FormData) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: await callbackUrl(nextFrom(formData)) },
  });
  if (error) redirect("/login?error=auth");
  if (data.url) redirect(data.url);
}

export async function signInWithGithub(formData?: FormData) {
  await oauth("github", formData);
}

export async function signInWithGoogle(formData?: FormData) {
  await oauth("google", formData);
}

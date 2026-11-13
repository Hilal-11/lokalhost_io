import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getProvider, processWebhook } from "@/lib/billing";
import { billingLog, errorMessage } from "@/lib/billing/log";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const reply = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

export async function POST(req: Request) {
  // Raw body first: the signature covers the exact bytes Razorpay sent.
  const raw = await req.text();
  let provider;
  try {
    provider = getProvider();
  } catch (e) {
    billingLog("error", "webhook.misconfigured", { error: errorMessage(e) });
    return reply(500, { error: "unavailable" });
  }
  if (!provider.verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature"))) {
    billingLog("warn", "webhook.bad_signature");
    return reply(400, { error: "invalid signature" });
  }

  let event;
  try {
    event = provider.parseWebhook(raw);
  } catch {
    return reply(400, { error: "invalid payload" });
  }
  const eventId = req.headers.get("x-razorpay-event-id") ?? `sha256:${createHash("sha256").update(raw).digest("hex")}`;
  const db = supabaseAdmin();

  try {
    // Idempotency: first writer wins; replays find the existing row.
    const { error: insErr } = await db.from("webhook_events").upsert(
      { id: eventId, provider: provider.name, event_type: event.type, payload: JSON.parse(raw) },
      { onConflict: "id", ignoreDuplicates: true },
    );
    if (insErr) throw new Error(insErr.message);
    const { data: row, error: selErr } = await db.from("webhook_events")
      .select("processed_at, attempts").eq("id", eventId).single();
    if (selErr) throw new Error(selErr.message);
    if (row.processed_at) return reply(200, { ok: true, duplicate: true });

    const attempts = (row.attempts ?? 0) + 1;
    try {
      const note = await processWebhook(event);
      await db.from("webhook_events").update({ processed_at: new Date().toISOString(), attempts, error: null }).eq("id", eventId);
      billingLog("info", "webhook.processed", { event_id: eventId, type: event.type, note, attempts });
      return reply(200, { ok: true });
    } catch (e) {
      const message = errorMessage(e);
      await db.from("webhook_events").update({ attempts, error: message.slice(0, 500) }).eq("id", eventId);
      billingLog("error", "webhook.failed", { event_id: eventId, type: event.type, attempts, error: message });
      return reply(500, { error: "processing failed" }); // Razorpay retries
    }
  } catch (e) {
    billingLog("error", "webhook.storage_failed", { event_id: eventId, error: errorMessage(e) });
    return reply(500, { error: "temporarily unavailable" });
  }
}

import { getBillingStatus, getProvider } from "@/lib/billing";
import { handle, json, requireUser } from "@/lib/billing/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return handle("billing/status", async () => {
    const user = await requireUser();
    const mode = getProvider().publicKey.startsWith("rzp_test_") ? "test" : "live";
    return json({ ...(await getBillingStatus(user.id)), mode });
  });
}

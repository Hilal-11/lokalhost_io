import { cancelSubscription } from "@/lib/billing";
import { handle, json, requireUser } from "@/lib/billing/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return handle("billing/cancel", async () => {
    const user = await requireUser();
    return json(await cancelSubscription(user.id));
  });
}

import { verifyCheckout, type VerifyInput } from "@/lib/billing";
import { handle, json, requireUser } from "@/lib/billing/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handle("billing/verify", async () => {
    const user = await requireUser();
    const body = (await req.json().catch(() => ({}))) as VerifyInput;
    return json(await verifyCheckout(user.id, body));
  });
}

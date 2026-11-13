import { createCheckout } from "@/lib/billing";
import { handle, json, requireUser } from "@/lib/billing/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handle("billing/checkout", async () => {
    const user = await requireUser();
    const body = await req.json().catch(() => ({}));
    const session = await createCheckout(
      {
        id: user.id,
        email: user.email,
        name: (user.user_metadata?.full_name ?? user.user_metadata?.name ?? null) as string | null,
      },
      (body as { planId?: unknown }).planId,
    );
    return json(session);
  });
}

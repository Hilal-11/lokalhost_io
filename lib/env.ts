import "server-only";
import { z } from "zod";

/**
 * Server environment, validated once on first use. Billing code fails fast
 * with a readable message if a required variable is missing.
 * RAZOR_PAY_TEST_API_KEY / _SECRET are accepted as legacy aliases.
 */
const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  RAZORPAY_PLAN_ID_MONTHLY: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  SUPPORT_EMAIL: z.string().optional(),
});

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | null = null;

const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const e = process.env;
  const parsed = schema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: clean(e.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: clean(e.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: clean(e.SUPABASE_SERVICE_ROLE_KEY),
    RAZORPAY_KEY_ID: clean(e.RAZORPAY_KEY_ID) ?? clean(e.RAZOR_PAY_TEST_API_KEY),
    RAZORPAY_KEY_SECRET: clean(e.RAZORPAY_KEY_SECRET) ?? clean(e.RAZOR_PAY_TEST_API_SECRET),
    RAZORPAY_PLAN_ID_MONTHLY: clean(e.RAZORPAY_PLAN_ID_MONTHLY),
    RAZORPAY_WEBHOOK_SECRET: clean(e.RAZORPAY_WEBHOOK_SECRET),
    SUPPORT_EMAIL: clean(e.SUPPORT_EMAIL),
  });
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`[env] Missing or invalid environment variables: ${missing}`);
  }
  cached = parsed.data;
  return cached;
}

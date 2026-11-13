/**
 * Razorpay sanity check + plan setup.
 *
 *   npm run billing:check            → shows which mode the keys are in and whether the monthly plan exists
 *   npm run billing:check -- --create → also creates the ₹999/month plan in THAT mode and prints its id
 *
 * Test and live are separate worlds in Razorpay: keys, plans, subscriptions and webhooks
 * created in one do not exist in the other.
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true, { info() {}, error() {} });

const keyId = process.env.RAZORPAY_KEY_ID ?? process.env.RAZOR_PAY_TEST_API_KEY ?? "";
const keySecret = process.env.RAZORPAY_KEY_SECRET ?? process.env.RAZOR_PAY_TEST_API_SECRET ?? "";
const planId = process.env.RAZORPAY_PLAN_ID_MONTHLY ?? "";
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

const AMOUNT = 99900; // paise — must match plans.amount for pro_monthly

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
  });
  return { status: res.status, body: (await res.json()) as any }; // eslint-disable-line @typescript-eslint/no-explicit-any
}

async function main() {
  if (!keyId || !keySecret) throw new Error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env first.");
  const mode = keyId.startsWith("rzp_test_") ? "TEST" : keyId.startsWith("rzp_live_") ? "LIVE" : "UNKNOWN";
  console.log(`Keys:            ${mode} mode`);
  if (mode === "LIVE") console.log("                 ⚠ real money. Razorpay test cards are declined in live mode.");

  console.log(
    `Webhook secret:  ${webhookSecret ? `${webhookSecret.length} characters as loaded` : "NOT SET"}` +
      (webhookSecret ? "  (if this is shorter than what you typed, wrap the value in quotes in .env — # starts a comment)" : ""),
  );

  const plan = planId ? await api(`/plans/${planId}`) : null;
  if (plan?.status === 200) {
    const ok = plan.body.item?.amount === AMOUNT && plan.body.item?.currency === "INR" && plan.body.period === "monthly";
    console.log(`Monthly plan:    found in ${mode} mode — ₹${plan.body.item.amount / 100} ${plan.body.period}${ok ? "" : "  ⚠ expected ₹999 monthly INR"}`);
  } else {
    console.log(`Monthly plan:    ${planId ? `"${planId}" does not exist in ${mode} mode` : "RAZORPAY_PLAN_ID_MONTHLY not set"}`);
  }

  if (process.argv.includes("--create")) {
    if (plan?.status === 200) return console.log("\nPlan already exists for these keys — nothing created.");
    const created = await api("/plans", {
      method: "POST",
      body: JSON.stringify({
        period: "monthly",
        interval: 1,
        item: { name: "lokalhost Pro Monthly", amount: AMOUNT, currency: "INR", description: "Monthly access to everything premium" },
      }),
    });
    if (created.status >= 300) throw new Error(`Could not create plan: ${created.body?.error?.description ?? created.status}`);
    console.log(`\nCreated ${mode} plan. Put this in .env:\n  RAZORPAY_PLAN_ID_MONTHLY=${created.body.id}`);
  } else if (plan?.status !== 200) {
    console.log("\nRun `npm run billing:check -- --create` to create the plan for these keys.");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});

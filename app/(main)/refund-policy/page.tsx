import type { Metadata } from "next";
import { LegalPage, SUPPORT_EMAIL } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Refund & Cancellation Policy | Lokalhost.io" };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      updated="[PLACEHOLDER: date]"
      intro={<p>lokalhost Pro is a digital product with instant access, so please preview items before you buy — every premium item has a public preview.</p>}
      sections={[
        { heading: "Cancellation", body: <p>Cancel Pro Monthly anytime from your billing page. You are not charged again and keep access until the end of the paid period. Pro Yearly never renews automatically, so there is nothing to cancel.</p> },
        { heading: "Refunds", body: <p>[PLACEHOLDER: refund window and conditions — e.g. full refund within 7 days if you have not downloaded premium source.] Approved refunds are returned to the original payment method, typically within 5–7 business days.</p> },
        { heading: "What happens to access", body: <p>When a payment is refunded, the access it paid for ends immediately.</p> },
        { heading: "Duplicate or failed payments", body: <p>If you were charged twice or charged without receiving access, write to us with your payment ID and we will fix it.</p> },
        { heading: "How to request", body: <p>Email <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from your account email with the payment ID shown on your billing page.</p> },
      ]}
    />
  );
}

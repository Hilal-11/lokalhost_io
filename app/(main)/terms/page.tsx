import type { Metadata } from "next";
import { LegalPage, SUPPORT_EMAIL } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Terms of Service | Lokalhost.io" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="[PLACEHOLDER: date]"
      intro={<p>These terms cover your use of Lokalhost.io and the lokalhost Pro plan. [PLACEHOLDER: legal entity name and registered address.]</p>}
      sections={[
        { heading: "The service", body: <p>Lokalhost.io provides UI components, blocks, templates and mobile UI kits. Free items are available to everyone. Premium items require an active Pro plan.</p> },
        { heading: "Plans and billing", body: <p>Pro Monthly (₹999/month) renews automatically until cancelled. Pro Yearly (₹7,999) is a one-time payment for 365 days of access and does not renew automatically. Payments are processed by Razorpay. Prices are in INR; taxes may apply.</p> },
        { heading: "Licence", body: <p>[PLACEHOLDER: licence terms — e.g. use in unlimited personal and client projects; no redistribution or resale of the source as a competing library or template.]</p> },
        { heading: "Cancellation", body: <p>You can cancel Pro Monthly anytime from your billing page. Access continues until the end of the paid period.</p> },
        { heading: "Liability", body: <p>[PLACEHOLDER: warranty disclaimer and limitation of liability.]</p> },
        { heading: "Governing law", body: <p>[PLACEHOLDER: governing law and jurisdiction.]</p> },
        { heading: "Contact", body: <p>Questions about these terms: <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p> },
      ]}
    />
  );
}

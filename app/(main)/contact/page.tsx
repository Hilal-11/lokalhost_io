import type { Metadata } from "next";
import { LegalPage, SUPPORT_EMAIL } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Contact | Lokalhost.io" };

export default function ContactPage() {
  return (
    <LegalPage
      title="Contact"
      updated="[PLACEHOLDER: date]"
      intro={<p>We usually reply within 48 hours on business days.</p>}
      sections={[
        { heading: "Email", body: <p><a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> — for billing questions, include the payment ID from your billing page.</p> },
        { heading: "Business details", body: <p>[PLACEHOLDER: legal business name, registered address, phone number, GSTIN if applicable.]</p> },
        { heading: "Custom work", body: <p>Need something built? Use the <a className="underline" href="/custom-work">custom work</a> form.</p> },
      ]}
    />
  );
}

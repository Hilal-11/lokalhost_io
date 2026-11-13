import type { Metadata } from "next";
import { LegalPage, SUPPORT_EMAIL } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Privacy Policy | Lokalhost.io" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="[PLACEHOLDER: date]"
      intro={<p>This policy explains what Lokalhost.io collects and why. [PLACEHOLDER: legal entity name.]</p>}
      sections={[
        { heading: "What we collect", body: <p>Account details you provide when signing in (email, name and avatar from Google or GitHub), your plan and payment history, and basic usage logs for premium downloads.</p> },
        { heading: "Payments", body: <p>Payments are handled by Razorpay. We never see or store your card, UPI or bank details — only the payment reference, amount and status.</p> },
        { heading: "How we use it", body: <p>To give you access to what you paid for, send receipts and renewal reminders, prevent abuse, and provide support.</p> },
        { heading: "Sharing", body: <p>We share data only with the processors needed to run the service (hosting, database, payments, email). [PLACEHOLDER: list of processors.]</p> },
        { heading: "Your choices", body: <p>You can ask for a copy of your data or for your account to be deleted. Billing records may be kept where tax law requires.</p> },
        { heading: "Contact", body: <p>Privacy requests: <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p> },
      ]}
    />
  );
}

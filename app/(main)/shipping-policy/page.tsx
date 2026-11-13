import type { Metadata } from "next";
import { LegalPage, SUPPORT_EMAIL } from "@/components/legal/legal-page";

export const metadata: Metadata = { title: "Shipping & Delivery Policy | Lokalhost.io" };

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping & Delivery Policy"
      updated="[PLACEHOLDER: date]"
      intro={<p>Lokalhost.io sells digital products only. Nothing is shipped physically.</p>}
      sections={[
        { heading: "Delivery", body: <p>Access to lokalhost Pro is delivered digitally to your account immediately after a successful payment. In rare cases bank confirmation can take a few minutes.</p> },
        { heading: "If access doesn't appear", body: <p>Open your billing page and refresh. If you were charged and still have no access after 30 minutes, email <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with your payment ID.</p> },
        { heading: "Shipping charges", body: <p>None.</p> },
      ]}
    />
  );
}

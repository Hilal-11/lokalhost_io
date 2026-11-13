import type { Metadata } from "next";
import { SuccessClient } from "./success-client";

export const metadata: Metadata = {
  title: "Payment received | Lokalhost.io",
  robots: { index: false },
};

export default function CheckoutSuccessPage() {
  return <SuccessClient supportEmail={process.env.SUPPORT_EMAIL ?? "hilalahmadcodedev123@gmail.com"} />;
}

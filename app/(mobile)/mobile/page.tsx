import type { Metadata } from "next";
import { getSummaries } from "@/lib/mobile/catalog";
import { Overview } from "@/components/mobile/overview/explorer";
import { PageFooter, PageLayout } from "@/components/mobile/page/chrome";

export const metadata: Metadata = {
  title: { absolute: "Mobile UI for React Native & Flutter — Lokalhost.io" },
  alternates: { canonical: "/mobile" },
};

export default function MobileOverviewPage() {
  return (
    <PageLayout>
      <Overview items={getSummaries()} />
      <PageFooter next={{ title: "Introduction", href: "/mobile/introduction" }} />
    </PageLayout>
  );
}

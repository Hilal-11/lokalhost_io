import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getMobileNav } from "@/lib/mobile/nav";
import { getSummaries } from "@/lib/mobile/catalog";
import { MobileShell } from "@/components/mobile/shell/mobile-shell";

export const metadata: Metadata = {
  title: {
    template: "%s · Mobile UI — Lokalhost.io",
    default: "Mobile UI for React Native & Flutter — Lokalhost.io",
  },
  description:
    "Copy-paste mobile components, screens and blocks for React Native (Expo) and Flutter, with live iOS and Android previews.",
};

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <MobileShell nav={getMobileNav()} items={getSummaries()}>
      {children}
    </MobileShell>
  );
}

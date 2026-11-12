import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getDocsNav } from "@/lib/docs-nav";
import { DocsShell } from "@/components/docs/docs-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | Lokalhost.io Docs",
    default: "Docs | Lokalhost.io — Free React UI Components & Templates",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  const { categories } = getDocsNav();
  return <DocsShell categories={categories}>{children}</DocsShell>;
}

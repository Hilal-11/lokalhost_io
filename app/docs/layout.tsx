import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";
import { baseOptions } from "../layout.config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template:
      "%s | Lokalhost.io - Free UI Components to build beautiful websites  Templates",
    default: "Lokalhost.io - Free UI Components to build beautiful websites Templates",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions}
      sidebar={{
        defaultOpenLevel: 1,
        
      }}
    >
      {children}
    </DocsLayout>
  );
}

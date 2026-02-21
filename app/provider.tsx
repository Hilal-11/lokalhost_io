"use client";

import { ThemeProvider } from "@/components/provider/theme-provider";
import { RootProvider } from "fumadocs-ui/provider"
import { ConvexClientProvider } from "@/provider/ConvexClientProvider";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RootProvider>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </RootProvider>
    </ThemeProvider>
  );
}
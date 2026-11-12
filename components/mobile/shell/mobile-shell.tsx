"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { MotionConfig } from "motion/react";
import { Menu, Search, X } from "lucide-react";
import type { NavSection } from "@/lib/mobile/nav";
import type { MobileItemSummary } from "@/lib/mobile/types";
import { IconButton, TooltipProvider } from "../ui/primitives";
import { MobilePrefsProvider } from "./prefs";
import { SearchDialog } from "./search-dialog";
import { DesktopSidebar, Logo, SidebarBody } from "./sidebar";

/* ------------------------------------------------------------------ */
/* Global shortcuts: ⌘K / Ctrl+K, "/" and "F" open search.            */
/* ------------------------------------------------------------------ */

function useSearchHotkeys(open: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
      const mod = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const bare = !typing && !e.metaKey && !e.ctrlKey && !e.altKey && (e.key === "/" || e.key.toLowerCase() === "f");
      if (mod || bare) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
}

function Shell({ nav, items, children }: { nav: NavSection[]; items: MobileItemSummary[]; children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const pathname = usePathname();
  const openSearch = useState(() => () => setSearchOpen(true))[0];

  useSearchHotkeys(openSearch);
  useEffect(() => setDrawer(false), [pathname]);

  // DocsToc reads this offset; /mobile has no site header.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.getPropertyValue("--docs-header-h");
    root.style.setProperty("--docs-header-h", "8px");
    return () => {
      if (prev) root.style.setProperty("--docs-header-h", prev);
      else root.style.removeProperty("--docs-header-h");
    };
  }, []);

  return (
    <div className="lk-app flex min-h-dvh bg-lk-bg font-sans text-lk-fg antialiased">
      <a
        href="#main"
        className="lk-focus sr-only z-[300] rounded-lk bg-lk-fg px-3 py-2 text-[13px] text-lk-bg focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      <DesktopSidebar nav={nav} onSearch={openSearch} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile / tablet top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-lk-border bg-lk-bg/85 px-3 backdrop-blur-md lg:hidden">
          <Dialog.Root open={drawer} onOpenChange={setDrawer}>
            <Dialog.Trigger asChild>
              <IconButton label="Open navigation">
                <Menu size={18} />
              </IconButton>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[90] bg-lk-overlay data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 left-0 z-[91] flex w-[min(300px,86vw)] flex-col border-r border-lk-border bg-lk-bg shadow-2xl duration-200 data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left"
              >
                <Dialog.Title className="sr-only">Navigation</Dialog.Title>
                <div className="flex h-14 shrink-0 items-center justify-between px-3">
                  <Link href="/mobile" className="lk-focus flex items-center gap-2 rounded-lk">
                    <Logo />
                    <span className="text-[14px] font-semibold">lokalhost</span>
                    <span className="rounded-full border border-lk-border bg-lk-surface px-1.5 py-px text-[11px] text-lk-muted">Mobile</span>
                  </Link>
                  <Dialog.Close asChild>
                    <IconButton label="Close navigation">
                      <X size={16} />
                    </IconButton>
                  </Dialog.Close>
                </div>
                <div className="min-h-0 flex-1">
                  <SidebarBody
                    nav={nav}
                    showHeader={false}
                    onNavigate={() => setDrawer(false)}
                    onSearch={() => {
                      setDrawer(false);
                      setSearchOpen(true);
                    }}
                  />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <Link href="/mobile" className="lk-focus flex items-center gap-2 rounded-lk">
            <Logo />
            <span className="text-[14px] font-semibold">Mobile</span>
          </Link>
          <IconButton label="Search" onClick={openSearch} className="ml-auto">
            <Search size={17} />
          </IconButton>
        </header>

        <main id="main" className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} nav={nav} items={items} />
    </div>
  );
}

export function MobileShell(props: { nav: NavSection[]; items: MobileItemSummary[]; children: ReactNode }) {
  return (
    <MobilePrefsProvider>
      <TooltipProvider delayDuration={200}>
        <MotionConfig reducedMotion="user">
          <Shell {...props} />
        </MotionConfig>
      </TooltipProvider>
    </MobilePrefsProvider>
  );
}

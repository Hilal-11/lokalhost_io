"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, PanelLeft, X } from "lucide-react";
import type { DocsNavCategory } from "@/lib/docs-nav";
import { DocsSidebar, SidebarContent } from "./docs-sidebar";

/** Keeps --docs-header-h in sync with the real height of the site header. */
function useHeaderHeight() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("[data-site-header]");
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--docs-header-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
}

function MobileBar({ categories }: { categories: DocsNavCategory[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const current = categories
    .flatMap((c) => c.groups.flatMap((g) => g.items.map((i) => ({ ...i, category: c.title }))))
    .find((i) => i.url === pathname);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div
        className="sticky z-30 flex h-11 items-center gap-2 border-b border-neutral-200 bg-white/85 px-4 backdrop-blur-md lg:hidden dark:border-neutral-800 dark:bg-black/80"
        style={{ top: "var(--docs-header-h)" }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-neutral-200 px-2 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          <PanelLeft size={14} />
          Menu
        </button>
        <div className="flex min-w-0 items-center gap-1 text-[13px] text-neutral-500">
          <span className="truncate">{current?.category ?? "Docs"}</span>
          {current && (
            <>
              <ChevronRight size={13} className="shrink-0" />
              <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">{current.title}</span>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 z-[90] flex w-[min(320px,86vw)] flex-col border-r border-neutral-200 bg-white shadow-2xl lg:hidden dark:border-neutral-800 dark:bg-neutral-950"
            >
              <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
                <span className="text-sm font-semibold">Documentation</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <SidebarContent categories={categories} onNavigate={() => setOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function DocsShell({ categories, children }: { categories: DocsNavCategory[]; children: ReactNode }) {
  useHeaderHeight();

  return (
    <div className="relative bg-white text-neutral-900 dark:bg-black dark:text-neutral-100">
      <MobileBar categories={categories} />
      <div className="mx-auto flex w-full max-w-[1680px]">
        <DocsSidebar categories={categories} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { featuredLinks, services } from "@/config/servicesConfig";
import { useHoverMenu } from "./use-hover-menu";

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400";
const DEFAULT_HINT = "Everything you need to ship UI faster.";

function isActive(pathname: string | null, link: string) {
  if (!pathname) return false;
  if (link === "/docs") return pathname === "/docs" || pathname.startsWith("/docs/components/buttons") || pathname.startsWith("/docs/components/code-blocks");
  return pathname === link || pathname.startsWith(`${link}/`);
}

/** Header "Products" item — hover mega-menu: 3×3 product grid + featured links. */
export function ProductsNavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const { open, close, rootProps, triggerProps, panelProps } = useHoverMenu();
  const [hint, setHint] = React.useState<string | null>(null);
  const hintId = React.useId();

  React.useEffect(() => {
    if (!open) setHint(null);
  }, [open]);

  const navigate = () => {
    close();
    onNavigate?.();
  };

  return (
    <div {...rootProps} className="relative">
      <button
        {...triggerProps}
        className={cn(
          "flex items-center gap-1 rounded-md font-sans text-sm font-medium transition-colors",
          open ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
          ring
        )}
      >
        Products
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex">
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...panelProps}
            initial={{ opacity: 0, y: reduce ? 0 : 6, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 4, scale: reduce ? 1 : 0.99, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-[calc(100%+14px)] z-50 w-[min(780px,calc(100vw-48px))]"
          >
            {/* hover bridge between trigger and panel */}
            <div aria-hidden className="absolute -top-4 left-0 h-4 w-full" />

            <div className="grid grid-cols-[1fr_210px] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100/80 font-sans shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25),0_2px_6px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]">
              {/* products card */}
              <div className="m-1.5 flex flex-col rounded-xl border border-neutral-200 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-950">
                <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">Products</p>

                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.018 } } }}
                  className="grid grid-cols-3 gap-1"
                  onPointerLeave={() => setHint(null)}
                >
                  {services.map(({ id, service, about, icon: Icon, link, badge }) => {
                    const active = isActive(pathname, link);
                    return (
                      <motion.li key={id} variants={{ hidden: { opacity: 0, y: reduce ? 0 : 3 }, show: { opacity: 1, y: 0 } }}>
                        <Link
                          data-menu-link=""
                          href={link}
                          onClick={navigate}
                          onPointerEnter={() => setHint(about)}
                          onFocus={() => setHint(about)}
                          aria-current={active ? "page" : undefined}
                          aria-describedby={hintId}
                          className={cn(
                            "group flex h-12 items-center gap-2.5 rounded-lg border px-2 outline-none transition-[background-color,border-color,box-shadow] duration-150",
                            "border-transparent hover:border-neutral-200 hover:bg-neutral-50 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
                            "focus-visible:border-neutral-300 focus-visible:bg-neutral-50",
                            "dark:hover:border-neutral-800 dark:hover:bg-neutral-900 dark:focus-visible:border-neutral-700 dark:focus-visible:bg-neutral-900",
                            active && "border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
                          )}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform duration-200 group-hover:scale-[1.04] dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                            <Icon className="size-4" strokeWidth={1.75} />
                          </span>
                          <span className="min-w-0 truncate text-[13.5px] font-medium text-neutral-800 group-hover:text-neutral-950 dark:text-neutral-200 dark:group-hover:text-white">
                            {service}
                          </span>
                          {badge && (
                            <span
                              className={cn(
                                "ml-auto shrink-0 rounded-[5px] px-1 py-px text-[9.5px] font-semibold uppercase tracking-wide",
                                badge === "pro"
                                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                                  : "border border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
                              )}
                            >
                              {badge}
                            </span>
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                {/* hover description + docs button */}
                <div className="mt-3 flex items-center gap-3 border-t border-neutral-100 pt-3 dark:border-neutral-800/80">
                  <p id={hintId} className="relative h-5 min-w-0 flex-1 overflow-hidden px-2 text-[12.5px] text-neutral-500 dark:text-neutral-400" aria-live="polite">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={hint ?? "default"}
                        initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.1 } }}
                        transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-x-2 truncate"
                      >
                        {hint ?? DEFAULT_HINT}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                  <Link
                    data-menu-link=""
                    href="/docs"
                    onClick={navigate}
                    className={cn(
                      "group inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3.5 text-[13px] font-medium text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:border-neutral-300 hover:bg-neutral-50",
                      "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800",
                      ring
                    )}
                  >
                    Go to docs
                    <ChevronRight className="size-3.5 text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>

              {/* featured links */}
              <div className="flex flex-col py-4 pl-4 pr-3 bg-neutral-50 z-50">
                <p className="pb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">Get started</p>
                <ul className="flex flex-col gap-0.5">
                  {featuredLinks.map((l) => (
                    <li key={l.href}>
                      <Link
                        data-menu-link=""
                        href={l.href}
                        onClick={navigate}
                        className={cn(
                          "group -mx-2 flex h-8 items-center justify-between rounded-md px-2 text-[13.5px] font-medium text-neutral-700 transition-colors hover:bg-white hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white",
                          ring
                        )}
                      >
                        {l.label}
                        <ChevronRight className="size-3.5 -translate-x-1 text-neutral-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

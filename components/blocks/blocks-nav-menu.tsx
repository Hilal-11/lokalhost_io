"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BLOCK_CATEGORIES,
  BLOCKS_BASE,
  blockHref,
  categoryHref,
  countBlocks,
  getCategory,
  getFeaturedBlock,
} from "@/lib/blocks/catalog";
import { BlockArt } from "./block-art";

const OPEN_DELAY = 80;
const CLOSE_DELAY = 160;

/** Header "Blocks" item with a hover / click / keyboard mega-menu. */
export function BlocksNavMenu({ onNavigate }: { onNavigate?: () => void }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();

  const featured = getFeaturedBlock();
  const featuredCategory = featured ? getCategory(featured.category) : BLOCK_CATEGORIES[0];
  const active = pathname?.startsWith(BLOCKS_BASE);

  const schedule = (next: boolean) => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), next ? OPEN_DELAY : CLOSE_DELAY);
  };

  React.useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  // close on route change, outside click and Escape
  React.useEffect(() => setOpen(false), [pathname]);
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const navigate = () => {
    setOpen(false);
    onNavigate?.();
  };

  const focusFirst = () => requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>("[data-menu-link]")?.focus());

  return (
    <div ref={rootRef} className="relative" onPointerEnter={(e) => e.pointerType === "mouse" && schedule(true)} onPointerLeave={(e) => e.pointerType === "mouse" && schedule(false)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            focusFirst();
          }
        }}
        className={cn(
          "flex items-center gap-1 rounded-md font-sans text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
          active || open ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        )}
      >
        Blocks
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex">
          <ChevronDown className="size-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: reduce ? 0 : 6, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 4, scale: reduce ? 1 : 0.99, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-[calc(100%+14px)] z-50 w-[min(760px,calc(100vw-48px))]"
          >
            {/* hover bridge so the pointer can travel from trigger to panel */}
            <div aria-hidden className="absolute -top-4 left-0 h-4 w-full" />
            <div
              className="grid grid-cols-[1fr_250px] gap-1.5 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 font-sans shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25),0_2px_6px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
              onKeyDown={(e) => {
                if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
                const links = Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-menu-link]") ?? []);
                const i = links.indexOf(document.activeElement as HTMLElement);
                e.preventDefault();
                links[(i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length]?.focus();
              }}
            >
              {/* categories */}
              <div className="flex flex-col rounded-xl px-3 pb-3 pt-3.5">
                <p className="px-2 text-[11.5px] font-medium text-neutral-500 dark:text-neutral-400">Blocks by section</p>
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.012 } } }}
                  className="mt-2 grid grid-cols-3 gap-x-1 gap-y-0.5"
                >
                  {BLOCK_CATEGORIES.map((c) => {
                    const n = countBlocks(c.slug);
                    return (
                      <motion.li key={c.slug} variants={{ hidden: { opacity: 0, y: reduce ? 0 : 3 }, show: { opacity: 1, y: 0 } }}>
                        <Link
                          data-menu-link=""
                          href={categoryHref(c.slug)}
                          onClick={navigate}
                          className="group flex h-9 items-center justify-between gap-2 rounded-lg px-2 text-[13.5px] font-medium text-neutral-700 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white dark:focus-visible:bg-neutral-900"
                        >
                          <span className="truncate">{c.title}</span>
                          {n > 0 && <span className="text-[11px] tabular-nums text-neutral-400 dark:text-neutral-500">{n}</span>}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
                <Link
                  data-menu-link=""
                  href={BLOCKS_BASE}
                  onClick={navigate}
                  className="group mt-auto flex h-9 w-fit items-center gap-1.5 rounded-lg px-2 pt-2 text-[13.5px] font-semibold text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:text-neutral-100"
                >
                  Browse all blocks
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>

              {/* featured */}
              <Link
                data-menu-link=""
                href={featured ? blockHref(featured) : categoryHref(featuredCategory?.slug ?? "")}
                onClick={navigate}
                className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 p-1.5 outline-none transition-colors hover:border-neutral-300 focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                  {featured?.image ? (
                    <Image src={featured.image} alt="" fill sizes="250px" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                      <BlockArt kind={featuredCategory?.art ?? "landing"} />
                    </div>
                  )}
                </div>
                <div className="px-1.5 pb-1.5 pt-3">
                  <p className="flex items-center gap-2 text-[14px] font-semibold text-neutral-900 dark:text-neutral-100">
                    <span className="truncate">{featured?.title ?? featuredCategory?.title}</span>
                    <span className="shrink-0 rounded-md border border-neutral-300 px-1.5 py-px text-[10.5px] font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                      {featured ? "new" : "soon"}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-neutral-500 dark:text-neutral-400">
                    {featured?.description ?? featuredCategory?.description}
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

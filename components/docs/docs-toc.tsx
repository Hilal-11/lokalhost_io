"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUp, TextAlignStart } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocEntry {
  title: ReactNode;
  url: string;
  depth: number;
}

/** "On this page" with scroll-spy and a sliding active marker. */
export function DocsToc({ items }: { items: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.url ?? null);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(decodeURIComponent(i.url.slice(1))))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const onScroll = () => {
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--docs-header-h")) || 73;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset - 40 <= 0) current = el.id;
      }
      // at the very bottom, the last heading wins
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = els[els.length - 1].id;
      setActive(`#${current}`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (!items.length) return null;
  const minDepth = Math.min(...items.map((i) => i.depth));

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-[13px] font-medium text-neutral-900 dark:text-neutral-100">
        <TextAlignStart size={14} className="text-neutral-400" />
        On this page
      </p>
      <ul className="relative m-0 flex list-none flex-col border-l border-neutral-200 p-0 dark:border-neutral-800">
        {items.map((item) => {
          const isActive = active === item.url;
          return (
            <li key={item.url} className="relative">
              {isActive && (
                <motion.span
                  layoutId="docs-toc-active"
                  className="absolute inset-y-0 -left-px w-px bg-neutral-900 dark:bg-white"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <a
                href={item.url}
                className={cn(
                  "block py-1 text-[13px] leading-snug transition-colors",
                  isActive
                    ? "text-neutral-900 dark:text-white"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                )}
                style={{ paddingLeft: 12 + (item.depth - minDepth) * 12 }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group mt-2 inline-flex w-fit items-center gap-1.5 text-[12.5px] text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
        Back to top
      </button>
    </div>
  );
}

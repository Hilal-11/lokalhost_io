"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocsNavCategory, DocsNavGroup, DocsNavItem } from "@/lib/docs-nav";
import { useTemplates } from "@/lib/templates-query";
import { docsIcons } from "./docs-icons";

const STORAGE_KEY = "lk-docs-sidebar-open";

function readStored(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeStored(v: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
}

function matches(item: DocsNavItem, q: string) {
  return (
    item.title.toLowerCase().includes(q) ||
    (item.group ?? "").toLowerCase().includes(q) ||
    (item.description ?? "").toLowerCase().includes(q)
  );
}

/* ------------------------------------------------------------------ */
/* Category content: groups → items                                   */
/* ------------------------------------------------------------------ */

function NavLink({ item, active, onNavigate }: { item: DocsNavItem; active: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href={item.url}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group/link relative -ml-px flex items-center gap-2 border-l py-[5px] pl-4 pr-2 text-[13.5px] transition-colors",
        active
          ? "border-transparent font-medium text-neutral-900 dark:text-white"
          : "border-transparent text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
      )}
    >
      {active && (
        <motion.span
          layoutId="docs-sidebar-active"
          className="absolute inset-y-0 -left-px w-[2px] rounded-full bg-lk-brand"
          transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
        />
      )}
      <span className="truncate transition-transform duration-200 group-hover/link:translate-x-0.5">{item.title}</span>
      {item.badge && (
        <span className="ml-auto shrink-0 rounded border border-sky-500/30 bg-sky-500/10 px-1 py-px text-[10px] font-medium leading-none text-sky-600 dark:text-sky-400">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function GroupList({
  groups,
  pathname,
  onNavigate,
}: {
  groups: DocsNavGroup[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 pb-2 pl-[22px] pt-1">
      {groups.map((group, gi) => (
        <div key={group.title ?? gi}>
          {group.title && (
            <p className="mb-1 pl-4 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400 dark:text-neutral-500">
              {group.title}
            </p>
          )}
          <div className="flex flex-col border-l border-neutral-200 dark:border-neutral-800">
            {group.items.map((item) => (
              <NavLink key={item.url} item={item} active={pathname === item.url} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TemplatesList({ query, pathname, onNavigate }: { query: string; pathname: string; onNavigate?: () => void }) {
  const { data, isLoading, error } = useTemplates();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 py-2 pl-[38px] pr-3">
        {[70, 85, 60, 75].map((w, i) => (
          <div key={i} className="h-2.5 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" style={{ width: `${w}%` }} />
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="py-2 pl-[38px] text-xs text-neutral-400">Couldn’t load templates.</p>;
  }

  const items: DocsNavItem[] = (data ?? [])
    .map((t) => ({ title: t.template_name, url: `/templates/template/${t.id}` }))
    .filter((i) => !query || matches(i, query));

  if (!items.length) {
    return query ? null : <p className="py-2 pl-[38px] text-xs text-neutral-400">No templates yet.</p>;
  }

  return (
    <GroupList
      pathname={pathname}
      onNavigate={onNavigate}
      groups={[{ items: query ? items : [...items, { title: "Browse all templates →", url: "/templates" }] }]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Category                                                           */
/* ------------------------------------------------------------------ */

function CategoryRow({
  category,
  open,
  onToggle,
  pathname,
  query,
  onNavigate,
}: {
  category: DocsNavCategory;
  open: boolean;
  onToggle: () => void;
  pathname: string;
  query: string;
  onNavigate?: () => void;
}) {
  const Icon = docsIcons[category.icon];
  const linkOnly = !category.dynamic && !category.soon && category.groups.length === 0 && category.href;
  const count = category.groups.reduce((n, g) => n + g.items.length, 0);
  const containsActive = category.groups.some((g) => g.items.some((i) => i.url === pathname));

  const iconBox = (
    <Icon size={16} strokeWidth={2} className="shrink-0 text-neutral-600 dark:text-neutral-400" aria-hidden />
  );

  const rowClass =
    "group/cat flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900";

  if (linkOnly) {
    if (query) return null;
    return (
      <Link href={category.href!} onClick={onNavigate} className={rowClass}>
        {iconBox}
        <span className="flex-1 truncate">{category.title}</span>
        <ArrowUpRight
          size={14}
          className="text-neutral-400 opacity-0 transition-all duration-200 group-hover/cat:-translate-y-px group-hover/cat:translate-x-px group-hover/cat:opacity-100"
        />
      </Link>
    );
  }

  if (category.soon) {
    if (query) return null;
    return (
      <div className={cn(rowClass, "cursor-default hover:bg-transparent dark:hover:bg-transparent")}>
        <span className="opacity-60">{iconBox}</span>
        <span className="flex-1 truncate text-neutral-400 dark:text-neutral-500">{category.title}</span>
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-px text-[10px] font-medium text-amber-600 dark:text-amber-400">
          Soon
        </span>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={onToggle} aria-expanded={open} className={rowClass}>
        {iconBox}
        <span className="flex-1 truncate">{category.title}</span>
        {count > 0 && !query && (
          <span className="text-[11px] tabular-nums text-neutral-400 dark:text-neutral-500">{count}</span>
        )}
        <ChevronDown
          size={14}
          className={cn("shrink-0 text-neutral-400 transition-transform duration-300", !open && "-rotate-90")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {category.dynamic === "templates" ? (
              <TemplatesList query={query} pathname={pathname} onNavigate={onNavigate} />
            ) : (
              <GroupList groups={category.groups} pathname={pathname} onNavigate={onNavigate} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar content (shared by desktop rail and mobile drawer)         */
/* ------------------------------------------------------------------ */

export function SidebarContent({
  categories,
  onNavigate,
  autoFocusSearch = false,
}: {
  categories: DocsNavCategory[];
  onNavigate?: () => void;
  autoFocusSearch?: boolean;
}) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const inputRef = useRef<HTMLInputElement>(null);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({ start: true, components: true, templates: true });

  // restore persisted state after mount (avoids hydration mismatch)
  useEffect(() => {
    setOpenMap((m) => ({ ...m, ...readStored() }));
  }, []);

  // always reveal the category that holds the current page
  useEffect(() => {
    const owner = categories.find((c) => c.groups.some((g) => g.items.some((i) => i.url === pathname)));
    if (owner) setOpenMap((m) => (m[owner.id] ? m : { ...m, [owner.id]: true }));
  }, [pathname, categories]);

  // ⌘K / Ctrl+K / "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        if (!inputRef.current || inputRef.current.offsetParent === null) return;
        // take over ⌘K on docs pages (capture phase, before global search hotkeys)
        e.preventDefault();
        e.stopImmediatePropagation();
        inputRef.current.focus();
        inputRef.current.select();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const filtered = useMemo(() => {
    if (!q) return categories;
    return categories.map((c) => ({
      ...c,
      groups: c.groups
        .map((g) => ({ ...g, items: g.items.filter((i) => matches(i, q)) }))
        .filter((g) => g.items.length),
    }));
  }, [categories, q]);

  const noResults =
    q && filtered.every((c) => c.dynamic !== "templates" && c.groups.length === 0);

  const toggle = (id: string) =>
    setOpenMap((m) => {
      const next = { ...m, [id]: !m[id] };
      writeStored(next);
      return next;
    });

  const [isMac, setIsMac] = useState(true);
  useEffect(() => setIsMac(/mac/i.test(navigator.userAgent)), []);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="px-3 pb-3 pt-5">
        <label className="group/search relative flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2.5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus-within:border-neutral-300 focus-within:ring-4 focus-within:ring-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900/60 dark:focus-within:border-neutral-700 dark:focus-within:ring-white/5">
          <Search size={14} className="shrink-0 text-neutral-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && (setQuery(""), (e.target as HTMLInputElement).blur())}
            placeholder="Search docs…"
            autoFocus={autoFocusSearch}
            className="min-w-0 flex-1 bg-transparent text-[13.5px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="rounded p-0.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
              <X size={13} />
            </button>
          ) : (
            <kbd className="hidden shrink-0 rounded border border-neutral-200 bg-neutral-50 px-1.5 font-sans text-[10.5px] font-medium text-neutral-400 sm:inline-block dark:border-neutral-700 dark:bg-neutral-800">
              {isMac ? "⌘" : "Ctrl"} K
            </kbd>
          )}
        </label>
      </div>

      {/* Categories */}
      <nav aria-label="Docs" className="lk-scroll flex-1 overflow-y-auto overscroll-contain px-3 pb-6">
        <div className="flex flex-col gap-0.5">
          {filtered.map((c) => (
            <CategoryRow
              key={c.id}
              category={c}
              open={q ? true : !!openMap[c.id]}
              onToggle={() => toggle(c.id)}
              pathname={pathname}
              query={q}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        {noResults && (
          <div className="mt-6 rounded-xl border border-dashed border-neutral-200 px-4 py-6 text-center dark:border-neutral-800">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">No results for “{query}”</p>
            <p className="mt-1 text-xs text-neutral-400">Try a component name like “button”.</p>
          </div>
        )}

        {!q && (
          <Link
            href="/custom-work"
            onClick={onNavigate}
            className="lk-cover lk-tone-warm lk-cover-dots group/promo mt-8 block rounded-xl border border-neutral-200 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800"
          >
            <p className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">Need something custom?</p>
            <p className="mt-1 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              We design and build landing pages, dashboards and full SaaS apps.
            </p>
            <span className="lk-btn lk-btn-sm lk-btn-primary mt-3 w-full">
              Start a project
              <ArrowUpRight size={13} className="transition-transform group-hover/promo:-translate-y-px group-hover/promo:translate-x-px" />
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop rail                                                       */
/* ------------------------------------------------------------------ */

export function DocsSidebar({ categories }: { categories: DocsNavCategory[] }) {
  return (
    <aside
      className="sticky hidden w-[272px] shrink-0 border-r border-neutral-200 bg-white lg:block dark:border-neutral-800/80 dark:bg-black"
      style={{ top: "var(--docs-header-h)", height: "calc(100dvh - var(--docs-header-h))" }}
    >
      <SidebarContent categories={categories} />
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Search, SearchX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemKind, MobileItemSummary, Platform } from "@/lib/mobile/types";
import { KIND_LABEL } from "@/lib/mobile/catalog";
import { IconButton, Segmented } from "../ui/primitives";
import { CategoryCard, FeaturedCard, ItemCard } from "./cards";

/* ------------------------------------------------------------------ */
/* Filters                                                            */
/* ------------------------------------------------------------------ */

export interface Filters {
  q: string;
  category: string;
  platform: "all" | Platform;
  tier: "all" | "free" | "pro";
  kind: "all" | ItemKind;
}

const EMPTY: Filters = { q: "", category: "all", platform: "all", tier: "all", kind: "all" };

function applyFilters(items: MobileItemSummary[], f: Filters) {
  const q = f.q.trim().toLowerCase();
  return items.filter((i) => {
    if (f.kind !== "all" && i.kind !== f.kind) return false;
    if (f.category !== "all" && i.category !== f.category) return false;
    if (f.platform !== "all" && i.platforms[f.platform] === "none") return false;
    if (f.tier !== "all" && i.tier !== f.tier) return false;
    if (q && ![i.title, i.description, i.category, ...i.tags].join(" ").toLowerCase().includes(q)) return false;
    return true;
  });
}

const selectClass =
  "lk-focus lk-transition h-8 appearance-none rounded-lk border border-lk-border bg-lk-bg pl-2.5 pr-7 text-[13px] text-lk-fg hover:border-lk-border-strong";

function Select<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={selectClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg aria-hidden className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-lk-subtle" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5 6 7.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

export function FilterBar({
  filters,
  setFilters,
  categories,
  showKind,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  categories: string[];
  showKind: boolean;
}) {
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setFilters({ ...filters, [k]: v });
  const dirty = JSON.stringify({ ...filters, kind: showKind ? filters.kind : "all" }) !== JSON.stringify(EMPTY);

  return (
    <div role="search" className="flex flex-col gap-2.5 md:flex-row md:items-center">
      <label className="lk-transition flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lk border border-lk-border bg-lk-bg px-2.5 focus-within:border-lk-border-strong md:max-w-[320px]">
        <Search size={14} className="shrink-0 text-lk-subtle" aria-hidden />
        <span className="sr-only">Search library</span>
        <input
          value={filters.q}
          onChange={(e) => set("q", e.target.value)}
          placeholder="Filter by name or tag…"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-lk-fg outline-none placeholder:text-lk-subtle"
        />
        {filters.q && (
          <button type="button" onClick={() => set("q", "")} aria-label="Clear search" className="lk-focus rounded text-lk-subtle hover:text-lk-fg">
            <X size={13} />
          </button>
        )}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {showKind && (
          <Select
            label="Type"
            value={filters.kind}
            onChange={(v) => set("kind", v)}
            options={[
              { value: "all", label: "All types" },
              { value: "component", label: "Components" },
              { value: "screen", label: "Screens" },
              { value: "block", label: "Blocks" },
            ]}
          />
        )}
        <Select
          label="Category"
          value={filters.category}
          onChange={(v) => set("category", v)}
          options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
        <Select
          label="Platform"
          value={filters.platform}
          onChange={(v) => set("platform", v)}
          options={[
            { value: "all", label: "All platforms" },
            { value: "ios", label: "iOS" },
            { value: "android", label: "Android" },
            { value: "web", label: "Web" },
          ]}
        />
        <Segmented
          size="sm"
          role="radiogroup"
          label="Pricing"
          value={filters.tier}
          onChange={(v) => set("tier", v)}
          options={[
            { value: "all", label: "All" },
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" },
          ]}
        />
        {dirty && (
          <button
            type="button"
            onClick={() => setFilters({ ...EMPTY, kind: showKind ? "all" : filters.kind })}
            className="lk-focus lk-transition h-8 rounded-lk px-2 text-[12.5px] text-lk-muted hover:bg-lk-surface hover:text-lk-fg"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export function EmptyResults({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lk-card border border-dashed border-lk-border px-6 py-16 text-center">
      <span className="flex size-10 items-center justify-center rounded-lk border border-lk-border bg-lk-surface">
        <SearchX size={18} className="text-lk-subtle" aria-hidden />
      </span>
      <p className="m-0 mt-2 text-[14px] font-medium text-lk-fg">No matches</p>
      <p className="m-0 max-w-sm text-[13px] text-lk-muted">Nothing fits those filters yet. Try a broader category or clear the search.</p>
      <button
        type="button"
        onClick={onReset}
        className="lk-focus lk-transition mt-3 h-8 rounded-lk border border-lk-border bg-lk-surface px-3 text-[13px] font-medium text-lk-fg hover:bg-lk-surface-2"
      >
        Clear filters
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Explorer — filter bar + grid                                        */
/* ------------------------------------------------------------------ */

export function Explorer({
  items,
  kind,
  filters: controlled,
  onFiltersChange,
}: {
  items: MobileItemSummary[];
  /** Fixed kind for category index pages. */
  kind?: ItemKind;
  filters?: Filters;
  onFiltersChange?: (f: Filters) => void;
}) {
  const [local, setLocal] = useState<Filters>({ ...EMPTY, kind: kind ?? "all" });
  const filters = controlled ?? local;
  const setFilters = onFiltersChange ?? setLocal;

  const scoped = kind ? items.filter((i) => i.kind === kind) : items;
  const categories = useMemo(() => [...new Set(scoped.map((i) => i.category))].sort(), [scoped]);
  const results = applyFilters(items, kind ? { ...filters, kind } : filters);

  return (
    <div className="flex flex-col gap-5">
      <FilterBar filters={filters} setFilters={setFilters} categories={categories} showKind={!kind} />
      <p className="m-0 text-[12.5px] text-lk-subtle" aria-live="polite">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>
      {results.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((i) => (
            <ItemCard key={i.href} item={i} />
          ))}
        </div>
      ) : (
        <EmptyResults onReset={() => setFilters({ ...EMPTY, kind: kind ?? "all" })} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview — hero, categories, featured, browse                      */
/* ------------------------------------------------------------------ */

function SectionTitle({ id, title, action }: { id?: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 id={id} className="m-0 scroll-mt-20 text-[20px] font-semibold tracking-tight text-lk-fg">
        {title}
      </h2>
      {action}
    </div>
  );
}

export function Overview({ items }: { items: MobileItemSummary[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const rowRef = useRef<HTMLDivElement>(null);

  // ?category= deep links (e.g. from other pages)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const category = p.get("category");
    const kind = p.get("kind") as Filters["kind"] | null;
    if (category || kind) setFilters((f) => ({ ...f, category: category ?? f.category, kind: kind ?? f.kind }));
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, MobileItemSummary[]>();
    for (const i of items) map.set(i.category, [...(map.get(i.category) ?? []), i]);
    return [...map.entries()].map(([name, list]) => ({ name, count: list.length, preview: list[0].preview }));
  }, [items]);

  const featured = items.filter((i) => i.featured);
  const counts = (["component", "screen", "block"] as const).map((k) => `${items.filter((i) => i.kind === k).length} ${KIND_LABEL[k].toLowerCase()}`);

  const pickCategory = (name: string) => {
    setFilters({ ...EMPTY, category: name });
    const url = new URL(window.location.href);
    url.searchParams.set("category", name);
    window.history.replaceState(null, "", url);
    document.getElementById("browse")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollRow = (dir: 1 | -1) => rowRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });

  return (
    <div className="flex flex-col gap-16">
      {/* hero */}
      <section className="flex flex-col gap-6 pt-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-lk-border bg-lk-surface px-2.5 py-1 text-[12px] text-lk-muted">
          <span className="size-1.5 rounded-full bg-lk-success" aria-hidden />
          React Native · Expo · Flutter
        </span>
        <div className="flex flex-col gap-3">
          <h1 className="m-0 max-w-[680px] text-[36px] font-semibold leading-[1.1] tracking-[-0.025em] text-lk-fg sm:text-[44px]">
            Mobile UI you can copy, paste and ship.
          </h1>
          <p className="m-0 max-w-[600px] text-[15.5px] leading-relaxed text-lk-muted">
            Components, full screens and blocks for iOS and Android — each with React Native and Flutter source, live previews and
            a one-line install.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/mobile/components"
            className="lk-focus lk-transition inline-flex h-9 items-center gap-1.5 rounded-lk bg-lk-fg px-3.5 text-[13.5px] font-medium text-lk-bg hover:opacity-90 active:opacity-80"
          >
            Browse components <ArrowRight size={14} aria-hidden />
          </Link>
          <Link
            href="/mobile/installation"
            className="lk-focus lk-transition inline-flex h-9 items-center gap-1.5 rounded-lk border border-lk-border bg-lk-bg px-3.5 text-[13.5px] font-medium text-lk-fg hover:bg-lk-surface active:bg-lk-surface-2"
          >
            <BookOpen size={14} aria-hidden /> Installation
          </Link>
        </div>
        <p className="m-0 text-[12.5px] text-lk-subtle">{counts.join(" · ")} · 2 frameworks</p>
      </section>

      {/* categories */}
      <section aria-labelledby="categories">
        <SectionTitle id="categories" title="Browse by category" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {categories.map((c) => (
            <CategoryCard key={c.name} {...c} onSelect={() => pickCategory(c.name)} />
          ))}
        </div>
      </section>

      {/* featured */}
      <section aria-labelledby="featured">
        <SectionTitle
          id="featured"
          title="Featured screens"
          action={
            <div className="flex gap-1">
              <IconButton label="Scroll left" onClick={() => scrollRow(-1)}>
                <ArrowLeft size={15} />
              </IconButton>
              <IconButton label="Scroll right" onClick={() => scrollRow(1)}>
                <ArrowRight size={15} />
              </IconButton>
            </div>
          }
        />
        <div ref={rowRef} className="lk-scroll -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {featured.map((i) => (
            <FeaturedCard key={i.href} item={i} />
          ))}
        </div>
      </section>

      {/* browse */}
      <section aria-labelledby="browse" className={cn("flex flex-col")}>
        <SectionTitle id="browse" title="All items" />
        <Explorer
          items={items}
          filters={filters}
          onFiltersChange={(f) => {
            setFilters(f);
            const url = new URL(window.location.href);
            if (f.category === "all") url.searchParams.delete("category");
            else url.searchParams.set("category", f.category);
            window.history.replaceState(null, "", url);
          }}
        />
      </section>
    </div>
  );
}

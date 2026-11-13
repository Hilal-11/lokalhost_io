"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Search, Terminal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocsNavCategory, DocsNavItem } from "@/lib/docs-nav";
import { useTemplates } from "@/lib/templates-query";
import { componentPreviews } from "@/content/docs/componentsAll";
import { docsIcons } from "./docs-icons";
import { Chip, Cover, type TintName } from "@/components/lk/cover";

const SECTION_TINT: Partial<Record<keyof typeof docsIcons, TintName>> = {
  start: "orange",
  components: "violet",
  templates: "amber",
  landings: "sky",
  blocks: "emerald",
  designs: "pink",
  mobile: "indigo",
  custom: "rose",
};

/* ------------------------------------------------------------------ */
/* Building blocks                                                    */
/* ------------------------------------------------------------------ */

function SectionHeader({
  id,
  icon,
  title,
  description,
  count,
  href,
  hrefLabel = "View all",
}: {
  id: string;
  icon: keyof typeof docsIcons;
  title: string;
  description?: string;
  count?: number;
  href?: string;
  hrefLabel?: string;
}) {
  const Icon = docsIcons[icon];
  return (
    <div id={id} className="mb-6 flex scroll-mt-28 flex-wrap items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        <Chip tint={SECTION_TINT[icon] ?? "orange"} size={36} radius={11} className="mt-0.5">
          <Icon size={17} />
        </Chip>
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">
            {title}
            {count !== undefined && (
              <span className="rounded-full border border-neutral-200 px-2 py-px text-[11px] font-medium tabular-nums text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                {count}
              </span>
            )}
          </h2>
          {description && <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>}
        </div>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        >
          {hrefLabel}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

const cardShell =
  "group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/60 p-1.5 " +
  "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] " +
  "dark:border-neutral-800/80 dark:bg-neutral-900/40 dark:hover:border-neutral-700 dark:hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)]";

const cardCanvas =
  "relative overflow-hidden rounded-xl border border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950";

function DotGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 text-neutral-200 dark:text-neutral-800/80"
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        maskImage: "radial-gradient(ellipse at center, black 35%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 85%)",
      }}
    />
  );
}

function ComponentCard({ item, index }: { item: DocsNavItem; index: number }) {
  const PreviewComp = componentPreviews[item.url];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
    >
      <div className={cardShell}>
        {/* full-card link overlay — previews may contain their own <a>/<button>, so they can't sit inside a Link */}
        <Link href={item.url} aria-label={item.title} className="absolute inset-0 z-10 rounded-2xl" />
        <div className={cn(cardCanvas, "h-[230px]")}>
          <DotGrid />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex select-none items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]"
          >
            {PreviewComp ? (
              <PreviewComp />
            ) : (
              <span className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                {"<"}
                {item.title.replace(/\s+/g, "")}
                {" />"}
              </span>
            )}
          </div>
          {item.group && (
            <span className="absolute left-3 top-3 rounded-md border border-neutral-200 bg-white/80 px-1.5 py-0.5 text-[10.5px] font-medium text-neutral-500 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400">
              {item.group}
            </span>
          )}
        </div>
        <div className="px-2.5 pb-2.5 pt-3.5">
          <h3 className="flex items-center justify-between gap-2 text-[15.5px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {item.title}
            <ArrowUpRight
              size={15}
              className="shrink-0 text-neutral-400 opacity-0 transition-all duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100"
            />
          </h3>
          <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {item.description || "Copy-paste ready, fully typed and themeable."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function TemplatesGrid({ query }: { query: string }) {
  const { data, isLoading, error } = useTemplates();
  const templates = (data ?? []).filter((t) => !query || t.template_name.toLowerCase().includes(query));

  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={cn(cardShell, "hover:translate-y-0")}>
            <div className={cn(cardCanvas, "h-[230px] animate-pulse bg-neutral-100 dark:bg-neutral-900")} />
            <div className="space-y-2 px-2.5 pb-3 pt-4">
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <EmptyState title="Couldn’t load templates" body="Please refresh the page or browse them on the templates page." />;
  }
  if (!templates.length) {
    return query ? null : <EmptyState title="No templates yet" body="New templates are on the way." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {templates.slice(0, query ? undefined : 6).map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
        >
          <Link href={`/templates/template/${t.id}`} className={cardShell}>
            <div className={cn(cardCanvas, "h-[230px]")}>
              {t.template_images?.[0] ? (
                <Image
                  src={t.template_images[0]}
                  alt={t.template_name}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-neutral-400">No preview</div>
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-2.5 pb-2.5 pt-3.5">
              <h3 className="truncate text-[15.5px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {t.template_name}
              </h3>
              {t.template_price && (
                <span className="shrink-0 rounded-full border border-neutral-200 px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
                  {/^\d/.test(String(t.template_price)) ? `$${t.template_price}` : t.template_price}
                </span>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-12 text-center dark:border-neutral-800">
      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{title}</p>
      <p className="mt-1 text-sm text-neutral-500">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                           */
/* ------------------------------------------------------------------ */

export function DocsOverview({ categories }: { categories: DocsNavCategory[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const components = useMemo(
    () => categories.find((c) => c.id === "components")?.groups.flatMap((g) => g.items) ?? [],
    [categories]
  );
  const shown = components.filter(
    (c) => !q || c.title.toLowerCase().includes(q) || (c.group ?? "").toLowerCase().includes(q) || (c.description ?? "").toLowerCase().includes(q)
  );

  const soon = categories.filter((c) => c.soon);
  const links = categories.filter((c) => !c.soon && !c.dynamic && c.href && c.groups.length === 0);

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      {/* ── Hero ── */}
      <Cover tone="violet" pattern="grid" className="mb-10 rounded-3xl border border-neutral-200 px-6 py-10 sm:px-10 sm:py-12 dark:border-neutral-800">
      <header className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,460px)] md:items-start md:gap-12">
        <div>
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/70 px-2.5 py-1 backdrop-blur dark:bg-neutral-950/60 text-[12px] font-medium text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            {components.length} components · shadcn compatible
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl dark:text-white">
            React UI Components
          </h1>
        </div>
        <div className="md:pt-11">
          <p className="text-[15.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Free, copy-paste components for React and Next.js, built with Tailwind CSS and Motion. Install with the
            shadcn CLI or copy the source — every page ships a live preview, code and props.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link
              href="/docs/installation"
              className="group lk-btn lk-btn-primary"
            >
              <Terminal size={14} />
              Get started
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/templates"
              className="lk-btn lk-btn-secondary"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </header>
      </Cover>

      {/* ── Filter ── */}
      <div className="mb-10 flex items-center gap-3">
        <label className="relative flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus-within:border-neutral-300 focus-within:ring-4 focus-within:ring-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-950 dark:focus-within:border-neutral-700 dark:focus-within:ring-white/5">
          <Search size={15} className="text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter components and templates…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear filter" className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
              <X size={14} />
            </button>
          )}
        </label>
        {q && (
          <span className="text-sm text-neutral-500">
            {shown.length} component{shown.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {/* ── Components ── */}
      <section className="mb-20">
        <SectionHeader
          id="components"
          icon="components"
          title="Components"
          description="Interactive building blocks with micro-interactions baked in."
          count={components.length}
        />
        {shown.length ? (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((item, i) => (
                <ComponentCard key={item.url} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState title={`No components match “${query}”`} body="Try a different keyword, like “button” or “model”." />
        )}
      </section>

      {/* ── Templates ── */}
      <section className="mb-20">
        <SectionHeader
          id="templates"
          icon="templates"
          title="Templates"
          description="Production-ready Next.js templates you can launch today."
          href="/templates"
        />
        <TemplatesGrid query={q} />
      </section>

      {/* ── Coming soon ── */}
      {!q && soon.length > 0 && (
        <section className="mb-20">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">On the roadmap</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {soon.map((c) => {
              const Icon = docsIcons[c.icon];
              return (
                <div
                  key={c.id}
                  className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-dashed border-neutral-200 p-5 dark:border-neutral-800"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{c.title}</p>
                    <p className="text-sm text-neutral-500">Full sections and pages, ready to drop in.</p>
                  </div>
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    Coming soon
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── More ── */}
      {!q && links.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">More from Lokalhost</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {links.map((c) => {
              const Icon = docsIcons[c.icon];
              return (
                <Link
                  key={c.id}
                  href={c.href!}
                  className="group flex items-center gap-3 rounded-2xl border border-neutral-200 p-4 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors group-hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:group-hover:text-white">
                    <Icon size={16} />
                  </span>
                  <span className="flex-1 font-medium text-neutral-900 dark:text-neutral-100">{c.title}</span>
                  <ArrowUpRight size={15} className="text-neutral-400 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

export default DocsOverview;

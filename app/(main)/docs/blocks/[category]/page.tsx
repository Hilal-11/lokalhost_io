import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLOCK_CATEGORIES, categoryHref, countBlocks, getBlocksByCategory, getCategory } from "@/lib/blocks/catalog";
import { canViewCode, getBlockViewer, readBlockFiles } from "@/lib/blocks/server";
import { BlockShowcase } from "@/components/blocks/block-showcase";
import { BlockArt } from "@/components/blocks/block-art";
import { Breadcrumbs, CountChip } from "@/components/blocks/block-cards";

type Params = { category: string };

export function generateStaticParams(): Params[] {
  return BLOCK_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return { title: `${c.title} — React Blocks`, description: c.description };
}

export default async function BlockCategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();

  const blocks = getBlocksByCategory(c.slug);
  const viewer = blocks.length ? await getBlockViewer() : { loggedIn: false, hasAccess: false };
  const items = await Promise.all(
    blocks.map(async (b) => ({ block: b, files: canViewCode(b, viewer) ? await readBlockFiles(b) : null }))
  );

  return (
    <div className="px-4 pb-24 pt-8 font-sans sm:px-8 lg:px-12 lg:pt-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Blocks", href: "/docs/blocks" }, { label: c.title }]} />

        <header className="flex flex-col gap-3 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">{c.title}</h1>
            <CountChip count={blocks.length} />
          </div>
          <p className="max-w-2xl text-[15px] leading-7 text-neutral-500 dark:text-neutral-400">{c.description}</p>
        </header>

        {/* category switcher */}
        <nav aria-label="Block categories" className="-mx-1 mb-10 flex gap-1.5 overflow-x-auto border-b border-neutral-200 px-1 pb-4 [scrollbar-width:none] dark:border-neutral-800 [&::-webkit-scrollbar]:hidden">
          {BLOCK_CATEGORIES.map((other) => {
            const active = other.slug === c.slug;
            const n = countBlocks(other.slug);
            return (
              <Link
                key={other.slug}
                href={categoryHref(other.slug)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors",
                  active
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100"
                )}
              >
                {other.title}
                {n > 0 && <span className={cn("tabular-nums", active ? "opacity-70" : "text-neutral-400 dark:text-neutral-500")}>{n}</span>}
              </Link>
            );
          })}
        </nav>

        {items.length > 0 ? (
          <div className="flex flex-col gap-16">
            {items.map(({ block, files }) => (
              <BlockShowcase key={block.slug} block={block} files={files} loggedIn={viewer.loggedIn} />
            ))}
          </div>
        ) : (
          <div className="grid overflow-hidden rounded-2xl border border-dashed border-neutral-300 md:grid-cols-2 dark:border-neutral-800">
            <div className="relative aspect-[16/10] border-b border-dashed border-neutral-300 bg-neutral-50 md:aspect-auto md:border-b-0 md:border-r dark:border-neutral-800 dark:bg-neutral-900/40">
              <BlockArt kind={c.art} />
            </div>
            <div className="flex flex-col justify-center gap-3 p-8">
              <span className="w-fit rounded-full border border-neutral-200 px-2.5 py-0.5 font-mono text-[10.5px] font-semibold uppercase tracking-widest text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                In the works
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{c.title} are on the way</h2>
              <p className="text-[14px] leading-6 text-neutral-500 dark:text-neutral-400">
                We&apos;re designing this category now. Tell us what you need and we&apos;ll prioritise it.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/contact" className="lk-btn lk-btn-sm lk-btn-secondary">
                  <MessageSquarePlus className="size-3.5" /> Request a block
                </Link>
                <Link href="/docs/blocks" className="inline-flex h-8 items-center gap-1 px-2 text-[12.5px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                  All categories <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BLOCKS, blockHref, categoryHref, getBlock, getBlocksByCategory, getCategory } from "@/lib/blocks/catalog";
import { canViewCode, getBlockViewer, readBlockFiles } from "@/lib/blocks/server";
import { BlockShowcase } from "@/components/blocks/block-showcase";
import { Breadcrumbs } from "@/components/blocks/block-cards";

type Params = { category: string; block: string };

export function generateStaticParams(): Params[] {
  return BLOCKS.map((b) => ({ category: b.category, block: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, block } = await params;
  const b = getBlock(category, block);
  const c = getCategory(category);
  if (!b || !c) return {};
  return { title: `${b.title} — ${c.title}`, description: b.description };
}

/** Full single-block view — the big preview for large screens. */
export default async function BlockPage({ params }: { params: Promise<Params> }) {
  const { category, block: slug } = await params;
  const c = getCategory(category);
  const block = getBlock(category, slug);
  if (!c || !block) notFound();

  const viewer = await getBlockViewer();
  const files = canViewCode(block, viewer) ? await readBlockFiles(block) : null;

  const siblings = getBlocksByCategory(c.slug);
  const i = siblings.findIndex((b) => b.slug === block.slug);
  const prev = i > 0 ? siblings[i - 1] : undefined;
  const next = i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : undefined;

  return (
    <div className="px-4 pb-24 pt-8 font-sans sm:px-6 lg:px-8 lg:pt-10">
      <div className="mx-auto w-full max-w-[1600px]">
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Blocks", href: "/docs/blocks" },
            { label: c.title, href: categoryHref(c.slug) },
            { label: block.title },
          ]}
        />

        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="flex flex-wrap items-center gap-2.5 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
              {block.title}
              {block.isNew && <span className="rounded-md border border-neutral-300 px-1.5 py-px text-[11px] font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">new</span>}
              {block.access === "pro" && (
                <span className="rounded-md bg-neutral-900 px-1.5 py-px text-[11px] font-medium text-white dark:bg-neutral-100 dark:text-neutral-900">Pro</span>
              )}
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-neutral-500 dark:text-neutral-400">{block.description}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {prev && (
              <Link href={blockHref(prev)} className="lk-btn lk-btn-sm lk-btn-secondary" aria-label={`Previous: ${prev.title}`}>
                <ArrowLeft className="size-3.5" />
                <span className="hidden sm:inline">{prev.title}</span>
              </Link>
            )}
            {next && (
              <Link href={blockHref(next)} className="lk-btn lk-btn-sm lk-btn-secondary" aria-label={`Next: ${next.title}`}>
                <span className="hidden sm:inline">{next.title}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </div>
        </header>

        <BlockShowcase block={block} files={files} loggedIn={viewer.loggedIn} variant="page" />
      </div>
    </div>
  );
}

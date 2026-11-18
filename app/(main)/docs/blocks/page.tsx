import type { Metadata } from "next";
import { BLOCK_CATEGORIES, BLOCKS } from "@/lib/blocks/catalog";
import { Breadcrumbs, CategoryCard } from "@/components/blocks/block-cards";

export const metadata: Metadata = {
  title: "React UI Blocks",
  description:
    "Premium copy-paste UI blocks for React and Next.js — hero sections, pricing, FAQs, auth screens and full landing pages. Built with Tailwind CSS and Motion, shadcn compatible.",
};

export default function BlocksIndexPage() {
  return (
    <div className="px-4 pb-24 pt-8 font-sans sm:px-8 lg:px-12 lg:pt-10">
      <div className="mx-auto w-full max-w-[1200px]">
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Blocks" }]} />

        <header className="grid gap-4 border-b border-neutral-200 pb-10 md:grid-cols-[1fr_minmax(0,1.1fr)] md:items-end md:gap-12 dark:border-neutral-800">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              {BLOCK_CATEGORIES.length} categories · {BLOCKS.length} blocks
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-100">React UI Blocks</h1>
          </div>
          <p className="text-[15px] leading-7 text-neutral-500 dark:text-neutral-400">
            Premium copy-paste sections for React and Next.js, built with Tailwind CSS and Motion. Preview every block live at any screen size, then copy, download or install it with the shadcn CLI.
          </p>
        </header>

        <div className="grid gap-5 pt-10 sm:grid-cols-2 xl:grid-cols-3">
          {BLOCK_CATEGORIES.map((c, i) => (
            <CategoryCard key={c.slug} category={c} priority={i < 3} />
          ))}
        </div>
      </div>
    </div>
  );
}

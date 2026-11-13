import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { source } from "@/lib/source";
import { getDocsNav, getNeighbours } from "@/lib/docs-nav";
import { getMDXComponents } from "@/mdx.components";
import { Preview } from "@/components/mdx/preview";
import { PreviewClient } from "@/components/mdx/preview-client";
import PropsTable from "@/components/mdx/props-table";
import { ManualInstallation } from "@/components/mdx/manual-installation";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsOverview } from "@/components/docs/docs-overview";
import { Cover, toneFor } from "@/components/lk/cover";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const { categories, flat } = getDocsNav();

  const components = getMDXComponents({
    Preview,
    PreviewClient,
    PropsTable,
    ManualInstallation,
    Installation: ManualInstallation,
    DocsOverview: () => <DocsOverview categories={categories} />,
  });

  /* ── Full-width pages (the /docs overview) ── */
  if (page.data.full) {
    return (
      <div className="px-4 pb-24 pt-10 sm:px-8 lg:px-12">
        <MDX components={components} />
      </div>
    );
  }

  const navItem = flat.find((i) => i.url === page.url);
  const category = categories.find((c) => c.groups.some((g) => g.items.some((i) => i.url === page.url)));
  const { previous, next } = getNeighbours(page.url);
  const toc = page.data.toc ?? [];

  return (
    <div className="flex">
      <article className="min-w-0 flex-1 px-4 pb-24 pt-8 sm:px-8 lg:px-12 lg:pt-10">
        <div className="mx-auto w-full max-w-[980px]">
          <Cover
            tone={toneFor(navItem?.group ?? category?.title ?? "Docs")}
            pattern="grid"
            className="mb-10 rounded-2xl border border-neutral-200 px-5 py-6 sm:px-8 sm:py-8 dark:border-neutral-800"
          >
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-[13px] text-neutral-500 dark:text-neutral-400">
            <Link href="/docs" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">
              Docs
            </Link>
            {category && category.id !== "start" && (
              <>
                <ChevronRight size={13} className="text-neutral-300 dark:text-neutral-700" />
                <Link href={category.href ?? "/docs"} className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">
                  {category.title}
                </Link>
              </>
            )}
            {navItem?.group && (
              <>
                <ChevronRight size={13} className="text-neutral-300 dark:text-neutral-700" />
                <span>{navItem.group}</span>
              </>
            )}
            <ChevronRight size={13} className="text-neutral-300 dark:text-neutral-700" />
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{page.data.title}</span>
          </nav>

          {/* Header */}
          <header className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)] md:items-start md:gap-10">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl dark:text-white">
              {page.data.title}
            </h1>
            {page.data.description && (
              <p className="text-[15px] leading-relaxed text-neutral-500 md:pt-1.5 md:text-right dark:text-neutral-400">
                {page.data.description}
              </p>
            )}
          </header>
          </Cover>

          {/* Body */}
          <div className="prose lk-docs-body max-w-none">
            <MDX components={components} />
          </div>

          {/* Prev / next */}
          {(previous || next) && (
            <nav aria-label="Pagination" className="mt-20 grid gap-3 border-t border-neutral-200 pt-8 sm:grid-cols-2 dark:border-neutral-800">
              {previous ? (
                <Link
                  href={previous.url}
                  className="group flex flex-col gap-1 rounded-xl border border-neutral-200 p-4 transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
                >
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
                    Previous
                  </span>
                  <span className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100">{previous.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  href={next.url}
                  className="group flex flex-col items-end gap-1 rounded-xl border border-neutral-200 p-4 text-right transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
                >
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    Next
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100">{next.title}</span>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>

      {/* On this page */}
      {toc.length > 0 && (
        <aside
          className="lk-scroll sticky hidden w-[232px] shrink-0 overflow-y-auto py-10 pr-6 xl:block"
          style={{ top: "var(--docs-header-h)", height: "calc(100dvh - var(--docs-header-h))" }}
        >
          <DocsToc items={toc.map((t) => ({ title: t.title, url: t.url, depth: t.depth }))} />
        </aside>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

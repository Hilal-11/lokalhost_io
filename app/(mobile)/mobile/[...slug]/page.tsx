import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { mobileSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx.components";
import { CATALOG, KIND_LABEL, KIND_SEGMENT, getItem, getSummaries } from "@/lib/mobile/catalog";
import { getMobileNav } from "@/lib/mobile/nav";
import { getItemDoc } from "@/lib/mobile/docs.server";
import type { ItemKind } from "@/lib/mobile/types";
import { Breadcrumb, PageFooter, PageHeader, PageLayout } from "@/components/mobile/page/chrome";
import { FrameworkSwitch, ItemBody, ItemRail } from "@/components/mobile/page/item-doc";
import { Explorer } from "@/components/mobile/overview/explorer";
import { ShowcaseGrid, TemplateGrid } from "@/components/mobile/page/resources";
import { DocsToc } from "@/components/docs/docs-toc";
import { Badge } from "@/components/mobile/ui/primitives";

/* ------------------------------------------------------------------ */
/* /mobile/[...slug] resolves, in order:                               */
/*   /mobile/{components|screens|blocks}          → category index     */
/*   /mobile/{components|screens|blocks}/{slug}   → item page          */
/*   anything else                                → MDX doc (Fumadocs) */
/* ------------------------------------------------------------------ */

export const dynamicParams = false;

const SEGMENT_TO_KIND = Object.fromEntries(Object.entries(KIND_SEGMENT).map(([k, v]) => [v, k as ItemKind])) as Record<string, ItemKind>;

const KIND_INTRO: Record<ItemKind, string> = {
  component: "Building blocks for every screen — each with React Native and Flutter source.",
  screen: "Complete, production-ready screens and multi-step flows.",
  block: "Larger sections you drop into your own screens.",
};

type Params = { slug: string[] };

function resolve(slug: string[]) {
  const kind = SEGMENT_TO_KIND[slug[0]];
  if (kind && slug.length === 1) return { type: "index" as const, kind };
  if (kind && slug.length === 2) {
    const item = getItem(kind, slug[1]);
    return item ? { type: "item" as const, item } : null;
  }
  const page = mobileSource.getPage(slug);
  return page ? { type: "doc" as const, page } : null;
}

/** Flat order of the sidebar for prev / next on doc pages. */
function docNeighbours(url: string) {
  const flat = getMobileNav().flatMap((s) => s.entries.map((e) => ({ title: e.title, href: e.href })));
  const i = flat.findIndex((e) => e.href === url);
  return { previous: i > 0 ? flat[i - 1] : undefined, next: i >= 0 ? flat[i + 1] : undefined };
}

export default async function MobilePage(props: { params: Promise<Params> }) {
  const { slug } = await props.params;
  const target = resolve(slug);
  if (!target) notFound();

  /* ---------------------------- category index ---------------------------- */
  if (target.type === "index") {
    const { kind } = target;
    const label = KIND_LABEL[kind];
    return (
      <PageLayout>
        <Breadcrumb items={[{ title: "Mobile", href: "/mobile" }, { title: label }]} />
        <PageHeader title={label} description={KIND_INTRO[kind]} />
        <Explorer items={getSummaries()} kind={kind} />
        <PageFooter {...docNeighbours(`/mobile/${KIND_SEGMENT[kind]}`)} />
      </PageLayout>
    );
  }

  /* ------------------------------- item page ------------------------------ */
  if (target.type === "item") {
    const { item } = target;
    const data = await getItemDoc(item);
    return (
      <PageLayout rail={<ItemRail data={data} />}>
        <Breadcrumb
          items={[
            { title: KIND_LABEL[item.kind], href: `/mobile/${KIND_SEGMENT[item.kind]}` },
            { title: item.title },
          ]}
        />
        <PageHeader title={item.title} description={item.description}>
          <FrameworkSwitch />
          <span className="flex items-center gap-2 text-[12.5px] text-lk-subtle">
            {item.badge && <Badge kind={item.badge} />}
            {item.category}
            <span aria-hidden>·</span>
            {item.flow ? `${item.flow.length}-screen flow` : `${item.variants} ${item.variants === 1 ? "variant" : "variants"}`}
          </span>
        </PageHeader>
        <ItemBody data={data} />
        <PageFooter
          previous={data.neighbours.previous}
          next={data.neighbours.next}
          editPath={`registry/mobile/react-native/${item.rn.file}`}
        />
      </PageLayout>
    );
  }

  /* -------------------------------- MDX doc -------------------------------- */
  const { page } = target;
  const MDX = page.data.body;
  const toc = page.data.toc ?? [];
  const { previous, next } = docNeighbours(page.url);

  return (
    <PageLayout
      rail={toc.length ? <DocsToc items={toc.map((t) => ({ title: t.title, url: t.url, depth: t.depth }))} /> : undefined}
    >
      <Breadcrumb items={[{ title: "Mobile", href: "/mobile" }, { title: page.data.title }]} />
      <PageHeader title={page.data.title} description={page.data.description} />
      <div className="prose lk-docs-body lk-mobile-prose max-w-none">
        <MDX components={getMDXComponents({ Tabs, Tab, Steps, Step, TemplateGrid, ShowcaseGrid })} />
      </div>
      <PageFooter previous={previous} next={next} editPath={`content/mobile/${page.path}`} />
    </PageLayout>
  );
}

export function generateStaticParams(): Params[] {
  const kinds = Object.values(KIND_SEGMENT).map((s) => ({ slug: [s] }));
  const items = CATALOG.map((i) => ({ slug: [KIND_SEGMENT[i.kind], i.slug] }));
  const docs = mobileSource.generateParams().filter((p) => p.slug.length > 0);
  return [...kinds, ...items, ...docs];
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await props.params;
  const target = resolve(slug);
  if (!target) return {};
  if (target.type === "index") {
    return { title: KIND_LABEL[target.kind], description: KIND_INTRO[target.kind] };
  }
  if (target.type === "item") {
    const { item } = target;
    return {
      title: `${item.title} — React Native & Flutter`,
      description: item.description,
      keywords: [...item.tags, "react native", "flutter", "expo", item.category],
    };
  }
  return { title: target.page.data.title, description: target.page.data.description };
}


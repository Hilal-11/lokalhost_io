import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOCKS, getBlock } from "@/lib/blocks/catalog";
import { BlockPreviewRenderer } from "@/components/blocks/block-preview-renderer";

type Params = { category: string; slug: string };

export const metadata: Metadata = {
  title: "Block preview",
  robots: { index: false, follow: false },
};

export function generateStaticParams(): Params[] {
  return BLOCKS.map((b) => ({ category: b.category, slug: b.slug }));
}

/** Bare, full-width render of one block — loaded inside the docs preview iframe. */
export default async function BlockPreviewPage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params;
  const block = getBlock(category, slug);
  if (!block) notFound();
  return <BlockPreviewRenderer id={`${category}/${slug}`} />;
}

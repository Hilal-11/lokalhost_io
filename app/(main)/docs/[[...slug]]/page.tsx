import { source } from "@/lib/source";
import {
    DocsPage,
    DocsBody,
    DocsTitle,
    DocsDescription,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from '@/mdx.components';
import { Preview } from "@/components/mdx/preview";
import { PreviewClient } from "@/components/mdx/preview-client";

export default async function Page(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    console.log("page", page);
    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <div className="min-h-screen bg-white dark:bg-black px-0 pb-20 xl:px-10 lg:px-10">
            <DocsPage
                toc={page.data.toc}
                full={page.data.full}
                container={{
                className: "max-w-none",
                }}
                tableOfContent={{ enabled: false }}
                tableOfContentPopover={{ enabled: false }}
                footer={{ enabled: false }}
            >
                <DocsTitle>{page.data.title}</DocsTitle>
                <DocsDescription>{page.data.description}</DocsDescription>
                <DocsBody
                style={{ maxWidth: "none" }}
                className="max-w-none lg:pr-20"
                >
                <MDX
                    components={{
                    ...getMDXComponents,
                    Preview,
                    PreviewClient,
                    }}
                />
                </DocsBody>
            </DocsPage>
            </div>
    );
}

export async function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}

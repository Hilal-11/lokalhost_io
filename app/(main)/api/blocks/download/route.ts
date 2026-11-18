import { NextResponse, type NextRequest } from "next/server";
import { getBlock, blockRegistryName } from "@/lib/blocks/catalog";
import { canViewCode, getBlockViewer, readBlockFiles } from "@/lib/blocks/server";
import { createZip } from "@/lib/blocks/zip";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/blocks/download?category=hero-sections&slug=hero-x → <slug>.zip */
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? "";
  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const block = getBlock(category, slug);
  if (!block) return NextResponse.json({ error: "Block not found." }, { status: 404 });

  const viewer = await getBlockViewer();
  if (!canViewCode(block, viewer)) {
    return NextResponse.json(
      { error: viewer.loggedIn ? "This block is part of Lokalhost Pro." : "Sign in with a Pro account to download this block." },
      { status: viewer.loggedIn ? 403 : 401, headers: { "Cache-Control": "private, no-store" } }
    );
  }

  const files = await readBlockFiles(block);
  const deps = block.dependencies ?? [];
  const readme = [
    `# ${block.title}`,
    "",
    block.description,
    "",
    "## Install",
    "",
    deps.length ? `npm i ${deps.join(" ")}` : "No extra dependencies.",
    "",
    "Copy the files into your project at the same paths. Components that use `cn` need `lib/utils.ts`:",
    "",
    "```ts",
    'import { clsx, type ClassValue } from "clsx";',
    'import { twMerge } from "tailwind-merge";',
    "export function cn(...inputs: ClassValue[]) {",
    "  return twMerge(clsx(inputs));",
    "}",
    "```",
    "",
    block.access === "free" ? `Or install with the CLI: npx shadcn@latest add ${SITE_URL}/r/${blockRegistryName(block)}.json` : "",
    "",
    `Docs: ${SITE_URL}/docs/blocks/${block.category}/${block.slug}`,
  ].join("\n");

  const zip = createZip([...files.map((f) => ({ path: f.path, content: f.code })), { path: "README.md", content: readme }]);

  return new NextResponse(zip as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${block.slug}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}

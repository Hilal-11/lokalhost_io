import type { Registry } from "./schema";
import { SITE_URL } from "@/lib/site";
import { BLOCKS, blockRegistryName } from "@/lib/blocks/catalog";

/**
 * Free blocks are published to the registry as /r/block-<slug>.json.
 * Pro blocks are intentionally NOT published — their code is only served
 * to Pro users through /docs/blocks and /api/blocks/download.
 */
export const blocks: Registry = BLOCKS.filter((b) => b.access === "free").map((b) => ({
  name: blockRegistryName(b),
  type: "registry:block",
  description: b.description,
  dependencies: b.dependencies ?? [],
  registryDependencies: [`${SITE_URL}/r/utils.json`],
  files: b.files.map((path) => ({ path, type: "registry:component" as const })),
}));

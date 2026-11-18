import type { ComponentType } from "react";

/**
 * Preview loaders for /block-preview/<category>/<slug>.
 * One line per block, keyed "<category>/<slug>" — must match lib/blocks/catalog.ts.
 *
 * Example:
 *   "hero-sections/hero-with-logo-ticker": () => import("./hero-sections/hero-with-logo-ticker"),
 */
export const blockLoaders: Record<string, () => Promise<{ default: ComponentType }>> = {};

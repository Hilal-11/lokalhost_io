/**
 * Blocks catalog — the single source of truth for /docs/blocks, the header
 * "Blocks" menu, the docs sidebar, the shadcn registry and the download route.
 *
 * ── Adding a block ──────────────────────────────────────────────────────
 * 1. Create the component (default export, full-width section):
 *      components/lokalhost_io/blocks/<category>/<slug>.tsx
 * 2. Register its preview loader in components/lokalhost_io/blocks/index.ts:
 *      "<category>/<slug>": () => import("./<category>/<slug>"),
 * 3. Add an entry to BLOCKS below. `files[0]` is the entry file; list every
 *    extra file the block imports so Code / Download / CLI include them.
 * 4. Optional: drop a screenshot at public/blocks/<category>/<slug>.png and set
 *    `image` — it's used by the header menu and category cards.
 * Free blocks are also published to the registry (run `npm run build:registry`).
 * Pro blocks are never published; their code is only served to Pro users.
 */

export type BlockCategorySlug =
  | "landing-pages"
  | "hero-sections"
  | "feature-sections"
  | "bento-grids"
  | "logo-clouds"
  | "testimonials"
  | "pricing-sections"
  | "call-to-action"
  | "faqs"
  | "navbars"
  | "footers"
  | "backgrounds"
  | "illustrations"
  | "shaders"
  | "login-and-signup"
  | "contact-sections";

/** Wireframe used for the category cover until a real screenshot exists. */
export type BlockArt =
  | "landing"
  | "hero"
  | "features"
  | "bento"
  | "logos"
  | "testimonials"
  | "pricing"
  | "cta"
  | "faq"
  | "navbar"
  | "footer"
  | "background"
  | "illustration"
  | "shader"
  | "auth"
  | "contact";

export interface BlockCategory {
  slug: BlockCategorySlug;
  title: string;
  description: string;
  art: BlockArt;
  /** Optional cover screenshot (public path). Falls back to `art`. */
  cover?: string;
}

export type BlockAccess = "free" | "pro";

export interface BlockEntry {
  /** URL slug, unique within its category, e.g. "hero-with-logo-ticker". */
  slug: string;
  category: BlockCategorySlug;
  title: string;
  description: string;
  /** Repo-relative source files. files[0] is the entry (default export). */
  files: string[];
  /** npm packages the files import (shown in Code, written to the download README, used by the CLI). */
  dependencies?: string[];
  /** "pro" blocks show a paywall in Code and Download for non-Pro visitors. */
  access: BlockAccess;
  /** Shows a "new" badge in the menu, sidebar and cards. */
  isNew?: boolean;
  /** Screenshot (public path) for the header menu and cards. */
  image?: string;
  /** Initial preview height in px before the iframe reports its real height. Defaults to 720. */
  height?: number;
  /** Highlight in the header "Blocks" menu. The newest featured block wins. */
  featured?: boolean;
  /** ISO date, used for ordering ("newest first"). */
  addedAt?: string;
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  { slug: "landing-pages", title: "Landing Pages", art: "landing", description: "Complete single-page landings — home, product and launch pages, ready to ship." },
  { slug: "hero-sections", title: "Hero Sections", art: "hero", description: "Above-the-fold heroes that are modern, fast and stand out." },
  { slug: "feature-sections", title: "Feature Sections", art: "features", description: "Explain what your product does with grids, lists and visuals." },
  { slug: "bento-grids", title: "Bento Grids", art: "bento", description: "Asymmetric card grids with micro-interactions for feature highlights." },
  { slug: "logo-clouds", title: "Logo Clouds", art: "logos", description: "Social proof rows and marquees with subtle motion." },
  { slug: "testimonials", title: "Testimonials", art: "testimonials", description: "Quotes, walls of love and review carousels." },
  { slug: "pricing-sections", title: "Pricing Sections", art: "pricing", description: "Plans, toggles and comparison tables that convert." },
  { slug: "call-to-action", title: "Call to Action", art: "cta", description: "Closing sections that turn visitors into sign-ups." },
  { slug: "faqs", title: "FAQs", art: "faq", description: "Accordions and two-column answers for common questions." },
  { slug: "navbars", title: "Navbars", art: "navbar", description: "Responsive headers with menus, search and mobile drawers." },
  { slug: "footers", title: "Footers", art: "footer", description: "Link columns, newsletters and legal rows." },
  { slug: "backgrounds", title: "Backgrounds", art: "background", description: "Grids, dots, gradients and animated surfaces behind your content." },
  { slug: "illustrations", title: "Illustrations", art: "illustration", description: "Code-drawn product visuals and decorative graphics." },
  { slug: "shaders", title: "Shaders", art: "shader", description: "GPU-powered backgrounds and effects for standout sections." },
  { slug: "login-and-signup", title: "Login and Signup", art: "auth", description: "Sign in, sign up, magic link and OTP screens." },
  { slug: "contact-sections", title: "Contact Sections", art: "contact", description: "Contact forms, office locations and support options." },
];

/** Add blocks here — see the guide at the top of this file. */
export const BLOCKS: BlockEntry[] = [];

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export const BLOCKS_BASE = "/docs/blocks";

export function getCategory(slug: string) {
  return BLOCK_CATEGORIES.find((c) => c.slug === slug);
}

const byNewest = (a: BlockEntry, b: BlockEntry) => (b.addedAt ?? "").localeCompare(a.addedAt ?? "");

export function getBlocksByCategory(slug: string) {
  return BLOCKS.filter((b) => b.category === slug).sort(byNewest);
}

export function getBlock(category: string, slug: string) {
  return BLOCKS.find((b) => b.category === category && b.slug === slug);
}

export function countBlocks(category: string) {
  return BLOCKS.filter((b) => b.category === category).length;
}

export function getFeaturedBlock() {
  const sorted = [...BLOCKS].sort(byNewest);
  return sorted.find((b) => b.featured) ?? sorted.find((b) => b.isNew) ?? sorted[0];
}

export const blockKey = (b: Pick<BlockEntry, "category" | "slug">) => `${b.category}/${b.slug}`;
export const blockHref = (b: Pick<BlockEntry, "category" | "slug">) => `${BLOCKS_BASE}/${b.category}/${b.slug}`;
export const blockPreviewHref = (b: Pick<BlockEntry, "category" | "slug">) => `/block-preview/${b.category}/${b.slug}`;
export const categoryHref = (slug: string) => `${BLOCKS_BASE}/${slug}`;
/** Registry item name for free blocks: /r/block-<slug>.json */
export const blockRegistryName = (b: Pick<BlockEntry, "slug">) => `block-${b.slug}`;

export function languageOf(path: string) {
  const ext = path.split(".").pop() ?? "tsx";
  return ({ ts: "ts", tsx: "tsx", js: "js", jsx: "jsx", css: "css", json: "json" } as Record<string, string>)[ext] ?? "tsx";
}

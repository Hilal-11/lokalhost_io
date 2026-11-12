import type { ReactNode } from "react";
import { source } from "@/lib/source";

/* ------------------------------------------------------------------ */
/* Serializable navigation model for the docs sidebar / overview.     */
/* Built on the server from the fumadocs page tree (content/docs).    */
/* ------------------------------------------------------------------ */

export type DocsIconKey =
  | "start"
  | "components"
  | "templates"
  | "landings"
  | "blocks"
  | "designs"
  | "mobile"
  | "custom";

export interface DocsNavItem {
  title: string;
  url: string;
  description?: string;
  /** Folder / group name, e.g. "Buttons" */
  group?: string;
  badge?: "new" | "soon" | "pro";
  external?: boolean;
}

export interface DocsNavGroup {
  title?: string;
  items: DocsNavItem[];
}

export interface DocsNavCategory {
  id: string;
  title: string;
  icon: DocsIconKey;
  /** Category landing link (used for link-only categories and "View all"). */
  href?: string;
  groups: DocsNavGroup[];
  /** Items are loaded on the client (e.g. templates from Supabase). */
  dynamic?: "templates";
  soon?: boolean;
}

type TreeNode = (typeof source.pageTree)["children"][number];

function text(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  return "";
}

function titleCase(slug: string) {
  return slug
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function toItem(url: string, fallbackTitle: string, group?: string): DocsNavItem {
  const page = source.getPages().find((p) => p.url === url);
  return {
    title: page?.data.title?.trim() || fallbackTitle,
    url,
    description: page?.data.description || undefined,
    group,
  };
}

/** Walk the page tree; separators start new groups, folders become groups. */
function collectGroups(nodes: TreeNode[]): DocsNavGroup[] {
  const groups: DocsNavGroup[] = [];
  let current: DocsNavGroup = { items: [] };

  const push = () => {
    if (current.items.length) groups.push(current);
  };

  const visit = (list: TreeNode[]) => {
    for (const node of list) {
      if (node.type === "separator") {
        push();
        current = { title: text(node.name) || undefined, items: [] };
      } else if (node.type === "page") {
        current.items.push(toItem(node.url, text(node.name), current.title));
      } else if (node.type === "folder") {
        push();
        const title = text(node.name) || undefined;
        current = { title, items: [] };
        if (node.index) current.items.push(toItem(node.index.url, text(node.index.name), title));
        visit(node.children as TreeNode[]);
        push();
        current = { items: [] };
      }
    }
  };

  visit(nodes);
  push();
  return groups;
}

let cached: { categories: DocsNavCategory[]; flat: DocsNavItem[] } | null = null;

export function getDocsNav() {
  if (cached && process.env.NODE_ENV === "production") return cached;

  const pages = source.getPages();
  const has = (url: string) => pages.some((p) => p.url === url);

  // Component pages: everything under /docs/components, in page-tree order.
  const treeGroups = collectGroups(source.pageTree.children as TreeNode[])
    .map((g) => ({ ...g, items: g.items.filter((i) => i.url.startsWith("/docs/components/")) }))
    .filter((g) => g.items.length);

  // Pages not referenced in meta.json still get listed, grouped by folder.
  const listed = new Set(treeGroups.flatMap((g) => g.items.map((i) => i.url)));
  const orphans = pages.filter((p) => p.url.startsWith("/docs/components/") && !listed.has(p.url));
  for (const p of orphans) {
    const folder = titleCase(p.slugs[1] ?? "Other");
    let group = treeGroups.find((g) => g.title === folder);
    if (!group) {
      group = { title: folder, items: [] };
      treeGroups.push(group);
    }
    group.items.push(toItem(p.url, p.data.title, folder));
  }

  const startItems: DocsNavItem[] = [{ title: "Introduction", url: "/docs" }];
  if (has("/docs/installation")) startItems.push({ title: "Installation", url: "/docs/installation" });

  const categories: DocsNavCategory[] = [
    { id: "start", title: "Getting Started", icon: "start", groups: [{ items: startItems }] },
    { id: "components", title: "Components", icon: "components", href: "/docs#components", groups: treeGroups },
    { id: "templates", title: "Templates", icon: "templates", href: "/templates", groups: [], dynamic: "templates" },
    { id: "landings", title: "Landing Pages", icon: "landings", groups: [], soon: true },
    { id: "blocks", title: "Blocks", icon: "blocks", groups: [], soon: true },
    { id: "designs", title: "Designs", icon: "designs", href: "/designs", groups: [] },
    { id: "mobile", title: "Mobile UI", icon: "mobile", href: "/mobile", groups: [] },
    { id: "custom", title: "Custom Work", icon: "custom", href: "/custom-work", groups: [] },
  ];

  const flat = [...startItems, ...treeGroups.flatMap((g) => g.items)];
  cached = { categories, flat };
  return cached;
}

export function getNeighbours(url: string) {
  const { flat } = getDocsNav();
  const i = flat.findIndex((item) => item.url === url);
  if (i === -1) return { previous: undefined, next: undefined };
  return { previous: flat[i - 1], next: flat[i + 1] };
}

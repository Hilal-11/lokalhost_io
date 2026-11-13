import { CATALOG, itemHref, KIND_SEGMENT } from "./catalog";
import type { BadgeKind, ItemKind } from "./types";

/* ------------------------------------------------------------------ */
/* Sidebar model. Serialisable — icons are string keys resolved on    */
/* the client (components/mobile/shell/icons.tsx).                    */
/* ------------------------------------------------------------------ */

export type NavIconKey =
  | "overview"
  | "introduction"
  | "installation"
  | "cli"
  | "theming"
  | "changelog"
  | "components"
  | "screens"
  | "blocks"
  | "templates"
  | "showcase"
  | "contributing";

export interface NavLeaf {
  title: string;
  href: string;
  badge?: BadgeKind;
}

export interface NavEntry extends NavLeaf {
  id: string;
  icon: NavIconKey;
  /** Expandable inline when present. */
  children?: NavLeaf[];
}

export interface NavSection {
  id: string;
  /** Screen-reader label only — sections are separated by dividers, not headings. */
  label: string;
  entries: NavEntry[];
}

function childrenOf(kind: ItemKind): NavLeaf[] {
  return CATALOG.filter((i) => i.kind === kind).map((i) => ({ title: i.title, href: itemHref(i), badge: i.badge }));
}

export function getMobileNav(): NavSection[] {
  return [
    {
      id: "start",
      label: "Getting started",
      entries: [
        { id: "overview", title: "Overview", href: "/mobile", icon: "overview" },
        { id: "introduction", title: "Introduction", href: "/mobile/introduction", icon: "introduction" },
        { id: "installation", title: "Installation", href: "/mobile/installation", icon: "installation" },
        { id: "cli", title: "CLI", href: "/mobile/cli", icon: "cli" },
        { id: "theming", title: "Theming", href: "/mobile/theming", icon: "theming" },
        { id: "changelog", title: "Changelog", href: "/mobile/changelog", icon: "changelog", badge: "new" },
      ],
    },
    {
      id: "library",
      label: "Library",
      entries: [
        { id: "components", title: "Components", href: `/mobile/${KIND_SEGMENT.component}`, icon: "components", children: childrenOf("component") },
        { id: "screens", title: "Screens", href: `/mobile/${KIND_SEGMENT.screen}`, icon: "screens", children: childrenOf("screen") },
        { id: "blocks", title: "Blocks", href: `/mobile/${KIND_SEGMENT.block}`, icon: "blocks", children: childrenOf("block") },
      ],
    },
    {
      id: "resources",
      label: "Resources",
      entries: [
        { id: "templates", title: "Templates", href: "/mobile/templates", icon: "templates", badge: "pro" },
        { id: "showcase", title: "Showcase", href: "/mobile/showcase", icon: "showcase" },
        { id: "contributing", title: "Contributing", href: "/mobile/contributing", icon: "contributing" },
      ],
    },
  ];
}

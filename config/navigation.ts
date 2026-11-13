export interface NavItem {
  id: string;
  title: string;
  href: string;
  isComingSoon?: boolean;
  isNew?: boolean;
  isLab?: boolean;
  count?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const Navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", title: "Introduction", href: "/docs" },
      { id: "installation", title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "blocks", title: "Blocks", href: "/docs/components/block/", count: 12 },
      { id: "something-new", title: "New Thing", href: "/docs/new", isNew: true },
      { id: "lab-thing", title: "Lab Thing", href: "/docs/lab", isLab: true },
    ],
  },
];
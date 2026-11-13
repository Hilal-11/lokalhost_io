import { PropRow } from "@/components/mdx/props-table";

export const copyPageMarkdownsProps: PropRow[] = [
  {
    name: "markdown",
    type: "string",
    description: "Raw markdown source for the current page. Used as the clipboard content for the \"Copy Page\" button. Falls back to pageUrl if omitted.",
    required: false,
  },
  {
    name: "pageUrl",
    type: "string",
    description: "Canonical URL of the current page. Used to build the \"View as markdown\" (.md) link and the \"Open in V0 / Claude / ChatGPT\" deep links. Defaults to window.location.href on the client if omitted.",
    required: false,
  },
  {
    name: "githubUrl",
    type: "string",
    description: "Source URL for this page's file on GitHub. When provided, an \"Open in GitHub\" item appears in the dropdown; when omitted, that item is not rendered at all.",
    required: false,
  },
  {
    name: "extraItems",
    type: "MenuItem[]",
    description: "Additional dropdown items appended after the default set (View as markdown, V0, Claude, ChatGPT, GitHub). Each item needs id, label, icon, external, and onSelect. Ignored if items is provided.",
    required: false,
  },
  {
    name: "items",
    type: "MenuItem[]",
    description: "Full override for the dropdown item list. When provided, replaces all default items (and extraItems is ignored) — use this to reorder, remove, or fully customize the built-in options.",
    required: false,
  },
];
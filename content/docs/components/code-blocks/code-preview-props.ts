import { PropRow } from "@/components/mdx/props-table";

export const componentPreviewProps: PropRow[] = [
  { name: "link", type: "string", description: "Identifies this preview and derives the install slug (last path segment) used for CLI/AI-prompt commands and the iframe preview URL.", required: true },
  { name: "children", type: "React.ReactNode", description: "The live component to render in the Preview tab. Omit for a code-only entry — shows a fallback message instead of an empty panel." },
  { name: "code", type: "string", description: "Source code shown in the Code tab, syntax-highlighted via Shiki. Omit to show a \"no code provided\" message instead." },
  { name: "language", type: "string", description: "Shiki language id used to highlight `code`. Defaults to \"tsx\"." },
  { name: "className", type: "string", description: "Extra classes applied to the inner white/black panel (border, radius, background)." },
  { name: "frameClassName", type: "string", description: "Classes for the outer padded frame behind the panel — the \"outer-layer\" background color. Defaults to \"bg-neutral-100 dark:bg-neutral-900\"." },
  { name: "useIframe", type: "boolean", description: "Renders the Preview tab as an iframe pointed at `{prePath}/preview/{link}` instead of rendering `children` directly." },
  { name: "compact", type: "boolean", description: "Reduces the Preview tab's minimum height from 500px to 120px. Ignored when `isBlock` is true." },
  { name: "isBlock", type: "boolean", description: "Removes the default padding around `children` in the Preview tab, for components that manage their own spacing." },
  { name: "comment", type: "string[]", description: "Optional list of short tags rendered as pills below the frame (e.g. notes like \"client component\", \"requires Framer Motion\")." },
  { name: "lightTheme", type: '"github-light-default" | "one-light" | "catppuccin-latte"', description: "Shiki theme used in the Code tab when the app is in light mode. Defaults to \"github-light-default\"." },
  { name: "darkTheme", type: '"one-dark-pro" | "github-dark-default" | "dracula" | "tokyo-night"', description: "Shiki theme used in the Code tab when the app is in dark mode. Defaults to \"one-dark-pro\"." },
  { name: "showLineNumbers", type: "boolean", description: "Shows a line-number gutter in the Code tab. Defaults to true." },
  { name: "maxCodeHeight", type: "number", description: "Max height in px of the Code tab before it scrolls. Defaults to 500." },
  { name: "defaultTab", type: '"Preview" | "Code"', description: "Which tab is active on first render. Defaults to \"Preview\"." },
  { name: "onCopyCode", type: "(code: string) => void", description: "Called after the code is successfully copied — hook up analytics or a toast here." },
];

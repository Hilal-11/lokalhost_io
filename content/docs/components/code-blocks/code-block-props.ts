import { PropRow } from "@/components/mdx/props-table";

export const codeBlockProps: PropRow[] = [
  { name: "code", type: "string", description: "The raw source code to display and highlight.", required: true },
  { name: "fileName", type: "string", default: '"app/api/mcp/route.ts"', description: "File path or name shown in the header next to the language icon." },
  { name: "language", type: "string", default: '"tsx"', description: "Shiki language id used for highlighting (e.g. \"ts\", \"tsx\", \"bash\", \"json\"). Also picks the header icon. Unknown languages fall back to plain text." },
  { name: "showLineNumbers", type: "boolean", default: "false", description: "Toggles a line-number gutter alongside the code." },
  { name: "lightTheme", type: "string", default: '"github-light"', description: "Shiki theme used in light mode." },
  { name: "darkTheme", type: "string", default: '"github-dark"', description: "Shiki theme used in dark mode. Both themes are rendered at once, so switching themes never flickers." },
  { name: "width", type: "string | number", default: '"100%"', description: "Width of the component. Numbers are pixels; strings are used as-is (e.g. \"100%\", \"40rem\"). Never overflows its parent." },
  { name: "height", type: "string | number", default: '"auto"', description: "Height of the component. Numbers are pixels; strings are used as-is (e.g. \"auto\", \"60vh\")." },
  { name: "maxHeight", type: "string | number", default: "480", description: "Max height of the code area before it scrolls. Ignored when height is fixed." },
  { name: "borderRadius", type: "string | number", default: "12", description: "Corner radius of the outer card. Numbers are pixels." },
  { name: "bgColor", type: "string", description: "Background color in light mode. Falls back to the neutral background if omitted." },
  { name: "darkBgColor", type: "string", description: "Background color in dark mode. Falls back to the neutral background if omitted." },
  { name: "borderColor", type: "string", description: "Border color in light mode. Falls back to the neutral border if omitted." },
  { name: "darkBorderColor", type: "string", description: "Border color in dark mode. Falls back to the neutral border if omitted." },
  { name: "headerBgColor", type: "string", description: "Background color of the header row in light mode." },
  { name: "darkHeaderBgColor", type: "string", description: "Background color of the header row in dark mode." },
  { name: "className", type: "string", description: "Additional classes applied to the outer card for one-off style overrides." },
];

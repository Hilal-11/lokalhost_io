import { PropRow } from "@/components/mdx/props-table";

export const providerProps: PropRow[] = [
  { name: "sources", type: "CitationSource[]", description: "Every source the answer may cite.", required: true },
  { name: "display", type: "\"number\" | \"domain\"", description: "Chip style: a number, or favicon + domain. Defaults to \"number\"." },
  { name: "getFavicon", type: "(source) => string", description: "Favicon URL resolver. Defaults to source.favicon or Google's favicon service." },
];

export const sourceProps: PropRow[] = [
  { name: "id", type: "string", description: "Referenced by <Citation ids>.", required: true },
  { name: "url", type: "string", description: "Opened in a new tab.", required: true },
  { name: "title", type: "string", description: "Clamped to two lines in the card.", required: true },
  { name: "domain", type: "string", description: "Defaults to the URL hostname." },
  { name: "favicon", type: "string", description: "Custom favicon URL." },
  { name: "snippet", type: "string", description: "Clamped to three lines." },
  { name: "highlight", type: "string", description: "Sentence inside the snippet to highlight — the cited claim." },
  { name: "publishedAt", type: "string | Date", description: "Shown as a short date." },
  { name: "author", type: "string", description: "Shown in the card footer." },
];

export const citationProps: PropRow[] = [
  { name: "ids", type: "string[]", description: "Source ids. Several ids show “1 +2” and a carousel in the card.", required: true },
  { name: "display", type: "\"number\" | \"domain\"", description: "Override the provider's display." },
];

export const stripProps: PropRow[] = [
  { name: "max", type: "number", description: "Cards before a “+N more” card that opens the full list. Defaults to 4." },
  { name: "show", type: "boolean", description: "Set false while streaming; cards stagger in when it flips to true. Defaults to true." },
];

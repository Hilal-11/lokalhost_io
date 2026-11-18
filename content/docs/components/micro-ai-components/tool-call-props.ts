import { PropRow } from "@/components/mdx/props-table";

export const toolCallProps: PropRow[] = [
  { name: "name", type: "string", description: "Machine name, e.g. \"search_web\". Shown in mono.", required: true },
  { name: "title", type: "ReactNode", description: "Human label, e.g. \"Searching the web\". Defaults to name." },
  { name: "icon", type: "LucideIcon", description: "Icon before the title." },
  { name: "status", type: "\"pending\" | \"awaiting-approval\" | \"running\" | \"success\" | \"error\" | \"cancelled\"", description: "Lifecycle. Defaults to \"pending\"." },
  { name: "input", type: "unknown", description: "Arguments, shown in a collapsible JSON viewer." },
  { name: "output", type: "unknown", description: "Result, shown in the JSON viewer or renderOutput." },
  { name: "error", type: "string", description: "Message shown for status \"error\"." },
  { name: "startedAt / endedAt", type: "number | Date", description: "Duration ticks live while running, then freezes." },
  { name: "onApprove", type: "() => void | Promise<unknown>", description: "Approve a call awaiting approval. The button spins until the promise settles." },
  { name: "onDeny", type: "() => void", description: "Deny a call awaiting approval." },
  { name: "onRetry", type: "() => void", description: "Adds a Retry button to the error banner." },
  { name: "approvalDescription", type: "ReactNode", description: "Short explanation of the action in approval mode." },
  { name: "renderOutput", type: "(output: unknown) => ReactNode", description: "Custom output UI. Defaults to the JSON viewer." },
  { name: "defaultOpen / open / onOpenChange", type: "boolean / boolean / (open) => void", description: "Expanded state, controlled or not. Defaults to collapsed." },
];

export const toolCallGroupProps: PropRow[] = [
  { name: "label", type: "(count: number) => ReactNode", description: "Override the \"Used 3 tools\" header." },
  { name: "defaultCollapsed", type: "boolean", description: "Start collapsed. Defaults to false." },
];

export const jsonViewerProps: PropRow[] = [
  { name: "value", type: "unknown", description: "Any JSON-serialisable value.", required: true },
  { name: "label", type: "string", description: "Section label, e.g. \"Input\"." },
  { name: "defaultOpenDepth", type: "number", description: "Levels expanded by default. Defaults to 2." },
  { name: "maxLines", type: "number", description: "Lines before \"Show more\". Defaults to 12." },
];

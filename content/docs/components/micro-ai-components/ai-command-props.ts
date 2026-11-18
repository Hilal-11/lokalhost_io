import { PropRow } from "@/components/mdx/props-table";

export const paletteProps: PropRow[] = [
  { name: "commands", type: "PaletteCommand[]", description: "{ id, label, icon?, shortcut?, group?, keywords?, onSelect }. Fuzzy-filtered with cmdk's scorer.", required: true },
  { name: "onAsk", type: "(query: string) => AsyncIterable<string>", description: "Streams an answer. Enables the “Ask AI” row." },
  { name: "onInsert", type: "(answer: string) => void", description: "Adds an Insert action to the answer footer." },
  { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open) => void", description: "Open state, controlled or not." },
  { name: "placeholder", type: "string", description: "Defaults to \"Search commands or ask AI…\"." },
  { name: "hotkey", type: "string | false", description: "Letter used with ⌘ / Ctrl to toggle. Defaults to \"k\"." },
  { name: "recentLimit", type: "number", description: "Recent commands shown when the input is empty. Defaults to 3." },
];

export const inlineProps: PropRow[] = [
  { name: "targetRef", type: "RefObject<HTMLTextAreaElement | HTMLElement>", description: "The textarea or contenteditable to watch.", required: true },
  { name: "onRun", type: "(action, selectedText, instruction?) => AsyncIterable<string>", description: "Streams the rewritten text.", required: true },
  { name: "actions", type: "(\"improve\" | \"shorter\" | \"longer\" | \"fix-grammar\" | \"tone\" | \"translate\" | \"custom\")[]", description: "Menu items, in order. custom adds an instruction input. Defaults to all." },
  { name: "onAccept", type: "(result, original) => void", description: "Called after the replacement is inserted." },
  { name: "onReplace", type: "(result, original) => void", description: "Take over insertion (Tiptap, ProseMirror, Lexical…). Skips the built-in execCommand replacement." },
];

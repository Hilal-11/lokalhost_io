import { PropRow } from "@/components/mdx/props-table";

export const messageProps: PropRow[] = [
  { name: "role", type: "\"assistant\" | \"user\"", description: "User messages render as a right-aligned muted bubble (max 80% wide); assistant messages are full width with an avatar. Defaults to \"assistant\"." },
  { name: "status", type: "\"pending\" | \"streaming\" | \"done\" | \"error\"", description: "pending shows the typing dots, streaming animates new words and the caret, done fades in the footer. Defaults to \"done\"." },
  { name: "avatar", type: "ReactNode | null", description: "Assistant avatar. Pass null to hide it. Defaults to a sparkle badge." },
  { name: "name", type: "string", description: "Name shown above assistant content." },
  { name: "timestamp", type: "ReactNode", description: "Shown in a footer that fades in when the message is done." },
];

export const messageContentProps: PropRow[] = [
  { name: "content", type: "string", description: "Markdown (partial while streaming).", required: true },
  { name: "animation", type: "\"fade\" | \"blur\" | \"none\"", description: "Per-word enter animation for newly streamed words. Defaults to \"fade\"." },
  { name: "markdown", type: "boolean", description: "Render as markdown. Defaults to true for assistant, false for user." },
  { name: "caret", type: "boolean", description: "Show the blinking ▍ caret while streaming. Defaults to true." },
  { name: "remarkPlugins", type: "PluggableList", description: "Extra remark plugins (e.g. remarkCitations). remark-gfm is always on." },
  { name: "components", type: "Components", description: "Override or add element renderers. Memoize the object." },
];

export const messageErrorProps: PropRow[] = [
  { name: "onRetry", type: "() => void | Promise<unknown>", description: "Shows a Retry button. Return a promise to keep the icon spinning until it settles." },
  { name: "message", type: "ReactNode", description: "Error text. Defaults to \"Something went wrong while generating this response.\"" },
];

export const messageListProps: PropRow[] = [
  { name: "threshold", type: "number", description: "Distance from the bottom (px) that still counts as stuck. Defaults to 48." },
  { name: "contentClassName", type: "string", description: "Classes on the inner content wrapper (gap, padding)." },
];

export const useStreamingTextProps: PropRow[] = [
  { name: "stream", type: "AsyncIterable<string> | null", description: "Pass a new iterable to (re)start. null resets to idle.", required: true },
  { name: "→ text", type: "string", description: "Accumulated text." },
  { name: "→ status", type: "\"idle\" | \"pending\" | \"streaming\" | \"done\" | \"error\"", description: "Lifecycle of the current stream." },
  { name: "→ stop", type: "() => void", description: "Stops reading and keeps the text received so far." },
  { name: "→ error", type: "unknown", description: "Whatever the stream threw." },
];

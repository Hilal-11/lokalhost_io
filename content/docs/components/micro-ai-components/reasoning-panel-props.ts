import { PropRow } from "@/components/mdx/props-table";

export const reasoningProps: PropRow[] = [
  { name: "isStreaming", type: "boolean", description: "True while the model is thinking. Drives the live timer, shimmer and rail pulse. Defaults to false." },
  { name: "defaultOpen", type: "boolean", description: "Uncontrolled initial open state. Defaults to isStreaming." },
  { name: "open", type: "boolean", description: "Controlled open state." },
  { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the panel opens or closes." },
  { name: "duration", type: "number", description: "Final thinking time in seconds. When omitted the measured time is shown." },
  { name: "autoCollapse", type: "boolean", description: "Collapse 600ms after thinking ends. A manual toggle disables it for that instance. Defaults to true." },
  { name: "steps", type: "ReasoningStep[]", description: "Render a mini step list ({ title, status: \"pending\" | \"active\" | \"done\" }) instead of raw text." },
  { name: "className", type: "string", description: "Classes on the root." },
];

export const reasoningTriggerProps: PropRow[] = [
  { name: "thinkingLabel", type: "string", description: "Label while thinking. Defaults to \"Thinking…\"." },
  { name: "doneLabel", type: "(seconds: number) => string", description: "Label after thinking. Defaults to \"Thought for {n}s\" or \"Thought for a few seconds\" under 2s." },
  { name: "hideTimer", type: "boolean", description: "Hide the live seconds counter." },
];

export const reasoningContentProps: PropRow[] = [
  { name: "children", type: "ReactNode", description: "The reasoning text (streamed or complete). Ignored when the root has steps." },
  { name: "maxHeight", type: "number", description: "Max height of the scroll area in px. Follows the bottom while streaming. Defaults to 240." },
];

export const shimmerTextProps: PropRow[] = [
  { name: "active", type: "boolean", description: "Turn the sweep on or off. Defaults to true." },
  { name: "duration", type: "number", description: "Seconds per sweep. Defaults to 1.8." },
  { name: "as", type: "\"span\" | \"p\" | \"div\"", description: "Element to render. Defaults to \"span\"." },
];

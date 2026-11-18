import { PropRow } from "@/components/mdx/props-table";

export const agentPlanProps: PropRow[] = [
  { name: "title", type: "ReactNode", description: "Plan title. Defaults to \"Plan\"." },
  { name: "steps", type: "PlanStep[]", description: "The plan. Keep ids stable across re-plans.", required: true },
  { name: "onStepClick", type: "(step: PlanStep) => void", description: "Makes rows clickable (Enter / Space too)." },
  { name: "collapsible", type: "boolean", description: "Show the collapse button. Defaults to true." },
  { name: "defaultCollapsed", type: "boolean", description: "Start collapsed." },
  { name: "variant", type: "\"vertical\" | \"compact\"", description: "Timeline, or a dot row with the active label for small spaces. Defaults to \"vertical\"." },
];

export const planStepProps: PropRow[] = [
  { name: "id", type: "string", description: "Stable id.", required: true },
  { name: "title", type: "string", description: "Step label.", required: true },
  { name: "status", type: "\"todo\" | \"active\" | \"done\" | \"failed\" | \"skipped\"", description: "active shimmers and ripples, done draws a check, failed shakes, skipped is struck through.", required: true },
  { name: "description", type: "string", description: "Muted helper text, clamped to two lines." },
  { name: "substeps", type: "PlanStep[]", description: "Auto-expanded while the step is active, collapsed when done (the user can reopen)." },
  { name: "startedAt / endedAt", type: "number | Date", description: "Per-step duration on the right; also drives the header's elapsed time." },
  { name: "meta", type: "ReactNode", description: "Extra UI under the step — an error with “Retry from here”, or a ToolCall." },
];

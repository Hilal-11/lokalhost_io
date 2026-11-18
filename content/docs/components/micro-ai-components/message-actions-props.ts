import { PropRow } from "@/components/mdx/props-table";

export const messageActionsProps: PropRow[] = [
  { name: "visibility", type: "\"always\" | \"hover\"", description: "hover fades the bar in when an ancestor with the group/message class (added by <Message>) is hovered or focused. Always visible on touch devices. Defaults to \"always\"." },
  { name: "tooltipDelay", type: "number", description: "Tooltip open delay in ms. Defaults to 300." },
];

export const copyProps: PropRow[] = [
  { name: "text", type: "string", description: "Markdown copied on click. Shift+click copies plain text.", required: true },
  { name: "plainText", type: "string", description: "Plain-text version. Derived from text when omitted." },
  { name: "onCopy", type: "(text, format: \"markdown\" | \"plain\") => void", description: "Called after a successful copy." },
];

export const regenerateProps: PropRow[] = [
  { name: "onRegenerate", type: "(modelId?: string) => void", description: "Called on click, or with the model picked from the caret menu." },
  { name: "regenerating", type: "boolean", description: "Keeps the icon spinning." },
  { name: "models", type: "{ id, label, description? }[]", description: "Turns the button into a split button with a model menu." },
];

export const feedbackProps: PropRow[] = [
  { name: "value", type: "\"up\" | \"down\" | null", description: "Controlled value." },
  { name: "defaultValue", type: "\"up\" | \"down\" | null", description: "Uncontrolled initial value. Defaults to null." },
  { name: "onFeedback", type: "(value, reason?, comment?) => void", description: "Called on every change. reason and comment come from the thumbs-down popover." },
  { name: "reasons", type: "string[]", description: "Reason chips. Defaults to Inaccurate, Not helpful, Too long, Unsafe, Other." },
];

export const otherActionProps: PropRow[] = [
  { name: "Share · onShare", type: "() => void | Promise<void>", description: "Custom share. Defaults to the Web Share API, falling back to copying the URL." },
  { name: "Share · url", type: "string", description: "URL for the default share. Defaults to the current page." },
  { name: "Speak · text", type: "string", description: "Read aloud with speechSynthesis (markdown is stripped). Toggles to Stop.", required: true },
  { name: "Speak · lang", type: "string", description: "BCP-47 language, e.g. \"en-US\"." },
  { name: "More · items", type: "{ label, icon?, onSelect, destructive? }[]", description: "Dropdown items.", required: true },
];

export const branchSwitcherProps: PropRow[] = [
  { name: "current", type: "number", description: "1-based visible version.", required: true },
  { name: "total", type: "number", description: "Number of versions. Renders nothing when 1.", required: true },
  { name: "onChange", type: "(next: number) => void", description: "Called with the new 1-based index." },
];

export const branchContentProps: PropRow[] = [
  { name: "current", type: "number", description: "Changing it crossfades the children.", required: true },
];

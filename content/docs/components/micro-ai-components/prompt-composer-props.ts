import { PropRow } from "@/components/mdx/props-table";

export const composerProps: PropRow[] = [
  { name: "value", type: "string", description: "Controlled text." },
  { name: "defaultValue", type: "string", description: "Uncontrolled initial text." },
  { name: "onValueChange", type: "(value: string) => void", description: "Called on every change." },
  { name: "onSubmit", type: "(value: string, attachments: ComposerAttachment[]) => void", description: "Receives the trimmed text. The input clears and keeps focus." },
  { name: "onStop", type: "() => void", description: "Called by the Stop button or Esc while streaming." },
  { name: "status", type: "\"idle\" | \"submitting\" | \"streaming\" | \"error\"", description: "streaming turns Send into Stop; error pulses the border once. Defaults to \"idle\"." },
  { name: "errorMessage", type: "ReactNode", description: "Inline message that slides down under the bar when status is \"error\"." },
  { name: "maxLength", type: "number", description: "Character limit. Submits are blocked (and the counter shakes) above it." },
  { name: "history", type: "string[]", description: "Sent messages, newest last. ArrowUp in an empty input recalls them." },
  { name: "attachments", type: "ComposerAttachment[]", description: "Controlled attachments." },
  { name: "onAttachmentsChange", type: "(attachments) => void", description: "Called when attachments change." },
  { name: "onUpload", type: "(file, onProgress) => Promise<void>", description: "Upload handler. Report 0..1 progress; throw to mark the chip as failed (with Retry). Without it files attach instantly." },
  { name: "disabled", type: "boolean", description: "Disable everything." },
];

export const composerInputProps: PropRow[] = [
  { name: "placeholder", type: "string", description: "Defaults to \"Ask anything…\"." },
  { name: "maxRows", type: "number", description: "Grows from 1 line up to this many, then scrolls. Defaults to 8." },
  { name: "aria-label", type: "string", description: "Defaults to \"Message\"." },
];

export const composerAttachButtonProps: PropRow[] = [
  { name: "accept", type: "string", description: "Accepted file types, e.g. \"image/*,.pdf\"." },
  { name: "multiple", type: "boolean", description: "Allow several files. Defaults to true." },
];

export const composerModelChipProps: PropRow[] = [
  { name: "models", type: "{ id, label, description?, icon? }[]", description: "Options in the popover.", required: true },
  { name: "value", type: "string", description: "Controlled selected id." },
  { name: "defaultValue", type: "string", description: "Uncontrolled initial id. Defaults to the first model." },
  { name: "onChange", type: "(id: string) => void", description: "Called with the new id." },
];

export const composerCounterProps: PropRow[] = [
  { name: "showAt", type: "number", description: "Fraction of maxLength after which the counter appears. Defaults to 0.8." },
];

export const composerSuggestionsProps: PropRow[] = [
  { name: "items", type: "(string | { label, value?, icon? })[]", description: "Pills shown while the input is empty.", required: true },
  { name: "onSelect", type: "(value: string) => void", description: "Called after the typewriter fill finishes." },
  { name: "typeSpeed", type: "number", description: "ms per character for the fill. Defaults to 8." },
];

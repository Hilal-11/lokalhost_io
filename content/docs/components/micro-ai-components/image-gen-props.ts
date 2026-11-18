import { PropRow } from "@/components/mdx/props-table";

export const imageGenProps: PropRow[] = [
  { name: "prompt", type: "string", description: "Used for alt text, the live aria-label and Copy prompt.", required: true },
  { name: "status", type: "\"queued\" | \"generating\" | \"done\" | \"error\"", description: "Lifecycle. Defaults to \"queued\"." },
  { name: "progress", type: "number", description: "0..100. Omit for an indeterminate bar." },
  { name: "src", type: "string", description: "Final image. It is decoded before the reveal starts, so it never half-loads on screen." },
  { name: "previewSrc", type: "string", description: "Low-res intermediate frame. Blur = 16px × (1 − progress / 100)." },
  { name: "aspectRatio", type: "\"1:1\" | \"4:3\" | \"16:9\" | \"9:16\"", description: "Fixed frame ratio — no layout shift. Defaults to \"1:1\"." },
  { name: "reveal", type: "\"radial\" | \"wipe\" | \"fade\"", description: "How the final image appears. Defaults to \"radial\"." },
  { name: "eta", type: "number", description: "Seconds remaining, shown under the percentage." },
  { name: "error", type: "string", description: "Error text. Defaults to \"Generation failed\"." },
  { name: "onDownload", type: "() => void | Promise<unknown>", description: "Download handler. Defaults to fetching src and saving it." },
  { name: "onRegenerate / onVariation / onUpscale", type: "() => void", description: "Each adds a button to the hover overlay." },
  { name: "onRetry", type: "() => void", description: "Retry button in the error state." },
  { name: "disableLightbox", type: "boolean", description: "Turn off click-to-open." },
];

export const imageGenGridProps: PropRow[] = [
  { name: "items", type: "(ImageGenProps & { id?: string })[]", description: "One ImageGen per cell. Cells enter 200ms apart.", required: true },
  { name: "columns", type: "1 | 2 | 3 | 4", description: "Columns (3 and 4 collapse to 2 on small screens). Defaults to 2." },
  { name: "selected / onSelect", type: "number | null / (index) => void", description: "Selected cell gets a ring and the others dim to 60%. Double-click opens the lightbox." },
];

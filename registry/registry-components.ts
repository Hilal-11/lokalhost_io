import type { Registry } from "./schema";
import { SITE_URL } from "@/lib/site";

/**
 * Web components served to the shadcn CLI from https://localhostui.com/r/<name>.json
 *
 * Rules (the build script enforces the first two):
 *  - `name` is the URL slug: lowercase kebab-case, unique.
 *  - `files[].path` is the real source file; it is installed at the same path.
 *  - `dependencies` must list every npm package the file imports, otherwise the
 *    CLI installs the file but the user's build fails on a missing module.
 *    Files that import `cn` from "@/lib/utils" need clsx + tailwind-merge.
 *  - `registryDependencies` use full URLs so the CLI resolves them from this registry.
 */

const r = (name: string) => `${SITE_URL}/r/${name}.json`;
const MA = "components/lokalhost_io/micro-ai-components";
const CN = ["clsx", "tailwind-merge"];

/** The `success` token used by Agent Plan and Inline AI diffs (added to globals.css). */
const SUCCESS_VARS = {
  light: { success: "oklch(0.527 0.137 150.069)" },
  dark: { success: "oklch(0.765 0.177 163.223)" },
};

export const component: Registry = [
  /* ---------------------------------------------------------------- */
  /* Buttons & code blocks                                            */
  /* ---------------------------------------------------------------- */
  {
    name: "download-button",
    type: "registry:component",
    description: "Platform-aware download buttons for Mac, Windows and Linux with a spring text-roll hover, monochrome primary/secondary variants and OS detection.",
    dependencies: ["motion", "react-icons"],
    registryDependencies: [],
    files: [{ path: "components/lokalhost_io/buttons/download-button.tsx", type: "registry:component" }],
  },
  {
    name: "code-preview-block",
    type: "registry:component",
    description: "A Preview / Code tabbed container for showcasing live components next to their source.",
    dependencies: ["shiki", "next-themes", "motion", "lucide-react", "react-icons", ...CN],
    registryDependencies: [r("utils")],
    files: [{ path: "components/lokalhost_io/code-blocks/component-preview.tsx", type: "registry:component" }],
  },
  {
    name: "code-block",
    type: "registry:component",
    description: "A syntax-highlighted code block with file header, language chip, animated copy button, optional line numbers and light/dark Shiki themes.",
    dependencies: ["shiki", "next-themes", "motion", "react-icons", ...CN],
    registryDependencies: [r("utils")],
    files: [{ path: "components/lokalhost_io/code-blocks/code-block.tsx", type: "registry:component" }],
  },

  /* ---------------------------------------------------------------- */
  /* Existing micro AI components                                     */
  /* ---------------------------------------------------------------- */
  {
    name: "install-command",
    type: "registry:component",
    description: "A package-manager aware install command with an animated npm/pnpm/yarn/bun switcher and one-click copy.",
    dependencies: ["shiki", "motion", "lucide-react", "react-icons"],
    registryDependencies: [],
    files: [{ path: `${MA}/install-command.tsx`, type: "registry:component" }],
  },
  {
    name: "copy-page-markdown",
    type: "registry:component",
    description: "A split button that copies the page as Markdown or opens it in ChatGPT, Claude, v0 and more.",
    dependencies: ["motion", "react-icons"],
    registryDependencies: [],
    files: [{ path: `${MA}/copy-page-markdown.tsx`, type: "registry:component" }],
  },
  {
    name: "model-picker",
    type: "registry:component",
    description: "A searchable AI model picker with provider icons, a sliding highlight and full keyboard navigation.",
    dependencies: ["motion", "lucide-react", "react-icons"],
    registryDependencies: [],
    files: [{ path: `${MA}/model-picker.tsx`, type: "registry:component" }],
  },
  {
    name: "models-selector",
    type: "registry:component",
    description: "A compact AI model dropdown with sizes, radius presets, alignment and optional search.",
    dependencies: ["motion", "react-icons"],
    registryDependencies: [],
    files: [{ path: `${MA}/models-selector.tsx`, type: "registry:component" }],
  },
  {
    name: "composer-actions",
    type: "registry:component",
    description: "The “+” menu next to a chat input: import, upload, toggles and submenus with keyboard navigation.",
    dependencies: ["motion", "react-icons"],
    registryDependencies: [],
    files: [{ path: `${MA}/ComposerActions.tsx`, type: "registry:component" }],
  },

  /* ---------------------------------------------------------------- */
  /* Micro AI UI                                                      */
  /* ---------------------------------------------------------------- */
  {
    name: "shimmer-text",
    type: "registry:ui",
    description: "A light band that sweeps across text — the “thinking” label used across Micro AI UI.",
    dependencies: ["motion", ...CN],
    registryDependencies: [r("utils")],
    files: [{ path: `${MA}/shimmer-text/shimmer-text.tsx`, type: "registry:ui" }],
  },
  {
    name: "mock-stream",
    type: "registry:lib",
    description: "mockStream(text, { wpm, jitter }) — an async generator yielding realistic tokens for demos.",
    dependencies: [],
    files: [{ path: "lib/mock-stream.ts", type: "registry:lib" }],
  },
  {
    name: "reasoning-panel",
    type: "registry:ui",
    description: "A collapsible “Thinking…” block with a shimmer label, live timer and auto-collapse when the answer starts.",
    dependencies: ["@radix-ui/react-collapsible", "motion", "lucide-react", ...CN],
    registryDependencies: [r("utils"), r("shimmer-text")],
    files: [{ path: `${MA}/reasoning-panel/reasoning-panel.tsx`, type: "registry:ui" }],
  },
  {
    name: "streaming-message",
    type: "registry:ui",
    description: "Streams AI markdown token by token without flicker: memoized blocks, word fade/blur, caret, code blocks and sticky auto-scroll.",
    dependencies: ["react-markdown", "remark-gfm", "shiki", "motion", "lucide-react", ...CN],
    registryDependencies: [r("utils")],
    files: [
      { path: `${MA}/streaming-message/streaming-message.tsx`, type: "registry:ui" },
      { path: `${MA}/streaming-message/markdown.tsx`, type: "registry:ui" },
    ],
  },
  {
    name: "prompt-composer",
    type: "registry:ui",
    description: "A chat input with auto-grow, attachments, drag & drop, a model chip, suggestions and a Send → Stop morph.",
    dependencies: ["@radix-ui/react-popover", "motion", "lucide-react", ...CN],
    registryDependencies: [r("utils")],
    files: [
      { path: `${MA}/prompt-composer/prompt-composer.tsx`, type: "registry:ui" },
      { path: `${MA}/prompt-composer/parts.tsx`, type: "registry:ui" },
      { path: `${MA}/prompt-composer/context.tsx`, type: "registry:ui" },
    ],
  },
  {
    name: "message-actions",
    type: "registry:ui",
    description: "The toolbar under every AI answer — copy, regenerate, feedback, speak, share — plus a ‹ 2/3 › branch switcher.",
    dependencies: ["@radix-ui/react-tooltip", "@radix-ui/react-popover", "motion", "lucide-react", ...CN],
    registryDependencies: [r("utils")],
    files: [
      { path: `${MA}/message-actions/message-actions.tsx`, type: "registry:ui" },
      { path: `${MA}/message-actions/branch-switcher.tsx`, type: "registry:ui" },
    ],
  },
  {
    name: "tool-call",
    type: "registry:ui",
    description: "Shows an agent calling a tool: morphing status icon, live duration, JSON input/output and an approval mode.",
    dependencies: ["motion", "lucide-react", ...CN],
    registryDependencies: [r("utils"), r("shimmer-text")],
    files: [
      { path: `${MA}/tool-call/tool-call.tsx`, type: "registry:ui" },
      { path: `${MA}/tool-call/json-viewer.tsx`, type: "registry:ui" },
    ],
  },
  {
    name: "agent-plan",
    type: "registry:ui",
    description: "A vertical plan timeline with a filling progress rail, substeps, re-planning and a compact dot variant.",
    dependencies: ["motion", "lucide-react", ...CN],
    registryDependencies: [r("utils"), r("shimmer-text")],
    cssVars: SUCCESS_VARS,
    files: [{ path: `${MA}/agent-plan/agent-plan.tsx`, type: "registry:ui" }],
  },
  {
    name: "voice-orb",
    type: "registry:ui",
    description: "An audio-reactive orb (blob, rings or bars) for voice mode, a control bar and a useMicLevel hook.",
    dependencies: ["motion", "lucide-react", ...CN],
    registryDependencies: [r("utils")],
    files: [
      { path: `${MA}/voice-orb/voice-orb.tsx`, type: "registry:ui" },
      { path: `${MA}/voice-orb/voice-bar.tsx`, type: "registry:ui" },
    ],
  },
  {
    name: "citations",
    type: "registry:ui",
    description: "Inline numbered source chips with spring hover cards, a sources strip and a remark plugin for [1] markers.",
    dependencies: ["@radix-ui/react-hover-card", "@radix-ui/react-dialog", "motion", "lucide-react", ...CN],
    registryDependencies: [r("utils")],
    files: [
      { path: `${MA}/citations/citations.tsx`, type: "registry:ui" },
      { path: `${MA}/citations/remark-citations.ts`, type: "registry:lib" },
    ],
  },
  {
    name: "ai-command",
    type: "registry:ui",
    description: "A ⌘K palette that streams AI answers, plus an inline “Ask AI” toolbar over selected text with a live word diff.",
    dependencies: ["@radix-ui/react-dialog", "cmdk", "react-markdown", "remark-gfm", "shiki", "motion", "lucide-react", ...CN],
    registryDependencies: [r("utils"), r("streaming-message")],
    cssVars: SUCCESS_VARS,
    files: [
      { path: `${MA}/ai-command/ai-command.tsx`, type: "registry:ui" },
      { path: `${MA}/ai-command/command-palette.tsx`, type: "registry:ui" },
      { path: `${MA}/ai-command/inline-ai.tsx`, type: "registry:ui" },
      { path: `${MA}/ai-command/word-diff.ts`, type: "registry:lib" },
    ],
  },
  {
    name: "image-gen",
    type: "registry:ui",
    description: "Placeholder and result frame for AI images: live grain, progressive blur-to-sharp reveal, actions, lightbox and a variations grid.",
    dependencies: ["@radix-ui/react-dialog", "motion", "lucide-react", ...CN],
    registryDependencies: [r("utils"), r("shimmer-text")],
    files: [{ path: `${MA}/image-gen/image-gen.tsx`, type: "registry:ui" }],
  },
];

import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Blocks,
  BookOpen,
  Boxes,
  Brain,
  Briefcase,
  Code2,
  Command,
  CreditCard,
  Crown,
  Download,
  FileCode2,
  Globe,
  Home,
  Image as ImageIcon,
  LayoutTemplate,
  ListChecks,
  LockKeyhole,
  Mail,
  MessageSquare,
  MessagesSquare,
  Mic,
  MousePointerClick,
  Newspaper,
  Palette,
  PanelsTopLeft,
  Quote,
  Smartphone,
  Sparkles,
  SquareTerminal,
  Users,
  Wrench,
} from "lucide-react";
import { BLOCK_CATEGORIES, categoryHref, countBlocks } from "@/lib/blocks/catalog";
import { CATALOG as MOBILE_CATALOG, itemHref as mobileHref } from "@/lib/mobile/catalog";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type SearchGroup = "Pages" | "Components" | "Blocks" | "Templates" | "Mobile" | "Company";

export interface SearchItem {
  /** Unique id (also used for "recent" history). */
  id: string;
  title: string;
  href: string;
  group: SearchGroup;
  /** One line shown under / beside the title. */
  description?: string;
  icon: LucideIcon;
  /** Extra words that should match this item. */
  keywords?: string[];
  badge?: "new" | "pro" | "soon";
  external?: boolean;
}

/** Display order of groups in the results list. */
export const SEARCH_GROUP_ORDER: SearchGroup[] = ["Pages", "Components", "Blocks", "Templates", "Mobile", "Company"];

/* ------------------------------------------------------------------ */
/* Pages                                                              */
/* ------------------------------------------------------------------ */

const PAGES: SearchItem[] = [
  { id: "home", title: "Home", href: "/", group: "Pages", icon: Home, description: "Lokalhost.io home" },
  { id: "docs", title: "Docs", href: "/docs", group: "Pages", icon: BookOpen, description: "All components and guides", keywords: ["documentation", "library"] },
  { id: "installation", title: "Installation & CLI", href: "/docs/installation", group: "Pages", icon: SquareTerminal, description: "Set up shadcn and add your first component", keywords: ["install", "setup", "shadcn", "npx", "registry", "get started"] },
  { id: "blocks", title: "Blocks", href: "/docs/blocks", group: "Pages", icon: Blocks, description: "Full sections and landing pages", badge: "new", keywords: ["sections", "ui blocks"] },
  { id: "templates", title: "Web Templates", href: "/templates", group: "Pages", icon: LayoutTemplate, description: "Production-ready Next.js templates", keywords: ["template", "saas", "landing", "website"] },
  { id: "mobile", title: "Mobile UI Kit", href: "/mobile", group: "Pages", icon: Smartphone, description: "React Native and Flutter components", keywords: ["react native", "flutter", "expo", "app"] },
  { id: "mobile-cli", title: "Mobile CLI", href: "/mobile/cli", group: "Pages", icon: SquareTerminal, description: "Add mobile components from the terminal" },
  { id: "designs", title: "Design Systems", href: "/designs", group: "Pages", icon: Palette, description: "Design kits and systems", keywords: ["figma", "design"] },
  { id: "softwares", title: "Desktop Software", href: "/softwares", group: "Pages", icon: AppWindow, description: "Apps by Lokalhost", keywords: ["download", "desktop"] },
  { id: "pricing", title: "Pricing", href: "/pricing", group: "Pages", icon: CreditCard, description: "Pro access — monthly or yearly", keywords: ["pro", "buy", "plan", "upgrade"] },
  { id: "billing", title: "Account & Billing", href: "/account/billing", group: "Pages", icon: Crown, description: "Your plan, invoices and access", keywords: ["account", "subscription", "invoice"] },
  { id: "changelog", title: "Changelog", href: "/mobile/changelog", group: "Pages", icon: ListChecks, description: "What's new" },
];

/* ------------------------------------------------------------------ */
/* Components                                                         */
/* ------------------------------------------------------------------ */

const C = "/docs/components/micro-ai-components";

const COMPONENTS: SearchItem[] = [
  { id: "c-prompt-composer", title: "Prompt Composer", href: `${C}/prompt-composer`, icon: MessageSquare, description: "Chat input with attachments and Send → Stop", keywords: ["chat input", "textarea", "composer", "ai input"] },
  { id: "c-streaming-message", title: "Streaming Message", href: `${C}/streaming-message`, icon: MessagesSquare, description: "Markdown that streams word by word", keywords: ["chat", "markdown", "stream", "message"] },
  { id: "c-reasoning-panel", title: "Reasoning Panel", href: `${C}/reasoning-panel`, icon: Brain, description: "Collapsible “Thinking…” with a live timer", keywords: ["thinking", "reasoning", "shimmer"] },
  { id: "c-message-actions", title: "Message Actions", href: `${C}/message-actions`, icon: MousePointerClick, description: "Copy, regenerate, feedback, branch switcher", keywords: ["toolbar", "copy", "thumbs", "feedback"] },
  { id: "c-tool-call", title: "Tool Call", href: `${C}/tool-call`, icon: Wrench, description: "Agent tool calls with approvals", keywords: ["agent", "function call", "json"] },
  { id: "c-agent-plan", title: "Agent Plan", href: `${C}/agent-plan`, icon: ListChecks, description: "Multi-step progress timeline", keywords: ["steps", "timeline", "progress", "agent"] },
  { id: "c-citations", title: "Citations", href: `${C}/citations`, icon: Quote, description: "Inline sources with hover cards", keywords: ["sources", "references", "perplexity"] },
  { id: "c-voice-orb", title: "Voice Orb", href: `${C}/voice-orb`, icon: Mic, description: "Audio-reactive voice mode orb", keywords: ["voice", "audio", "microphone", "realtime"] },
  { id: "c-ai-command", title: "AI Command Palette", href: `${C}/ai-command`, icon: Command, description: "⌘K palette with streamed answers", keywords: ["cmdk", "command palette", "ask ai", "inline"] },
  { id: "c-image-gen", title: "Image Generation", href: `${C}/image-gen`, icon: ImageIcon, description: "Generating placeholder with blur reveal", keywords: ["image", "dall-e", "progress"] },
  { id: "c-composer-actions", title: "Composer Actions", href: `${C}/composer-actions`, icon: Sparkles, description: "The “+” menu next to a chat input", keywords: ["menu", "plus"] },
  { id: "c-model-picker", title: "Model Picker", href: `${C}/model-picker`, icon: Boxes, description: "Searchable AI model list", keywords: ["model", "gpt", "claude", "select"] },
  { id: "c-models-selector", title: "Model Selector", href: `${C}/models-selector`, icon: Boxes, description: "Compact AI model dropdown", keywords: ["model", "dropdown", "select"] },
  { id: "c-install-command", title: "Install Command", href: `${C}/install-command`, icon: SquareTerminal, description: "npm / pnpm / yarn / bun switcher", keywords: ["npm", "pnpm", "terminal"] },
  { id: "c-copy-page-markdown", title: "Copy Page Markdown", href: `${C}/copy-page-markdown`, icon: FileCode2, description: "Copy page or open in ChatGPT, Claude", keywords: ["markdown", "llm", "copy"] },
  { id: "c-code-block", title: "Code Block", href: "/docs/components/code-blocks/code-block", icon: Code2, description: "Syntax-highlighted code with copy", keywords: ["shiki", "syntax", "code"] },
  { id: "c-component-preview", title: "Component Preview", href: "/docs/components/code-blocks/component-preview", icon: Code2, description: "Preview / Code tabs container", keywords: ["preview", "tabs"] },
  { id: "c-download-button", title: "Download Button", href: "/docs/components/buttons/download-button", icon: Download, description: "OS-aware download buttons", keywords: ["button", "mac", "windows", "linux"] },
].map((c) => ({ ...c, group: "Components" as const }));

/* ------------------------------------------------------------------ */
/* Blocks (from the blocks catalog) & Mobile (from the mobile catalog) */
/* ------------------------------------------------------------------ */

const BLOCK_ITEMS: SearchItem[] = BLOCK_CATEGORIES.map((c) => ({
  id: `b-${c.slug}`,
  title: c.title,
  href: categoryHref(c.slug),
  group: "Blocks" as const,
  icon: c.slug === "login-and-signup" ? LockKeyhole : c.slug === "landing-pages" ? PanelsTopLeft : Blocks,
  description: c.description,
  keywords: ["block", "section", c.art],
  badge: countBlocks(c.slug) === 0 ? ("soon" as const) : undefined,
}));

const MOBILE_ITEMS: SearchItem[] = MOBILE_CATALOG.map((m) => ({
  id: `m-${m.kind}-${m.slug}`,
  title: m.title,
  href: mobileHref(m),
  group: "Mobile" as const,
  icon: Smartphone,
  description: m.description,
  keywords: ["mobile", "react native", "flutter", m.kind, m.category, ...m.tags],
}));

/* ------------------------------------------------------------------ */
/* Company                                                            */
/* ------------------------------------------------------------------ */

const COMPANY: SearchItem[] = [
  { id: "custom-work", title: "Custom Work", href: "/custom-work", group: "Company", icon: Briefcase, description: "Hire us to design and build it", keywords: ["hire", "freelance", "agency", "request"] },
  { id: "blogs", title: "Blog", href: "/blogs", group: "Company", icon: Newspaper, description: "Articles and guides", keywords: ["blogs", "articles"] },
  { id: "team", title: "Team & About", href: "/team", group: "Company", icon: Users, description: "Who builds Lokalhost", keywords: ["about", "founder"] },
  { id: "contact", title: "Contact & Feedback", href: "/contact", group: "Company", icon: Mail, description: "Report a bug or request a component", keywords: ["support", "bug", "feedback", "help"] },
  { id: "developer", title: "About the Developer", href: "https://hila-11.com", group: "Company", icon: Globe, external: true },
];

/** Every searchable destination. */
export const SEARCH_ITEMS: SearchItem[] = [...PAGES, ...COMPONENTS, ...BLOCK_ITEMS, ...MOBILE_ITEMS, ...COMPANY];

/** Shown when the input is empty (after recent searches). */
export const SEARCH_SUGGESTED_IDS = ["installation", "blocks", "c-prompt-composer", "c-streaming-message", "templates", "mobile", "pricing"];

/** @deprecated kept for older imports — use SEARCH_ITEMS. */
export const MAIN_PAGE_SEARCHING_CONFIG = SEARCH_ITEMS;

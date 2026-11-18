import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  Boxes,
  Crown,
  Handshake,
  LayoutTemplate,
  LockKeyhole,
  PanelsTopLeft,
  Smartphone,
  Sparkles,
} from "lucide-react";

export interface Service {
  id: string;
  /** Menu title. */
  service: string;
  /** One-line description (shown in the menu footer on hover and in the mobile list). */
  about: string;
  icon: LucideIcon;
  link: string;
  /** Small monochrome tag next to the title. */
  badge?: "new" | "pro";
}

/** Products in the header "Products" menu — 3×3 grid on desktop, list on mobile. */
export const services: Service[] = [
  { id: "components", service: "Components", about: "Copy-paste React components with micro-interactions.", icon: Boxes, link: "/docs" },
  { id: "ai", service: "AI Components", about: "Composer, streaming, reasoning, tool calls and voice UI.", icon: Sparkles, link: "/docs/components/micro-ai-components/prompt-composer" },
  { id: "blocks", service: "Blocks", about: "Full sections — heroes, pricing, FAQs and more.", icon: Blocks, link: "/docs/blocks", badge: "new" },
  { id: "landings", service: "Landing Pages", about: "Complete single-page landings, ready to ship.", icon: PanelsTopLeft, link: "/docs/blocks/landing-pages", badge: "new" },
  { id: "auth", service: "Auth Screens", about: "Login, signup, magic link and OTP screens.", icon: LockKeyhole, link: "/docs/blocks/login-and-signup" },
  { id: "templates", service: "Web Templates", about: "Production-ready Next.js templates you can launch today.", icon: LayoutTemplate, link: "/templates" },
  { id: "mobile", service: "Mobile Apps & UI", about: "React Native and Flutter components, screens and starters.", icon: Smartphone, link: "/mobile" },
  { id: "custom", service: "Custom Work", about: "Got a unique idea? We design and build it with you.", icon: Handshake, link: "/custom-work" },
  { id: "pro", service: "Pro Access", about: "Every Pro block, landing page and template in one plan.", icon: Crown, link: "/pricing", badge: "pro" },
];

/** Plain text links in the menu's right column. */
export const featuredLinks: { label: string; href: string }[] = [
  { label: "Installation & CLI", href: "/docs/installation" },
  { label: "Prompt Composer", href: "/docs/components/micro-ai-components/prompt-composer" },
  { label: "Streaming Message", href: "/docs/components/micro-ai-components/streaming-message" },
  { label: "Mobile CLI", href: "/mobile/cli" },
  { label: "Request a component", href: "/contact" },
];

/* ------------------------------------------------------------------ */
/* /mobile — shared types. Everything here is serialisable so it can  */
/* cross the server → client boundary unchanged.                      */
/* ------------------------------------------------------------------ */

export type Framework = "react-native" | "flutter";
export type Platform = "ios" | "android" | "web";
export type Support = "full" | "partial" | "none";
export type ItemKind = "component" | "screen" | "block";
export type Tier = "free" | "pro";
export type BadgeKind = "new" | "pro" | "beta";

/** Keys into the client-side preview registry (components/mobile/preview/previews). */
export type PreviewId =
  | "buttons"
  | "inputs"
  | "cards"
  | "lists"
  | "bottom-sheet"
  | "tabs"
  | "navigation-bar"
  | "modal"
  | "toast"
  | "avatar"
  | "skeleton"
  | "onboarding-1"
  | "onboarding-2"
  | "onboarding-3"
  | "auth-sign-in"
  | "auth-sign-up"
  | "auth-otp"
  | "home-feed"
  | "product"
  | "cart"
  | "checkout"
  | "order-success"
  | "profile"
  | "settings"
  | "chat-list"
  | "chat-thread"
  | "empty-state"
  | "error-state"
  | "offline-state"
  | "app-header"
  | "story-rail"
  | "stats-grid"
  | "pricing-plans";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface FrameworkSpec {
  /** Main source file name, relative to registry/mobile/<framework>/ */
  file: string;
  /** Where the file lands in the user's project. */
  target: string;
  /** Runtime dependencies (npm for RN, pub for Flutter). */
  dependencies: string[];
  props: PropDef[];
}

export interface FlowStep {
  title: string;
  preview?: PreviewId;
  /** Static screenshot fallback when no live preview exists. */
  image?: string;
}

export interface MobileItem {
  slug: string;
  kind: ItemKind;
  title: string;
  description: string;
  /** Library category, e.g. "Overlays", "Commerce". */
  category: string;
  tags: string[];
  tier: Tier;
  badge?: BadgeKind;
  platforms: Record<Platform, Support>;
  updated: string; // ISO date
  /** Number of variants shown on the page (cards, overview). */
  variants: number;
  preview: PreviewId;
  /** Screens/flows: multiple frames rendered as a horizontal gallery. */
  flow?: FlowStep[];
  featured?: boolean;
  /** Other catalog slugs this item imports (installed alongside it). */
  uses?: string[];
  rn: FrameworkSpec;
  flutter: FrameworkSpec;
}

/** Lightweight item used by the sidebar, search palette and overview cards. */
export interface MobileItemSummary {
  slug: string;
  kind: ItemKind;
  href: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  tier: Tier;
  badge?: BadgeKind;
  platforms: Record<Platform, Support>;
  variants: number;
  preview: PreviewId;
  featured?: boolean;
  flow?: FlowStep[];
}

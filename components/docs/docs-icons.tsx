import {
  Blocks,
  BriefcaseBusiness,
  Component,
  LayoutTemplate,
  Palette,
  PanelsTopLeft,
  Rocket,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { DocsIconKey } from "@/lib/docs-nav";

export const docsIcons: Record<DocsIconKey, LucideIcon> = {
  start: Rocket,
  components: Component,
  templates: LayoutTemplate,
  landings: PanelsTopLeft,
  blocks: Blocks,
  designs: Palette,
  mobile: Smartphone,
  custom: BriefcaseBusiness,
};

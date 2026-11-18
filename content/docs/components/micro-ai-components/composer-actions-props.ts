import { PropRow } from "@/components/mdx/props-table";

export const composerActionsProps: PropRow[] = [
  { name: "primary", type: "ComposerAction[]", description: "Rows above the divider. Defaults to GitHub / Figma / Upload." },
  { name: "secondary", type: "ComposerAction[]", description: "Rows below the divider. Defaults to the settings rows." },
  { name: "onSelect", type: "(id: string) => void", description: "Called when a non-toggle row is chosen." },
  { name: "generateImages", type: "boolean", description: "Controlled state of the “Generate images” switch." },
  { name: "onGenerateImagesChange", type: "(next: boolean) => void", description: "Called when the switch flips." },
  { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open) => void", description: "Menu open state. Defaults to closed." },
  { name: "trigger", type: "ReactNode", description: "Custom trigger. Defaults to a + button that rotates into ×." },
  { name: "className", type: "string", description: "Classes on the menu panel." },
];

export const composerActionProps: PropRow[] = [
  { name: "id", type: "string", description: "Passed to onSelect.", required: true },
  { name: "label", type: "string", description: "Row text.", required: true },
  { name: "icon", type: "IconType", description: "A react-icons component.", required: true },
  { name: "premium", type: "boolean", description: "Shows a Premium pill." },
  { name: "hasSubmenu", type: "boolean", description: "Trailing chevron; the menu stays open on select." },
  { name: "toggle", type: "boolean", description: "Trailing switch instead of a chevron." },
];

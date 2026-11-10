import { PropRow } from "@/components/mdx/props-table";

export const aiModelProps: PropRow[] = [
  {
    name: "id",
    type: "string",
    description: 'Stable unique id, e.g. "claude-sonnet-4-6"',
    required: true,
  },
  {
    name: "name",
    type: "string",
    description: 'Display name, e.g. "Claude Sonnet 4.5"',
    required: true,
  },
  {
    name: "tier",
    type: "ModelTier",
    description: "Section this model is grouped under.",
    required: true,
  },
  {
    name: "icon",
    type: "React.ReactNode",
    description: "Icon renderer, sized by the list row.",
    required: true,
  },
  {
    name: "iconClassName",
    type: "string",
    description: "Icon color, any Tailwind text color class.",
    required: false,
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Disable a specific row (e.g. not available on current plan).",
    required: false,
  },
  {
    name: "description",
    type: "string",
    description: "Optional short description, used as an aria-description.",
    required: false,
  },
];

export const modelPickerProps: PropRow[] = [
  {
    name: "models",
    type: "AIModel[]",
    description: "Full list of selectable models.",
    required: true,
  },
  {
    name: "selectedModelId",
    type: "string | null",
    description: "Currently selected model id (controlled).",
    required: true,
  },
  {
    name: "onSelectModel",
    type: "(model: AIModel) => void",
    description: "Called when the user picks a model.",
    required: true,
  },
  {
    name: "searchPlaceholder",
    type: "string",
    description: "Placeholder text for the search field.",
    required: false,
  },
  {
    name: "searchValue",
    type: "string",
    description: "Controlled search value.",
    required: false,
  },
  {
    name: "onSearchChange",
    type: "(value: string) => void",
    description:
      "Called on search value change (component manages its own state if omitted).",
    required: false,
  },
  {
    name: "sectionLabels",
    type: "Partial<Record<ModelTier, string>>",
    description: "Labels for each section header.",
    required: false,
  },
  {
    name: "className",
    type: "string",
    description: "Extra classes on the outer panel.",
    required: false,
  },
  {
    name: "maxListHeight",
    type: "number | string",
    description: "Max height of the scrollable list area.",
    required: false,
  },
  {
    name: "enableTiltEffect",
    type: "boolean",
    description:
      "Enable the coverflow-style scale/tilt effect on the centered row while scrolling.",
    required: false,
  },
];
import { PropRow } from "@/components/mdx/props-table";

export const installCommandProps: PropRow[] = [
  { name: "commands", type: "Partial<Record<\"npx\" | \"pnpm\" | \"yarn\" | \"bun\" | \"npm\", string>>", description: "Map of package manager to full install command string. Only managers present here appear in the dropdown. \"npm\" is accepted as an alias for \"npx\" — if both are omitted the npx slot falls back to the npm value.", required: true },
  { name: "title", type: "string", description: "Label shown in the terminal header next to the terminal icon.", required: false},
  { name: "defaultManager", type: "\"npx\" | \"pnpm\" | \"yarn\" | \"bun\"", description: "Which package manager is selected on initial render. Falls back to the first available manager (in pnpm, bun, yarn, npx order) if omitted or not present in commands.", required: false },
  { name: "className", type: "string", description: "Additional class names merged onto the outer wrapper div.", required: false},
];
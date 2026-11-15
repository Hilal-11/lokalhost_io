import type { Registry } from "./schema";

/**
 * Web components served to the shadcn CLI from https://localhostui.com/r/<name>.json
 *
 * Rules (the build script enforces the first two):
 *  - `name` is the URL slug: lowercase kebab-case, unique.
 *  - `files[].path` is the real source file; it is installed at the same path.
 *  - `dependencies` must list every npm package the file imports, otherwise the
 *    CLI installs the file but the user's build fails on a missing module.
 *    Files that import `cn` from "@/lib/utils" need clsx + tailwind-merge.
 */
export const component: Registry = [
    {
        name: "download-button",
        type: "registry:component",
        description:
            "Platform-aware download buttons for Mac, Windows and Linux with a smooth hover roll animation and fully swappable colors.",
        dependencies: [],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/buttons/download-button.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "code-preview-block",
        type: "registry:component",
        description:
            "A Preview / Code tabbed container for showcasing live components next to their source.",
        dependencies: ["shiki", "next-themes", "lucide-react", "react-icons", "clsx", "tailwind-merge"],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/code-blocks/component-preview.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "code-block",
        type: "registry:component",
        description:
            "A syntax-highlighted code block with file header, copy button, optional line numbers and light/dark Shiki themes.",
        dependencies: ["shiki", "next-themes", "react-icons", "clsx", "tailwind-merge"],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/code-blocks/code-block.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "install-command",
        type: "registry:component",
        description:
            "A package-manager aware install command with tabs for npm, pnpm, yarn and bun and one-click copy.",
        dependencies: ["shiki", "lucide-react", "react-icons"],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/micro-ai-components/install-command.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "copy-page-markdown",
        type: "registry:component",
        description:
            "A split button that copies the page as Markdown or opens it in ChatGPT, Claude, v0 and more.",
        dependencies: ["react-icons"],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/micro-ai-components/copy-page-markdown.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "model-picker",
        type: "registry:component",
        description:
            "A searchable AI model picker with provider icons, smooth motion and full keyboard navigation.",
        dependencies: ["motion", "lucide-react", "react-icons"],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/micro-ai-components/model-picker.tsx",
                type: "registry:component",
            },
        ],
    },
    {
        name: "models-selector",
        type: "registry:component",
        description:
            "A compact AI model dropdown with sizes, radius presets and optional search.",
        dependencies: ["react-icons"],
        registryDependencies: [],
        files: [
            {
                path: "components/lokalhost_io/micro-ai-components/models-selector.tsx",
                type: "registry:component",
            },
        ],
    },
];

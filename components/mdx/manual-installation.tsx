import { readFile } from "node:fs/promises";
import path from "node:path";
import { InstallationTabs } from "./installation-tabs";

export interface ManualInstallationProps {
  /** e.g. "motion clsx tailwind-merge" */
  dependencies?: string;
  /** Kept for compatibility — the user can now switch package managers in the UI. */
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";
  /** shadcn registry item name (public/r/<name>.json). Enables the CLI tab. */
  registry?: string | null;

  /** Defaults to lib/utils.ts — omit utilsCode to skip this step. */
  utilsFileName?: string | null;
  utilsCode?: string;

  /** Target path shown to the user, e.g. "components/ui/draggable-card.tsx" */
  componentFileName: string;
  /** Inline source. If omitted, the file at `src` (repo-relative) is read at build time. */
  componentCode?: string;
  /** Repo-relative path to read the component source from, keeping docs in sync with the code. */
  src?: string;
  language?: string;
}

async function readSource(file: string) {
  try {
    return await readFile(path.join(process.cwd(), file), "utf8");
  } catch {
    return null;
  }
}

/**
 * Server component: resolves the component source (inline or from disk) and
 * renders the interactive CLI / Manual installation tabs.
 */
export async function ManualInstallation({
  dependencies,
  registry,
  utilsFileName = "lib/utils.ts",
  utilsCode,
  componentFileName,
  componentCode,
  src,
  language = "tsx",
}: ManualInstallationProps) {
  const code =
    (componentCode?.trim() ? componentCode : null) ??
    (await readSource(src ?? componentFileName)) ??
    "// Source not found";

  return (
    <InstallationTabs
      registry={registry}
      dependencies={dependencies}
      utilsFileName={utilsFileName}
      utilsCode={utilsCode}
      componentFileName={componentFileName}
      componentCode={code}
      language={language}
    />
  );
}

export const Installation = ManualInstallation;
export default ManualInstallation;

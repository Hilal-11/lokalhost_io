import type { Framework } from "./types";

/* ------------------------------------------------------------------ */
/* Install command builders for /mobile.                              */
/* Registry namespace: @lokalhost/<slug> (React Native, shadcn CLI).  */
/* Flutter items install through the lokalhost CLI with --flutter.    */
/* ------------------------------------------------------------------ */

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";
export const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

const dlx: Record<PackageManager, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

export function registryName(slug: string, framework: Framework) {
  return framework === "flutter" ? `@lokalhost/flutter/${slug}` : `@lokalhost/${slug}`;
}

export function cliCommand(slug: string, framework: Framework, pm: PackageManager) {
  return framework === "flutter"
    ? `${dlx[pm]} lokalhost@latest add ${slug} --flutter`
    : `${dlx[pm]} shadcn@latest add ${registryName(slug, "react-native")}`;
}

/** Dependency install command for the manual path. */
export function depsCommand(deps: string[], framework: Framework) {
  if (!deps.length) return null;
  return framework === "flutter" ? `flutter pub add ${deps.join(" ")}` : `npx expo install ${deps.join(" ")}`;
}

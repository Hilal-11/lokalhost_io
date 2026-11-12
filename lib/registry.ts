/**
 * Helpers for building shadcn registry install commands shown in the docs.
 * NEXT_PUBLIC_BASE_URL may be set with or without a protocol — normalise it.
 */
const RAW_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "lokalhost.io";

export const REGISTRY_BASE = /^https?:\/\//.test(RAW_BASE)
  ? RAW_BASE.replace(/\/$/, "")
  : `https://${RAW_BASE.replace(/\/$/, "")}`;

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

const runners: Record<PackageManager, string> = {
  npm: "npx shadcn@latest add",
  pnpm: "pnpm dlx shadcn@latest add",
  yarn: "yarn dlx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
};

const installers: Record<PackageManager, string> = {
  npm: "npm i",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

export function registryUrl(name: string) {
  return `${REGISTRY_BASE}/r/${name}.json`;
}

export function registryCommand(name: string, pm: PackageManager = "npm") {
  return `${runners[pm]} ${registryUrl(name)}`;
}

export function installCommand(deps: string, pm: PackageManager = "npm") {
  return `${installers[pm]} ${deps}`;
}

import { SITE_URL } from "@/lib/site";

/**
 * Helpers for building shadcn registry install commands shown in the docs.
 * Defaults to the production domain. NEXT_PUBLIC_BASE_URL overrides it (e.g.
 * http://localhost:3000 while testing the registry locally) and may be set
 * with or without a protocol — normalise it.
 */
const RAW_BASE = process.env.NEXT_PUBLIC_BASE_URL?.trim() || SITE_URL;

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

import { promises as fs } from "node:fs";
import path from "node:path";
import { CATALOG, getItemNeighbours, itemHref, toSummary } from "./catalog";
import { PACKAGE_MANAGERS, cliCommand, depsCommand, registryName, type PackageManager } from "./install";
import type { Framework, MobileItem, MobileItemSummary, PropDef } from "./types";

/* ------------------------------------------------------------------ */
/* Server-only: reads registry/mobile/** and highlights with Shiki at  */
/* build time, so the client never downloads a highlighter.            */
/* ------------------------------------------------------------------ */

const ROOT = path.join(process.cwd(), "registry", "mobile");
const DIR: Record<Framework, string> = { "react-native": "react-native", flutter: "flutter" };

export interface Snippet {
  code: string;
  html: string;
}

export interface CodeFile extends Snippet {
  name: string;
  /** Path inside the user's project. */
  target: string;
  lang: string;
  /** JavaScript variant (React Native only). */
  js?: Snippet & { name: string; target: string };
}

export interface FrameworkDoc {
  framework: Framework;
  registry: string;
  files: CodeFile[];
  usage: Snippet;
  cli: Record<PackageManager, Snippet>;
  deps: Snippet | null;
  dependencies: string[];
  props: PropDef[];
  target: string;
}

export interface ItemDocData {
  item: MobileItemSummary;
  updated: string;
  uses: { title: string; href: string }[];
  neighbours: ReturnType<typeof getItemNeighbours>;
  rn: FrameworkDoc;
  flutter: FrameworkDoc;
}

/* ---------------------------- highlighting --------------------------- */

const htmlCache = new Map<string, string>();

export async function highlight(code: string, lang: string) {
  const key = `${lang}::${code}`;
  const hit = htmlCache.get(key);
  if (hit) return hit;
  const { codeToHtml } = await import("shiki");
  let html: string;
  try {
    html = await codeToHtml(code, { lang, themes: { light: "github-light", dark: "github-dark" }, defaultColor: false });
  } catch {
    html = await codeToHtml(code, { lang: "text", themes: { light: "github-light", dark: "github-dark" }, defaultColor: false });
  }
  htmlCache.set(key, html);
  return html;
}

async function snippet(code: string, lang: string): Promise<Snippet> {
  const trimmed = code.replace(/^\n+|\s+$/g, "");
  return { code: trimmed, html: await highlight(trimmed, lang) };
}

/* ------------------------------ files -------------------------------- */

async function read(framework: Framework, file: string) {
  return fs.readFile(path.join(ROOT, DIR[framework], file), "utf8");
}

/**
 * TS → JS for the React Native "JS" toggle. Sucrase strips types in place,
 * so the author's formatting, comments and JSX survive untouched.
 */
async function toJs(code: string): Promise<string | null> {
  try {
    const { transform } = await import("sucrase");
    const out = transform(code, {
      transforms: ["typescript", "jsx"],
      jsxRuntime: "preserve",
      disableESTransforms: true,
    }).code;
    return out
      .split("\n")
      // removed `type X` specifiers leave "View, }" behind
      .map((l) => l.replace(/\s+$/, "").replace(/,\s+\}/g, " }"))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch {
    return null;
  }
}

/* Demo files mark their minimal usage region with `// usage-start` /
   `// usage-end` (or `{/* usage-start *\/}` inside JSX). Markers never reach the page. */
const MARKER = (k: "start" | "end") => new RegExp(String.raw`^[ \t]*(?:\/\/ usage-${k}|\{\/\* usage-${k} \*\/\})[ \t]*$`, "m");
const ANY_MARKER = /^[ \t]*(?:\/\/ usage-(?:start|end)|\{\/\* usage-(?:start|end) \*\/\})[ \t]*\r?\n/gm;

function splitDemo(demo: string, mainFile: string) {
  const clean = demo.replace(ANY_MARKER, "");
  const start = demo.search(MARKER("start"));
  const end = demo.search(MARKER("end"));
  if (start === -1 || end === -1) return { demo: clean, usage: clean };
  const region = demo.slice(start, end).split("\n").slice(1);
  const indent = Math.min(...region.filter((l) => l.trim()).map((l) => l.match(/^\s*/)![0].length));
  const body = region.map((l) => l.slice(indent)).join("\n").trimEnd();
  const base = mainFile.replace(/\.(tsx?|dart)$/, "");
  // keep imports of the item itself and of other lokalhost files
  const imports = clean
    .split("\n")
    .filter((l) => /^import /.test(l) && (l.includes(base) || l.includes("@/") || l.includes("package:your_app")))
    .join("\n");
  return { demo: clean, usage: imports ? `${imports}\n\n${body}` : body };
}

async function frameworkDoc(item: MobileItem, framework: Framework): Promise<FrameworkDoc> {
  const spec = framework === "flutter" ? item.flutter : item.rn;
  const isRn = framework === "react-native";
  const lang = isRn ? "tsx" : "dart";
  const ext = isRn ? ".tsx" : ".dart";
  const demoName = isRn ? `${item.slug}-demo.tsx` : `${item.slug.replace(/-/g, "_")}_demo.dart`;

  const [mainSrc, demoSrc, themeSrc] = await Promise.all([
    read(framework, spec.file),
    read(framework, `demos/${isRn ? item.slug + ext : item.slug.replace(/-/g, "_") + ext}`),
    read(framework, isRn ? "theme.ts" : "lk_theme.dart"),
  ]);
  const { demo, usage } = splitDemo(demoSrc, spec.file);

  const themeTarget = isRn ? "lib/theme.ts" : "lib/theme/lk_theme.dart";
  const demoTarget = isRn ? `app/${demoName}` : `lib/${demoName}`;

  const raw: { name: string; target: string; code: string; lang: string }[] = [
    { name: demoName, target: demoTarget, code: demo, lang },
    { name: spec.file, target: spec.target, code: mainSrc, lang },
    { name: isRn ? "theme.ts" : "lk_theme.dart", target: themeTarget, code: themeSrc, lang: isRn ? "ts" : "dart" },
  ];

  const files: CodeFile[] = await Promise.all(
    raw.map(async (f) => {
      const s = await snippet(f.code, f.lang);
      const file: CodeFile = { ...s, name: f.name, target: f.target, lang: f.lang };
      if (isRn) {
        const js = await toJs(f.code);
        if (js) {
          const jsName = f.name.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
          const jsTarget = f.target.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js");
          file.js = { ...(await snippet(js, f.lang === "tsx" ? "jsx" : "js")), name: jsName, target: jsTarget };
        }
      }
      return file;
    })
  );

  const cli = Object.fromEntries(
    await Promise.all(PACKAGE_MANAGERS.map(async (pm) => [pm, await snippet(cliCommand(item.slug, framework, pm), "bash")] as const))
  ) as Record<PackageManager, Snippet>;

  const depCmd = depsCommand(spec.dependencies, framework);

  return {
    framework,
    registry: registryName(item.slug, framework),
    files,
    usage: await snippet(usage, lang),
    cli,
    deps: depCmd ? await snippet(depCmd, "bash") : null,
    dependencies: spec.dependencies,
    props: spec.props,
    target: spec.target,
  };
}

export async function getItemDoc(item: MobileItem): Promise<ItemDocData> {
  const [rn, flutter] = await Promise.all([frameworkDoc(item, "react-native"), frameworkDoc(item, "flutter")]);
  const uses = (item.uses ?? [])
    .map((slug) => CATALOG.find((i) => i.slug === slug))
    .filter((i): i is MobileItem => !!i)
    .map((i) => ({ title: i.title, href: itemHref(i) }));
  return { item: toSummary(item), updated: item.updated, uses, neighbours: getItemNeighbours(item), rn, flutter };
}

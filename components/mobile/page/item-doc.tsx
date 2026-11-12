"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Minus, Package, X } from "lucide-react";
import { SiAndroid, SiApple } from "react-icons/si";
import { Globe } from "lucide-react";
import type { FrameworkDoc, ItemDocData } from "@/lib/mobile/docs.server";
import type { Platform, Support } from "@/lib/mobile/types";
import { cn } from "@/lib/utils";
import { DocsToc } from "@/components/docs/docs-toc";
import { PreviewPanel } from "../preview/preview-panel";
import { FRAMEWORK_LABEL, usePrefs } from "../shell/prefs";
import { SnippetBlock } from "../ui/code-block";
import { Installation } from "../ui/install-stepper";
import { FrameworkIcon, Segmented, TagList } from "../ui/primitives";
import { MobilePropsTable } from "../ui/props-table";

/* ------------------------------------------------------------------ */
/* Framework switch — drives code, install, usage, props and deps.    */
/* ------------------------------------------------------------------ */

export function FrameworkSwitch({ className }: { className?: string }) {
  const { framework, set } = usePrefs();
  return (
    <Segmented
      role="radiogroup"
      label="Framework"
      value={framework}
      onChange={(v) => set("framework", v)}
      className={className}
      options={[
        { value: "react-native", label: <><FrameworkIcon framework="react-native" /> React Native</> },
        { value: "flutter", label: <><FrameworkIcon framework="flutter" /> Flutter</> },
      ]}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Copy-as-prompt / markdown                                          */
/* ------------------------------------------------------------------ */

function buildPrompt(data: ItemDocData, doc: FrameworkDoc, lang: "ts" | "js") {
  const fw = FRAMEWORK_LABEL[doc.framework];
  const fence = doc.framework === "flutter" ? "dart" : lang === "js" ? "jsx" : "tsx";
  const files = doc.files
    .slice(1)
    .map((f) => {
      const v = lang === "js" && f.js ? f.js : f;
      return `File: ${v.target}\n\`\`\`${fence}\n${v.code}\n\`\`\``;
    })
    .join("\n\n");
  return [
    `Add the "${data.item.title}" ${data.item.kind} from lokalhost.io to my ${fw} app.`,
    ``,
    `What it is: ${data.item.description}`,
    doc.dependencies.length ? `Install these dependencies first: ${doc.dependencies.join(", ")}.` : `It has no extra dependencies.`,
    `Create the files below exactly, adapting only import paths to my project structure. Then show me how to use it, based on this example:`,
    ``,
    "```" + fence,
    doc.usage.code,
    "```",
    ``,
    files,
  ].join("\n");
}

function buildMarkdown(data: ItemDocData, doc: FrameworkDoc) {
  const fence = doc.framework === "flutter" ? "dart" : "tsx";
  const rows = doc.props.map((p) => `| \`${p.name}\` | \`${p.type.replace(/\|/g, "\\|")}\` | ${p.default ?? "—"} | ${p.description} |`);
  return [
    `# ${data.item.title} (${FRAMEWORK_LABEL[doc.framework]})`,
    ``,
    data.item.description,
    ``,
    `## Installation`,
    ``,
    "```bash",
    doc.cli.npm.code,
    "```",
    ``,
    `## Usage`,
    ``,
    "```" + fence,
    doc.usage.code,
    "```",
    ``,
    `## Props`,
    ``,
    `| Prop | Type | Default | Description |`,
    `| --- | --- | --- | --- |`,
    ...rows,
  ].join("\n");
}

/* ------------------------------------------------------------------ */
/* Body                                                               */
/* ------------------------------------------------------------------ */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-5 mt-14 scroll-mt-24 text-[20px] font-semibold tracking-tight text-lk-fg first:mt-0">
      <a href={`#${id}`} className="lk-focus rounded">
        {children}
      </a>
    </h2>
  );
}

export function ItemBody({ data }: { data: ItemDocData }) {
  const { framework, lang } = usePrefs();
  const doc = framework === "flutter" ? data.flutter : data.rn;

  return (
    <div>
      <h2 id="preview" className="sr-only">
        Preview
      </h2>
      <PreviewPanel
        item={data.item}
        files={doc.files}
        registry={doc.registry}
        framework={framework}
        getPrompt={() => buildPrompt(data, doc, lang)}
        getMarkdown={() => buildMarkdown(data, doc)}
      />

      <H2 id="installation">Installation</H2>
      <Installation key={framework} doc={doc} uses={data.uses} />

      <H2 id="usage">Usage</H2>
      <SnippetBlock snippet={doc.usage} title={doc.files[0].name} maxHeight={420} />

      <H2 id="props">{data.item.kind === "screen" ? "Screen props" : "Props"}</H2>
      <MobilePropsTable props={doc.props} />

      <div className="mt-10">
        <TagList tags={data.item.tags} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Right rail                                                         */
/* ------------------------------------------------------------------ */

const PLATFORM_META: Record<Platform, { label: string; icon: React.ReactNode }> = {
  ios: { label: "iOS", icon: <SiApple size={13} aria-hidden /> },
  android: { label: "Android", icon: <SiAndroid size={13} aria-hidden /> },
  web: { label: "Web", icon: <Globe size={13} aria-hidden /> },
};

function SupportMark({ s }: { s: Support }) {
  if (s === "full") return <Check size={14} className="text-lk-success" aria-label="Supported" />;
  if (s === "partial") return <Minus size={14} className="text-lk-pro" aria-label="Partial support" />;
  return <X size={14} className="text-lk-subtle" aria-label="Not supported" />;
}

function RailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lk-card border border-lk-border p-3.5">
      <h3 className="m-0 mb-2.5 text-[12px] font-medium uppercase tracking-[0.06em] text-lk-subtle">{title}</h3>
      {children}
    </section>
  );
}

export function ItemRail({ data }: { data: ItemDocData }) {
  const { framework } = usePrefs();
  const doc = framework === "flutter" ? data.flutter : data.rn;
  const updated = new Date(data.updated + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="flex flex-col gap-5">
      <DocsToc
        items={[
          { title: "Preview", url: "#preview", depth: 2 },
          { title: "Installation", url: "#installation", depth: 2 },
          { title: "Usage", url: "#usage", depth: 2 },
          { title: data.item.kind === "screen" ? "Screen props" : "Props", url: "#props", depth: 2 },
        ]}
      />

      <RailCard title="Dependencies">
        {doc.dependencies.length ? (
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {doc.dependencies.map((d) => (
              <li key={d} className="flex items-center gap-2 font-mono text-[12px] text-lk-fg">
                <Package size={13} className="shrink-0 text-lk-subtle" aria-hidden />
                <span className="truncate" title={d}>
                  {d}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 text-[12.5px] text-lk-muted">None — only {framework === "flutter" ? "Flutter SDK" : "React Native core"}.</p>
        )}
        {data.uses.length > 0 && (
          <p className="mb-0 mt-2.5 text-[12.5px] text-lk-muted">
            Uses{" "}
            {data.uses.map((u, i) => (
              <span key={u.href}>
                <Link href={u.href} className="lk-focus rounded text-lk-fg hover:underline">
                  {u.title}
                </Link>
                {i < data.uses.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </RailCard>

      <RailCard title="Platforms">
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {(Object.keys(PLATFORM_META) as Platform[]).map((p) => (
            <li key={p} className="flex items-center justify-between text-[13px] text-lk-fg">
              <span className="flex items-center gap-2 text-lk-muted">
                {PLATFORM_META[p].icon}
                {PLATFORM_META[p].label}
              </span>
              <SupportMark s={data.item.platforms[p]} />
            </li>
          ))}
        </ul>
      </RailCard>

      <p className="m-0 flex items-center justify-between text-[12.5px] text-lk-subtle">
        <span>Last updated</span>
        <time dateTime={data.updated} className="text-lk-muted">
          {updated}
        </time>
      </p>
      <a
        href={`https://github.com/Hilal-11/lokalhost.io/tree/main/registry/mobile/${framework}`}
        target="_blank"
        rel="noreferrer"
        className={cn("lk-focus inline-flex w-fit items-center gap-1 rounded text-[12.5px] text-lk-muted hover:text-lk-fg")}
      >
        View source on GitHub <ArrowUpRight size={12} aria-hidden />
      </a>
    </div>
  );
}

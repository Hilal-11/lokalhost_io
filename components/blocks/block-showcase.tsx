"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  CodeXml,
  Download,
  Eye,
  Lock,
  Maximize2,
  Monitor,
  RotateCcw,
  Smartphone,
  SquareArrowOutUpRight,
  Tablet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  blockHref,
  blockKey,
  blockPreviewHref,
  blockRegistryName,
  type BlockEntry,
} from "@/lib/blocks/catalog";
import { InstallChip } from "@/components/mdx/preview";
import { CodeView, CopyButton } from "@/components/mdx/code-view";
import { BlockFrame, type Viewport } from "./block-frame";
import { BlockPaywall } from "./block-paywall";

export interface ShowcaseFile {
  path: string;
  code: string;
  language: string;
}

const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950";
const toolBtn = cn(
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 text-[12.5px] font-medium text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors",
  "hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100",
  ring
);

type Tab = "preview" | "code";

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: React.ReactNode; title?: string }[];
  label: string;
}) {
  const id = React.useId();
  return (
    <div role="tablist" aria-label={label} className="inline-flex h-8 items-center rounded-[10px] border border-neutral-200 bg-neutral-100/80 p-[3px] dark:border-neutral-800 dark:bg-neutral-900">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          title={o.title}
          aria-label={o.title}
          onClick={() => onChange(o.id)}
          className={cn(
            "relative flex h-full items-center gap-1.5 rounded-[7px] px-2.5 text-[12.5px] font-medium transition-colors",
            value === o.id ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
            ring
          )}
        >
          {value === o.id && (
            <motion.span
              layoutId={`${id}-seg`}
              className="absolute inset-0 rounded-[7px] border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:border-neutral-700 dark:bg-neutral-800"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

function DownloadButton({ block, locked, onLocked }: { block: BlockEntry; locked: boolean; onLocked: () => void }) {
  const [state, setState] = React.useState<"idle" | "busy" | "done" | "error">("idle");
  const run = async () => {
    if (locked) return onLocked();
    setState("busy");
    try {
      const res = await fetch(`/api/blocks/download?category=${block.category}&slug=${block.slug}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement("a"), { href: url, download: `${block.slug}.zip` }).click();
      URL.revokeObjectURL(url);
      setState("done");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 1800);
  };
  return (
    <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={run} className={toolBtn} aria-label={locked ? "Download (Pro)" : "Download code"}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex"
        >
          {state === "done" ? (
            <Check className="size-3.5" strokeWidth={2.5} />
          ) : state === "busy" ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700 dark:border-neutral-700 dark:border-t-neutral-200" />
          ) : locked ? (
            <Lock className="size-3.5" />
          ) : (
            <Download className="size-3.5" />
          )}
        </motion.span>
      </AnimatePresence>
      <span className="hidden sm:inline">{state === "error" ? "Failed" : "Download"}</span>
    </motion.button>
  );
}

export interface BlockShowcaseProps {
  block: BlockEntry;
  /** Source files, or null when the viewer can't see this block's code. */
  files: ShowcaseFile[] | null;
  loggedIn: boolean;
  /** "card" inside a category list, "page" for the full single-block view. */
  variant?: "card" | "page";
}

export function BlockShowcase({ block, files, loggedIn, variant = "card" }: BlockShowcaseProps) {
  const reduce = useReducedMotion();
  const [tab, setTab] = React.useState<Tab>("preview");
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  const [reloadKey, setReloadKey] = React.useState(0);
  const [fileIndex, setFileIndex] = React.useState(0);
  const locked = files === null;
  const isPage = variant === "page";
  const file = files?.[Math.min(fileIndex, files.length - 1)];

  return (
    <section id={block.slug} className="scroll-mt-28 font-sans" aria-label={block.title}>
      {/* title row (card variant) */}
      {!isPage && (
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
              <Link href={blockHref(block)} className={cn("hover:underline hover:decoration-neutral-300 hover:underline-offset-4", ring)}>
                {block.title}
              </Link>
              {block.isNew && <span className="rounded-md border border-neutral-300 px-1.5 py-px text-[10.5px] font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">new</span>}
              {block.access === "pro" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-1.5 py-px text-[10.5px] font-medium text-white dark:bg-neutral-100 dark:text-neutral-900">
                  Pro
                </span>
              )}
            </h2>
            <p className="mt-0.5 text-[13.5px] text-neutral-500 dark:text-neutral-400">{block.description}</p>
          </div>
        </div>
      )}

      <div className={cn("overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-950", isPage && "flex h-full flex-col")}>
        {/* toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50/70 px-2.5 py-2 dark:border-neutral-800 dark:bg-neutral-900/40">
          <div className="flex items-center gap-2">
            <Segmented
              label="View"
              value={tab}
              onChange={setTab}
              options={[
                { id: "preview", label: <><Eye className="size-3.5" />Preview</> },
                { id: "code", label: <>{locked ? <Lock className="size-3.5" /> : <CodeXml className="size-3.5" />}Code</> },
              ]}
            />
            <AnimatePresence initial={false}>
              {tab === "preview" && (
                <motion.div
                  initial={{ opacity: 0, x: reduce ? 0 : -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="hidden items-center gap-2 md:flex"
                >
                  <Segmented
                    label="Viewport"
                    value={viewport}
                    onChange={setViewport}
                    options={[
                      { id: "desktop", label: <Monitor className="size-3.5" />, title: "Desktop" },
                      { id: "tablet", label: <Tablet className="size-3.5" />, title: "Tablet (768px)" },
                      { id: "mobile", label: <Smartphone className="size-3.5" />, title: "Mobile (390px)" },
                    ]}
                  />
                  <button type="button" onClick={() => setReloadKey((k) => k + 1)} className={cn(toolBtn, "group w-8 px-0")} aria-label="Reload preview" title="Reload preview">
                    <RotateCcw className="size-3.5 transition-transform duration-500 group-hover:-rotate-180" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5">
            {block.access === "free" && <InstallChip name={blockRegistryName(block)} />}
            <DownloadButton block={block} locked={locked} onLocked={() => setTab("code")} />
            {!isPage && (
              <Link href={blockHref(block)} className={cn(toolBtn, "w-8 px-0")} aria-label="Open full view" title="Open full view">
                <Maximize2 className="size-3.5" />
              </Link>
            )}
            <a href={blockPreviewHref(block)} target="_blank" rel="noopener noreferrer" className={cn(toolBtn, "w-8 px-0")} aria-label="Open preview in a new tab" title="Open in new tab">
              <SquareArrowOutUpRight className="size-3.5" />
            </a>
          </div>
        </div>

        {/* body */}
        <div className={cn("relative", isPage && "min-h-0 flex-1")}>
          <AnimatePresence mode="wait" initial={false}>
            {tab === "preview" ? (
              <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.18 }} className={cn(isPage && "h-full")}>
                <BlockFrame
                  src={blockPreviewHref(block)}
                  id={blockKey(block)}
                  title={`${block.title} preview`}
                  viewport={viewport}
                  initialHeight={block.height ?? 720}
                  reloadKey={reloadKey}
                />
              </motion.div>
            ) : locked ? (
              <motion.div key="paywall" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.18 }}>
                <BlockPaywall loggedIn={loggedIn} returnTo={blockHref(block)} />
              </motion.div>
            ) : (
              <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.1 } }} transition={{ duration: 0.18 }} className="flex flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
                  <div className="flex min-w-0 flex-wrap items-center gap-1" role="tablist" aria-label="Files">
                    {files.map((f, i) => (
                      <button
                        key={f.path}
                        type="button"
                        role="tab"
                        aria-selected={i === fileIndex}
                        onClick={() => setFileIndex(i)}
                        className={cn(
                          "h-7 max-w-[260px] truncate rounded-md px-2 font-mono text-[11.5px] transition-colors",
                          i === fileIndex ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
                          ring
                        )}
                        title={f.path}
                      >
                        {f.path.split("/").pop()}
                      </button>
                    ))}
                  </div>
                  {file && <CopyButton text={file.code} />}
                </div>
                {(block.dependencies?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200 px-3 py-2 text-[12px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <span>Dependencies</span>
                    {block.dependencies!.map((d) => (
                      <code key={d} className="rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-px font-mono text-[11px] text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                        {d}
                      </code>
                    ))}
                    <CopyButton text={`npm i ${block.dependencies!.join(" ")}`} label="Copy install command" className="ml-auto" />
                  </div>
                )}
                {file && <CodeView code={file.code} language={file.language} collapsible={!isPage} collapsedHeight={520} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

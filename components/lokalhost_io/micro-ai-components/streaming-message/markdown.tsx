"use client";

import * as React from "react";
import ReactMarkdown, { type Components, type Options } from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Incomplete-markdown repair                                         */
/* ------------------------------------------------------------------ */

/**
 * Makes a partial markdown string safe to render mid-stream:
 *  - unclosed ``` fences are closed (renders as an open code block)
 *  - dangling `**`, `*`, `_`, `` ` `` and `~~` are closed or trimmed so raw markers never flash
 */
export function repairMarkdown(input: string): string {
  let text = input;
  const fenceCount = (text.match(/^\s*```/gm) ?? []).length;
  if (fenceCount % 2 === 1) return text.endsWith("\n") ? `${text}\`\`\`` : `${text}\n\`\`\``;

  // only look at the prose after the last fence
  const lastFence = text.lastIndexOf("```");
  const head = lastFence >= 0 ? text.slice(0, lastFence + 3) : "";
  let tail = lastFence >= 0 ? text.slice(lastFence + 3) : text;

  // a half-typed citation marker like "[1" or "[1, 3"
  tail = tail.replace(/\s?\[[\d,\s]*$/, "");

  // a trailing half-typed marker with nothing after it: drop it
  tail = tail.replace(/(\*{1,3}|_{1,3}|~{1,2}|`)\s*$/, (m, marker: string, offset: number, full: string) => {
    const before = full.slice(0, offset);
    const count = before.split(marker).length - 1;
    return count % 2 === 0 ? "" : m;
  });

  const closers: string[] = [];
  const strip = tail.replace(/`[^`]*`/g, "");
  if ((tail.match(/`/g) ?? []).length % 2 === 1) closers.push("`");
  if ((strip.match(/\*\*/g) ?? []).length % 2 === 1) closers.push("**");
  const singles = strip.replace(/\*\*/g, "").replace(/^\s*[*-]\s/gm, "");
  if ((singles.match(/\*/g) ?? []).length % 2 === 1) closers.push("*");
  if ((strip.match(/~~/g) ?? []).length % 2 === 1) closers.push("~~");

  text = head + tail;
  return closers.length ? text.trimEnd() + closers.reverse().join("") : text;
}

/** Splits markdown into top-level blocks on blank lines, never inside a code fence. */
export function splitBlocks(markdown: string): string[] {
  const lines = markdown.split("\n");
  const blocks: string[] = [];
  let current: string[] = [];
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && line.trim() === "" && current.length) {
      blocks.push(current.join("\n"));
      current = [];
      continue;
    }
    if (!inFence && line.trim() === "" && !current.length) continue;
    current.push(line);
  }
  if (current.length) blocks.push(current.join("\n"));
  return blocks;
}

/* ------------------------------------------------------------------ */
/* Rehype plugins: word spans + caret                                 */
/* ------------------------------------------------------------------ */

interface HNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HNode[];
}

const SKIP = new Set(["code", "pre", "svg"]);

function rehypeWords() {
  return (tree: HNode) => {
    const walk = (node: HNode) => {
      if (!node.children) return;
      if (node.type === "element" && node.tagName && SKIP.has(node.tagName)) return;
      const next: HNode[] = [];
      for (const child of node.children) {
        if (child.type === "text" && child.value) {
          for (const part of child.value.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) next.push({ type: "text", value: part });
            else next.push({ type: "element", tagName: "span", properties: { className: ["lk-w"] }, children: [{ type: "text", value: part }] });
          }
        } else {
          walk(child);
          next.push(child);
        }
      }
      node.children = next;
    };
    walk(tree);
  };
}

const CARET: HNode = { type: "element", tagName: "span", properties: { className: ["lk-caret"], ariaHidden: "true" }, children: [] };

function rehypeCaret() {
  return (tree: HNode) => {
    let target: HNode = tree;
    // descend into the last element child (list item, paragraph, code …)
    for (;;) {
      const kids = (target.children ?? []).filter((c) => c.type === "element" || (c.type === "text" && c.value?.trim()));
      const last = kids[kids.length - 1];
      if (!last || last.type !== "element" || last.tagName === "span" || last.tagName === "br" || last.tagName === "hr") break;
      if (last.tagName === "table" || last.tagName === "citation" || last.tagName === "img") break;
      target = last;
    }
    target.children = [...(target.children ?? []), { ...CARET }];
  };
}

/* ------------------------------------------------------------------ */
/* Styles                                                             */
/* ------------------------------------------------------------------ */

const MD_CSS = `
@keyframes lk-w-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes lk-w-blur { from { opacity: 0; filter: blur(4px); } to { opacity: 1; filter: blur(0); } }
@keyframes lk-caret-blink { 0%, 45% { opacity: 1; } 50%, 95% { opacity: 0; } 100% { opacity: 1; } }
.lk-md[data-anim="fade"] .lk-w { animation: lk-w-fade 220ms cubic-bezier(0.22,1,0.36,1) both; }
.lk-md[data-anim="blur"] .lk-w { animation: lk-w-blur 220ms cubic-bezier(0.22,1,0.36,1) both; }
.lk-md .lk-caret::after {
  content: "▍"; display: inline-block; margin-left: 1px; line-height: 1;
  color: var(--foreground); animation: lk-caret-blink 1s steps(1) infinite;
  transition: opacity 200ms ease;
}
.lk-md[data-caret="out"] .lk-caret::after { opacity: 0; animation: none; }
.lk-md-code pre { margin: 0; background: transparent !important; }
.lk-md-code .shiki span { color: var(--shiki-light); }
.dark .lk-md-code .shiki span { color: var(--shiki-dark); }
@media (prefers-reduced-motion: reduce) {
  .lk-md .lk-w { animation: none !important; }
  .lk-md .lk-caret::after { animation: none; }
}
`;

/* ------------------------------------------------------------------ */
/* Code block (lazy Shiki)                                            */
/* ------------------------------------------------------------------ */

const highlightCache = new Map<string, string>();

async function highlight(code: string, lang: string): Promise<string> {
  const key = `${lang}::${code}`;
  const hit = highlightCache.get(key);
  if (hit) return hit;
  const { codeToHtml } = await import("shiki");
  const opts = { themes: { light: "github-light", dark: "github-dark" }, defaultColor: false } as const;
  const html = await codeToHtml(code, { lang, ...opts }).catch(() => codeToHtml(code, { lang: "text", ...opts }));
  highlightCache.set(key, html);
  return html;
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

export function CopyIconButton({ text, className, label = "Copy code" }: { text: string; className?: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <motion.button
      type="button"
      onClick={onCopy}
      whileTap={{ scale: 0.92 }}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "relative flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0.5, rotate: -15, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.16 }}>
            <Check className="size-3.5" strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.16 }}>
            <Copy className="size-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">{copied ? "Copied to clipboard" : ""}</span>
    </motion.button>
  );
}

function CodeBlock({ language, code, raw, active }: { language: string; code: string; raw: React.ReactNode; active: boolean }) {
  const [html, setHtml] = React.useState<string | null>(() => highlightCache.get(`${language}::${code}`) ?? null);

  React.useEffect(() => {
    if (active) return; // keep plain text (with caret) while the fence is still streaming
    let cancelled = false;
    highlight(code, language).then((h) => !cancelled && setHtml(h));
    return () => {
      cancelled = true;
    };
  }, [code, language, active]);

  return (
    <div className="lk-md-code not-prose my-4 overflow-hidden rounded-xl border border-border bg-muted/40 shadow-sm">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-9 items-center justify-between border-b border-border bg-background/60 pl-3.5 pr-1"
      >
        <span className="font-mono text-[11.5px] lowercase tracking-wide text-muted-foreground">{language || "text"}</span>
        <CopyIconButton text={code} />
      </motion.div>
      <div className="overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.7]">
        {html && !active ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="m-0 text-foreground/90">
            <code>{raw}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Markdown element styles                                            */
/* ------------------------------------------------------------------ */

/** Whether the block being rendered is still streaming (read by the code block renderer). */
const ActiveBlock = React.createContext(false);

function PreRenderer({ children }: { children?: React.ReactNode }) {
  const active = React.useContext(ActiveBlock);
  const child = React.Children.toArray(children)[0];
  const props = React.isValidElement<{ className?: string; children?: React.ReactNode }>(child) ? child.props : {};
  const language = /language-([\w-]+)/.exec(props.className ?? "")?.[1] ?? "";
  const raw = props.children;
  return <CodeBlock language={language} code={textOf(raw).replace(/\n$/, "")} raw={raw} active={active} />;
}

// One stable map for every block: if renderer identities changed when a block
// finished, React would remount it and replay the word animations.
function makeComponents(): Components {
  return {
    h1: ({ node: _n, ...p }) => <h1 className="mb-3 mt-6 text-xl font-semibold tracking-tight text-foreground first:mt-0" {...p} />,
    h2: ({ node: _n, ...p }) => <h2 className="mb-2.5 mt-6 text-lg font-semibold tracking-tight text-foreground first:mt-0" {...p} />,
    h3: ({ node: _n, ...p }) => <h3 className="mb-2 mt-5 text-[15px] font-semibold text-foreground first:mt-0" {...p} />,
    p: ({ node: _n, ...p }) => <p className="my-3 leading-7 first:mt-0 last:mb-0" {...p} />,
    ul: ({ node: _n, ...p }) => <ul className="my-3 ml-5 list-disc space-y-1.5 marker:text-muted-foreground/60" {...p} />,
    ol: ({ node: _n, ...p }) => <ol className="my-3 ml-5 list-decimal space-y-1.5 marker:text-muted-foreground" {...p} />,
    li: ({ node: _n, ...p }) => <li className="pl-1 leading-7" {...p} />,
    strong: ({ node: _n, ...p }) => <strong className="font-semibold text-foreground" {...p} />,
    a: ({ node: _n, ...p }) => (
      <a className="font-medium text-foreground underline decoration-foreground/30 underline-offset-[3px] transition-colors hover:decoration-foreground" target="_blank" rel="noopener noreferrer" {...p} />
    ),
    blockquote: ({ node: _n, ...p }) => <blockquote className="my-3 border-l-2 border-border pl-4 text-muted-foreground" {...p} />,
    hr: () => <hr className="my-6 border-border" />,
    table: ({ node: _n, ...p }) => (
      <div className="my-4 w-full overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-[13px]" {...p} />
      </div>
    ),
    thead: ({ node: _n, ...p }) => <thead className="bg-muted/50" {...p} />,
    th: ({ node: _n, ...p }) => <th className="border-b border-border px-3 py-2 text-left font-medium text-foreground" {...p} />,
    td: ({ node: _n, ...p }) => <td className="border-b border-border px-3 py-2 align-top text-foreground/90 [tr:last-child_&]:border-0" {...p} />,
    code: ({ node: _n, className, ...p }) => (
      <code className={cn("rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground", className)} {...p} />
    ),
    pre: ({ children }) => <PreRenderer>{children}</PreRenderer>,
  };
}

const COMPONENTS = makeComponents();

/* ------------------------------------------------------------------ */
/* Blocks                                                             */
/* ------------------------------------------------------------------ */

type Plugins = NonNullable<Options["rehypePlugins"]>;
const REMARK: NonNullable<Options["remarkPlugins"]> = [remarkGfm];

interface BlockProps {
  content: string;
  active: boolean;
  words: boolean;
  caret: boolean;
  remarkPlugins?: Options["remarkPlugins"];
  components?: Components;
}

const Block = React.memo(
  function Block({ content, active, words, caret, remarkPlugins, components }: BlockProps) {
    const rehypePlugins = React.useMemo(() => {
      const list: unknown[] = [];
      if (words) list.push(rehypeWords);
      if (caret) list.push(rehypeCaret);
      return list as Plugins;
    }, [words, caret]);
    const comps = React.useMemo(() => (components ? { ...COMPONENTS, ...components } : COMPONENTS), [components]);
    return (
      <ActiveBlock.Provider value={active}>
        <ReactMarkdown remarkPlugins={remarkPlugins ?? REMARK} rehypePlugins={rehypePlugins} components={comps}>
          {active ? repairMarkdown(content) : content}
        </ReactMarkdown>
      </ActiveBlock.Provider>
    );
  },
  (a, b) =>
    a.content === b.content &&
    a.active === b.active &&
    a.words === b.words &&
    a.caret === b.caret &&
    a.components === b.components &&
    a.remarkPlugins === b.remarkPlugins
);

export type StreamAnimation = "fade" | "blur" | "none";

export interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Markdown source. May be partial while streaming. */
  content: string;
  /** True while tokens are still arriving. */
  streaming?: boolean;
  /** Per-word enter animation. Defaults to "fade". */
  animation?: StreamAnimation;
  /** Show the blinking caret while streaming. Defaults to true. */
  caret?: boolean;
  /** Extra remark plugins (e.g. remarkCitations). remark-gfm is always included. */
  remarkPlugins?: Options["remarkPlugins"];
  /** Override or add element renderers. Keep the object stable (memoize it). */
  components?: Components;
}

/**
 * Streaming-safe markdown. Content is split into blocks; completed blocks are
 * memoized and never re-parsed — only the last (active) block re-renders per token.
 */
export function Markdown({
  content,
  streaming = false,
  animation = "fade",
  caret = true,
  remarkPlugins,
  components,
  className,
  ...props
}: MarkdownProps) {
  const blocks = React.useMemo(() => splitBlocks(content), [content]);
  const plugins = React.useMemo(
    () => (remarkPlugins ? [remarkGfm, ...remarkPlugins] : REMARK) as NonNullable<Options["remarkPlugins"]>,
    [remarkPlugins]
  );

  // keep the caret for one beat after streaming ends so it can fade out
  const [caretOut, setCaretOut] = React.useState(false);
  const wasStreaming = React.useRef(streaming);
  React.useEffect(() => {
    if (wasStreaming.current && !streaming) {
      setCaretOut(true);
      const t = window.setTimeout(() => setCaretOut(false), 220);
      wasStreaming.current = streaming;
      return () => window.clearTimeout(t);
    }
    wasStreaming.current = streaming;
  }, [streaming]);

  const words = streaming && animation !== "none";
  const showCaret = caret && (streaming || caretOut);

  return (
    <div
      className={cn("lk-md text-[14px] leading-7 text-foreground/90 [overflow-wrap:anywhere]", className)}
      data-anim={words ? animation : undefined}
      data-caret={caretOut ? "out" : undefined}
      {...props}
    >
      <style href="lk-md" precedence="default">
        {MD_CSS}
      </style>
      {blocks.length === 0 && showCaret ? (
        <p className="my-0 leading-7">
          <span className="lk-caret" aria-hidden />
        </p>
      ) : (
        blocks.map((block, i) => {
          const isLast = i === blocks.length - 1;
          return (
            <Block
              key={i}
              content={block}
              active={streaming && isLast}
              words={words}
              caret={showCaret && isLast}
              remarkPlugins={plugins}
              components={components}
            />
          );
        })
      )}
    </div>
  );
}

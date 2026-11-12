"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shiki — highlighted once with light + dark themes. Colors switch   */
/* through CSS variables (see .lk-code in globals.css), so toggling   */
/* the theme never re-highlights or flickers.                         */
/* ------------------------------------------------------------------ */

const cache = new Map<string, string>();

async function highlight(code: string, lang: string) {
  const key = `${lang}::${code}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const { codeToHtml } = await import("shiki");
  let html: string;
  try {
    html = await codeToHtml(code, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    });
  } catch {
    html = await codeToHtml(code, {
      lang: "text",
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    });
  }
  cache.set(key, html);
  return html;
}

export function useHighlighted(code: string, lang: string) {
  const [html, setHtml] = useState<string | null>(() => cache.get(`${lang}::${code}`) ?? null);
  useEffect(() => {
    let alive = true;
    highlight(code, lang).then((h) => alive && setHtml(h));
    return () => {
      alive = false;
    };
  }, [code, lang]);
  return html;
}

/* ------------------------------------------------------------------ */
/* CopyButton                                                         */
/* ------------------------------------------------------------------ */

export async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;left:-9999px;top:-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  className,
  label = "Copy code",
}: {
  text: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (await copyText(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied!" : label}
      className={cn(
        "relative inline-flex size-7 shrink-0 items-center justify-center rounded-md",
        "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
        "hover:bg-neutral-200/70 dark:hover:bg-neutral-800",
        "transition-colors active:scale-90 transition-transform",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={14} strokeWidth={2.5} className="text-emerald-500" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Copy size={14} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* CodeView — highlighted code with optional line numbers and a       */
/* collapsible max height ("Expand code").                            */
/* ------------------------------------------------------------------ */

export function CodeView({
  code,
  language = "tsx",
  lineNumbers = true,
  collapsible = false,
  collapsedHeight = 360,
  className,
}: {
  code: string;
  language?: string;
  lineNumbers?: boolean;
  collapsible?: boolean;
  collapsedHeight?: number;
  className?: string;
}) {
  const trimmed = code.replace(/^\n+|\s+$/g, "");
  const html = useHighlighted(trimmed, language);
  const lineCount = trimmed.split("\n").length;
  const canCollapse = collapsible && lineCount > Math.floor(collapsedHeight / 22);
  const [expanded, setExpanded] = useState(false);
  const collapsed = canCollapse && !expanded;

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "lk-code overflow-auto text-[13px] leading-[1.7]",
          collapsed && "overflow-hidden"
        )}
        data-line-numbers={lineNumbers ? "" : undefined}
        style={collapsed ? { maxHeight: collapsedHeight } : undefined}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="shiki">
            <code>
              {trimmed.split("\n").map((line, i) => (
                <span key={i} className="line">
                  {line || " "}
                  {"\n"}
                </span>
              ))}
            </code>
          </pre>
        )}
      </div>

      {canCollapse && (
        <div
          className={cn(
            "flex justify-center",
            collapsed
              ? "absolute inset-x-0 bottom-0 h-28 items-end pb-4 bg-gradient-to-t from-neutral-50 via-neutral-50/85 to-transparent dark:from-neutral-950 dark:via-neutral-950/85"
              : "pb-4 pt-1"
          )}
        >
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:-translate-y-px hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {collapsed ? "Expand code" : "Collapse code"}
            <ChevronDown
              size={13}
              className={cn("transition-transform duration-200", !collapsed && "rotate-180")}
            />
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BiLogoJavascript, BiLogoTypescript } from "react-icons/bi";
import { PiCheckBold, PiCopy, PiFileCode, PiTerminal } from "react-icons/pi";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export interface CodeBlockProps {
  code: string;
  fileName?: string;
  language?: string;
  showLineNumbers?: boolean;
  /** Shiki theme for light mode, e.g. "github-light". */
  lightTheme?: string;
  /** Shiki theme for dark mode, e.g. "github-dark". */
  darkTheme?: string;

  // layout
  width?: string | number;
  height?: string | number;
  /** Max height of the code area before it scrolls (ignored when height is fixed). */
  maxHeight?: string | number;
  borderRadius?: string | number;

  // colors (override the neutral defaults)
  bgColor?: string;
  darkBgColor?: string;
  borderColor?: string;
  darkBorderColor?: string;
  headerBgColor?: string;
  darkHeaderBgColor?: string;

  /** Hide the language chip in the header. */
  hideLanguage?: boolean;
  /** Called after a successful copy. */
  onCopy?: (code: string) => void;
  className?: string;
}

const toCss = (v: string | number | undefined) => (typeof v === "number" ? `${v}px` : v);

/* Scoped styles: dual-theme colors via CSS variables + line numbers. */
const CODE_BLOCK_CSS = `
.lkcb pre { margin:0; padding:1rem 0; background:transparent !important; min-width:max-content; }
.lkcb code { display:block; counter-reset:lkcb-line; }
.lkcb .line { display:inline-block; width:100%; padding:0 1.125rem; }
.lkcb pre span { color:var(--shiki-light); }
.dark .lkcb pre span { color:var(--shiki-dark); }
.lkcb[data-ln] .line { padding-left:.5rem; }
.lkcb[data-ln] .line::before {
  counter-increment:lkcb-line; content:counter(lkcb-line);
  display:inline-block; width:2rem; margin-right:1.125rem; text-align:right;
  color:#a3a3a3; opacity:.65; user-select:none; font-variant-numeric: tabular-nums;
}
.dark .lkcb[data-ln] .line::before { color:#525252; }
`;

function LanguageIcon({ language }: { language: string }) {
  const lang = language.toLowerCase();
  const cls = "shrink-0 text-neutral-500 dark:text-neutral-400";
  if (lang === "ts" || lang === "tsx" || lang === "typescript") return <BiLogoTypescript size={17} className={cls} />;
  if (lang === "js" || lang === "jsx" || lang === "javascript") return <BiLogoJavascript size={17} className={cls} />;
  if (["bash", "sh", "shell", "zsh"].includes(lang)) return <PiTerminal size={16} className={cls} />;
  return <PiFileCode size={16} className={cls} />;
}

function CopyButton({ code, onCopy }: { code: string; onCopy?: (code: string) => void }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.(code);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      whileTap={{ scale: 0.92 }}
      aria-label={copied ? "Copied" : "Copy code"}
      title={copied ? "Copied!" : "Copy code"}
      className={cn(
        "relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors",
        "hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
        "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600"
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ scale: 0.5, rotate: copied ? -15 : 0, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {copied ? <PiCheckBold size={15} className="text-neutral-900 dark:text-neutral-100" /> : <PiCopy size={15} />}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </motion.button>
  );
}

function CodeBlock({
  code,
  fileName = "app/api/mcp/route.ts",
  language = "tsx",
  showLineNumbers = false,
  lightTheme = "github-light",
  darkTheme = "github-dark",
  width = "100%",
  height = "auto",
  maxHeight = 480,
  borderRadius = 12,
  bgColor,
  darkBgColor,
  borderColor,
  darkBorderColor,
  headerBgColor,
  darkHeaderBgColor,
  hideLanguage = false,
  onCopy,
  className,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // only trust the theme after mount — avoids hydration mismatches for color overrides
  const isDark = mounted && resolvedTheme === "dark";
  const fixedHeight = height !== "auto" && height !== undefined;

  const containerStyle: CSSProperties = {
    width: toCss(width),
    maxWidth: "100%",
    height: toCss(height),
    borderRadius: toCss(borderRadius),
    backgroundColor: isDark ? darkBgColor ?? bgColor : bgColor,
    borderColor: isDark ? darkBorderColor ?? borderColor : borderColor,
  };
  const headerStyle: CSSProperties = {
    backgroundColor: isDark ? darkHeaderBgColor ?? headerBgColor : headerBgColor,
    borderColor: isDark ? darkBorderColor ?? borderColor : borderColor,
  };

  return (
    <div className="flex w-full items-center justify-center">
      <style href="lk-code-block" precedence="default">
        {CODE_BLOCK_CSS}
      </style>
      <div
        style={containerStyle}
        className={cn(
          "flex flex-col overflow-hidden border font-sans",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
          !bgColor && "bg-neutral-50/70",
          !darkBgColor && "dark:bg-neutral-950",
          !borderColor && "border-neutral-200",
          !darkBorderColor && "dark:border-neutral-800",
          className
        )}
      >
        {/* Header */}
        <div
          style={headerStyle}
          className={cn(
            "flex h-11 w-full shrink-0 items-center justify-between gap-3 border-b pl-3.5 pr-1.5",
            !headerBgColor && "bg-white",
            !darkHeaderBgColor && "dark:bg-neutral-900/50",
            !borderColor && "border-neutral-200",
            !darkBorderColor && "dark:border-neutral-800"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <LanguageIcon language={language} />
            <p className="truncate font-mono text-[12.5px] text-neutral-600 dark:text-neutral-400">{fileName}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {!hideLanguage && (
              <span className="rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10.5px] lowercase text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                {language}
              </span>
            )}
            <CopyButton code={code} onCopy={onCopy} />
          </div>
        </div>

        {/* Code */}
        <div
          className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]"
          style={fixedHeight ? undefined : { maxHeight: toCss(maxHeight) }}
          tabIndex={0}
          aria-label={`${fileName} source`}
        >
          <CodeHighlight code={code} language={language} lightTheme={lightTheme} darkTheme={darkTheme} showLineNumbers={showLineNumbers} />
        </div>
      </div>
    </div>
  );
}

const htmlCache = new Map<string, string>();

function CodeHighlight({
  code,
  language = "tsx",
  lightTheme,
  darkTheme,
  showLineNumbers,
}: {
  code: string;
  language?: string;
  lightTheme: string;
  darkTheme: string;
  showLineNumbers: boolean;
}) {
  const key = `${language}|${lightTheme}|${darkTheme}|${code}`;
  const [html, setHtml] = useState<string | null>(() => htmlCache.get(key) ?? null);

  useEffect(() => {
    let cancelled = false;
    const hit = htmlCache.get(key);
    if (hit) {
      setHtml(hit);
      return;
    }
    // Lazy-load Shiki and highlight once with both themes; CSS variables switch colors.
    import("shiki").then(({ codeToHtml }) => {
      const opts = { themes: { light: lightTheme, dark: darkTheme }, defaultColor: false } as const;
      codeToHtml(code, { lang: language, ...opts })
        .catch(() => codeToHtml(code, { lang: "text", ...opts }))
        .then((h) => {
          htmlCache.set(key, h);
          if (!cancelled) setHtml(h);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [key, code, language, lightTheme, darkTheme]);

  const sharedClass = "lkcb text-[12.5px] leading-[1.75] [&_pre]:font-[inherit]";
  const fontStyle: CSSProperties = { fontFamily: "var(--font-geist-mono), 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace" };

  if (!html) {
    return (
      <div className={sharedClass} style={fontStyle} data-ln={showLineNumbers ? "" : undefined}>
        <pre className="text-neutral-700 dark:text-neutral-300">
          <code>
            {code.split("\n").map((line, i) => (
              <span key={i} className="line">
                {line || " "}
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={sharedClass}
      style={fontStyle}
      data-ln={showLineNumbers ? "" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default CodeBlock;

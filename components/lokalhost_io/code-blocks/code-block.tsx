"use client";

import React, { useEffect, useState, type CSSProperties } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
import { BiLogoTypescript, BiLogoJavascript } from "react-icons/bi";
import { PiCopyDuotone, PiFileCodeDuotone, PiTerminalDuotone } from "react-icons/pi";
import { codeToHtml } from "shiki";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  fileName?: string;
  language?: string;
  showLineNumbers?: boolean;
  lightTheme?: string; // e.g. "github-light"
  darkTheme?: string; // e.g. "github-dark"

  // layout
  width?: string | number; // e.g. 600, "100%", "40rem"
  height?: string | number; // e.g. 400, "auto"
  /** Max height of the code area before it scrolls (ignored when height is fixed). */
  maxHeight?: string | number;
  borderRadius?: string | number; // e.g. 8, "0.5rem", "9999px"

  // colors (override the neutral defaults)
  bgColor?: string; // light mode background
  darkBgColor?: string; // dark mode background
  borderColor?: string; // light mode border
  darkBorderColor?: string; // dark mode border
  headerBgColor?: string; // optional separate header bg (defaults to bgColor)
  darkHeaderBgColor?: string;

  className?: string; // escape hatch for anything else
}

const toCss = (v: string | number | undefined) => (typeof v === "number" ? `${v}px` : v);

/* Scoped styles: dual-theme colors via CSS variables + line numbers. */
const CODE_BLOCK_CSS = `
.lkcb pre { margin:0; padding:1rem 0; background:transparent !important; min-width:max-content; }
.lkcb code { display:block; counter-reset:lkcb-line; }
.lkcb .line { display:inline-block; width:100%; padding:0 1rem; }
.lkcb pre span { color:var(--shiki-light); }
.dark .lkcb pre span { color:var(--shiki-dark); }
.lkcb[data-ln] .line { padding-left:.5rem; }
.lkcb[data-ln] .line::before {
  counter-increment:lkcb-line; content:counter(lkcb-line);
  display:inline-block; width:2rem; margin-right:1rem; text-align:right;
  color:#a3a3a3; opacity:.7; user-select:none;
}
.dark .lkcb[data-ln] .line::before { color:#525252; }
`;

function LanguageIcon({ language }: { language: string }) {
  const lang = language.toLowerCase();
  if (lang === "ts" || lang === "tsx" || lang === "typescript")
    return <BiLogoTypescript size={18} className="text-[#3178c6]" />;
  if (lang === "js" || lang === "jsx" || lang === "javascript")
    return <BiLogoJavascript size={18} className="text-[#e5c42b]" />;
  if (lang === "bash" || lang === "sh" || lang === "shell" || lang === "zsh")
    return <PiTerminalDuotone size={17} className="text-neutral-500" />;
  return <PiFileCodeDuotone size={17} className="text-neutral-500" />;
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

  className,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);
  // only trust the theme after mount — avoids hydration mismatches for color overrides
  const isDark = mounted && resolvedTheme === "dark";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

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
      <style>{CODE_BLOCK_CSS}</style>
      <div
        style={containerStyle}
        className={cn(
          "flex flex-col overflow-hidden border shadow-sm",
          !bgColor && "bg-neutral-50",
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
            "flex h-11 w-full shrink-0 items-center justify-between border-b px-3",
            !headerBgColor && "bg-white",
            !darkHeaderBgColor && "dark:bg-neutral-900/60",
            !borderColor && "border-neutral-200",
            !darkBorderColor && "dark:border-neutral-800"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <LanguageIcon language={language} />
            <p className="truncate font-mono text-[12.5px] text-neutral-600 dark:text-neutral-400">{fileName}</p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
            title={copied ? "Copied!" : "Copy code"}
            className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-all hover:bg-neutral-200/70 hover:text-neutral-900 active:scale-90 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <IoCheckmarkOutline
              size={16}
              className={cn("absolute text-emerald-500 transition-all duration-200", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")}
            />
            <PiCopyDuotone
              size={16}
              className={cn("absolute transition-all duration-200", copied ? "scale-50 opacity-0" : "scale-100 opacity-100")}
            />
          </button>
        </div>

        {/* Code */}
        <div className="min-h-0 flex-1 overflow-auto" style={fixedHeight ? undefined : { maxHeight: toCss(maxHeight) }}>
          <CodeHighlight
            code={code}
            language={language}
            lightTheme={lightTheme}
            darkTheme={darkTheme}
            showLineNumbers={showLineNumbers}
          />
        </div>
      </div>
    </div>
  );
}

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
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Highlight once with both themes; CSS variables switch colors on theme change.
    codeToHtml(code, {
      lang: language,
      themes: { light: lightTheme, dark: darkTheme },
      defaultColor: false,
    })
      .catch(() =>
        codeToHtml(code, { lang: "text", themes: { light: lightTheme, dark: darkTheme }, defaultColor: false })
      )
      .then((h) => {
        if (!cancelled) setHtml(h);
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, lightTheme, darkTheme]);

  const sharedClass = "lkcb text-[12.5px] leading-[1.7] [&_pre]:font-[inherit]";
  const fontStyle: CSSProperties = { fontFamily: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace" };

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
    <div
      className={sharedClass}
      style={fontStyle}
      data-ln={showLineNumbers ? "" : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default CodeBlock;

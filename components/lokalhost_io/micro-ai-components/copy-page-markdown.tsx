"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IoCopyOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { HiArrowUpRight } from "react-icons/hi2";
import { VscOpenai } from "react-icons/vsc";
import { BsAnthropic } from "react-icons/bs";
import { ImGithub } from "react-icons/im";
import { SiV0 } from "react-icons/si";
import { PiMarkdownLogo } from "react-icons/pi";
import { RiGrokAiFill } from "react-icons/ri";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** Shows the external-link arrow. */
  external: boolean;
  /** Click handler. If omitted, `href` is opened in a new tab. */
  onSelect?: () => void;
  /** Link opened in a new tab when `onSelect` is not provided. */
  href?: string;
}

interface CopyPageMarkdownsProps {
  /** Raw markdown for the current page, used for the copy + "View as markdown" actions. */
  markdown?: string;
  /** Canonical URL of the current page, used to build the "Open in …" links. */
  pageUrl?: string;
  /** Optional GitHub source link. If omitted, "Open in GitHub" is hidden. */
  githubUrl?: string;
  /** Extra items appended after the defaults. */
  extraItems?: MenuItem[];
  /** Full override for the menu items (extraItems is ignored when set). */
  items?: MenuItem[];
  /** Button label. Defaults to "Copy page". */
  label?: string;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600";

function CopyPageMarkdown({ markdown = "", pageUrl, githubUrl, extraItems = [], items, label = "Copy page", className = "" }: CopyPageMarkdownsProps) {
  const reduce = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();
  const [url, setUrl] = useState(pageUrl ?? "");
  useEffect(() => {
    if (!pageUrl) setUrl(window.location.href);
    else setUrl(pageUrl);
  }, [pageUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown || url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const openExternal = (href: string) => window.open(href, "_blank", "noopener,noreferrer");
  const q = encodeURIComponent(`Read ${url} so I can ask questions about it.`);

  const defaultItems: MenuItem[] = [
    { id: "view-markdown", label: "View as Markdown", icon: <PiMarkdownLogo size={17} />, external: true, onSelect: () => openExternal(`${url}.md`) },
    { id: "open-v0", label: "Open in v0", icon: <SiV0 size={17} />, external: true, onSelect: () => openExternal(`https://v0.dev/chat?q=${q}`) },
    { id: "open-claude", label: "Open in Claude", icon: <BsAnthropic size={15} />, external: true, onSelect: () => openExternal(`https://claude.ai/new?q=${q}`) },
    { id: "open-chatgpt", label: "Open in ChatGPT", icon: <VscOpenai size={16} />, external: true, onSelect: () => openExternal(`https://chatgpt.com/?q=${q}`) },
    { id: "open-grok", label: "Open in Grok", icon: <RiGrokAiFill size={16} />, external: true, onSelect: () => openExternal(`https://grok.com/?q=${q}`) },
    ...(githubUrl ? [{ id: "open-github", label: "Open in GitHub", icon: <ImGithub size={15} />, external: true, onSelect: () => openExternal(githubUrl) }] : []),
  ];

  const menuItems: MenuItem[] = items ?? [...defaultItems, ...extraItems];

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    setActive(0);
    requestAnimationFrame(() => itemRefs.current[0]?.focus());
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const select = (item: MenuItem) => {
    if (item.onSelect) item.onSelect();
    else if (item.href) openExternal(item.href);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-flex w-fit font-sans ${className}`}>
      <div className="flex h-8 items-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          aria-label={copied ? "Copied page" : label}
          className={`flex h-full items-center gap-1.5 rounded-md pl-2 pr-2.5 text-[13px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 ${ring}`}
        >
          <span className="relative flex size-4 items-center justify-center text-neutral-500 dark:text-neutral-400">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={copied ? "done" : "copy"}
                initial={{ scale: 0.5, rotate: copied ? -15 : 0, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.16, ease: EASE }}
                className="flex"
              >
                {copied ? <MdOutlineDone size={16} className="text-neutral-900 dark:text-neutral-100" /> : <IoCopyOutline size={15} />}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="relative inline-flex overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={copied ? "c" : "l"} initial={{ y: reduce ? 0 : 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduce ? 0 : -10, opacity: 0 }} transition={{ duration: 0.18, ease: EASE }}>
                {copied ? "Copied" : label}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="sr-only" aria-live="polite">
            {copied ? "Page copied to clipboard" : ""}
          </span>
        </motion.button>

        <div className="mx-0.5 h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setIsOpen((p) => !p)}
          className={`flex h-full w-7 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 ${isOpen ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100" : ""} ${ring}`}
        >
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex">
            <IoIosArrowDown size={14} />
          </motion.span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Page actions"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{ transformOrigin: "top right" }}
            onKeyDown={(e) => {
              if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") return;
              e.preventDefault();
              const n = menuItems.length;
              const next = e.key === "Home" ? 0 : e.key === "End" ? n - 1 : (active + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
              setActive(next);
              itemRefs.current[next]?.focus();
            }}
            className="absolute right-0 top-[calc(100%+6px)] z-50 w-60 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)]"
          >
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.02 } } }}>
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={i === active ? 0 : -1}
                  variants={{ hidden: { opacity: 0, y: reduce ? 0 : -2 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.16 }}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => select(item)}
                  className={`group flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-neutral-700 outline-none transition-colors dark:text-neutral-300 ${
                    i === active ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white" : ""
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex size-5 items-center justify-center text-neutral-500 dark:text-neutral-400">{item.icon}</span>
                    {item.label}
                  </span>
                  {item.external && (
                    <HiArrowUpRight size={13} className="text-neutral-400 transition-transform duration-150 group-hover:-translate-y-px group-hover:translate-x-px dark:text-neutral-500" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CopyPageMarkdown;
export type { MenuItem, CopyPageMarkdownsProps };

"use client"

import React, { useEffect, useRef, useState } from "react"
import { IoCopyOutline } from "react-icons/io5"
import { IoIosArrowDown } from "react-icons/io"
import { MdOutlineDone } from "react-icons/md"
import { HiArrowTopRightOnSquare } from "react-icons/hi2"

import { VscOpenai } from "react-icons/vsc"
import { BsAnthropic } from "react-icons/bs"
import { ImGithub } from "react-icons/im"
import { SiV0 } from "react-icons/si"
import { PiMarkdownLogo } from "react-icons/pi"
import { RiGrokAiFill } from 'react-icons/ri';

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  external: boolean
  onSelect: () => void
}

interface CopyPageMarkdownsProps {
  /** Raw markdown for the current page, used for the copy + "View as markdown" actions */
  markdown?: string
  /** Canonical URL of the current page, used to build the "open in ..." links */
  pageUrl?: string
  /** Optional GitHub source link for this page. If omitted, the "Open in GitHub" item is not shown. */
  githubUrl?: string
  /**
   * Extra dropdown items to append after the default ones (View as markdown, V0, Claude, ChatGPT, GitHub).
   * Each item needs an id, label, icon, whether it's an external link (shows the arrow icon), and an onSelect handler.
   */
  extraItems?: MenuItem[]
  /**
   * Full override for the dropdown items. If provided, this replaces the default list entirely
   * (extraItems is ignored when this is set). Use this if you want to reorder, remove, or fully
   * customize the built-in options instead of just appending to them.
   */
  items?: MenuItem[]
}

function 
CopyPageMarkdown({
  markdown = "",
  pageUrl = typeof window !== "undefined" ? window.location.href : "",
  githubUrl,
  extraItems = [],
  items,
}: CopyPageMarkdownsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown || pageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openExternal = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const defaultItems: MenuItem[] = [
    {
      id: "view-markdown",
      label: "View as markdown",
      icon: <PiMarkdownLogo size={18} />,
      external: true,
      onSelect: () => openExternal(`${pageUrl}.md`),
    },
    {
      id: "open-v0",
      label: "Open in V0",
      icon: <SiV0 size={18} />,
      external: true,
      onSelect: () =>
        openExternal(`https://v0.dev/chat?url=${encodeURIComponent(pageUrl)}`),
    },
    {
      id: "open-claude",
      label: "Open in Claude",
      icon: <BsAnthropic size={18} />,
      external: true,
      onSelect: () =>
        openExternal(`https://claude.ai/new?q=${encodeURIComponent(pageUrl)}`),
    },
    {
      id: "open-chatgpt",
      label: "Open in ChatGPT",
      icon: <VscOpenai size={18} />,
      external: true,
      onSelect: () =>
        openExternal(`https://chat.openai.com/?q=${encodeURIComponent(pageUrl)}`),
    },
    {
      id: "open-grok",
      label: "Open in Grok",
      icon: <RiGrokAiFill size={18} />,
      external: true,
      onSelect: () =>
        openExternal(`https://grok/chat?url=${encodeURIComponent(pageUrl)}`),
    },
    // Only include the GitHub item when a githubUrl is actually provided
    ...(githubUrl
      ? [
          {
            id: "open-github",
            label: "Open in GitHub",
            icon: <ImGithub size={18} />,
            external: true,
            onSelect: () => openExternal(githubUrl),
          } as MenuItem,
        ]
      : []),
  ]

  // `items` fully overrides the list; otherwise use defaults + any extraItems appended
  const menuItems: MenuItem[] = items ?? [...defaultItems, ...extraItems]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative inline-flex w-fit">
      <div className="flex items-center justify-between rounded-sm h-7.5 pl-1 pr-1 bg-neutral-200/50 dark:bg-neutral-800/60 border border-neutral-300/60 dark:border-neutral-700/60 overflow-hidden px-3">
        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm font-sans font-bold pl-2 pr-2.5 h-full text-neutral-800 dark:text-neutral-200 rounded-[7px] transition-colors duration-150"
        >
          <span className="text-neutral-600 dark:text-neutral-400">
            {copied ? (
              <MdOutlineDone size={16} className="text-neutral-600 dark:text-neutral-400" />
            ) : (
              <IoCopyOutline size={16} />
            )}
          </span>
            Copy Page
        </button>

        <div className="w-px h-4.5 bg-neutral-300/70 dark:bg-neutral-700/70 mx-0.5" />

        {/* Dropdown trigger */}
        <button
          type="button"
          aria-label="More options"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
          className="bg-white dark:bg-neutral-950/40 border border-neutral-300/60 dark:border-neutral-700/60 w-6 h-6 rounded-[7px] flex items-center justify-center hover:bg-neutral-200/50 dark:hover:bg-neutral-800/60 transition-colors duration-150"
        >
          <IoIosArrowDown
            size={16}
            className={`text-neutral-600 dark:text-neutral-400 transition-transform duration-200 ease-out ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* Dropdown panel */}
      <div
        role="menu"
        className={`absolute top-[calc(100%+6px)] right-0 w-58 origin-top-right rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg shadow-neutral-900/[0.06] dark:shadow-black/30 py-1.5 z-50 overflow-hidden transition-all duration-150 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="relative z-10 px-[3px]">
          {menuItems.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              onClick={() => {
                item.onSelect()
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-sm font-sans text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800/50 hover:text-neutral-950 dark:hover:text-white transition-colors duration-100 rounded-sm"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-neutral-500 dark:text-neutral-400">{item.icon}</span>
                {item.label}
              </span>
              {item.external && (
                <span className="flex items-center justify-center bg-white dark:bg-neutral-900 w-6 h-6 rounded-sm transition-colors duration-150">
                  <HiArrowTopRightOnSquare
                    size={16}
                    className="text-neutral-500 dark:text-neutral-600"
                  />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CopyPageMarkdown
export type { MenuItem, CopyPageMarkdownsProps }
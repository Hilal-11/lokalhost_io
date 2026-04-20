"use client"
import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from "motion/react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link'
import { IoSearchSharp } from 'react-icons/io5'
import { RxCross2 } from 'react-icons/rx'
import { MAIN_PAGE_SEARCHING_CONFIG } from '../../../config/searchingConfig'
import NProgress from 'nprogress'

export function SearchingMain() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState([...MAIN_PAGE_SEARCHING_CONFIG])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
   const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearching = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    const filtered = MAIN_PAGE_SEARCHING_CONFIG.filter((item: any) =>
      item.suggesstion.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [searchQuery])

  // auto-focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80)
      setSearchQuery('')
      setFilteredItems([...MAIN_PAGE_SEARCHING_CONFIG])
    }
  }, [open])

  const handleLinkClick = () => {
    NProgress.start()
    setOpen(false)
  }
    const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      setOpen(false)
    }
  }

  const displayItems = filteredItems.length > 0 ? filteredItems : MAIN_PAGE_SEARCHING_CONFIG
  const isFiltering = searchQuery.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ── Trigger button ── */}
    <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="group flex items-center justify-between gap-1.5 bg-neutral-50 dark:bg-neutral-900 w-44 px-1 h-8 rounded-sm shadow-sm border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
        >
          <div className="flex items-center gap-1">
            <IoSearchSharp className="text-[15px] text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors duration-200" />
            <span className="text-xs text-neutral-400 dark:text-neutral-500">Search</span>
          </div>
          <kbd className="ml-1 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 border border-neutral-200 dark:border-neutral-700 rounded px-1 py-px bg-white dark:bg-neutral-950">
            ⌘K
          </kbd>
        </motion.button>
      </DialogTrigger>

      {/* ── Dialog ── */}
      <DialogContent className="p-0 gap-0 lg:w-[520px] max-h-[480px] overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl bg-white dark:bg-neutral-950">

        {/* ── Fixed search bar ── */}
        <div className={`sticky top-0 z-20 w-full bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 transition-shadow duration-200 ${focused ? 'shadow-sm' : ''}`}>
          <div className="flex items-center gap-2 px-3 h-12">
            <motion.span
              animate={focused ? { scale: 1.1, color: "#525252" } : { scale: 1, color: "#a3a3a3" }}
              transition={{ duration: 0.2 }}
            >
              <IoSearchSharp className="text-lg flex-shrink-0" />
            </motion.span>

            <input
              ref={inputRef}
              className="flex-1 h-full outline-none text-sm font-sans font-medium bg-transparent text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              onChange={handleSearching}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              value={searchQuery}
              type="text"
              placeholder="Search components, templates, docs…"
            />

            <AnimatePresence>
              {searchQuery.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSearchQuery('')}
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-150 flex-shrink-0"
                >
                  <RxCross2 className="text-[10px] text-neutral-600 dark:text-neutral-300" />
                </motion.button>
              )}
            </AnimatePresence>

            <kbd className="hidden sm:flex items-center justify-center h-5 px-1.5 rounded border border-neutral-200 dark:border-neutral-700 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900 flex-shrink-0">
              ESC
            </kbd>
          </div>

          {/* animated focus underline */}
          <motion.div
            className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-500 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={focused ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0.5 }}
          />
        </div>

        {/* ── Results list ── */}
        <div className="overflow-y-auto max-h-[380px] px-2 py-2 scroll-smooth">

          {/* section label */}
          <motion.p
            layout
            className="text-[11px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 px-2 pt-1 pb-2 uppercase tracking-wider"
          >
            {isFiltering
              ? `${filteredItems.length} result${filteredItems.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : 'Suggestions'}
          </motion.p>

          {/* no results */}
          <AnimatePresence mode="wait">
            {isFiltering && filteredItems.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center py-12 gap-3"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-3xl text-neutral-300 dark:text-neutral-700"
                >
                  <IoSearchSharp />
                </motion.div>
                <p className="text-sm font-sans font-medium text-neutral-400 dark:text-neutral-600">
                  No results for <span className="text-neutral-600 dark:text-neutral-400">"{searchQuery}"</span>
                </p>
              </motion.div>
            ) : (
              <motion.div key="results" className="flex flex-col gap-0.5">
                {displayItems.map(({ suggesstion, suggesstion_to, Icon }: any, i: number) => (
                  <motion.div
                    key={suggesstion_to}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <Link
                      onClick={handleLinkClick}
                      prefetch={true}
                      href={suggesstion_to}
                      className="group/item flex items-center gap-3 w-full px-2 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors duration-150 relative overflow-hidden"
                    >
                      {/* hover bg sweep */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-neutral-100/80 dark:from-neutral-800/80 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 rounded-lg"
                      />

                      {/* icon box */}
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="relative z-10 flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 group-hover/item:border-neutral-300 dark:group-hover/item:border-neutral-600 transition-colors duration-150 flex-shrink-0"
                      >
                        <Icon className="text-sm" />
                      </motion.span>

                      {/* label with query highlight */}
                      <span className="relative z-10 text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300 group-hover/item:text-neutral-900 dark:group-hover/item:text-neutral-100 transition-colors duration-150">
                        {isFiltering
                          ? highlightMatch(suggesstion, searchQuery)
                          : suggesstion}
                      </span>

                      {/* arrow indicator */}
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        className="relative z-10 ml-auto text-xs text-neutral-400 dark:text-neutral-600 opacity-0 group-hover/item:opacity-100 transition-all duration-150 group-hover/item:translate-x-0 -translate-x-1"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer hint ── */}
        <div className="sticky bottom-0 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2 flex items-center gap-3">
          {[
            { key: '↑↓', label: 'navigate' },
            { key: '↵',  label: 'select' },
            { key: 'ESC', label: 'close' },
          ].map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1 text-[10px] font-sans text-neutral-400 dark:text-neutral-600">
              <kbd className="px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-[10px]">{key}</kbd>
              {label}
            </span>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ── Highlight matching substring ── */
function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-neutral-900 dark:text-white font-bold underline decoration-neutral-400 dark:decoration-neutral-500 underline-offset-2">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}
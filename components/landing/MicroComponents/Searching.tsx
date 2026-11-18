"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Command, defaultFilter } from "cmdk";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useDocsSearch } from "fumadocs-core/search/client";
import NProgress from "nprogress";
import {
  ArrowUpRight,
  Clock,
  Copy,
  CornerDownLeft,
  FileText,
  Hash,
  Loader2,
  MessageSquarePlus,
  Moon,
  Search,
  Sun,
  TextQuote,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LayoutTemplate } from "lucide-react";
import { SEARCH_GROUP_ORDER, SEARCH_ITEMS, type SearchItem } from "@/config/searchingConfig";
import { useTemplates } from "@/lib/templates-query";

/* ------------------------------------------------------------------ */
/* Recent searches (per browser)                                      */
/* ------------------------------------------------------------------ */

interface Recent {
  title: string;
  href: string;
  external?: boolean;
}

const RECENT_KEY = "lk-search-recent";
const RECENT_MAX = 5;

function readRecent(): Recent[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: Recent[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
  } catch {
    /* storage unavailable */
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400";
/** Max matches per group while typing (the empty state lists everything). */
const PER_GROUP = 8;

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-neutral-900/10 px-px text-neutral-950 dark:bg-white/15 dark:text-white">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-neutral-200 bg-white px-1 font-sans text-[10.5px] font-medium text-neutral-500 shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400",
        className
      )}
    >
      {children}
    </kbd>
  );
}

function useIsMac() {
  const [mac, setMac] = React.useState(true);
  React.useEffect(() => setMac(/mac|iphone|ipad/i.test(navigator.userAgent)), []);
  return mac;
}

/* ------------------------------------------------------------------ */
/* Trigger + global hotkeys                                           */
/* ------------------------------------------------------------------ */

/** The header renders this twice (desktop + mobile); only one instance owns the hotkeys. */
let hotkeyOwner: symbol | null = null;

export function SearchingMain() {
  const [open, setOpen] = React.useState(false);
  const isMac = useIsMac();
  const [ownsHotkeys, setOwnsHotkeys] = React.useState(false);

  React.useEffect(() => {
    const me = Symbol("search");
    if (hotkeyOwner === null) {
      hotkeyOwner = me;
      setOwnsHotkeys(true);
    }
    return () => {
      if (hotkeyOwner === me) hotkeyOwner = null;
    };
  }, []);

  React.useEffect(() => {
    if (!ownsHotkeys) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, ownsHotkeys]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          aria-label="Search"
          className={cn(
            "group flex h-[33px] w-28 items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100/20 pl-2 pr-1 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors lg:w-48",
            "hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/20 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/70",
            ring
          )}
        >
          <Search className="size-3.5 shrink-0 text-neutral-400 transition-colors group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
          <span className="flex-1 truncate font-sans text-[12.5px] text-neutral-400 dark:text-neutral-500">Search…</span>
          <span className="hidden items-center gap-0.5 lg:flex">
            <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </motion.button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-white/50 backdrop-blur-[4px] dark:bg-black/50"
              />
            </Dialog.Overlay>
            <SearchPanel onClose={() => setOpen(false)} isMac={isMac} />
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                              */
/* ------------------------------------------------------------------ */

type Row =
  | { kind: "item"; key: string; item: SearchItem }
  | { kind: "recent"; key: string; recent: Recent }
  | { kind: "doc"; key: string; title: string; href: string; type: "page" | "heading" | "text"; trail?: string }
  | { kind: "action"; key: string; title: string; icon: React.ReactNode; hint?: string; run: () => void };

function SearchPanel({ onClose, isMac }: { onClose: () => void; isMac: boolean }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const uid = React.useId();
  const [query, setQuery] = React.useState("");
  const [value, setValue] = React.useState("");
  const [recent, setRecent] = React.useState<Recent[]>([]);
  const [notice, setNotice] = React.useState<string | null>(null);
  const docs = useDocsSearch({ type: "static", from: "/api/search", delayMs: 120 });
  const { data: templates } = useTemplates();

  /** Static items + live templates from Supabase. */
  const allItems = React.useMemo<SearchItem[]>(() => {
    const t: SearchItem[] = (templates ?? []).map((tpl) => ({
      id: `t-${tpl.id}`,
      title: tpl.template_name,
      href: `/templates/template/${tpl.id}`,
      group: "Templates",
      icon: LayoutTemplate,
      description: tpl.template_price ? `Template · ${tpl.template_price}` : "Next.js template",
      keywords: ["template", "website", "next.js"],
    }));
    return [...SEARCH_ITEMS, ...t];
  }, [templates]);

  React.useEffect(() => setRecent(readRecent()), []);

  const q = query.trim();
  React.useEffect(() => docs.setSearch(q), [q]); // eslint-disable-line react-hooks/exhaustive-deps

  /* -------- navigation -------- */
  const go = React.useCallback(
    (r: Recent, newTab = false) => {
      const next = [r, ...readRecent().filter((x) => x.href !== r.href)];
      writeRecent(next);
      if (newTab || r.external) {
        window.open(r.href, "_blank", "noopener,noreferrer");
        if (!r.external) return;
      } else {
        NProgress.start();
        router.push(r.href);
      }
      onClose();
    },
    [router, onClose]
  );

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 1600);
  };

  /* -------- results -------- */
  const sections = React.useMemo(() => {
    const out: { heading: string; rows: Row[] }[] = [];

    if (!q) {
      if (recent.length) out.push({ heading: "Recent", rows: recent.map((r) => ({ kind: "recent", key: `recent:${r.href}`, recent: r })) });
      // everything, grouped — so the list is browsable before typing
      for (const group of SEARCH_GROUP_ORDER) {
        const rows = allItems
          .filter((i) => i.group === group)
          .map((item) => ({ kind: "item" as const, key: `item:${item.id}`, item }));
        if (rows.length) out.push({ heading: group, rows });
      }
      out.push({
        heading: "Actions",
        rows: [
          {
            kind: "action",
            key: "action:theme",
            title: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
            icon: resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />,
            run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
          },
          {
            kind: "action",
            key: "action:copy-init",
            title: "Copy setup command",
            hint: "npx shadcn@latest init",
            icon: <Copy className="size-4" />,
            run: async () => {
              try {
                await navigator.clipboard.writeText("npx shadcn@latest init");
                flash("Setup command copied");
              } catch {
                flash("Couldn't access the clipboard");
              }
            },
          },
          {
            kind: "action",
            key: "action:request",
            title: "Request a component",
            icon: <MessageSquarePlus className="size-4" />,
            run: () => go({ title: "Contact & Feedback", href: "/contact" }),
          },
        ],
      });
      return out;
    }

    // ranked local matches
    const scored = allItems.map((item) => ({
      item,
      score: Math.max(
        defaultFilter(item.title, q, item.keywords) * 1.5,
        item.description ? defaultFilter(item.description, q) : 0
      ),
    })).filter((s) => s.score > 0.05);

    for (const group of SEARCH_GROUP_ORDER) {
      const rows = scored
        .filter((s) => s.item.group === group)
        .sort((a, b) => b.score - a.score)
        .slice(0, PER_GROUP)
        .map(({ item }) => ({ kind: "item" as const, key: `item:${item.id}`, item }));
      if (rows.length) out.push({ heading: group, rows });
    }

    // full-text documentation
    const data = docs.query.data;
    if (Array.isArray(data) && data.length) {
      const known = new Set(allItems.map((i) => i.href));
      const rows: Row[] = [];
      for (const r of data) {
        if (r.type === "page" && known.has(r.url)) continue;
        rows.push({
          kind: "doc",
          key: `doc:${r.id}`,
          title: r.content,
          href: r.url,
          type: r.type,
          trail: r.breadcrumbs?.join(" / "),
        });
        if (rows.length >= 8) break;
      }
      if (rows.length) out.push({ heading: "Documentation", rows });
    }
    return out;
  }, [q, recent, allItems, resolvedTheme, setTheme, docs.query.data, go]);

  const rows = React.useMemo(() => sections.flatMap((s) => s.rows), [sections]);
  const firstKey = rows[0]?.key ?? "";
  React.useEffect(() => setValue(firstKey), [firstKey, q]);

  const select = (row: Row, newTab = false) => {
    if (row.kind === "item") go({ title: row.item.title, href: row.item.href, external: row.item.external }, newTab);
    else if (row.kind === "recent") go(row.recent, newTab);
    else if (row.kind === "doc") go({ title: row.title, href: row.href }, newTab);
    else row.run();
  };

  const removeRecent = (href: string) => {
    const next = readRecent().filter((r) => r.href !== href);
    writeRecent(next);
    setRecent(next);
  };

  const loading = !!q && docs.query.isLoading;
  const count = q ? rows.length : 0;

  return (
    <Dialog.Content
      asChild
      forceMount
      aria-describedby={undefined}
      onOpenAutoFocus={(e) => {
        e.preventDefault();
        inputRef.current?.focus();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: reduce ? 1 : 0.97, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduce ? 1 : 0.98, transition: { duration: 0.14 } }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="fixed left-1/2 top-[12vh] z-[101] flex max-h-[min(620px,76vh)] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white font-sans shadow-[0_32px_80px_-24px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.05)] outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_32px_80px_-24px_rgba(0,0,0,0.9)]"
      >
        <Dialog.Title className="sr-only">Search Lokalhost.io</Dialog.Title>
        <Command
          shouldFilter={false}
          loop
          value={value}
          onValueChange={setValue}
          label="Search"
          className="flex min-h-0 flex-1 flex-col"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              const row = rows.find((r) => r.key === value);
              if (row) {
                e.preventDefault();
                select(row, true);
              }
            }
          }}
        >
          {/* input */}
          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-neutral-200 px-4 dark:border-neutral-800">
            <AnimatePresence mode="popLayout" initial={false}>
              {loading ? (
                <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                  <Loader2 className="size-[18px] animate-spin text-neutral-400" />
                </motion.span>
              ) : (
                <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
                  <Search className="size-[18px] text-neutral-400" />
                </motion.span>
              )}
            </AnimatePresence>
            <Command.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder="Search components, blocks, docs, pages…"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className={cn("flex size-6 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200", ring)}
                >
                  <X className="size-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
            <Dialog.Close asChild>
              <button type="button" className={cn("rounded-md", ring)} aria-label="Close search">
                <Kbd>Esc</Kbd>
              </button>
            </Dialog.Close>
          </div>

          {/* results */}
          <Command.List className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 [scrollbar-width:thin]">
            {q && rows.length === 0 && !loading && (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <span className="flex size-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
                  <Search className="size-4" />
                </span>
                <p className="text-[14px] font-medium text-neutral-800 dark:text-neutral-200">No results for “{q}”</p>
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400">Try “button”, “pricing”, “hero” or “react native”.</p>
                <button
                  type="button"
                  onClick={() => go({ title: "Contact & Feedback", href: "/contact" })}
                  className={cn("mt-2 inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-[12.5px] font-medium text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100", ring)}
                >
                  <MessageSquarePlus className="size-3.5" /> Request “{q}”
                </button>
              </div>
            )}

            {q && rows.length === 0 && loading && (
              <div className="flex flex-col gap-2 p-2" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-2 py-2">
                    <span className="size-8 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
                    <span className="h-3 animate-pulse rounded-full bg-neutral-100 dark:bg-neutral-900" style={{ width: `${60 - i * 8}%` }} />
                  </div>
                ))}
              </div>
            )}

            {sections.map((section) => (
              <Command.Group key={section.heading} heading={section.heading} className="lk-search-group">
                {section.rows.map((row) => (
                  <ResultRow
                    key={row.key}
                    row={row}
                    active={value === row.key}
                    query={q}
                    layoutId={reduce ? undefined : `${uid}-hl`}
                    onSelect={() => select(row)}
                    onRemove={row.kind === "recent" ? () => removeRecent(row.recent.href) : undefined}
                  />
                ))}
              </Command.Group>
            ))}
          </Command.List>

          {/* footer */}
          <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-t border-neutral-200 bg-neutral-50/70 px-3 text-[11.5px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/40 dark:text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
                <span className="hidden sm:inline">navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <Kbd>
                  <CornerDownLeft className="size-3" />
                </Kbd>
                open
              </span>
              <span className="hidden items-center gap-1 sm:flex">
                <Kbd>{isMac ? "⌘" : "Ctrl"}</Kbd>
                <Kbd>
                  <CornerDownLeft className="size-3" />
                </Kbd>
                new tab
              </span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={notice ?? String(count)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="tabular-nums"
                aria-live="polite"
              >
                {notice ?? (q ? `${count} result${count === 1 ? "" : "s"}` : "Type to search everything")}
              </motion.span>
            </AnimatePresence>
          </div>
        </Command>
        <style href="lk-search" precedence="default">{`
          .lk-search-group [cmdk-group-heading] { padding: 10px 10px 6px; font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--color-neutral-400); }
          .lk-search-group + .lk-search-group { margin-top: 2px; }
        `}</style>
      </motion.div>
    </Dialog.Content>
  );
}

/* ------------------------------------------------------------------ */
/* Row                                                                */
/* ------------------------------------------------------------------ */

function ResultRow({
  row,
  active,
  query,
  layoutId,
  onSelect,
  onRemove,
}: {
  row: Row;
  active: boolean;
  query: string;
  layoutId?: string;
  onSelect: () => void;
  onRemove?: () => void;
}) {
  let icon: React.ReactNode;
  let title: string;
  let sub: string | undefined;
  let badge: SearchItem["badge"];
  let external = false;

  if (row.kind === "item") {
    const Icon = row.item.icon;
    icon = <Icon className="size-4" strokeWidth={1.75} />;
    title = row.item.title;
    sub = row.item.description;
    badge = row.item.badge;
    external = !!row.item.external;
  } else if (row.kind === "recent") {
    icon = <Clock className="size-4" strokeWidth={1.75} />;
    title = row.recent.title;
    sub = row.recent.href;
    external = !!row.recent.external;
  } else if (row.kind === "doc") {
    icon = row.type === "page" ? <FileText className="size-4" strokeWidth={1.75} /> : row.type === "heading" ? <Hash className="size-4" strokeWidth={1.75} /> : <TextQuote className="size-4" strokeWidth={1.75} />;
    title = row.title;
    sub = row.trail;
  } else {
    icon = row.icon;
    title = row.title;
    sub = row.hint;
  }

  return (
    <Command.Item value={row.key} onSelect={onSelect} className="group relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-2 py-1.5 outline-none">
      {active && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 rounded-xl bg-neutral-100 dark:bg-neutral-900"
          transition={{ type: "spring", stiffness: 520, damping: 40 }}
        />
      )}
      <span
        className={cn(
          "relative flex size-8 shrink-0 items-center justify-center rounded-lg border bg-white transition-colors dark:bg-neutral-950",
          active ? "border-neutral-300 text-neutral-900 dark:border-neutral-700 dark:text-neutral-100" : "border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
        )}
      >
        {icon}
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("truncate text-[13.5px] font-medium", active ? "text-neutral-950 dark:text-white" : "text-neutral-800 dark:text-neutral-200", row.kind === "doc" && row.type === "text" && "font-normal")}>
            <Highlight text={title} query={query} />
          </span>
          {badge && (
            <span
              className={cn(
                "shrink-0 rounded-[5px] px-1 py-px text-[9.5px] font-semibold uppercase tracking-wide",
                badge === "pro" ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900" : "border border-neutral-300 text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
              )}
            >
              {badge}
            </span>
          )}
        </span>
        {sub && <span className="block truncate text-[12px] text-neutral-500 dark:text-neutral-400">{sub}</span>}
      </span>
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${title} from recent`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="relative flex size-6 items-center justify-center rounded-md text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-200 hover:text-neutral-700 group-hover:opacity-100 data-[active=true]:opacity-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          data-active={active}
        >
          <X className="size-3.5" />
        </button>
      )}
      <span className={cn("relative flex shrink-0 items-center text-neutral-400 transition-opacity", active ? "opacity-100" : "opacity-0")}>
        {external ? <ArrowUpRight className="size-4" /> : <CornerDownLeft className="size-3.5" />}
      </span>
    </Command.Item>
  );
}

"use client";

import * as React from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export { remarkCitations } from "./remark-citations";

const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";

/* ------------------------------------------------------------------ */
/* Types & context                                                    */
/* ------------------------------------------------------------------ */

export interface CitationSource {
  /** Stable id referenced by <Citation ids>. */
  id: string;
  url: string;
  title: string;
  /** Defaults to the URL hostname. */
  domain?: string;
  /** Favicon URL. Defaults to Google's favicon service. */
  favicon?: string;
  snippet?: string;
  /** Sentence inside the snippet to highlight. */
  highlight?: string;
  publishedAt?: string | Date;
  author?: string;
}

export type CitationDisplay = "number" | "domain";

interface CitationContextValue {
  sources: CitationSource[];
  byId: Map<string, CitationSource>;
  display: CitationDisplay;
  numberOf: (id: string) => number;
  active: string[];
  setActive: (ids: string[]) => void;
  favicon: (source: CitationSource) => string;
}

const CitationContext = React.createContext<CitationContextValue | null>(null);

function useCitations() {
  const ctx = React.useContext(CitationContext);
  if (!ctx) throw new Error("Citation components must be inside <CitationProvider>");
  return ctx;
}

export function domainOf(source: Pick<CitationSource, "url" | "domain">) {
  if (source.domain) return source.domain;
  try {
    return new URL(source.url).hostname.replace(/^www\./, "");
  } catch {
    return source.url;
  }
}

const defaultFavicon = (s: CitationSource) => s.favicon ?? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domainOf(s))}&sz=64`;

export interface CitationProviderProps {
  sources: CitationSource[];
  /** Chip style. Defaults to "number". */
  display?: CitationDisplay;
  /** Resolve a favicon URL. Defaults to source.favicon or Google's favicon service. */
  getFavicon?: (source: CitationSource) => string;
  children?: React.ReactNode;
}

export function CitationProvider({ sources, display = "number", getFavicon, children }: CitationProviderProps) {
  const byId = React.useMemo(() => new Map(sources.map((s) => [s.id, s])), [sources]);
  // numbers are assigned in order of first appearance while rendering
  const order = React.useRef(new Map<string, number>());
  const prevSources = React.useRef(sources);
  if (prevSources.current !== sources) {
    order.current = new Map();
    prevSources.current = sources;
  }
  const numberOf = React.useCallback((id: string) => {
    const map = order.current;
    if (!map.has(id)) map.set(id, map.size + 1);
    return map.get(id) as number;
  }, []);
  const [active, setActive] = React.useState<string[]>([]);

  return (
    <CitationContext.Provider
      value={{ sources, byId, display, numberOf, active, setActive, favicon: getFavicon ?? defaultFavicon }}
    >
      {children}
    </CitationContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Favicon                                                            */
/* ------------------------------------------------------------------ */

export function Favicon({ source, className }: { source: CitationSource; className?: string }) {
  const { favicon } = useCitations();
  const [state, setState] = React.useState<"loading" | "ok" | "error">("loading");
  const domain = domainOf(source);
  return (
    <span className={cn("relative flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-[4px] bg-muted", className)} aria-hidden>
      {state === "loading" && <span className="absolute inset-0 animate-pulse bg-muted-foreground/15" />}
      {state === "error" ? (
        <span className="text-[9px] font-semibold uppercase text-muted-foreground">{domain.charAt(0)}</span>
      ) : (
        <img
          src={favicon(source)}
          alt=""
          loading="lazy"
          onLoad={() => setState("ok")}
          onError={() => setState("error")}
          className={cn("size-full object-contain transition-opacity duration-200", state === "ok" ? "opacity-100" : "opacity-0")}
        />
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hover card content                                                 */
/* ------------------------------------------------------------------ */

function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const i = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-foreground/10 px-0.5 text-foreground">{text.slice(i, i + highlight.length)}</mark>
      {text.slice(i + highlight.length)}
    </>
  );
}

function formatDate(d?: string | Date) {
  if (!d) return undefined;
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function SourceCardBody({ source }: { source: CitationSource }) {
  const date = formatDate(source.publishedAt);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <Favicon source={source} />
        <span className="truncate">{domainOf(source)}</span>
        {date && (
          <>
            <span aria-hidden className="text-muted-foreground/50">·</span>
            <span className="shrink-0">{date}</span>
          </>
        )}
      </div>
      <p className="line-clamp-2 text-[13.5px] font-medium leading-snug text-foreground">{source.title}</p>
      {source.snippet && (
        <p className="line-clamp-3 text-[12.5px] leading-5 text-muted-foreground">
          <Highlighted text={source.snippet} highlight={source.highlight} />
        </p>
      )}
      <div className="mt-1 flex items-center justify-between">
        {source.author ? <span className="truncate text-[12px] text-muted-foreground">{source.author}</span> : <span />}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("inline-flex h-7 items-center gap-1 rounded-md px-2 text-[12px] font-medium text-foreground transition-colors hover:bg-accent", ring)}
        >
          Open <ArrowUpRight className="size-3.5" />
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </div>
  );
}

function CardCarousel({ sources }: { sources: CitationSource[] }) {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = React.useState<[number, number]>([0, 0]);
  const go = (d: number) => setState(([i]) => [Math.min(sources.length - 1, Math.max(0, i + d)), d]);
  const source = sources[index];
  const navBtn = cn("flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-30", ring);

  return (
    <div className="flex flex-col gap-2">
      {sources.length > 1 && (
        <div className="flex items-center justify-between border-b border-border pb-2">
          <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => go(-1)} disabled={index === 0} className={navBtn} aria-label="Previous source">
            <ChevronLeft className="size-3.5" />
          </motion.button>
          <span className="text-[11.5px] font-medium tabular-nums text-muted-foreground" aria-live="polite">
            {index + 1}/{sources.length}
          </span>
          <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => go(1)} disabled={index === sources.length - 1} className={navBtn} aria-label="Next source">
            <ChevronRight className="size-3.5" />
          </motion.button>
        </div>
      )}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={source.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: reduce ? 0 : d * 24, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: reduce ? 0 : d * -24, opacity: 0, transition: { duration: 0.12 } }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: EASE }}
          >
            <SourceCardBody source={source} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Citation chip                                                      */
/* ------------------------------------------------------------------ */

export interface CitationProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Source ids this claim is backed by. */
  ids: string[];
  /** Override the provider's display style. */
  display?: CitationDisplay;
}

export const Citation = React.forwardRef<HTMLButtonElement, CitationProps>(({ ids, display: displayProp, className, ...props }, ref) => {
  const { byId, numberOf, display: ctxDisplay, active, setActive } = useCitations();
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const sources = ids.map((id) => byId.get(id)).filter((s): s is CitationSource => !!s);
  if (!sources.length) return null;
  const numbers = sources.map((s) => numberOf(s.id));
  const display = displayProp ?? ctxDisplay;
  const first = sources[0];
  const highlighted = sources.some((s) => active.includes(s.id));

  return (
    <HoverCard.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        setActive(o ? sources.map((s) => s.id) : []);
      }}
      openDelay={150}
      closeDelay={120}
    >
      <HoverCard.Trigger asChild>
        <motion.button
          ref={ref}
          type="button"
          data-active={highlighted || undefined}
          initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 26 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            // tap support on touch devices (hover cards ignore touch); outside tap closes
            if (open) return;
            setOpen(true);
            setActive(sources.map((s) => s.id));
          }}
          aria-label={`Source ${numbers[0]}: ${first.title}${sources.length > 1 ? ` and ${sources.length - 1} more` : ""}`}
          className={cn(
            "relative mx-0.5 inline-flex h-5 -translate-y-px items-center gap-1 rounded-full border border-border bg-muted px-1.5 align-middle font-sans text-[11px] font-medium leading-none text-muted-foreground",
            "transition-colors duration-[120ms] hover:border-foreground hover:bg-foreground hover:text-background data-[state=open]:border-foreground data-[state=open]:bg-foreground data-[state=open]:text-background",
            "data-[active=true]:border-foreground/40 data-[active=true]:bg-foreground/10 data-[active=true]:text-foreground",
            ring,
            className
          )}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          {display === "domain" ? (
            <>
              <Favicon source={first} className="size-3 rounded-[3px]" />
              <span className="max-w-[96px] truncate">{domainOf(first)}</span>
              {sources.length > 1 && <span className="opacity-70">+{sources.length - 1}</span>}
            </>
          ) : (
            <span className="tabular-nums">
              {numbers[0]}
              {sources.length > 1 && <span className="opacity-70"> +{sources.length - 1}</span>}
            </span>
          )}
        </motion.button>
      </HoverCard.Trigger>
      <AnimatePresence>
        {open && (
          <HoverCard.Portal forceMount>
            <HoverCard.Content asChild forceMount side="top" align="center" sideOffset={6} collisionPadding={12}>
              <motion.div
                initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.12 } }}
                transition={reduce ? { duration: 0.15 } : SPRING}
                style={{ transformOrigin: "var(--radix-hover-card-content-transform-origin)" }}
                className="z-50 w-[300px] max-w-[calc(100vw-24px)] rounded-xl border border-border bg-popover p-3 font-sans text-popover-foreground shadow-md outline-none"
              >
                <CardCarousel sources={sources} />
              </motion.div>
            </HoverCard.Content>
          </HoverCard.Portal>
        )}
      </AnimatePresence>
    </HoverCard.Root>
  );
});
Citation.displayName = "Citation";

/** Renderer for the `citation` element produced by remarkCitations (1-based indexes). */
export function MarkdownCitation({ indexes }: { indexes?: string }) {
  const { sources } = useCitations();
  const ids = (indexes ?? "")
    .split(",")
    .map((n) => sources[Number(n) - 1]?.id)
    .filter((id): id is string => !!id);
  return <Citation ids={ids} />;
}

/* ------------------------------------------------------------------ */
/* Sources strip                                                      */
/* ------------------------------------------------------------------ */

export interface SourcesStripProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cards shown before a "+N more" card. Defaults to 4. */
  max?: number;
  /** Set false to hide until the answer completes (cards stagger in when it flips to true). */
  show?: boolean;
}

export function SourcesStrip({ max = 4, show = true, className, ...props }: SourcesStripProps) {
  const { sources, numberOf, active, setActive } = useCitations();
  const reduce = useReducedMotion();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ left: false, right: false });
  const drag = React.useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dialog, setDialog] = React.useState(false);

  const sorted = React.useMemo(() => [...sources].sort((a, b) => numberOf(a.id) - numberOf(b.id)), [sources, numberOf]);
  const visible = sorted.slice(0, max);
  const hidden = sorted.length - visible.length;

  const updateEdges = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 2, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2 });
  }, []);
  React.useEffect(() => {
    updateEdges();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, show, sources.length]);

  const mask = `linear-gradient(to right, ${edges.left ? "transparent" : "#000"} 0, #000 28px, #000 calc(100% - 28px), ${edges.right ? "transparent" : "#000"} 100%)`;

  return (
    <div className={cn("w-full font-sans", className)} {...props}>
      <AnimatePresence>
        {show && (
          <motion.div
            ref={scrollRef}
            onScroll={updateEdges}
            onPointerDown={(e) => {
              if (e.pointerType !== "mouse" || !scrollRef.current) return;
              drag.current = { x: e.clientX, left: scrollRef.current.scrollLeft, moved: false };
            }}
            onPointerMove={(e) => {
              const d = drag.current;
              if (!d || !scrollRef.current) return;
              const dx = e.clientX - d.x;
              if (Math.abs(dx) > 4) d.moved = true;
              if (d.moved) scrollRef.current.scrollLeft = d.left - dx;
            }}
            onPointerUp={() => {
              window.setTimeout(() => (drag.current = null), 0);
            }}
            onPointerLeave={() => (drag.current = null)}
            onClickCapture={(e) => {
              if (drag.current?.moved) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ maskImage: mask, WebkitMaskImage: mask }}
            role="list"
            aria-label="Sources"
          >
            {visible.map((s) => {
              const on = active.includes(s.id);
              return (
                <motion.a
                  key={s.id}
                  role="listitem"
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  variants={{ hidden: { opacity: 0, y: reduce ? 0 : 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE } } }}
                  animate={on && !reduce ? { y: -2 } : { y: 0 }}
                  onPointerEnter={() => setActive([s.id])}
                  onPointerLeave={() => setActive([])}
                  onFocus={() => setActive([s.id])}
                  onBlur={() => setActive([])}
                  className={cn(
                    "flex w-[200px] shrink-0 snap-start select-none flex-col gap-1.5 rounded-xl border bg-background p-3 shadow-sm transition-[border-color,box-shadow] duration-150",
                    on ? "border-foreground/40 shadow-md ring-1 ring-foreground/10" : "border-border hover:border-foreground/25",
                    ring
                  )}
                >
                  <span className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <Favicon source={s} className="size-3.5" />
                    <span className="truncate">{domainOf(s)}</span>
                    <span className="ml-auto tabular-nums text-muted-foreground/70">{numberOf(s.id)}</span>
                  </span>
                  <span className="line-clamp-2 text-[12.5px] font-medium leading-snug text-foreground">{s.title}</span>
                  <span className="sr-only">(opens in new tab)</span>
                </motion.a>
              );
            })}
            {hidden > 0 && (
              <motion.button
                type="button"
                role="listitem"
                variants={{ hidden: { opacity: 0, y: reduce ? 0 : 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE } } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setDialog(true)}
                className={cn("flex w-[120px] shrink-0 snap-start flex-col items-start justify-between gap-2 rounded-xl border border-dashed border-border bg-muted/40 p-3 text-left transition-colors hover:bg-accent", ring)}
              >
                <span className="flex -space-x-1">
                  {sorted.slice(max, max + 3).map((s) => (
                    <Favicon key={s.id} source={s} className="size-4 ring-2 ring-background" />
                  ))}
                </span>
                <span className="text-[12.5px] font-medium text-foreground">+{hidden} more</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog.Root open={dialog} onOpenChange={setDialog}>
        <AnimatePresence>
          {dialog && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/60 backdrop-blur-[4px]" />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount>
                <motion.div
                  initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.97, transition: { duration: 0.15 } }}
                  transition={SPRING}
                  className="fixed left-1/2 top-1/2 z-50 flex max-h-[80vh] w-[min(520px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background font-sans shadow-xl outline-none"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <Dialog.Title className="text-[14px] font-semibold text-foreground">Sources</Dialog.Title>
                    <Dialog.Close asChild>
                      <motion.button type="button" whileTap={{ scale: 0.9 }} aria-label="Close" className={cn("flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", ring)}>
                        <X className="size-4" />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                  <Dialog.Description className="sr-only">All sources cited in this answer</Dialog.Description>
                  <div className="overflow-y-auto p-2">
                    <SourcesList />
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sources list                                                       */
/* ------------------------------------------------------------------ */

export type SourcesListProps = React.HTMLAttributes<HTMLOListElement>;

export function SourcesList({ className, ...props }: SourcesListProps) {
  const { sources, numberOf, setActive } = useCitations();
  const sorted = [...sources].sort((a, b) => numberOf(a.id) - numberOf(b.id));
  return (
    <ol className={cn("flex flex-col font-sans", className)} {...props}>
      {sorted.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            onPointerEnter={() => setActive([s.id])}
            onPointerLeave={() => setActive([])}
            className={cn("group/src flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-accent/60", ring)}
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-medium tabular-nums text-muted-foreground">
              {numberOf(s.id)}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="line-clamp-1 text-[13.5px] font-medium text-foreground">{s.title}</span>
              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Favicon source={s} className="size-3.5" />
                <span className="truncate">{domainOf(s)}</span>
                {s.publishedAt && <span className="shrink-0">· {formatDate(s.publishedAt)}</span>}
              </span>
              {s.snippet && <span className="line-clamp-2 text-[12.5px] leading-5 text-muted-foreground">{s.snippet}</span>}
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover/src:-translate-y-0.5 group-hover/src:translate-x-0.5 group-hover/src:text-foreground" />
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default CitationProvider;

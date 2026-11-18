"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { BsOpenai } from "react-icons/bs";
import { RiGrokAiFill, RiDeepseekFill, RiGeminiFill, RiPerplexityLine } from "react-icons/ri";
import { SiClaudecode, SiV0 } from "react-icons/si";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ModelTier = "basic" | "advanced";

export interface AIModel {
  /** Stable unique id, e.g. "claude-sonnet-4-6" */
  id: string;
  /** Display name, e.g. "Claude Sonnet 4.5" */
  name: string;
  /** Section this model is grouped under */
  tier: ModelTier;
  /** Icon renderer, sized by the list row */
  icon: React.ReactNode;
  /** Icon color, any Tailwind text color class. Defaults to a neutral tone. */
  iconClassName?: string;
  /** Disable a specific row (e.g. not available on current plan) */
  disabled?: boolean;
  /** Optional short description, shown under the name and used as aria-description */
  description?: string;
}

export interface ModelPickerProps {
  /** Full list of selectable models */
  models?: AIModel[];
  /** Currently selected model id (controlled) */
  selectedModelId?: string | null;
  /** Called when the user picks a model */
  onSelectModel?: (model: AIModel) => void;
  /** Placeholder text for the search field */
  searchPlaceholder?: string;
  /** Controlled search value */
  searchValue?: string;
  /** Called on search value change (component manages its own state if omitted) */
  onSearchChange?: (value: string) => void;
  /** Labels for each section header */
  sectionLabels?: Partial<Record<ModelTier, string>>;
  /** Extra classes on the outer panel */
  className?: string;
  /** Max height of the scrollable list area */
  maxListHeight?: number | string;
  /** Enable the coverflow-style scale/tilt effect on rows while scrolling */
  enableTiltEffect?: boolean;
  /** Focus the search field on mount. Defaults to true. */
  autoFocus?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Default demo dataset (replace with your real model list)           */
/* ------------------------------------------------------------------ */

export const defaultModels: AIModel[] = [
  { id: "gpt-5-mini", name: "GPT-5 mini", tier: "basic", icon: <BsOpenai size={18} />, description: "Fast and inexpensive" },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", tier: "basic", icon: <SiClaudecode size={18} />, description: "Quick everyday tasks" },
  { id: "gemini-3-flash", name: "Gemini 3.0 Flash", tier: "basic", icon: <RiGeminiFill size={18} />, description: "Low latency" },
  { id: "gpt-5-2", name: "GPT-5.2", tier: "advanced", icon: <BsOpenai size={18} />, description: "Strong general reasoning" },
  { id: "gemini-3-pro", name: "Gemini 3 Pro", tier: "advanced", icon: <RiGeminiFill size={18} />, description: "Long context" },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", tier: "advanced", icon: <SiClaudecode size={18} />, description: "Great at code" },
  { id: "grok-4", name: "Grok 4", tier: "advanced", icon: <RiGrokAiFill size={18} /> },
  { id: "deepseek-v3-2", name: "DeepSeek v3.2", tier: "advanced", icon: <RiDeepseekFill size={18} /> },
  { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", tier: "advanced", icon: <SiClaudecode size={18} />, disabled: true, description: "Not on your plan" },
  { id: "v0", name: "v0", tier: "advanced", icon: <SiV0 size={18} /> },
  { id: "perplexity", name: "Perplexity", tier: "advanced", icon: <RiPerplexityLine size={18} /> },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const DEFAULT_SECTION_LABELS: Record<ModelTier, string> = { basic: "Basic", advanced: "Advanced" };
const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;

type RowTransform = { scale: number; rotate: number; opacity: number };
const REST_TRANSFORM: RowTransform = { scale: 1, rotate: 0, opacity: 1 };

export function ModelPicker({
  models = defaultModels,
  selectedModelId,
  onSelectModel,
  searchPlaceholder = "Search models…",
  searchValue,
  onSearchChange,
  sectionLabels,
  className = "",
  maxListHeight = 360,
  enableTiltEffect = true,
  autoFocus = true,
}: ModelPickerProps) {
  const reduce = useReducedMotion();
  const tilt = enableTiltEffect && !reduce;
  const uid = React.useId();
  const [internalSearch, setInternalSearch] = React.useState("");
  const search = searchValue ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [transforms, setTransforms] = React.useState<Record<string, RowTransform>>({});
  const labels = { ...DEFAULT_SECTION_LABELS, ...sectionLabels };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = q ? models.filter((m) => m.name.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q)) : models;
    return { basic: matches.filter((m) => m.tier === "basic"), advanced: matches.filter((m) => m.tier === "advanced") };
  }, [models, search]);

  const flatList = React.useMemo(() => [...filtered.basic, ...filtered.advanced], [filtered]);

  React.useEffect(() => {
    const sel = flatList.findIndex((m) => m.id === selectedModelId);
    setActiveIndex(search ? 0 : Math.max(0, sel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* coverflow tilt while scrolling */
  const listRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const rafRef = React.useRef<number | null>(null);

  const updateTransforms = React.useCallback(() => {
    if (!tilt) return;
    const container = listRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const half = rect.height / 2 || 1;
    const next: Record<string, RowTransform> = {};
    rowRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      const dist = r.top + r.height / 2 - centerY;
      const norm = Math.min(Math.abs(dist) / half, 1);
      next[id] = { scale: 1 + (1 - norm) * 0.04, rotate: (dist / half) * 8, opacity: 1 - norm * 0.35 };
    });
    setTransforms(next);
  }, [tilt]);

  const handleScroll = React.useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateTransforms);
  }, [updateTransforms]);

  React.useEffect(() => {
    const id = requestAnimationFrame(updateTransforms);
    return () => cancelAnimationFrame(id);
  }, [filtered, updateTransforms]);

  React.useEffect(() => () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
  }, []);

  // keep the keyboard-active row visible
  React.useEffect(() => {
    const m = flatList[activeIndex];
    if (m) rowRefs.current.get(m.id)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, flatList]);

  function move(dir: 1 | -1) {
    if (!flatList.length) return;
    let i = activeIndex;
    for (let n = 0; n < flatList.length; n++) {
      i = (i + dir + flatList.length) % flatList.length;
      if (!flatList[i].disabled) break;
    }
    setActiveIndex(i);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!flatList.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatList[activeIndex];
      if (target && !target.disabled) onSelectModel?.(target);
    }
  }

  const activeId = flatList[activeIndex] ? `${uid}-${flatList[activeIndex].id}` : undefined;

  function renderRow(model: AIModel, flatIndex: number) {
    const isSelected = model.id === selectedModelId;
    const isActive = flatIndex === activeIndex;
    const t = transforms[model.id] ?? REST_TRANSFORM;

    return (
      <motion.button
        key={model.id}
        id={`${uid}-${model.id}`}
        ref={(el) => {
          if (el) rowRefs.current.set(model.id, el);
          else rowRefs.current.delete(model.id);
        }}
        type="button"
        role="option"
        tabIndex={-1}
        aria-selected={isSelected}
        aria-disabled={model.disabled || undefined}
        disabled={model.disabled}
        onMouseEnter={() => !model.disabled && setActiveIndex(flatIndex)}
        onClick={() => !model.disabled && onSelectModel?.(model)}
        animate={tilt ? { scale: t.scale, rotateX: t.rotate, opacity: model.disabled ? 0.4 : t.opacity } : { opacity: model.disabled ? 0.4 : 1 }}
        whileTap={model.disabled ? undefined : { scale: (tilt ? t.scale : 1) * 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left will-change-transform ${
          model.disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {isActive && !model.disabled && (
          <motion.span
            layoutId={reduce ? undefined : `${uid}-active`}
            className="absolute inset-0 rounded-lg bg-neutral-100 dark:bg-neutral-800/70"
            transition={{ type: "spring", stiffness: 500, damping: 38 }}
          />
        )}
        <span className="relative flex min-w-0 items-center gap-2.5">
          <span className={`flex size-7 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 ${model.iconClassName ?? "text-neutral-800 dark:text-neutral-200"}`}>
            {model.icon}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[13.5px] font-medium text-neutral-900 dark:text-neutral-100">{model.name}</span>
            {model.description && <span className="truncate text-[11.5px] text-neutral-500 dark:text-neutral-400">{model.description}</span>}
          </span>
        </span>
        <AnimatePresence>
          {isSelected && (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 500, damping: 25 }} className="relative shrink-0">
              <Check className="size-4 text-neutral-900 dark:text-neutral-100" strokeWidth={2.5} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  let runningIndex = -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.98, transition: { duration: 0.12 } }}
      transition={SPRING}
      className={`w-[320px] overflow-hidden rounded-2xl border border-neutral-200 bg-white font-sans shadow-[0_16px_40px_-16px_rgba(0,0,0,0.2)] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Search */}
      <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3 dark:border-neutral-900">
        <Search className="size-4 shrink-0 text-neutral-400 dark:text-neutral-500" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search models"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${uid}-list`}
          aria-activedescendant={activeId}
          className="w-full bg-transparent text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          autoFocus={autoFocus}
        />
      </div>

      <div className="relative">
        <div
          id={`${uid}-list`}
          ref={listRef}
          onScroll={handleScroll}
          role="listbox"
          aria-label="Available models"
          className="overflow-y-auto px-2 py-2 [&::-webkit-scrollbar]:hidden"
          style={{
            maxHeight: maxListHeight,
            scrollbarWidth: "none",
            perspective: 700,
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0, black 14px, black calc(100% - 14px), transparent 100%)",
          }}
        >
          {flatList.length === 0 ? (
            <p className="px-2.5 py-8 text-center text-[13px] text-neutral-500 dark:text-neutral-400">No models match &ldquo;{search}&rdquo;</p>
          ) : (
            (["basic", "advanced"] as const).map((tier) =>
              filtered[tier].length > 0 ? (
                <div key={tier} role="group" aria-label={labels[tier]} className="mb-1 last:mb-0">
                  <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">{labels[tier]}</p>
                  {filtered[tier].map((m) => {
                    runningIndex += 1;
                    return renderRow(m, runningIndex);
                  })}
                </div>
              ) : null
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo wrapper — trigger button + popover, for preview purposes.     */
/*  Swap for your own popover primitive (e.g. Radix Popover).           */
/* ------------------------------------------------------------------ */

export default function ModelPickerDemo() {
  const [open, setOpen] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState("gpt-5-2");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const selected = defaultModels.find((m) => m.id === selectedId);

  return (
    <div className="flex min-h-[560px] w-full items-start justify-center overflow-hidden px-4 pt-16">
      <div ref={containerRef} className="relative">
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-[13.5px] font-medium text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-neutral-50 outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          <span className="flex size-4 items-center justify-center text-neutral-700 dark:text-neutral-300 [&_svg]:size-4">{selected?.icon}</span>
          {selected?.name ?? "Select model"}
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING} className="flex text-neutral-400">
            <ChevronDown className="size-3.5" />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {open && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-50">
              <ModelPicker
                models={defaultModels}
                selectedModelId={selectedId}
                onSelectModel={(m) => {
                  setSelectedId(m.id);
                  setOpen(false);
                }}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

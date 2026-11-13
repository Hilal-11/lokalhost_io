"use client";

import * as React from "react";
import { Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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
  /** Icon color, any Tailwind text color class */
  iconClassName?: string;
  /** Disable a specific row (e.g. not available on current plan) */
  disabled?: boolean;
  /** Optional short description, used as an aria-description */
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
  /** Enable the coverflow-style scale/tilt effect on the centered row while scrolling */
  enableTiltEffect?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Default demo dataset (replace with your real model list)           */
/* ------------------------------------------------------------------ */

export const defaultModels: AIModel[] = [
  { id: "gpt-5-mini", name: "GPT-5 mini", tier: "basic", icon: <BsOpenai size={20} />, iconClassName: "text-neutral-900 dark:text-neutral-100" },
  { id: "claude-haiku-4-5", name: "Claude Haiku 4.5", tier: "basic", icon: <SiClaudecode size={20} />, iconClassName: "text-orange-500" },
  { id: "gemini-3-flash", name: "Gemini 3.0 Flash", tier: "basic", icon: <RiGeminiFill size={20} />, iconClassName: "text-blue-500" },

  { id: "gpt-5-2", name: "GPT-5.2", tier: "advanced", icon: <BsOpenai size={20} />, iconClassName: "text-neutral-900 dark:text-neutral-100" },
  { id: "gemini-3-pro", name: "Gemini 3 Pro", tier: "advanced", icon: <RiGeminiFill size={20} />, iconClassName: "text-blue-500" },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5", tier: "advanced", icon: <SiClaudecode size={20} />, iconClassName: "text-orange-500" },
  { id: "grok-4", name: "Grok 4", tier: "advanced", icon: <RiGrokAiFill size={20} />, iconClassName: "text-neutral-900 dark:text-neutral-100" },
  { id: "deepseek-v3-2", name: "DeepSeek v3.2", tier: "advanced", icon: <RiDeepseekFill size={20} />, iconClassName: "text-blue-600" },
  { id: "claude-3-5-haiku", name: "Claude 3.5 Haiku", tier: "advanced", icon: <SiClaudecode size={20} />, iconClassName: "text-neutral-900 dark:text-neutral-100" },
  { id: "v0", name: "v0", tier: "advanced", icon: <SiV0 size={20} />, iconClassName: "text-neutral-900 dark:text-neutral-100" },
  { id: "perplexity", name: "Perplexity", tier: "advanced", icon: <RiPerplexityLine size={20} />, iconClassName: "text-cyan-600" },
];

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const DEFAULT_SECTION_LABELS: Record<ModelTier, string> = {
  basic: "Basic",
  advanced: "Advanced",
};

type RowTransform = { scale: number; rotate: number; opacity: number };
const REST_TRANSFORM: RowTransform = { scale: 1, rotate: 0, opacity: 1 };

export function ModelPicker({
  models = defaultModels,
  selectedModelId,
  onSelectModel,
  searchPlaceholder = "Search models...",
  searchValue,
  onSearchChange,
  sectionLabels,
  className = "",
  maxListHeight = 360,
  enableTiltEffect = true,
}: ModelPickerProps) {
  const [internalSearch, setInternalSearch] = React.useState("");
  const search = searchValue ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [transforms, setTransforms] = React.useState<Record<string, RowTransform>>({});

  const labels = { ...DEFAULT_SECTION_LABELS, ...sectionLabels };

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = q ? models.filter((m) => m.name.toLowerCase().includes(q)) : models;
    return {
      basic: matches.filter((m) => m.tier === "basic"),
      advanced: matches.filter((m) => m.tier === "advanced"),
    };
  }, [models, search]);

  const flatList = [...filtered.basic, ...filtered.advanced];

  React.useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  /* -------------------------------------------------------------- */
  /*  Scroll-driven "coverflow" scale/tilt effect                     */
  /* -------------------------------------------------------------- */

  const listRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const rafRef = React.useRef<number | null>(null);

  const updateTransforms = React.useCallback(() => {
    if (!enableTiltEffect) return;
    const container = listRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;
    const halfHeight = containerRect.height / 2 || 1;

    const next: Record<string, RowTransform> = {};

    rowRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const dist = itemCenter - centerY;
      const absDist = Math.abs(dist);
      const norm = Math.min(absDist / halfHeight, 1);

      next[id] = {
        scale: 1 + (1 - norm) * 0.1, // up to 1.1x right at the center
        rotate: (dist / halfHeight) * 10, // degrees, tilts opposite above/below center
        opacity: 1 - norm * 0.4,
      };
    });

    setTransforms(next);
  }, [enableTiltEffect]);

  const handleScroll = React.useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateTransforms);
  }, [updateTransforms]);

  React.useEffect(() => {
    // Recompute once rows change (e.g. after filtering) so the initial state is correct.
    const id = requestAnimationFrame(updateTransforms);
    return () => cancelAnimationFrame(id);
  }, [filtered, updateTransforms]);

  React.useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (flatList.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatList[activeIndex];
      if (target && !target.disabled) onSelectModel?.(target);
    }
  }

  function renderRow(model: AIModel, flatIndex: number) {
    const isSelected = model.id === selectedModelId;
    const isActive = flatIndex === activeIndex;
    const t = transforms[model.id] ?? REST_TRANSFORM;

    return (
      <motion.button
        key={model.id}
        ref={(el) => {
          if (el) rowRefs.current.set(model.id, el);
          else rowRefs.current.delete(model.id);
        }}
        type="button"
        role="option"
        aria-selected={isSelected}
        disabled={model.disabled}
        onMouseEnter={() => setActiveIndex(flatIndex)}
        onClick={() => !model.disabled && onSelectModel?.(model)}
        animate={enableTiltEffect ? { scale: t.scale, rotateX: t.rotate, opacity: t.opacity } : undefined}
        whileHover={model.disabled ? undefined : { x: 2 }}
        whileTap={model.disabled ? undefined : { scale: (enableTiltEffect ? t.scale : 1) * 0.97 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[13.5px] will-change-transform
          ${isSelected ? "bg-neutral-100 dark:bg-neutral-900" : isActive ? "bg-neutral-50 dark:bg-neutral-900" : "bg-transparent"}
          ${model.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}
        `}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center text-[15px] ${model.iconClassName ?? "text-neutral-700 dark:text-neutral-200"}`}>
            {model.icon}
          </span>
          <span className="truncate font-medium text-neutral-900 dark:text-neutral-200">{model.name}</span>
        </span>
        <AnimatePresence>
          {isSelected && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="shrink-0"
            >
              <Check className="h-4 w-4 text-neutral-900 dark:text-neutral-200" strokeWidth={2.5} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  let runningIndex = -1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className={`w-[320px] overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-[0_8px_30px_rgba(0,0,0,0.08)] font-sans pl-[2px] ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Search */}
      <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-900 px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-700" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search models"
          className="w-full bg-transparent text-[14px] text-neutral-900 placeholder:text-neutral-400 dark:text-neutral-700 dark:placeholder:text-neutral-700 focus:outline-none"
          autoFocus
        />
      </div>

      {/* List wrapper — holds the fade overlays that sit above the scroll area */}
      <div className="relative">
        {/* top fade, right under the search/toggle divider */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-linear-to-b from-white to-transparent dark:from-neutral-950" />

        <div
          ref={listRef}
          onScroll={handleScroll}
          role="listbox"
          aria-label="Available models"
          className="overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:hidden"
          style={{
            maxHeight: maxListHeight,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            perspective: 700,
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0, black 14px, black calc(100% - 10px), transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, transparent 0, black 14px, black calc(100% - 10px), transparent 100%)",
          }}
        >
          {flatList.length === 0 ? (
            <p className="px-2.5 py-6 text-center text-[13px] text-neutral-400 dark:text-neutral-700">
              No models match &ldquo;{search}&rdquo;
            </p>
          ) : (
            <>
              {filtered.basic.length > 0 && (
                <div className="mb-1">
                  <p className="px-2.5 pb-1 pt-1 text-[11px] font-sans font-semibold tracking-wide text-neutral-400">
                    {labels.basic}
                  </p>
                  {filtered.basic.map((m) => {
                    runningIndex += 1;
                    return renderRow(m, runningIndex);
                  })}
                </div>
              )}

              {filtered.advanced.length > 0 && (
                <div>
                  <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold tracking-wide text-neutral-400">
                    {labels.advanced}
                  </p>
                  {filtered.advanced.map((m) => {
                    runningIndex += 1;
                    return renderRow(m, runningIndex);
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* bottom fade, small/micro so it doesn't fully hide the last row */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-linear-to-t from-white to-transparent dark:from-neutral-950" />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo wrapper — trigger button + popover, for preview purposes.     */
/*  Delete this section once you wire ModelPicker into your own        */
/*  popover/dropdown primitive (e.g. Radix Popover, shadcn Popover).    */
/* ------------------------------------------------------------------ */

export default function ModelPickerDemo() {
  const [open, setOpen] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState("gpt-5-2");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selected = defaultModels.find((m) => m.id === selectedId);

  return (
    <div className="flex min-h-[560px] w-full items-center justify-center bg-neutral-50 px-4 overflow-hidden">
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13.5px] font-medium text-neutral-900 shadow-sm"
        >
          <span className={`flex h-4 w-4 items-center justify-center text-[14px] ${selected?.iconClassName}`}>
            {selected?.icon}
          </span>
          {selected?.name ?? "Select model"}
        </button>

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
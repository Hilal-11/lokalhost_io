"use client";

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useId,
  type CSSProperties,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IoChevronDown, IoCheckmark, IoSearch } from "react-icons/io5";
import { SiGooglegemini, SiV0, SiCursor } from "react-icons/si";
import { TbBrandMeta } from "react-icons/tb";
import { RiOpenaiFill } from "react-icons/ri";
import { BsAnthropic } from "react-icons/bs";
import type { IconType } from "react-icons";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ModelOption {
  id: string;
  label: string;
  icon: IconType;
  /** Optional short subtext shown under the label in the dropdown (e.g. "Fast, balanced"). */
  description?: string;
  disabled?: boolean;
}

export type ModelSelectorSize = "sm" | "md" | "lg";
export type ModelSelectorRadius = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ModelSelectorColors {
  triggerBg?: string;
  triggerHoverBg?: string;
  panelBg?: string;
  panelBorder?: string;
  itemHoverBg?: string;
  text?: string;
  muted?: string;
  accent?: string;
}

export interface ModelSelectorProps {
  models?: ModelOption[];
  /** Uncontrolled default selection, used if `value` isn't passed. */
  defaultValue?: string;
  /** Controlled selected model id. */
  value?: string;
  /** Fired with the newly selected model id. */
  onChange?: (id: string, model: ModelOption) => void;
  /** Controlled open state. Omit to let the component manage it internally. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trigger sizing. Number (px) or any CSS length. Falls back to defaults per `size`. */
  width?: number | string;
  height?: number | string;
  /** Preset size affecting padding/font/icon scale. Default "md". */
  size?: ModelSelectorSize;
  /** Corner rounding for trigger and panel unless overridden individually. Default "sm". */
  radius?: ModelSelectorRadius;
  triggerRadius?: ModelSelectorRadius;
  panelRadius?: ModelSelectorRadius;
  /** Width of the dropdown panel. Defaults to the trigger width, min 180px. */
  panelWidth?: number | string;
  /** Max height of the dropdown before it scrolls. Default 280px. */
  panelMaxHeight?: number | string;
  /** Horizontal alignment of the panel relative to the trigger. Default "start". */
  align?: "start" | "center" | "end";
  /** Color overrides. Anything omitted falls back to the neutral theme. */
  colors?: ModelSelectorColors;
  /** Search input at the top of the panel. Default: auto (true if more than 5 models). */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Message shown when a search yields no results. */
  emptyMessage?: string;
  /** Shows the checkmark next to the selected item. Default true. */
  showCheckmark?: boolean;
  /** Closes the panel after a selection. Default true. */
  closeOnSelect?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Fully custom trigger renderer. */
  renderTrigger?: (selected: ModelOption | undefined, open: boolean) => ReactNode;
  /** Fully custom row renderer inside the dropdown. */
  renderItem?: (model: ModelOption, isSelected: boolean) => ReactNode;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  itemClassName?: string;
  style?: CSSProperties;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

/* -------------------------------------------------------------------------- */
/*  Static data                                                                */
/* -------------------------------------------------------------------------- */

export const defaultModels: ModelOption[] = [
  { id: "claude", label: "Claude Sonnet 5", icon: BsAnthropic, description: "Best for code" },
  { id: "gpt", label: "GPT-5", icon: RiOpenaiFill, description: "General purpose" },
  { id: "gemini", label: "Gemini 2.5", icon: SiGooglegemini, description: "Long context" },
  { id: "llama", label: "Llama 4", icon: TbBrandMeta, description: "Open weights" },
  { id: "v0", label: "Vercel v0", icon: SiV0, description: "UI generation" },
  { id: "cursor", label: "Cursor", icon: SiCursor, disabled: true, description: "Coming soon" },
];

/* -------------------------------------------------------------------------- */
/*  Style maps                                                                 */
/* -------------------------------------------------------------------------- */

const RADIUS_CLASS: Record<ModelSelectorRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

const ITEM_RADIUS: Record<ModelSelectorRadius, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-md",
  xl: "rounded-lg",
  "2xl": "rounded-xl",
  full: "rounded-xl",
};

const SIZE_MAP: Record<
  ModelSelectorSize,
  { triggerHeight: string; triggerWidth: string; triggerPadX: string; triggerText: string; triggerIcon: string; itemPadY: string; itemText: string; itemIcon: string; chevron: string }
> = {
  sm: { triggerHeight: "1.75rem", triggerWidth: "8rem", triggerPadX: "px-2", triggerText: "text-[12px]", triggerIcon: "h-3 w-3", itemPadY: "py-1", itemText: "text-[12.5px]", itemIcon: "h-3.5 w-3.5", chevron: "h-3 w-3" },
  md: { triggerHeight: "2rem", triggerWidth: "9rem", triggerPadX: "px-2.5", triggerText: "text-[13px]", triggerIcon: "h-3.5 w-3.5", itemPadY: "py-1.5", itemText: "text-[13px]", itemIcon: "h-4 w-4", chevron: "h-3.5 w-3.5" },
  lg: { triggerHeight: "2.5rem", triggerWidth: "11rem", triggerPadX: "px-3", triggerText: "text-[14px]", triggerIcon: "h-4 w-4", itemPadY: "py-2", itemText: "text-[14px]", itemIcon: "h-[18px] w-[18px]", chevron: "h-4 w-4" },
};

const ALIGN: Record<NonNullable<ModelSelectorProps["align"]>, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

const toCssLength = (v: number | string | undefined) => (v === undefined ? undefined : typeof v === "number" ? `${v}px` : v);
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950";

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export function ModelsSelector({
  models = defaultModels,
  defaultValue,
  value,
  onChange,
  open: openProp,
  onOpenChange,
  width,
  height,
  size = "md",
  radius = "sm",
  triggerRadius,
  panelRadius,
  panelWidth,
  panelMaxHeight = 280,
  align = "start",
  colors,
  searchable,
  searchPlaceholder = "Search models…",
  emptyMessage = "No models found",
  showCheckmark = true,
  closeOnSelect = true,
  disabled = false,
  placeholder = "Select model",
  renderTrigger,
  renderItem,
  className = "",
  triggerClassName = "",
  panelClassName = "",
  itemClassName = "",
  style,
  id,
  name,
  "aria-label": ariaLabel,
}: ModelSelectorProps) {
  const reduce = useReducedMotion();
  const isControlledValue = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? models[0]?.id);
  const selectedId = isControlledValue ? value : internalValue;
  const selected = models.find((m) => m.id === selectedId);

  const isControlledOpen = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlledOpen ? Boolean(openProp) : internalOpen;

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const triggerId = id ?? `model-selector-${reactId}`;
  const listId = `${triggerId}-list`;

  const shouldSearch = searchable ?? models.length > 5;

  const filteredModels = useMemo(() => {
    if (!shouldSearch || !query.trim()) return models;
    const q = query.trim().toLowerCase();
    return models.filter((m) => m.label.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
  }, [models, query, shouldSearch]);

  const setOpen = (next: boolean) => {
    if (!isControlledOpen) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) setQuery("");
  };

  // outside click / escape
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && e.target instanceof Node && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // on open: start on the selected row and focus search (or the list)
  useEffect(() => {
    if (!open) return;
    setActiveIndex(Math.max(0, filteredModels.findIndex((m) => m.id === selectedId)));
    const t = setTimeout(() => (shouldSearch ? searchRef.current : listRef.current)?.focus(), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (activeIndex >= filteredModels.length) setActiveIndex(0);
  }, [filteredModels, activeIndex]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const handleSelect = (model: ModelOption) => {
    if (model.disabled) return;
    if (!isControlledValue) setInternalValue(model.id);
    onChange?.(model.id, model);
    if (closeOnSelect) {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const step = (dir: 1 | -1) => {
    const n = filteredModels.length;
    let i = activeIndex;
    for (let k = 0; k < n; k++) {
      i = (i + dir + n) % n;
      if (!filteredModels[i].disabled) break;
    }
    setActiveIndex(i);
  };

  const handleListKeyDown = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (!filteredModels.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const model = filteredModels[activeIndex];
      if (model) handleSelect(model);
    }
  };

  const s = SIZE_MAP[size];
  const finalTriggerRadius = RADIUS_CLASS[triggerRadius ?? radius];
  const finalPanelRadius = RADIUS_CLASS[panelRadius ?? radius];
  const itemRadius = ITEM_RADIUS[panelRadius ?? radius];

  const triggerStyle: CSSProperties = {
    width: toCssLength(width),
    height: toCssLength(height),
    backgroundColor: colors?.triggerBg,
    color: colors?.text,
    ...style,
  };
  const panelStyle: CSSProperties = {
    width: toCssLength(panelWidth) ?? toCssLength(width),
    maxHeight: toCssLength(panelMaxHeight),
    backgroundColor: colors?.panelBg,
    borderColor: colors?.panelBorder,
  };

  const SelectedIcon = selected?.icon;
  const activeDesc = open && filteredModels[activeIndex] ? `${listId}-${filteredModels[activeIndex].id}` : undefined;

  const triggerShared = {
    ref: triggerRef,
    role: "combobox" as const,
    tabIndex: disabled ? -1 : 0,
    "aria-haspopup": "listbox" as const,
    "aria-expanded": open,
    "aria-controls": listId,
    "aria-disabled": disabled,
    id: triggerId,
    onClick: () => !disabled && setOpen(!open),
    onKeyDown: handleTriggerKeyDown,
  };

  return (
    <div ref={rootRef} className={["relative inline-block font-sans", className].join(" ")}>
      {name && <input type="hidden" name={name} value={selectedId ?? ""} />}

      {renderTrigger ? (
        <div {...triggerShared} aria-label={ariaLabel ?? "Select model"} className={ring}>
          {renderTrigger(selected, open)}
        </div>
      ) : (
        <motion.div
          {...triggerShared}
          aria-label={ariaLabel ?? `Model: ${selected?.label ?? placeholder}`}
          whileTap={disabled ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ ...triggerStyle, height: triggerStyle.height ?? s.triggerHeight, width: triggerStyle.width ?? s.triggerWidth }}
          className={[
            finalTriggerRadius,
            !colors?.triggerBg
              ? "border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              : "",
            !colors?.triggerBg && !disabled ? "hover:border-neutral-300 hover:bg-neutral-50 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/70" : "",
            open && !colors?.triggerBg ? "border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/70" : "",
            "flex select-none items-center gap-1.5 transition-colors duration-150",
            s.triggerPadX,
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            ring,
            triggerClassName,
          ].join(" ")}
        >
          {SelectedIcon && (
            <span className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-400" style={{ color: colors?.muted }}>
              <SelectedIcon className={s.triggerIcon} aria-hidden="true" />
            </span>
          )}
          <span className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={selected?.id ?? "none"}
                initial={{ y: reduce ? 0 : 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: reduce ? 0 : -8, opacity: 0 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className={["block truncate font-medium text-neutral-800 dark:text-neutral-100", s.triggerText].join(" ")}
                style={{ color: colors?.text }}
              >
                {selected?.label ?? placeholder}
              </motion.span>
            </AnimatePresence>
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="flex shrink-0">
            <IoChevronDown className={["text-neutral-400 dark:text-neutral-500", s.chevron].join(" ")} style={{ color: colors?.muted }} aria-hidden="true" />
          </motion.span>
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : -4, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4, scale: reduce ? 1 : 0.97, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ ...panelStyle, transformOrigin: align === "end" ? "top right" : align === "center" ? "top center" : "top left" }}
            className={[
              "absolute top-[calc(100%+6px)] z-50 flex min-w-[200px] flex-col overflow-hidden border p-1",
              ALIGN[align],
              finalPanelRadius,
              !colors?.panelBg ? "bg-white dark:bg-neutral-900" : "",
              !colors?.panelBorder ? "border-neutral-200 dark:border-neutral-800" : "",
              "shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)]",
              panelClassName,
            ].join(" ")}
          >
            {shouldSearch && (
              <div className={["mb-1 flex items-center gap-1.5 border-b border-neutral-100 px-2 pb-1.5 pt-1 dark:border-neutral-800"].join(" ")}>
                <IoSearch className="size-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleListKeyDown}
                  placeholder={searchPlaceholder}
                  aria-label="Search models"
                  aria-controls={listId}
                  aria-activedescendant={activeDesc}
                  className="h-7 w-full bg-transparent text-[13px] text-neutral-800 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                />
              </div>
            )}

            <div
              id={listId}
              ref={listRef}
              role="listbox"
              aria-labelledby={triggerId}
              aria-activedescendant={activeDesc}
              tabIndex={shouldSearch ? -1 : 0}
              onKeyDown={handleListKeyDown}
              className="flex flex-col gap-0.5 overflow-y-auto outline-none [scrollbar-width:thin]"
            >
              {filteredModels.length === 0 && <div className="px-2.5 py-4 text-center text-[13px] text-neutral-500 dark:text-neutral-400">{emptyMessage}</div>}

              {filteredModels.map((model, index) => {
                const isSelected = model.id === selectedId;
                const isActive = index === activeIndex && !model.disabled;

                if (renderItem) {
                  return (
                    <div
                      key={model.id}
                      id={`${listId}-${model.id}`}
                      data-index={index}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(model)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      {renderItem(model, isSelected)}
                    </div>
                  );
                }

                const Icon = model.icon;
                return (
                  <button
                    key={model.id}
                    id={`${listId}-${model.id}`}
                    data-index={index}
                    type="button"
                    role="option"
                    tabIndex={-1}
                    aria-selected={isSelected}
                    aria-disabled={model.disabled || undefined}
                    disabled={model.disabled}
                    onClick={() => handleSelect(model)}
                    onMouseEnter={() => !model.disabled && setActiveIndex(index)}
                    className={[
                      "relative flex w-full items-center gap-2.5 px-2.5 text-left outline-none",
                      itemRadius,
                      s.itemPadY,
                      model.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
                      itemClassName,
                    ].join(" ")}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={reduce ? undefined : `${reactId}-active`}
                        className={["absolute inset-0", itemRadius, !colors?.itemHoverBg ? "bg-neutral-100 dark:bg-neutral-800" : ""].join(" ")}
                        style={colors?.itemHoverBg ? { backgroundColor: colors.itemHoverBg } : undefined}
                        transition={{ type: "spring", stiffness: 500, damping: 38 }}
                      />
                    )}
                    <span className="relative flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-400" style={{ color: colors?.muted }}>
                      <Icon className={s.itemIcon} aria-hidden="true" />
                    </span>
                    <span className="relative min-w-0 flex-1 text-left">
                      <span className={["block truncate font-medium text-neutral-800 dark:text-neutral-100", s.itemText].join(" ")} style={{ color: colors?.text }}>
                        {model.label}
                      </span>
                      {model.description && <span className="block truncate text-[11.5px] text-neutral-500 dark:text-neutral-400">{model.description}</span>}
                    </span>
                    <AnimatePresence>
                      {showCheckmark && isSelected && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 26 }}
                          className="relative flex"
                        >
                          <IoCheckmark className="size-4 shrink-0 text-neutral-900 dark:text-neutral-100" style={{ color: colors?.accent }} aria-hidden="true" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModelsSelector;

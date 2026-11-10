"use client"
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
  /** Trigger background. Default: neutral-100 / neutral-900 */
  triggerBg?: string;
  triggerHoverBg?: string;
  /** Dropdown panel background. Default: white / neutral-900 */
  panelBg?: string;
  panelBorder?: string;
  /** Row hover background inside the panel. */
  itemHoverBg?: string;
  /** Main text color. */
  text?: string;
  /** Muted/icon color. */
  muted?: string;
  /** Checkmark / selected-state accent color. */
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

  /** Trigger sizing. Accepts number (px) or any CSS length string. Falls back to sensible defaults per `size`. */
  width?: number | string;
  height?: number | string;
  /** Preset size affecting padding/font/icon scale. Default "md". */
  size?: ModelSelectorSize;
  /** Corner rounding for both trigger and panel, unless overridden individually. Default "sm". */
  radius?: ModelSelectorRadius;
  triggerRadius?: ModelSelectorRadius;
  panelRadius?: ModelSelectorRadius;

  /** Width of the dropdown panel. Defaults to matching trigger width if omitted, min 180px. */
  panelWidth?: number | string;
  /** Max height of the dropdown before it scrolls. Default 280px. */
  panelMaxHeight?: number | string;
  /** Horizontal alignment of the panel relative to the trigger. Default "center". */
  /** Color overrides. Anything omitted falls back to the default neutral theme. */
  colors?: ModelSelectorColors;

  /** Shows a search input at the top of the panel when there are more than a few models. Default: auto (true if models.length > 5). */
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

  /** Fully custom trigger renderer — receives the selected model (or undefined) and open state. */
  renderTrigger?: (selected: ModelOption | undefined, open: boolean) => ReactNode;
  /** Fully custom row renderer inside the dropdown. */
  renderItem?: (model: ModelOption, isSelected: boolean) => ReactNode;

  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  itemClassName?: string;
  style?: CSSProperties;

  /** Useful for forms / testing. */
  id?: string;
  name?: string;
  "aria-label"?: string;
}

/* -------------------------------------------------------------------------- */
/*  Static data                                                                */
/* -------------------------------------------------------------------------- */

export const defaultModels: ModelOption[] = [
  { id: "claude", label: "Claude Sonnet 5", icon: BsAnthropic },
  { id: "gpt", label: "GPT-5", icon: RiOpenaiFill },
  { id: "gemini", label: "Gemini 2.5", icon: SiGooglegemini },
  { id: "llama", label: "Llama 4", icon: TbBrandMeta },
  { id: "v0", label: "Vercel V0", icon: SiV0 },
  { id: "cursor", label: "Cursor", icon: SiCursor, disabled: true},
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


const SIZE_MAP: Record<
  ModelSelectorSize,
  {
    triggerHeight: string;
    triggerWidth: string;
    triggerPadX: string;
    triggerText: string;
    triggerIcon: string;
    itemPadY: string;
    itemText: string;
    itemIcon: string;
    chevron: string;
  }
> = {
  sm: {
    triggerHeight: "1.5rem",
    triggerWidth: "7rem",
    triggerPadX: "px-1.5",
    triggerText: "text-[11px]",
    triggerIcon: "h-[12px] w-[12px]",
    itemPadY: "py-[4px]",
    itemText: "text-[13px]",
    itemIcon: "h-4 w-4",
    chevron: "h-3 w-3",
  },
  md: {
    triggerHeight: "1.75rem",
    triggerWidth: "8rem",
    triggerPadX: "px-2",
    triggerText: "text-[12px]",
    triggerIcon: "h-[14px] w-[14px]",
    itemPadY: "py-[5px]",
    itemText: "text-[14px]",
    itemIcon: "h-5 w-5",
    chevron: "h-3.5 w-3.5",
  },
  lg: {
    triggerHeight: "2.25rem",
    triggerWidth: "10rem",
    triggerPadX: "px-3",
    triggerText: "text-[14px]",
    triggerIcon: "h-4 w-4",
    itemPadY: "py-[7px]",
    itemText: "text-[15px]",
    itemIcon: "h-5 w-5",
    chevron: "h-4 w-4",
  },
};

const toCssLength = (v: number | string | undefined) =>
  v === undefined ? undefined : typeof v === "number" ? `${v}px` : v;

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
  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const triggerId = id ?? `model-selector-${reactId}`;

  const shouldSearch = searchable ?? models.length > 5;

  const filteredModels = useMemo(() => {
    if (!shouldSearch || !query.trim()) return models;
    const q = query.trim().toLowerCase();
    return models.filter((m) => m.label.toLowerCase().includes(q));
  }, [models, query, shouldSearch]);

  const setOpen = (next: boolean) => {
    if (!isControlledOpen) setInternalOpen(next);
    onOpenChange?.(next);
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
  };

  // outside click / escape
  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && e.target instanceof Node && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // focus search input on open
  useEffect(() => {
    if (open && shouldSearch) {
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open, shouldSearch]);

  // keep active index in range as filtered list changes
  useEffect(() => {
    if (activeIndex >= filteredModels.length) setActiveIndex(0);
  }, [filteredModels, activeIndex]);

  const handleSelect = (model: ModelOption) => {
    if (model.disabled) return;
    if (!isControlledValue) setInternalValue(model.id);
    onChange?.(model.id, model);
    if (closeOnSelect) setOpen(false);
  };

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!filteredModels.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % filteredModels.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + filteredModels.length) % filteredModels.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const model = filteredModels[activeIndex];
      if (model) handleSelect(model);
    }
  };

  const s = SIZE_MAP[size];
  const finalTriggerRadius = RADIUS_CLASS[triggerRadius ?? radius];
  const finalPanelRadius = RADIUS_CLASS[panelRadius ?? radius];

  const triggerStyle: CSSProperties = {
    width: toCssLength(width) ?? undefined,
    height: toCssLength(height) ?? undefined,
    backgroundColor: colors?.triggerBg,
    color: colors?.text,
    ...style,
  };

  const panelStyle: CSSProperties = {
    width: toCssLength(panelWidth) ?? toCssLength(width) ?? undefined,
    maxHeight: toCssLength(panelMaxHeight),
    backgroundColor: colors?.panelBg,
    borderColor: colors?.panelBorder,
  };

  const SelectedIcon = selected?.icon;

  return (
    <div ref={rootRef} className={["relative inline-block font-sans", className].join(" ")}>
      {/* Hidden native input keeps this usable inside plain HTML forms */}
      {name && <input type="hidden" name={name} value={selectedId ?? ""} />}

      {/* Trigger */}
      {renderTrigger ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-disabled={disabled}
          id={triggerId}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleTriggerKeyDown}
        >
          {renderTrigger(selected, open)}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-disabled={disabled}
          aria-label={ariaLabel ?? "Select model"}
          id={triggerId}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleTriggerKeyDown}
          style={triggerStyle}
          className={[
            !width ? s.triggerWidth : "",
            !height ? s.triggerHeight : "",
            finalTriggerRadius,
            !colors?.triggerBg ? "bg-white dark:bg-neutral-900 border" : "",
            !colors?.triggerBg && !disabled
              ? "hover:bg-neutral-200 dark:hover:bg-neutral-800"
              : "",
            "flex items-center gap-1.5 select-none transition-colors duration-100",
            s.triggerPadX,
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            triggerClassName,
          ].join(" ")}
        >
          {SelectedIcon && (
            <span
              className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-400"
              style={{ color: colors?.muted }}
            >
              <SelectedIcon className={s.triggerIcon} aria-hidden="true" />
            </span>
          )}

          <span
            className={[
              "flex-1 truncate font-[500] text-neutral-800 dark:text-neutral-100",
              s.triggerText,
            ].join(" ")}
            style={{ color: colors?.text }}
          >
            {selected?.label ?? placeholder}
          </span>

          <IoChevronDown
            className={[
              "shrink-0 text-neutral-400 dark:text-neutral-500 transition-transform duration-150",
              s.chevron,
              open ? "rotate-180" : "",
            ].join(" ")}
            style={{ color: colors?.muted }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          aria-labelledby={triggerId}
          style={panelStyle}
          className={[
            "absolute top-[calc(100%+8px)] z-50 min-w-[180px]",
            finalPanelRadius,
            "border p-1.5 overflow-hidden flex flex-col",
            !colors?.panelBg ? "bg-white dark:bg-neutral-900" : "",
            !colors?.panelBorder ? "border-neutral-200/80 dark:border-white/10" : "",
            "shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]",
            "dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
            panelClassName,
          ].join(" ")}
        >
          {shouldSearch && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1 rounded-md bg-neutral-100 dark:bg-white/5">
              <IoSearch className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleListKeyDown}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-[13px] text-neutral-800 dark:text-neutral-100 outline-none placeholder:text-neutral-400"
              />
            </div>
          )}

          <div
            ref={listRef}
            onKeyDown={handleListKeyDown}
            className="flex flex-col gap-0.5 overflow-y-auto"
          >
            {filteredModels.length === 0 && (
              <div className="px-2.5 py-3 text-center text-[13px] text-neutral-400">
                {emptyMessage}
              </div>
            )}

            {filteredModels.map((model, index) => {
              const isSelected = model.id === selectedId;
              const isActive = index === activeIndex;

              if (renderItem) {
                return (
                  <div
                    key={model.id}
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
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  disabled={model.disabled}
                  onClick={() => handleSelect(model)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={[
                    "group flex w-full items-center gap-2 rounded-md px-2.5",
                    s.itemPadY,
                    "outline-none transition-colors duration-100 text-left",
                    model.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer",
                    !colors?.itemHoverBg && !model.disabled
                      ? "hover:bg-neutral-100 dark:hover:bg-white/5"
                      : "",
                    isActive && !model.disabled ? "bg-neutral-100 dark:bg-white/5" : "",
                    itemClassName,
                  ].join(" ")}
                  style={
                    isActive && colors?.itemHoverBg
                      ? { backgroundColor: colors.itemHoverBg }
                      : undefined
                  }
                >
                  <span
                    className={[
                      "flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-400",
                    ].join(" ")}
                    style={{ color: colors?.muted }}
                  >
                    <Icon className={s.itemIcon} aria-hidden="true" />
                  </span>

                  <span className="flex-1 min-w-0 text-left">
                    <span
                      className={[
                        "block truncate font-[500] text-neutral-800 dark:text-neutral-100",
                        s.itemText,
                      ].join(" ")}
                      style={{ color: colors?.text }}
                    >
                      {model.label}
                    </span>
                    {model.description && (
                      <span className="block truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                        {model.description}
                      </span>
                    )}
                  </span>

                  {showCheckmark && isSelected && (
                    <IoCheckmark
                      className="h-4 w-4 shrink-0 text-neutral-900 dark:text-neutral-100"
                      style={{ color: colors?.accent }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModelsSelector;
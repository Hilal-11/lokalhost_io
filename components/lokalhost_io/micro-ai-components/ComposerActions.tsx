
"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";


import { FaGithub } from "react-icons/fa";
import { FiFigma } from "react-icons/fi";
import { LuCloudUpload, LuImage } from "react-icons/lu";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { IoFolderOpenOutline, IoChevronForward } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { RiConnectorLine } from "react-icons/ri";
import { AiTwotoneUnlock } from "react-icons/ai";
import { FaHexagonNodesBolt } from "react-icons/fa6";
import type { IconType } from "react-icons";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface ComposerAction {
  id: string;
  label: string;
  icon: IconType;
  /** Shows a "Premium" pill next to the label. */
  premium?: boolean;
  /** Shows a trailing chevron (row navigates to a submenu). */
  hasSubmenu?: boolean;
  /** Renders a trailing switch instead of a chevron. */
  toggle?: boolean;
}

export interface ComposerActionsProps {
  /** Top group, shown above the divider. Defaults to the GitHub/Figma/Upload rows. */
  primary?: ComposerAction[];
  /** Bottom group, shown below the divider. Defaults to the settings/nav rows. */
  secondary?: ComposerAction[];
  /** Fired when a non-toggle row is clicked, with the row's id. */
  onSelect?: (id: string) => void;
  /** Controlled state for the "Generate Images" switch. */
  generateImages?: boolean;
  /** Controlled setter for the "Generate Images" switch. */
  onGenerateImagesChange?: (next: boolean) => void;
  /** Controlled open state for the menu panel. */
  open?: boolean;
  /** Controlled setter for the menu's open state. */
  onOpenChange?: (next: boolean) => void;
  /** Custom trigger element. Defaults to a "+" icon button. */
  trigger?: ReactNode;
  /** Extra classes applied to the menu panel wrapper. */
  className?: string;
}

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  id?: string;
}

interface ActionRowProps {
  action: ComposerAction;
  onSelect?: (id: string) => void;
  onToggle?: (id: string) => void;
  toggled?: boolean;
  switchId?: string;
}

/* -------------------------------------------------------------------------- */
/*  Static data                                                                */
/* -------------------------------------------------------------------------- */

/** Primary "create / import" actions — shown above the divider. */
export const primaryActions: ComposerAction[] = [
  {
    id: "github",
    label: "Import from GitHub",
    icon: FaGithub,
  },
  {
    id: "figma",
    label: "Create from Figma",
    icon: FiFigma,
    premium: true,
  },
  {
    id: "upload",
    label: "Upload from computer",
    icon: LuCloudUpload,
  },
];

/** Secondary settings / navigation actions — shown below the divider. */
export const secondaryActions: ComposerAction[] = [
  {
    id: "generate-images",
    label: "Generate Images",
    icon: LuImage,
    toggle: true,
  },
  {
    id: "skills",
    label: "Skills",
    icon: BsFillLightningChargeFill,
    hasSubmenu: true,
  },
  {
    id: "design-systems",
    label: "Design Systems",
    icon: FaHexagonNodesBolt,
    hasSubmenu: true,
  },
  {
    id: "folder",
    label: "Folder",
    icon: IoFolderOpenOutline,
    hasSubmenu: true,
  },
  {
    id: "instructions",
    label: "Instructions",
    icon: HiOutlineBookOpen,
    hasSubmenu: true,
  },
  {
    id: "mcps",
    label: "MCPs",
    icon: RiConnectorLine,
    hasSubmenu: true,
  },
  {
    id: "permissions",
    label: "Auto Permissions",
    icon: AiTwotoneUnlock,
    hasSubmenu: true,
  },
];

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A tiny, dependency-free switch. Kept local so this file can be dropped
 * into any project without pulling in a UI kit just for one control.
 */
function Switch({ checked, onChange, label, id }: SwitchProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full",
        "transition-colors duration-150 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-blue-500 dark:focus-visible:ring-offset-neutral-900",
        checked ? "bg-neutral-950" : "bg-neutral-300 dark:bg-neutral-600",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm",
          "transition-transform duration-150 ease-out",
          checked ? "translate-x-[18px]" : "translate-x-[3px]",
        ].join(" ")}
      />
    </button>
  );
}

/**
 * Single row inside the menu. Handles icon, label, premium pill,
 * trailing chevron and/or trailing toggle switch.
 */
function ActionRow({ action, onSelect, onToggle, toggled, switchId }: ActionRowProps) {
  const Icon = action.icon;
  const interactive = !action.toggle;

  const content = (
    <>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-400">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>

      <span className="flex-1 truncate font-sans font-[500] text-left text-[14px] text-neutral-800 dark:text-neutral-100">
        {action.label}
      </span>

      {action.premium && (
        <span className="shrink-0 rounded-full bg-orange-400/30 px-2 py-0.5 text-[11px] font-medium text-orange-700 dark:bg-orange-400/10 dark:text-orange-300">
          Premium
        </span>
      )}

      {action.hasSubmenu && (
        <IoChevronForward
          className="h-4 w-4 shrink-0 text-neutral-400 dark:text-neutral-500"
          aria-hidden="true"
        />
      )}

      {action.toggle && (
        <Switch
          id={switchId}
          checked={Boolean(toggled)}
          onChange={() => onToggle?.(action.id)}
          label={action.label}
        />
      )}
    </>
  );

  const rowClasses = [
    "group flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px]",
    "outline-none transition-colors duration-100",
  ].join(" ");

  if (!interactive) {
    // "Generate Images" row: the whole row is clickable to flip the switch,
    // but it isn't a <button> since the switch itself owns the interactive role.
    return (
      <div
        className={[
          rowClasses,
          "cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/5",
        ].join(" ")}
        onClick={() => onToggle?.(action.id)}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={[
        rowClasses,
        "cursor-pointer hover:bg-neutral-100 focus-visible:bg-neutral-100",
        "dark:hover:bg-white/5 dark:focus-visible:bg-white/5",
      ].join(" ")}
      onClick={() => onSelect?.(action.id)}
    >
      {content}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

function ComposerActions({
  primary = primaryActions,
  secondary = secondaryActions,
  onSelect,
  generateImages,
  onGenerateImagesChange,
  open,
  onOpenChange,
  trigger,
  className = "",
}: ComposerActionsProps) {
  const isControlledOpen = open !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(true);
  const isOpen = isControlledOpen ? Boolean(open) : internalOpen;

  const isControlledToggle = generateImages !== undefined;
  const [internalToggle, setInternalToggle] = useState<boolean>(true);
  const imagesOn = isControlledToggle ? Boolean(generateImages) : internalToggle;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const switchId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlledOpen) setInternalOpen(next);
    onOpenChange?.(next);
  };

  // Close on outside click / Escape — standard menu behaviour.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleToggle = (id: string) => {
    if (id !== "generate-images") return;
    const next = !imagesOn;
    if (!isControlledToggle) setInternalToggle(next);
    onGenerateImagesChange?.(next);
  };

  const handleSelect = (id: string) => {
    onSelect?.(id);
    setOpen(false);
  };

  const handleTriggerClick = (event: ReactMouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setOpen(!isOpen);
  };

  return (
    <div ref={rootRef} className="relative inline-block font-sans">
      {trigger ? (
        <span onClick={handleTriggerClick}>{trigger}</span>
      ) : (
        <button
          type="button"
          onClick={handleTriggerClick}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full border",
            "border-neutral-300 text-neutral-600 transition-colors",
            "hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300",
            "dark:hover:bg-white/10",
          ].join(" ")}
        >
          <span className="text-lg leading-none">+</span>
        </button>
      )}

      {isOpen && (
        <div
          role="menu"
          className={[
            "absolute left-0 top-[calc(100%+8px)] z-50 w-[268px]",
            "rounded-2xl border border-neutral-200/80 bg-white p-1.5",
            "shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]",
            "dark:border-white/10 dark:bg-neutral-900",
            "dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
            className,
          ].join(" ")}
        >
          <div className="flex flex-col gap-0.5">
            {primary.map((action) => (
              <ActionRow key={action.id} action={action} onSelect={handleSelect} />
            ))}
          </div>

          <div className="my-1.5 h-px bg-neutral-200 dark:bg-white/10" />

          <div className="flex flex-col gap-0.5">
            {secondary.map((action) => (
              <ActionRow
                key={action.id}
                action={action}
                onSelect={handleSelect}
                onToggle={handleToggle}
                toggled={action.id === "generate-images" ? imagesOn : undefined}
                switchId={action.id === "generate-images" ? switchId : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ComposerActions;

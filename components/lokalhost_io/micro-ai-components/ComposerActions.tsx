"use client";

import { useState, useRef, useEffect, useId, type ReactNode, type MouseEvent as ReactMouseEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FaGithub } from "react-icons/fa";
import { FiFigma } from "react-icons/fi";
import { LuCloudUpload, LuImage, LuPlus } from "react-icons/lu";
import { BsLightningCharge } from "react-icons/bs";
import { IoFolderOpenOutline, IoChevronForward } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi2";
import { RiConnectorLine } from "react-icons/ri";
import { AiOutlineUnlock } from "react-icons/ai";
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
  /** Top group, shown above the divider. */
  primary?: ComposerAction[];
  /** Bottom group, shown below the divider. */
  secondary?: ComposerAction[];
  /** Fired when a non-toggle row is clicked, with the row's id. */
  onSelect?: (id: string) => void;
  /** Controlled state for the "Generate Images" switch. */
  generateImages?: boolean;
  onGenerateImagesChange?: (next: boolean) => void;
  /** Controlled open state for the menu panel. */
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  /** Uncontrolled initial open state. Defaults to false. */
  defaultOpen?: boolean;
  /** Custom trigger element. Defaults to a "+" icon button. */
  trigger?: ReactNode;
  /** Extra classes applied to the menu panel. */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Static data                                                                */
/* -------------------------------------------------------------------------- */

export const primaryActions: ComposerAction[] = [
  { id: "github", label: "Import from GitHub", icon: FaGithub },
  { id: "figma", label: "Create from Figma", icon: FiFigma, premium: true },
  { id: "upload", label: "Upload from computer", icon: LuCloudUpload },
];

export const secondaryActions: ComposerAction[] = [
  { id: "generate-images", label: "Generate images", icon: LuImage, toggle: true },
  { id: "skills", label: "Skills", icon: BsLightningCharge, hasSubmenu: true },
  { id: "design-systems", label: "Design systems", icon: FaHexagonNodesBolt, hasSubmenu: true },
  { id: "folder", label: "Folder", icon: IoFolderOpenOutline, hasSubmenu: true },
  { id: "instructions", label: "Instructions", icon: HiOutlineBookOpen, hasSubmenu: true },
  { id: "mcps", label: "MCPs", icon: RiConnectorLine, hasSubmenu: true },
  { id: "permissions", label: "Auto permissions", icon: AiOutlineUnlock, hasSubmenu: true },
];

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600";
const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                            */
/* -------------------------------------------------------------------------- */

function Switch({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={[
        "relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full p-[2px] transition-colors duration-150",
        checked ? "bg-neutral-900 dark:bg-neutral-100" : "bg-neutral-200 dark:bg-neutral-700",
      ].join(" ")}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className={["size-3.5 rounded-full shadow-sm", checked ? "ml-auto bg-white dark:bg-neutral-900" : "bg-white dark:bg-neutral-300"].join(" ")}
      />
    </span>
  );
}

function ActionRow({ action, onActivate, toggled }: { action: ComposerAction; onActivate: (a: ComposerAction) => void; toggled?: boolean }) {
  const Icon = action.icon;
  return (
    <motion.button
      type="button"
      role={action.toggle ? "menuitemcheckbox" : "menuitem"}
      aria-checked={action.toggle ? Boolean(toggled) : undefined}
      aria-haspopup={action.hasSubmenu ? "menu" : undefined}
      data-row=""
      tabIndex={-1}
      variants={{ hidden: { opacity: 0, y: -3 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.16, ease: EASE }}
      onClick={() => onActivate(action)}
      className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left outline-none transition-colors duration-100 hover:bg-neutral-100 focus-visible:bg-neutral-100 dark:hover:bg-white/[0.06] dark:focus-visible:bg-white/[0.06]"
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-neutral-500 transition-colors group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200">
        <Icon className="size-[17px]" aria-hidden="true" />
      </span>
      <span className="flex-1 truncate text-[13.5px] font-medium text-neutral-800 dark:text-neutral-100">{action.label}</span>
      {action.premium && (
        <span className="shrink-0 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10.5px] font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
          Premium
        </span>
      )}
      {action.hasSubmenu && (
        <IoChevronForward className="size-3.5 shrink-0 text-neutral-400 transition-transform duration-150 group-hover:translate-x-0.5 dark:text-neutral-500" aria-hidden="true" />
      )}
      {action.toggle && <Switch checked={Boolean(toggled)} />}
    </motion.button>
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
  defaultOpen = false,
  trigger,
  className = "",
}: ComposerActionsProps) {
  const reduce = useReducedMotion();
  const isControlledOpen = open !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const isOpen = isControlledOpen ? Boolean(open) : internalOpen;

  const isControlledToggle = generateImages !== undefined;
  const [internalToggle, setInternalToggle] = useState<boolean>(true);
  const imagesOn = isControlledToggle ? Boolean(generateImages) : internalToggle;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  // don't steal focus when the menu starts open (defaultOpen / controlled on mount)
  const skipFocus = useRef(isOpen);
  const menuId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlledOpen) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && event.target instanceof Node && !rootRef.current.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    if (skipFocus.current) skipFocus.current = false;
    else requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("[data-row]")?.focus());
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const activate = (action: ComposerAction) => {
    if (action.toggle) {
      const next = !imagesOn;
      if (!isControlledToggle) setInternalToggle(next);
      onGenerateImagesChange?.(next);
      return;
    }
    onSelect?.(action.id);
    if (!action.hasSubmenu) setOpen(false);
  };

  const onPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const rows = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("[data-row]") ?? []);
    const i = rows.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "Home" ? 0 : e.key === "End" ? rows.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length;
    rows[next]?.focus();
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
        <motion.button
          ref={triggerRef}
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={handleTriggerClick}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label="Add context"
          className={[
            "flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors",
            "hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:text-neutral-100",
            isOpen ? "border-neutral-300 text-neutral-900 dark:border-neutral-600 dark:text-neutral-100" : "",
            ring,
          ].join(" ")}
        >
          <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 26 }} className="flex">
            <LuPlus className="size-4" />
          </motion.span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            ref={panelRef}
            role="menu"
            aria-label="Composer actions"
            onKeyDown={onPanelKeyDown}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: EASE }}
            style={{ transformOrigin: "top left" }}
            className={[
              "absolute left-0 top-[calc(100%+8px)] z-50 w-[272px] rounded-2xl border border-neutral-200 bg-white p-1.5",
              "shadow-[0_16px_40px_-16px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.04)]",
              "dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)]",
              className,
            ].join(" ")}
          >
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.018 } } }} className="flex flex-col gap-0.5">
              {primary.map((action) => (
                <ActionRow key={action.id} action={action} onActivate={activate} />
              ))}
              <div className="my-1 h-px bg-neutral-200 dark:bg-white/10" role="separator" />
              {secondary.map((action) => (
                <ActionRow key={action.id} action={action} onActivate={activate} toggled={action.id === "generate-images" ? imagesOn : undefined} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ComposerActions;

"use client";

import React, { forwardRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa";

/* ------------------------------------------------------------------ */
/* Utils                                                              */
/* ------------------------------------------------------------------ */

/** Tiny classnames joiner — filters out falsy values. No dependency needed. */
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type Platform = "mac" | "windows" | "linux" | "custom";
export type ButtonSize = "sm" | "md" | "lg" | "xl";
export type DownloadButtonVariant = "primary" | "secondary";

export interface PlatformConfig {
  id: Platform;
  label: string;
  icon?: React.ReactNode;
  downloadUrl?: string;
  fileName?: string;
}

export interface DownloadButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"> {
  /** Which platform this button represents. Drives default label/icon/url lookup. */
  platform?: Platform;
  /** Override the label text/node entirely. Falls back to platformConfig lookup. */
  label?: React.ReactNode;
  /** Override the icon entirely. Falls back to the built-in platform icon. */
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  showIcon?: boolean;

  /** Render as <a> instead of <button> — needed for direct file downloads. */
  as?: "button" | "a";
  href?: string;
  fileName?: string;
  target?: string;
  rel?: string;

  /** Size — controls height / min-width / font-size / icon-size. Padding is identical across sizes. */
  size?: ButtonSize;
  /** Monochrome style. "primary" is the solid inverted button, "secondary" the quiet outline one. Defaults to "primary". */
  variant?: DownloadButtonVariant;

  /** State */
  isLoading?: boolean;
  loadingText?: React.ReactNode;
  /** Replaces the built-in spinner while loading. */
  loadingIcon?: React.ReactNode;
  disabled?: boolean;

  /**
   * Full override for the root <button>/<a> className. When provided, this
   * REPLACES everything (structure + size + color). Prefer `colorClassName`.
   */
  className?: string;
  /** Full override for the inner content-wrapper className. Prefer `wrapperColorClassName`. */
  wrapperClassName?: string;
  /** Background / text / border / hover classes for the OUTER shell only. */
  colorClassName?: string;
  /** Background / text / hover classes for the INNER wrapper pill only. */
  wrapperColorClassName?: string;
  iconClassName?: string;

  /** Callbacks */
  onDownloadStart?: (platform: Platform) => void;
  onDownloadComplete?: (platform: Platform) => void;
  onDownloadError?: (error: Error) => void;

  children?: React.ReactNode;
  radius?: "none" | "sm" | "md" | "lg" | "full";
}

/* ------------------------------------------------------------------ */
/* Size config                                                        */
/* ------------------------------------------------------------------ */

export const sizeConfig: Record<
  ButtonSize,
  { outerHeight: string; outerMinWidth: string; innerMinWidth: string; text: string; gap: string; iconSize: string }
> = {
  sm: { outerHeight: "h-8", outerMinWidth: "min-w-[108px]", innerMinWidth: "min-w-[96px]", text: "text-xs", gap: "gap-1.5", iconSize: "[&_svg]:size-3.5" },
  md: { outerHeight: "h-9", outerMinWidth: "min-w-[128px]", innerMinWidth: "min-w-[116px]", text: "text-[13.5px]", gap: "gap-2", iconSize: "[&_svg]:size-4" },
  lg: { outerHeight: "h-11", outerMinWidth: "min-w-[148px]", innerMinWidth: "min-w-[136px]", text: "text-[15px]", gap: "gap-2", iconSize: "[&_svg]:size-[18px]" },
  xl: { outerHeight: "h-12", outerMinWidth: "min-w-[168px]", innerMinWidth: "min-w-[156px]", text: "text-base", gap: "gap-2.5", iconSize: "[&_svg]:size-5" },
};

/* ------------------------------------------------------------------ */
/* Default styling — split into STRUCTURE and COLOR                   */
/* ------------------------------------------------------------------ */

export const structuralButtonClassName =
  "group/dl relative inline-flex items-center px-1 font-medium font-sans no-underline select-none " +
  "overflow-hidden transition-[background-color,border-color,box-shadow,color] duration-150 " +
  "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-950 " +
  "disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:cursor-not-allowed";

const VARIANTS: Record<DownloadButtonVariant, { outer: string; inner: string }> = {
  primary: {
    outer:
      "bg-neutral-900 text-neutral-50 border border-neutral-950 hover:bg-neutral-950 " +
      "shadow-[0_1px_2px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] " +
      "dark:bg-neutral-100 dark:text-neutral-900 dark:border-white dark:hover:bg-white " +
      "dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_4px_14px_-4px_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.06)]",
    inner:
      "bg-gradient-to-b from-neutral-800 to-neutral-900 text-neutral-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.3)] " +
      "dark:from-white dark:to-neutral-100 dark:text-neutral-900 dark:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.12)]",
  },
  secondary: {
    outer:
      "bg-neutral-100 text-neutral-800 border border-neutral-200 hover:bg-neutral-200/70 " +
      "shadow-[0_1px_2px_rgba(0,0,0,0.05)] " +
      "dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-800/80 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
    inner:
      "bg-white text-neutral-800 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04)] " +
      "dark:bg-neutral-950 dark:text-neutral-100 dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]",
  },
};

/** Default color classes for the outer shell (primary) — replaceable via `colorClassName`. */
export const defaultButtonColorClassName = VARIANTS.primary.outer;

export const structuralWrapperClassName = "relative inline-flex items-center px-2.5 py-[5px] overflow-hidden transition-colors duration-150";

export const radiusMap: Record<NonNullable<DownloadButtonProps["radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

/** Default color classes for the inner wrapper (primary) — replaceable via `wrapperColorClassName`. */
export const defaultWrapperColorClassName = VARIANTS.primary.inner;

/** Backwards-compatible full class strings (structure + default color + md size). */
export const defaultButtonClassName = cx(structuralButtonClassName, sizeConfig.md.outerHeight, sizeConfig.md.text, defaultButtonColorClassName);
export const defaultWrapperClassName = cx(structuralWrapperClassName, sizeConfig.md.gap, defaultWrapperColorClassName);

/* ------------------------------------------------------------------ */
/* Default platform config (data-driven — edit/extend freely)         */
/* ------------------------------------------------------------------ */

export const defaultPlatformConfig: Record<Platform, PlatformConfig> = {
  mac: { id: "mac", label: "Download for Mac", icon: <FaApple />, downloadUrl: "", fileName: "" },
  windows: { id: "windows", label: "Download for Windows", icon: <FaWindows />, downloadUrl: "", fileName: "" },
  linux: { id: "linux", label: "Download for Linux", icon: <FaLinux />, downloadUrl: "", fileName: "" },
  custom: { id: "custom", label: "Download", icon: null },
};

/* ------------------------------------------------------------------ */
/* OS auto-detect hook                                                */
/* ------------------------------------------------------------------ */

function subscribeNoop() {
  return () => {};
}

function getPlatformSnapshot(): Platform | null {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes("android") || ua.includes("iphone") || ua.includes("ipad")) return null;
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return null;
}

function getPlatformServerSnapshot(): Platform | null {
  return null;
}

/** The visitor's desktop OS, or null on mobile / during SSR. */
export function useDetectedPlatform(): Platform | null {
  return useSyncExternalStore(subscribeNoop, getPlatformSnapshot, getPlatformServerSnapshot);
}

/* ------------------------------------------------------------------ */
/* Spinner                                                            */
/* ------------------------------------------------------------------ */

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="animate-spin" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

const ROLL = { type: "spring", stiffness: 420, damping: 32 } as const;

export const DownloadButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, DownloadButtonProps>(
  (
    {
      platform = "custom",
      label,
      icon,
      iconPosition = "left",
      showIcon = true,
      as = "button",
      href,
      fileName,
      target,
      rel,
      size = "md",
      variant = "primary",
      isLoading = false,
      loadingText,
      loadingIcon,
      disabled = false,
      className,
      colorClassName,
      iconClassName = "",
      wrapperClassName,
      wrapperColorClassName,
      onDownloadStart,
      onDownloadComplete,
      onDownloadError,
      radius = "md",
      children,
      onClick,
      onMouseEnter: onMouseEnterProp,
      onMouseLeave: onMouseLeaveProp,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      ...rest
    },
    ref
  ) => {
    const reduce = useReducedMotion();
    const config = defaultPlatformConfig[platform];
    const sizing = sizeConfig[size];
    const [hovered, setHovered] = useState(false);
    const inactive = disabled || isLoading;

    const resolvedLabel = children ?? label ?? config.label;
    const resolvedIcon = icon ?? config.icon;
    const resolvedHref = href ?? config.downloadUrl;
    const resolvedFileName = fileName ?? config.fileName;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (inactive) {
        e.preventDefault();
        return;
      }
      try {
        onDownloadStart?.(platform);
        onClick?.(e as React.MouseEvent<HTMLButtonElement>);
        onDownloadComplete?.(platform);
      } catch (err) {
        onDownloadError?.(err instanceof Error ? err : new Error(String(err)));
      }
    };

    const iconNode = showIcon ? (isLoading ? loadingIcon ?? <Spinner /> : resolvedIcon) : null;
    const labelNode = isLoading ? loadingText ?? resolvedLabel : resolvedLabel;

    const inner = (
      <>
        {iconPosition === "left" && iconNode ? (
          <span className={cx("flex shrink-0", sizing.iconSize, iconClassName)} data-slot="icon">
            {iconNode}
          </span>
        ) : null}
        <span data-slot="label" className="whitespace-nowrap">
          {labelNode}
        </span>
        {iconPosition === "right" && iconNode ? (
          <span className={cx("flex shrink-0", sizing.iconSize, iconClassName)} data-slot="icon">
            {iconNode}
          </span>
        ) : null}
      </>
    );

    const roll = hovered && !reduce && !inactive;
    const rowClass = cx("flex items-center justify-center", sizing.gap);

    const content = (
      <span
        className={
          wrapperClassName ??
          cx(
            structuralWrapperClassName,
            radiusMap[radius],
            sizing.innerMinWidth,
            "justify-center",
            wrapperColorClassName ?? VARIANTS[variant].inner
          )
        }
        data-slot="content-wrapper"
      >
        {/* text roll: the visible copy slides up while an identical copy slides in from below */}
        <motion.span className={rowClass} initial={false} animate={{ y: roll ? "-130%" : "0%", opacity: roll ? 0 : 1 }} transition={ROLL}>
          {inner}
        </motion.span>
        <motion.span
          aria-hidden
          className={cx(rowClass, "absolute inset-0")}
          initial={false}
          animate={{ y: roll ? "0%" : "130%", opacity: roll ? 1 : 0 }}
          transition={ROLL}
        >
          {inner}
        </motion.span>
      </span>
    );

    const resolvedClassName =
      className ??
      cx(
        structuralButtonClassName,
        radiusMap[radius],
        sizing.outerHeight,
        sizing.outerMinWidth,
        sizing.text,
        "justify-center",
        colorClassName ?? VARIANTS[variant].outer
      );

    const sharedProps = {
      className: resolvedClassName,
      onMouseEnter: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        onMouseEnterProp?.(e as React.MouseEvent<HTMLButtonElement>);
        setHovered(true);
      },
      onMouseLeave: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        onMouseLeaveProp?.(e as React.MouseEvent<HTMLButtonElement>);
        setHovered(false);
      },
      onFocus: (e: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        onFocusProp?.(e as React.FocusEvent<HTMLButtonElement>);
        if ((e.target as HTMLElement).matches(":focus-visible")) setHovered(true);
      },
      onBlur: (e: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        onBlurProp?.(e as React.FocusEvent<HTMLButtonElement>);
        setHovered(false);
      },
      whileTap: inactive ? undefined : { scale: 0.97 },
      transition: { type: "spring", stiffness: 400, damping: 30 } as const,
      "data-platform": platform,
      "data-size": size,
      "data-variant": variant,
      "data-loading": isLoading || undefined,
      "data-disabled": disabled || undefined,
      "aria-disabled": inactive || undefined,
      "aria-busy": isLoading || undefined,
    };

    if (as === "a") {
      return (
        <motion.a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={inactive ? undefined : resolvedHref || undefined}
          download={resolvedFileName || true}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          onClick={handleClick}
          {...sharedProps}
          {...(rest as React.ComponentProps<typeof motion.a>)}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={inactive}
        onClick={handleClick}
        {...sharedProps}
        {...(rest as React.ComponentProps<typeof motion.button>)}
      >
        {content}
      </motion.button>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

/* ------------------------------------------------------------------ */
/* Group wrapper — renders Mac / Windows / Linux together             */
/* ------------------------------------------------------------------ */

export interface DownloadButtonGroupProps {
  platforms?: Platform[];
  config?: Partial<Record<Platform, Partial<PlatformConfig>>>;
  /** Make the visitor's OS the primary button and the others secondary. */
  highlightDetected?: boolean;
  as?: "button" | "a";
  size?: ButtonSize;
  variant?: DownloadButtonVariant;
  className?: string;
  colorClassName?: string;
  wrapperColorClassName?: string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  buttonProps?: Partial<DownloadButtonProps>;
}

export default function DownloadButtonGroup({
  platforms = ["mac", "windows", "linux"],
  config,
  highlightDetected = false,
  as = "a",
  size = "md",
  variant = "primary",
  className = "inline-flex flex-wrap items-center gap-3",
  colorClassName,
  wrapperColorClassName,
  buttonProps,
  radius = "md",
}: DownloadButtonGroupProps) {
  const detected = useDetectedPlatform();
  const merged = platforms.reduce(
    (acc, p) => {
      acc[p] = { ...defaultPlatformConfig[p], ...config?.[p] };
      return acc;
    },
    {} as Record<Platform, PlatformConfig>
  );

  return (
    <div className={className} data-slot="download-group">
      {platforms.map((p) => {
        const cfg = merged[p];
        const isDetected = highlightDetected && detected === p;
        const v: DownloadButtonVariant = highlightDetected && detected ? (isDetected ? "primary" : "secondary") : variant;
        return (
          <DownloadButton
            key={p}
            platform={p}
            as={as}
            size={size}
            variant={v}
            colorClassName={colorClassName}
            wrapperColorClassName={wrapperColorClassName}
            href={cfg.downloadUrl}
            fileName={cfg.fileName}
            label={cfg.label}
            icon={cfg.icon}
            data-detected={isDetected || undefined}
            radius={radius}
            {...buttonProps}
          />
        );
      })}
    </div>
  );
}

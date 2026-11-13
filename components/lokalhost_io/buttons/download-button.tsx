"use client";

import React, { forwardRef, useSyncExternalStore, useEffect, useState } from "react";

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

export interface PlatformConfig {
  id: Platform;
  label: string;
  icon?: React.ReactNode;
  downloadUrl?: string;
  fileName?: string;
}

export interface DownloadButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Which platform this button represents. Drives default label/icon/url lookup. */
  platform?: Platform;

  /** Override the label text/node entirely. Falls back to platformConfig lookup. */
  label?: React.ReactNode;

  /** Override the icon entirely. Falls back to platformConfig lookup. */
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  showIcon?: boolean;

  /** Render as <a> instead of <button> — needed for direct file downloads. */
  as?: "button" | "a";
  href?: string;
  fileName?: string;
  target?: string;
  rel?: string;

  /** Size — controls height / min-width / font-size / icon-size of BOTH the
   *  outer shell and inner wrapper. Padding is intentionally identical across
   *  all sizes so the button's "frame" never feels inconsistent. */
  size?: ButtonSize;

  /** State */
  isLoading?: boolean;
  loadingText?: React.ReactNode;
  loadingIcon?: React.ReactNode;
  disabled?: boolean;

  /**
   * Full override for the root <button>/<a> className. When provided, this
   * REPLACES everything (structure + size + color) — use this only if you
   * want to build the button from scratch. For normal color customization
   * prefer `colorClassName` below, which keeps the shape/size/shadow intact.
   */
  className?: string;

  /**
   * Full override for the inner content-wrapper className. Same "replaces
   * everything" behavior as `className` above, scoped to the inner pill.
   * Prefer `wrapperColorClassName` for normal color customization.
   */
  wrapperClassName?: string;

  /**
   * Background / text / border / hover classes for the OUTER shell only.
   * Structure (rounded corners, height, padding, shadow, transitions) is
   * preserved — you're only swapping colors. Defaults to the built-in
   * neutral dark/light theme.
   *
   * Example: "bg-blue-600 dark:bg-blue-500 text-white border border-blue-700 hover:bg-blue-700"
   */
  colorClassName?: string;

  /**
   * Background / text / hover classes for the INNER wrapper pill only.
   * Structure (rounded corners, padding, shadow) is preserved.
   *
   * Example: "bg-blue-800 dark:bg-blue-700 text-white hover:bg-blue-900"
   */
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

/**
 * Only height, min-width, font-size, gap and icon-size change per size.
 * Padding (px-1 on the shell, px-2/py-[3.5px] on the inner wrapper) is
 * fixed in the structural classes below and is the SAME for every size.
 */
export const sizeConfig: Record<
  ButtonSize,
  {
    outerHeight: string;
    outerMinWidth: string;
    innerMinWidth: string;
    text: string;
    gap: string;
    iconSize: string;
  }
> = {
  sm: {
    outerHeight: "h-8",
    outerMinWidth: "min-w-[108px]",
    innerMinWidth: "min-w-[96px]",
    text: "text-xs",
    gap: "gap-1.5",
    iconSize: "[&_svg]:size-3.5",
  },
  md: {
    outerHeight: "h-9",
    outerMinWidth: "min-w-[128px]",
    innerMinWidth: "min-w-[116px]",
    text: "text-sm",
    gap: "gap-2",
    iconSize: "[&_svg]:size-4",
  },
  lg: {
    outerHeight: "h-11",
    outerMinWidth: "min-w-[148px]",
    innerMinWidth: "min-w-[136px]",
    text: "text-base",
    gap: "gap-2",
    iconSize: "[&_svg]:size-[18px]",
  },
  xl: {
    outerHeight: "h-12",
    outerMinWidth: "min-w-[168px]",
    innerMinWidth: "min-w-[156px]",
    text: "text-lg",
    gap: "gap-2.5",
    iconSize: "[&_svg]:size-5",
  },
};

/* ------------------------------------------------------------------ */
/* Default styling — split into STRUCTURE and COLOR                   */
/* ------------------------------------------------------------------ */

/**
 * Structural classes for the outer shell: shape, fixed padding, shadow,
 * transitions, disabled state. NO color/background/border-color here —
 * those live in `defaultButtonColorClassName` so they can be swapped
 * independently. Height/font-size come from `sizeConfig` at render time.
 */
export const structuralButtonClassName =
  "inline-flex items-center px-1 text-sm font-medium font-sans no-underline " +
  "overflow-hidden transition-colors duration-150 " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]";

/** Default color classes for the outer shell — fully replaceable via `colorClassName`. */
export const defaultButtonColorClassName =
  "bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-900 " +
  "border border-neutral-700 dark:border-neutral-300 " +
  "hover:bg-neutral-950 dark:hover:bg-neutral-100";

/**
 * Structural classes for the inner content wrapper (icon + label): shape,
 * fixed padding, shadow. No color here — see `defaultWrapperColorClassName`.
 * Gap comes from `sizeConfig` at render time.
 */
export const structuralWrapperClassName =
  "inline-flex items-center px-2 py-[3.5px] shadow-sm transition-colors duration-150";

export const radiusMap: Record<NonNullable<DownloadButtonProps["radius"]>, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

/** Default color classes for the inner wrapper — fully replaceable via `wrapperColorClassName`. */
export const defaultWrapperColorClassName =
  "bg-neutral-950 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 " +
  "hover:bg-neutral-800 dark:hover:bg-neutral-200";

/**
 * Backwards-compatible full class strings (structure + default color + md
 * size), kept for anyone importing these directly from before this update.
 */
export const defaultButtonClassName = cx(
  structuralButtonClassName,
  sizeConfig.md.outerHeight,
  sizeConfig.md.text,
  defaultButtonColorClassName
);

export const defaultWrapperClassName = cx(
  structuralWrapperClassName,
  sizeConfig.md.gap,
  defaultWrapperColorClassName
);

/* ------------------------------------------------------------------ */
/* Default platform config (data-driven — edit/extend freely)         */
/* ------------------------------------------------------------------ */

export const defaultPlatformConfig: Record<Platform, PlatformConfig> = {
  mac: {
    id: "mac",
    label: "Download for Mac",
    icon: null, // plug in your own icon component/svg
    downloadUrl: "",
    fileName: "",
  },
  windows: {
    id: "windows",
    label: "Download for Windows",
    icon: null,
    downloadUrl: "",
    fileName: "",
  },
  linux: {
    id: "linux",
    label: "Download for Linux",
    icon: null,
    downloadUrl: "",
    fileName: "",
  },
  custom: {
    id: "custom",
    label: "Download",
    icon: null,
  },
};

/* ------------------------------------------------------------------ */
/* OS auto-detect hook — useful for highlighting the "right" button   */
/* ------------------------------------------------------------------ */

// No real browser event to subscribe to (UA doesn't change at runtime),
// so subscribe is a no-op — we only need getSnapshot/getServerSnapshot.
function subscribeNoop() {
  return () => {};
}

function getPlatformSnapshot(): Platform | null {
  const ua = window.navigator.userAgent.toLowerCase();
  // check android before linux — Android UAs contain "linux" too
  if (ua.includes("android")) return null;
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  if (ua.includes("linux")) return "linux";
  return null;
}

function getPlatformServerSnapshot(): Platform | null {
  return null;
}

export function useDetectedPlatform(): Platform | null {
  return useSyncExternalStore(
    subscribeNoop,
    getPlatformSnapshot,
    getPlatformServerSnapshot
  );
}

/* ------------------------------------------------------------------ */
/* Hover animation — slides content up, teleports to bottom, slides in */
/* ------------------------------------------------------------------ */

const BTN_HOVER_CSS = `
@keyframes keep-btn-enter {
  0% { transform: translateY(0); opacity: 1; }
  30% { transform: translateY(-100%); opacity: 0; }
  32% { transform: translateY(100%); opacity: 0; }
  80% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes keep-btn-leave {
  0% { transform: translateY(0); opacity: 1; }
  30% { transform: translateY(100%); opacity: 0; }
  32% { transform: translateY(-100%); opacity: 0; }
  80% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(0); opacity: 1; }
}
.keep-btn-enter {
  animation: keep-btn-enter 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.keep-btn-leave {
  animation: keep-btn-leave 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
`;

let keepBtnCssInjected = false;

function injectKeepBtnCSS() {
  if (keepBtnCssInjected) return;
  keepBtnCssInjected = true;
  if (typeof document !== "undefined") {
    const s = document.createElement("style");
    s.textContent = BTN_HOVER_CSS;
    document.head.appendChild(s);
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export const DownloadButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  DownloadButtonProps
>(
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
      ...rest
    },
    ref
  ) => {
    const config = defaultPlatformConfig[platform];
    const sizing = sizeConfig[size];

    useEffect(() => { injectKeepBtnCSS(); }, []);

    const [animClass, setAnimClass] = useState<"keep-btn-enter" | "keep-btn-leave" | "">("");

    const resolvedLabel = children ?? label ?? config.label;
    const resolvedIcon = icon ?? config.icon;
    const resolvedHref = href ?? config.downloadUrl;
    const resolvedFileName = fileName ?? config.fileName;

    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
    ) => {
      if (disabled || isLoading) {
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

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      onMouseEnterProp?.(e as React.MouseEvent<HTMLButtonElement>);
      setAnimClass("keep-btn-enter");
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      onMouseLeaveProp?.(e as React.MouseEvent<HTMLButtonElement>);
      setAnimClass("keep-btn-leave");
    };

    const handleAnimEnd = () => {
      setAnimClass("");
    };

    const iconNode = showIcon
      ? isLoading
        ? loadingIcon ?? resolvedIcon
        : resolvedIcon
      : null;

    const labelNode = isLoading ? loadingText ?? resolvedLabel : resolvedLabel;

    // Inner wrapper: full override wins; otherwise compose structure + size + color.
    const resolvedWrapperClassName =
      wrapperClassName ??
      cx(
        animClass,
        structuralWrapperClassName,
        radiusMap[radius],
        sizing.gap,
        sizing.innerMinWidth,
        "justify-center",
        wrapperColorClassName ?? defaultWrapperColorClassName
      );

    const content = (
      <span className={resolvedWrapperClassName} data-slot="content-wrapper" onAnimationEnd={handleAnimEnd}>
        {iconPosition === "left" && iconNode ? (
          <span className={cx(sizing.iconSize, iconClassName)} data-slot="icon">
            {iconNode}
          </span>
        ) : null}
        <span data-slot="label">{labelNode}</span>
        {iconPosition === "right" && iconNode ? (
          <span className={cx(sizing.iconSize, iconClassName)} data-slot="icon">
            {iconNode}
          </span>
        ) : null}
      </span>
    );

    // Outer shell: full override wins; otherwise compose structure + size + color.
    const resolvedClassName =
      className ??
      cx(
        structuralButtonClassName,
        radiusMap[radius],
        sizing.outerHeight,
        sizing.outerMinWidth,
        sizing.text,
        "justify-center",
        colorClassName ?? defaultButtonColorClassName
      );

    const sharedProps = {
      className: resolvedClassName,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      "data-platform": platform,
      "data-size": size,
      "data-loading": isLoading || undefined,
      "data-disabled": disabled || undefined,
      "aria-disabled": disabled || isLoading || undefined,
      "aria-busy": isLoading || undefined,
    };

    if (as === "a") {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={disabled || isLoading ? undefined : resolvedHref}
          download={resolvedFileName || true}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          onClick={handleClick}
          {...sharedProps}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...sharedProps}
        {...rest}
      >
        {content}
      </button>
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
  highlightDetected?: boolean;
  as?: "button" | "a";
  size?: ButtonSize;
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
  className = "",
  colorClassName,
  wrapperColorClassName,
  buttonProps,
  radius="md"
}: DownloadButtonGroupProps) {
  const detected = useDetectedPlatform();
  const merged: Record<Platform, PlatformConfig> = platforms.reduce(
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

        return (
          <DownloadButton
            key={p}
            platform={p}
            as={as}
            size={size}
            colorClassName={colorClassName}
            wrapperColorClassName={wrapperColorClassName}
            href={cfg.downloadUrl}
            fileName={cfg.fileName}
            data-detected={isDetected || undefined}
            radius={radius}
            {...buttonProps}
          />
        );
      })}
    </div>
  );
}
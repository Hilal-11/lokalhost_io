"use client";

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Devices                                                            */
/* ------------------------------------------------------------------ */

export type PhonePlatform = "ios" | "android";
export type PhoneTheme = "light" | "dark";

export interface Device {
  id: string;
  name: string;
  platform: PhonePlatform;
  /** CSS viewport in points / dp */
  width: number;
  height: number;
  /** screen corner radius */
  radius: number;
}

export const DEVICES: Device[] = [
  { id: "iphone-15-pro", name: "iPhone 15 Pro", platform: "ios", width: 393, height: 852, radius: 55 },
  { id: "iphone-15-pro-max", name: "iPhone 15 Pro Max", platform: "ios", width: 430, height: 932, radius: 55 },
  { id: "iphone-13-mini", name: "iPhone 13 mini", platform: "ios", width: 375, height: 812, radius: 44 },
  { id: "pixel-8", name: "Pixel 8", platform: "android", width: 412, height: 915, radius: 38 },
  { id: "pixel-8-pro", name: "Pixel 8 Pro", platform: "android", width: 448, height: 998, radius: 40 },
  { id: "galaxy-s24", name: "Galaxy S24", platform: "android", width: 360, height: 780, radius: 34 },
];

export const defaultDevice = (p: PhonePlatform) => DEVICES.find((d) => d.platform === p)!;

const BEZEL = 12;
const SAFE: Record<PhonePlatform, { top: number; bottom: number }> = {
  ios: { top: 54, bottom: 34 },
  android: { top: 36, bottom: 20 },
};

export function frameSize(d: Device) {
  return { width: d.width + BEZEL * 2, height: d.height + BEZEL * 2 };
}

/* ------------------------------------------------------------------ */
/* Theme tokens used inside the phone. Mirrors registry theme.ts /    */
/* lk_theme.dart so previews match the shipped code.                  */
/* ------------------------------------------------------------------ */

const PHONE_TOKENS: Record<PhoneTheme, Record<string, string>> = {
  light: {
    "--m-bg": "#ffffff",
    "--m-bg-subtle": "#f5f5f5",
    "--m-card": "#ffffff",
    "--m-muted": "#f4f4f5",
    "--m-border": "#e5e5e5",
    "--m-fg": "#0a0a0a",
    "--m-fg-muted": "#737373",
    "--m-primary": "#0a0a0a",
    "--m-on-primary": "#ffffff",
    "--m-accent": "#2563eb",
    "--m-success": "#16a34a",
    "--m-danger": "#dc2626",
    "--m-warning": "#d97706",
    "--m-scrim": "rgba(0,0,0,0.4)",
  },
  dark: {
    "--m-bg": "#000000",
    "--m-bg-subtle": "#0a0a0a",
    "--m-card": "#141414",
    "--m-muted": "#1f1f1f",
    "--m-border": "#262626",
    "--m-fg": "#fafafa",
    "--m-fg-muted": "#a3a3a3",
    "--m-primary": "#fafafa",
    "--m-on-primary": "#0a0a0a",
    "--m-accent": "#3b82f6",
    "--m-success": "#22c55e",
    "--m-danger": "#ef4444",
    "--m-warning": "#f59e0b",
    "--m-scrim": "rgba(0,0,0,0.6)",
  },
};

const FONTS: Record<PhonePlatform, string> = {
  ios: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
  android: 'Roboto, "Google Sans", "Segoe UI", system-ui, sans-serif',
};

/* ------------------------------------------------------------------ */
/* Context for preview components                                     */
/* ------------------------------------------------------------------ */

interface PhoneCtx {
  platform: PhonePlatform;
  theme: PhoneTheme;
  device: Device;
  /** false for thumbnails: previews render their "open" state and skip timers. */
  interactive: boolean;
}

const Ctx = createContext<PhoneCtx>({
  platform: "ios",
  theme: "dark",
  device: DEVICES[0],
  interactive: true,
});

export const usePhone = () => useContext(Ctx);

/* ------------------------------------------------------------------ */
/* Status bar                                                         */
/* ------------------------------------------------------------------ */

function StatusIcons({ platform }: { platform: PhonePlatform }) {
  const s = platform === "ios" ? 1 : 0.85;
  return (
    <span className="flex items-center" style={{ gap: 6 * s }} aria-hidden>
      <svg width={18 * s} height={12 * s} viewBox="0 0 18 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
        <rect x="10" y="3" width="3" height="9" rx="1" />
        <rect x="15" y="0" width="3" height="12" rx="1" />
      </svg>
      <svg width={16 * s} height={12 * s} viewBox="0 0 16 12" fill="currentColor">
        <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.2-1.3A10.4 10.4 0 0 0 8 .6 10.4 10.4 0 0 0 .8 3.5L2 4.8a8.6 8.6 0 0 1 6-2.4Zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.8 6.8 0 0 0 8 4.2 6.8 6.8 0 0 0 3.4 6l1.2 1.3C5.5 6.5 6.7 6 8 6Zm0 3.5c-.6 0-1.1.2-1.5.6L8 11.8l1.5-1.7c-.4-.4-.9-.6-1.5-.6Z" />
      </svg>
      <svg width={26 * s} height={12 * s} viewBox="0 0 26 12" fill="none">
        <rect x="0.5" y="0.5" width="22" height="11" rx="3.2" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
        <path d="M24 4v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2Z" fill="currentColor" opacity="0.4" />
      </svg>
    </span>
  );
}

function StatusBar({ platform, overlay }: { platform: PhonePlatform; overlay?: boolean }) {
  const ios = platform === "ios";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex items-center justify-between"
      style={{
        height: SAFE[platform].top,
        padding: ios ? "0 30px 0 50px" : "0 22px",
        paddingTop: ios ? 4 : 0,
        color: overlay ? "#fff" : "var(--m-fg)",
        fontFamily: FONTS[platform],
        fontWeight: ios ? 600 : 500,
        fontSize: ios ? 16 : 13.5,
      }}
    >
      <span>9:41</span>
      <StatusIcons platform={platform} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PhoneFrame                                                         */
/* ------------------------------------------------------------------ */

export function PhoneFrame({
  device,
  theme,
  interactive = true,
  children,
  className,
  label,
  overlayStatusBar,
}: {
  device: Device;
  theme: PhoneTheme;
  interactive?: boolean;
  children: ReactNode;
  className?: string;
  /** Accessible description of what's on screen. */
  label?: string;
  overlayStatusBar?: boolean;
}) {
  const { platform } = device;
  const ios = platform === "ios";
  const { width, height } = frameSize(device);

  const screenStyle = {
    ...PHONE_TOKENS[theme],
    "--safe-top": `${SAFE[platform].top}px`,
    "--safe-bottom": `${SAFE[platform].bottom}px`,
    "--m-radius-control": ios ? "12px" : "999px",
    "--m-radius-card": "16px",
    fontFamily: FONTS[platform],
    borderRadius: device.radius,
    colorScheme: theme,
  } as CSSProperties;

  return (
    <Ctx.Provider value={{ platform, theme, device, interactive }}>
      <div
        role="group"
        aria-roledescription="phone preview"
        aria-label={label ?? `${device.name} preview`}
        className={cn("relative shrink-0 select-none", className)}
        style={{ width, height }}
      >
        {/* hardware buttons */}
        {ios ? (
          <>
            <span aria-hidden className="absolute -left-[3px] top-[118px] h-8 w-[3px] rounded-l bg-neutral-700" />
            <span aria-hidden className="absolute -left-[3px] top-[176px] h-14 w-[3px] rounded-l bg-neutral-700" />
            <span aria-hidden className="absolute -left-[3px] top-[244px] h-14 w-[3px] rounded-l bg-neutral-700" />
            <span aria-hidden className="absolute -right-[3px] top-[200px] h-20 w-[3px] rounded-r bg-neutral-700" />
          </>
        ) : (
          <>
            <span aria-hidden className="absolute -right-[3px] top-[150px] h-12 w-[3px] rounded-r bg-neutral-700" />
            <span aria-hidden className="absolute -right-[3px] top-[220px] h-24 w-[3px] rounded-r bg-neutral-700" />
          </>
        )}

        {/* body */}
        <div
          className="absolute inset-0 bg-[#0b0b0b] shadow-[0_0_0_1px_#2a2a2a,0_0_0_2px_#111,0_30px_60px_-20px_rgba(0,0,0,0.5)]"
          style={{ borderRadius: device.radius + BEZEL, padding: BEZEL }}
        >
          {/* screen */}
          <div
            className="relative h-full w-full overflow-hidden bg-[var(--m-bg)] text-[var(--m-fg)] antialiased"
            style={screenStyle}
            inert={!interactive}
          >
            <StatusBar platform={platform} overlay={overlayStatusBar} />
            {/* camera cut-out */}
            {ios ? (
              <span
                aria-hidden
                className="absolute left-1/2 top-[11px] z-[70] h-[35px] w-[122px] -translate-x-1/2 rounded-full bg-black"
              />
            ) : (
              <span
                aria-hidden
                className="absolute left-1/2 top-[12px] z-[70] size-[13px] -translate-x-1/2 rounded-full bg-black ring-1 ring-neutral-800"
              />
            )}
            <div className="absolute inset-0">{children}</div>
            {/* home indicator / gesture bar */}
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-2 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-[var(--m-fg)] opacity-80"
              style={ios ? { width: 134, height: 5 } : { width: 108, height: 4 }}
            />
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Scale-to-fit wrapper                                               */
/* ------------------------------------------------------------------ */

/** Measures its parent and scales a fixed-size child down to fit. */
export function FitScale({
  width,
  height,
  maxScale = 1,
  maxHeight,
  padding = 32,
  children,
  onReady,
}: {
  width: number;
  height: number;
  maxScale?: number;
  /** cap on the available height (px) */
  maxHeight?: number;
  padding?: number;
  children: ReactNode;
  onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const compute = () => {
      const availW = el.clientWidth - padding;
      const availH = (maxHeight ?? el.clientHeight) - padding;
      const s = Math.max(0.2, Math.min(maxScale, availW / width, availH / height));
      setScale(Number(s.toFixed(3)));
      onReady?.();
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, maxScale, maxHeight, padding]);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      style={{
        width: width * (scale ?? 0),
        height: height * (scale ?? 0),
        visibility: scale ? "visible" : "hidden",
      }}
    >
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale ?? 1})`, width, height }}>
        {children}
      </div>
    </div>
  );
}

/** Fixed scale (thumbnails, galleries). */
export function Scaled({ width, height, scale, children }: { width: number; height: number; scale: number; children: ReactNode }) {
  return (
    <div className="relative shrink-0" style={{ width: width * scale, height: height * scale }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})`, width, height }}>
        {children}
      </div>
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Cover — soft mesh-gradient banner with an optional pattern and      */
/* glassy shapes. Shared by /docs and /mobile so headers look the same.*/
/* Styles live in app/tokens.css (.lk-cover, .lk-tone-*, .lk-glass).   */
/* ------------------------------------------------------------------ */

export type Tone = "warm" | "violet" | "sky" | "mint" | "rose";
export type CoverPattern = "grid" | "pixels" | "dots" | "none";

export const TONES: Tone[] = ["warm", "violet", "sky", "mint", "rose"];

/** Stable tone for any label (categories, groups). */
export function toneFor(label: string): Tone {
  let h = 0;
  for (const ch of label) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

export const TINTS = {
  orange: "var(--lk-tint-orange)",
  pink: "var(--lk-tint-pink)",
  violet: "var(--lk-tint-violet)",
  indigo: "var(--lk-tint-indigo)",
  sky: "var(--lk-tint-sky)",
  emerald: "var(--lk-tint-emerald)",
  amber: "var(--lk-tint-amber)",
  rose: "var(--lk-tint-rose)",
} as const;

export type TintName = keyof typeof TINTS;

const TINT_ORDER: TintName[] = ["orange", "violet", "sky", "emerald", "pink", "amber", "indigo", "rose"];

export function tintFor(label: string): TintName {
  let h = 0;
  for (const ch of label) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TINT_ORDER[h % TINT_ORDER.length];
}

export function Cover({
  tone = "violet",
  pattern = "grid",
  soft = false,
  shapes = false,
  className,
  style,
  children,
}: {
  tone?: Tone;
  pattern?: CoverPattern;
  /** lighter gradient for small thumbnails */
  soft?: boolean;
  /** decorative glass cards on the right (large banners) */
  shapes?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("lk-cover", `lk-tone-${tone}`, pattern !== "none" && `lk-cover-${pattern}`, soft && "lk-cover-soft", className)}
      style={style}
    >
      {shapes && (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] md:block">
          <span className="lk-glass right-[18%] top-[18%] h-[62%] w-[34%] rotate-[-14deg]" />
          <span className="lk-glass right-[8%] top-[28%] h-[62%] w-[34%] rotate-[-8deg]" />
          <span className="lk-glass right-[-4%] top-[38%] h-[62%] w-[34%] rotate-[-2deg]" />
        </div>
      )}
      {children}
    </div>
  );
}

/** Tinted icon chip — `<Chip tint="violet"><Icon/></Chip>` */
export function Chip({
  tint,
  active,
  size = 22,
  radius = 7,
  className,
  children,
}: {
  tint: TintName;
  active?: boolean;
  size?: number;
  radius?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      aria-hidden
      data-active={active ? "true" : undefined}
      className={cn("lk-chip lk-transition", className)}
      style={{ "--tint": TINTS[tint], width: size, height: size, borderRadius: radius } as CSSProperties}
    >
      {children}
    </span>
  );
}

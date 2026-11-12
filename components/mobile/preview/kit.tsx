"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Loader2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePhone } from "./phone-frame";

/* ------------------------------------------------------------------ */
/* Mock kit — web renditions of the registry components, driven by    */
/* the --m-* tokens set on the phone screen. Previews only.           */
/* ------------------------------------------------------------------ */

export function Screen({
  children,
  className,
  subtle,
  style,
}: {
  children: ReactNode;
  className?: string;
  subtle?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("absolute inset-0 flex flex-col", subtle ? "bg-[var(--m-bg-subtle)]" : "bg-[var(--m-bg)]", className)}
      style={{ paddingTop: "var(--safe-top)", ...style }}
    >
      {children}
    </div>
  );
}

/** Scrollable body that leaves room for the home indicator. */
export function Body({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cn("scrollbar-hide min-h-0 flex-1 overflow-y-auto", className)} style={style}>
      {children}
    </div>
  );
}

export function NavHeader({
  title,
  back,
  right,
  large,
  subtitle,
}: {
  title: string;
  back?: boolean;
  right?: ReactNode;
  large?: boolean;
  subtitle?: string;
}) {
  const { platform } = usePhone();
  const ios = platform === "ios";
  if (large) {
    return (
      <div className="px-5 pb-2 pt-2">
        <div className="flex h-9 items-center justify-between">
          {back ? <ChevronLeft size={26} className="-ml-2 text-[var(--m-fg)]" /> : <span />}
          <div className="flex items-center gap-3 text-[var(--m-fg)]">{right}</div>
        </div>
        {subtitle && <p className="text-[13px] font-medium text-[var(--m-fg-muted)]">{subtitle}</p>}
        <h1 className="text-[32px] font-bold leading-tight tracking-tight">{title}</h1>
      </div>
    );
  }
  return (
    <div className={cn("flex h-12 shrink-0 items-center gap-2 px-3", ios ? "justify-between" : "justify-start")}>
      <span className="flex w-16 items-center">{back && <ChevronLeft size={26} className="text-[var(--m-fg)]" />}</span>
      <span className={cn("truncate text-[17px] font-semibold", ios ? "text-center" : "flex-1 text-[20px] font-normal")}>{title}</span>
      <span className="flex w-16 items-center justify-end gap-3 text-[var(--m-fg)]">{right}</span>
    </div>
  );
}

/* ------------------------------- Button ------------------------------ */

export type MVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

export function MButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  full,
  loading,
  disabled,
  onClick,
  className,
}: {
  children?: ReactNode;
  variant?: MVariant;
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  full?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const h = size === "sm" ? 36 : size === "lg" ? 52 : 44;
  const styles: Record<MVariant, string> = {
    primary: "bg-[var(--m-primary)] text-[var(--m-on-primary)]",
    secondary: "bg-[var(--m-muted)] text-[var(--m-fg)]",
    outline: "border border-[var(--m-border)] text-[var(--m-fg)]",
    ghost: "text-[var(--m-fg)]",
    destructive: "bg-[var(--m-danger)] text-white",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-[transform,opacity] duration-100 active:scale-[0.97] active:opacity-80 disabled:opacity-50",
        styles[variant],
        full && "w-full",
        className
      )}
      style={{
        height: h,
        paddingInline: size === "sm" ? 14 : size === "lg" ? 22 : 18,
        borderRadius: "var(--m-radius-control)",
        fontSize: size === "sm" ? 14 : 16,
      }}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  );
}

/* -------------------------------- Input ------------------------------ */

export function MInput({
  label,
  placeholder,
  value,
  icon: Icon,
  trailing,
  error,
  helper,
  focused,
  secure,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  icon?: LucideIcon;
  trailing?: ReactNode;
  error?: string;
  helper?: string;
  focused?: boolean;
  secure?: boolean;
}) {
  const [text, setText] = useState(value ?? "");
  const { interactive } = usePhone();
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-[14px] font-medium">{label}</span>}
      <span
        className={cn(
          "flex h-12 items-center gap-2.5 rounded-xl border bg-[var(--m-card)] px-3.5",
          error ? "border-[var(--m-danger)]" : focused ? "border-[var(--m-fg)]" : "border-[var(--m-border)]",
          "focus-within:border-[var(--m-fg)]"
        )}
      >
        {Icon && <Icon size={18} className="shrink-0 text-[var(--m-fg-muted)]" />}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          type={secure ? "password" : "text"}
          readOnly={!interactive}
          aria-label={label ?? placeholder}
          className="min-w-0 flex-1 bg-transparent text-[16px] text-[var(--m-fg)] outline-none placeholder:text-[var(--m-fg-muted)]"
        />
        {trailing}
      </span>
      {(error || helper) && (
        <span className={cn("text-[13px]", error ? "text-[var(--m-danger)]" : "text-[var(--m-fg-muted)]")}>{error ?? helper}</span>
      )}
    </label>
  );
}

/* --------------------------- Lists & groups -------------------------- */

export function MGroup({ title, children, footer }: { title?: string; children: ReactNode; footer?: string }) {
  return (
    <section className="px-4">
      {title && <p className="mb-1.5 px-4 text-[13px] uppercase tracking-wide text-[var(--m-fg-muted)]">{title}</p>}
      <div className="overflow-hidden rounded-[var(--m-radius-card)] bg-[var(--m-card)] [&>*+*]:border-t [&>*+*]:border-[var(--m-border)]">
        {children}
      </div>
      {footer && <p className="mt-1.5 px-4 text-[13px] text-[var(--m-fg-muted)]">{footer}</p>}
    </section>
  );
}

export function MRow({
  title,
  subtitle,
  icon: Icon,
  tint,
  value,
  trailing,
  chevron = true,
  destructive,
  onClick,
  leading,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  tint?: string;
  value?: string;
  trailing?: ReactNode;
  chevron?: boolean;
  destructive?: boolean;
  onClick?: () => void;
  leading?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[48px] w-full items-center gap-3 px-4 py-2 text-left active:bg-[var(--m-muted)]"
    >
      {leading}
      {Icon && (
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg text-white" style={{ background: tint ?? "var(--m-fg-muted)" }}>
          <Icon size={17} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[16px]", destructive && "text-[var(--m-danger)]")}>{title}</span>
        {subtitle && <span className="block truncate text-[13px] text-[var(--m-fg-muted)]">{subtitle}</span>}
      </span>
      {value && <span className="text-[15px] text-[var(--m-fg-muted)]">{value}</span>}
      {trailing}
      {chevron && !trailing && <ChevronRight size={18} className="shrink-0 text-[var(--m-fg-muted)] opacity-60" />}
    </button>
  );
}

export function MSwitch({ on: initial = false }: { on?: boolean }) {
  const [on, setOn] = useState(initial);
  const { platform } = usePhone();
  const ios = platform === "ios";
  return (
    <span
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        setOn(!on);
      }}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), setOn(!on))}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200",
        ios ? "h-[31px] w-[51px]" : "h-8 w-[52px] border-2",
        on
          ? ios
            ? "bg-[var(--m-success)]"
            : "border-[var(--m-primary)] bg-[var(--m-primary)]"
          : ios
            ? "bg-[var(--m-muted)]"
            : "border-[var(--m-fg-muted)] bg-transparent"
      )}
    >
      <span
        className={cn(
          "absolute rounded-full shadow transition-all duration-200",
          ios ? "top-[2px] size-[27px] bg-white" : on ? "size-6 bg-[var(--m-on-primary)]" : "size-4 bg-[var(--m-fg-muted)]"
        )}
        style={ios ? { left: on ? 22 : 2 } : { left: on ? 22 : 6 }}
      />
    </span>
  );
}

/* -------------------------------- Avatar ----------------------------- */

const HUES = [12, 32, 145, 190, 220, 265, 300, 340];

export function hueFor(name: string) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return HUES[h % HUES.length];
}

export function MAvatar({
  name,
  size = 40,
  status,
  ring,
  className,
}: {
  name: string;
  size?: number;
  status?: "online" | "away" | "offline";
  ring?: boolean;
  className?: string;
}) {
  const hue = hueFor(name);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const dot = status === "online" ? "var(--m-success)" : status === "away" ? "var(--m-warning)" : "var(--m-fg-muted)";
  return (
    <span className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }}>
      <span
        className={cn("flex size-full items-center justify-center rounded-full font-semibold text-white", ring && "ring-2 ring-[var(--m-bg)]")}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 70% 58%), hsl(${(hue + 40) % 360} 65% 42%))`,
          fontSize: size * 0.38,
        }}
      >
        {initials}
      </span>
      {status && (
        <span
          className="absolute bottom-0 right-0 rounded-full ring-2 ring-[var(--m-bg)]"
          style={{ width: size * 0.28, height: size * 0.28, background: dot }}
        />
      )}
    </span>
  );
}

/* ------------------------------ Imagery ------------------------------ */

/** Gradient placeholder art — no external images needed. */
export function Art({
  hue = 220,
  icon: Icon,
  className,
  style,
  children,
}: {
  hue?: number;
  icon?: LucideIcon;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at 20% 10%, hsl(${hue} 80% 70%), transparent 60%), radial-gradient(100% 90% at 90% 90%, hsl(${(hue + 50) % 360} 70% 50%), transparent 60%), hsl(${(hue + 20) % 360} 50% 30%)`,
        ...style,
      }}
    >
      {Icon && <Icon size={44} className="text-white/85" strokeWidth={1.5} />}
      {children}
    </div>
  );
}

/* ------------------------------- Tabs -------------------------------- */

export function MSegmented({
  tabs,
  value,
  onChange,
  variant = "segmented",
}: {
  tabs: string[];
  value: number;
  onChange: (i: number) => void;
  variant?: "segmented" | "underline";
}) {
  if (variant === "underline") {
    return (
      <div className="relative flex border-b border-[var(--m-border)]">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(i)}
            className={cn(
              "h-11 flex-1 text-[15px] font-medium transition-colors",
              i === value ? "text-[var(--m-fg)]" : "text-[var(--m-fg-muted)]"
            )}
          >
            {t}
          </button>
        ))}
        <span
          className="absolute bottom-[-1px] h-[2px] rounded-full bg-[var(--m-fg)] transition-all duration-300 ease-out"
          style={{ width: `${100 / tabs.length}%`, left: `${(100 / tabs.length) * value}%` }}
        />
      </div>
    );
  }
  return (
    <div className="relative flex h-9 rounded-[10px] bg-[var(--m-muted)] p-[3px]">
      <span
        className="absolute bottom-[3px] top-[3px] rounded-[8px] bg-[var(--m-card)] shadow-sm transition-all duration-300 ease-out"
        style={{ width: `calc(${100 / tabs.length}% - 2px)`, left: `calc(${(100 / tabs.length) * value}% + 1px)` }}
      />
      {tabs.map((t, i) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(i)}
          className={cn("relative flex-1 text-[13.5px] font-semibold", i === value ? "text-[var(--m-fg)]" : "text-[var(--m-fg-muted)]")}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------ Tab bar ------------------------------ */

export interface MTabItem {
  key: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export function MTabBar({ items, active, onChange }: { items: MTabItem[]; active: string; onChange?: (k: string) => void }) {
  const { platform } = usePhone();
  const ios = platform === "ios";
  return (
    <nav
      className="shrink-0 border-t border-[var(--m-border)] bg-[var(--m-bg)]/95 backdrop-blur"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      <div className={cn("flex", ios ? "h-[50px] pt-1" : "h-16 items-center")}>
        {items.map((it) => {
          const on = it.key === active;
          const Icon = it.icon;
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange?.(it.key)}
              className="relative flex flex-1 flex-col items-center gap-0.5"
            >
              <span
                className={cn(
                  "relative flex items-center justify-center transition-colors",
                  !ios && "h-8 w-16 rounded-full",
                  !ios && on && "bg-[var(--m-muted)]"
                )}
              >
                <Icon size={ios ? 24 : 22} strokeWidth={on ? 2.3 : 1.8} className={on ? "text-[var(--m-fg)]" : "text-[var(--m-fg-muted)]"} />
                {it.badge ? (
                  <span className="absolute -right-0 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[var(--m-danger)] px-1 text-[10.5px] font-bold text-white">
                    {it.badge}
                  </span>
                ) : null}
              </span>
              <span className={cn("text-[10.5px]", on ? "font-semibold text-[var(--m-fg)]" : "text-[var(--m-fg-muted)]", !ios && "text-[12px]")}>
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/** Spacer for screens without a tab bar. */
export function SafeBottom() {
  return <div className="shrink-0" style={{ height: "var(--safe-bottom)" }} />;
}

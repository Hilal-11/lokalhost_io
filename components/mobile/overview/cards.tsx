"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { ArrowUpRight, Globe } from "lucide-react";
import { SiAndroid, SiApple } from "react-icons/si";
import { cn } from "@/lib/utils";
import type { MobileItemSummary, PreviewId } from "@/lib/mobile/types";
import { DEVICES, frameSize, type PhonePlatform } from "../preview/phone-frame";
import { PhoneScreen } from "../preview/preview-panel";
import { Badge, SkeletonBlock } from "../ui/primitives";

/* ------------------------------------------------------------------ */
/* Lazy, non-interactive phone thumbnail                              */
/* ------------------------------------------------------------------ */

function useInView<T extends HTMLElement>(margin = "200px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen] as const;
}

export { cardShell, stretch };

export function PhoneThumb({
  preview,
  scale,
  platform = "ios",
  className,
}: {
  preview: PreviewId;
  scale: number;
  platform?: PhonePlatform;
  className?: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const device = DEVICES.find((d) => d.platform === platform)!;
  const { width, height } = frameSize(device);
  const theme = mounted && resolvedTheme === "light" ? "light" : "dark";

  return (
    <div ref={ref} aria-hidden className={cn("relative shrink-0", className)} style={{ width: width * scale, height: height * scale }}>
      {seen && mounted ? (
        <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${scale})`, width, height }}>
          <PhoneScreen step={{ title: preview, preview }} device={device} theme={theme} interactive={false} />
        </div>
      ) : (
        <SkeletonBlock className="size-full" />
      )}
    </div>
  );
}

/* Cards use a stretched link: the thumbnail holds live previews (with their
   own buttons), so it must be a sibling of the link, never a descendant. */
const cardShell =
  "lk-transition group relative flex flex-col overflow-hidden rounded-lk-card border border-lk-border bg-lk-bg hover:border-lk-border-strong has-[.lk-stretch:focus-visible]:outline-2 has-[.lk-stretch:focus-visible]:outline-offset-2 has-[.lk-stretch:focus-visible]:outline-[var(--lk-ring)]";
const stretch = "lk-stretch outline-none after:absolute after:inset-0 after:z-10 after:content-['']";

/* ------------------------------------------------------------------ */
/* Item card                                                          */
/* ------------------------------------------------------------------ */

function PlatformIcons({ item }: { item: MobileItemSummary }) {
  const p = item.platforms;
  return (
    <span className="flex items-center gap-1.5 text-lk-subtle" aria-label="Platforms">
      {p.ios !== "none" && <SiApple size={12} title="iOS" />}
      {p.android !== "none" && <SiAndroid size={12} title="Android" />}
      {p.web !== "none" && <Globe size={12} aria-label={p.web === "partial" ? "Web (partial)" : "Web"} className={p.web === "partial" ? "opacity-50" : ""} />}
    </span>
  );
}

export function ItemCard({ item }: { item: MobileItemSummary }) {
  return (
    <article className={cardShell}>
      <div className="relative flex h-[232px] justify-center overflow-hidden border-b border-lk-border lk-dots">
        <PhoneThumb preview={item.preview} scale={0.46} className="mt-6 lk-transition group-hover:-translate-y-1" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-lk-bg-subtle to-transparent" />
        {item.flow && (
          <span className="absolute left-3 top-3 rounded-full border border-lk-border bg-lk-bg/80 px-2 py-0.5 text-[11px] font-medium text-lk-muted backdrop-blur">
            {item.flow.length}-step flow
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <div className="flex items-center gap-2">
          <h3 className="m-0 truncate text-[14px] font-medium text-lk-fg">
            <Link href={item.href} className={stretch}>
              {item.title}
            </Link>
          </h3>
          {item.badge && <Badge kind={item.badge} />}
          <ArrowUpRight size={14} className="lk-transition ml-auto shrink-0 text-lk-subtle opacity-0 group-hover:opacity-100" aria-hidden />
        </div>
        <p className="m-0 line-clamp-2 text-[13px] leading-snug text-lk-muted">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-[12px] text-lk-subtle">
          <span>
            {item.category} · {item.variants} {item.variants === 1 ? "variant" : "variants"}
          </span>
          <PlatformIcons item={item} />
        </div>
      </div>
    </article>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lk-card border border-lk-border" aria-hidden>
      <SkeletonBlock className="h-[232px] rounded-none" />
      <div className="flex flex-col gap-2 p-3.5">
        <SkeletonBlock className="h-3.5 w-1/2" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Category card                                                      */
/* ------------------------------------------------------------------ */

export function CategoryCard({
  name,
  count,
  preview,
  onSelect,
}: {
  name: string;
  count: number;
  preview: PreviewId;
  onSelect: () => void;
}) {
  return (
    <div className={cardShell}>
      <div className="relative flex h-[148px] justify-center overflow-hidden border-b border-lk-border lk-dots">
        <PhoneThumb preview={preview} scale={0.34} className="mt-5 lk-transition group-hover:-translate-y-1" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-lk-bg-subtle to-transparent" />
      </div>
      <div className="flex items-center justify-between px-3.5 py-3">
        <button type="button" onClick={onSelect} className={`${stretch} text-left text-[13.5px] font-medium text-lk-fg`}>
          {name}
          <span className="sr-only">, {count} items</span>
        </button>
        <span aria-hidden className="font-mono text-[12px] tabular-nums text-lk-subtle">{count}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Featured screen — tall frame                                       */
/* ------------------------------------------------------------------ */

export function FeaturedCard({ item }: { item: MobileItemSummary }) {
  return (
    <div className={`${cardShell} w-[236px] shrink-0 snap-start gap-3 p-3`}>
      <div className="flex justify-center rounded-lk bg-lk-bg-subtle py-4">
        <PhoneThumb preview={item.preview} scale={0.46} />
      </div>
      <div className="flex items-center gap-2 px-0.5">
        <Link href={item.href} className={`${stretch} truncate text-[13.5px] font-medium text-lk-fg`}>
          {item.title}
        </Link>
        {item.badge && <Badge kind={item.badge} />}
        <span className="ml-auto text-[12px] text-lk-subtle">{item.flow ? `${item.flow.length} screens` : item.category}</span>
      </div>
    </div>
  );
}

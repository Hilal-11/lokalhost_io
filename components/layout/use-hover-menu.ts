"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

const OPEN_DELAY = 80;
const CLOSE_DELAY = 160;

/**
 * Shared behaviour for header mega-menus: opens on mouse hover (with a small
 * intent delay), toggles on click/tap, ArrowDown opens and focuses the first
 * [data-menu-link], arrows move between links, Escape / outside click / route
 * change close it.
 */
export function useHoverMenu() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();

  const schedule = React.useCallback((next: boolean) => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), next ? OPEN_DELAY : CLOSE_DELAY);
  }, []);

  React.useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>("[data-menu-link]") ?? []);

  const rootProps = {
    ref: rootRef,
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && schedule(true),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && schedule(false),
  };

  const triggerProps = {
    ref: triggerRef,
    type: "button" as const,
    "aria-expanded": open,
    "aria-controls": panelId,
    "aria-haspopup": true,
    onClick: () => setOpen((o) => !o),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => links()[0]?.focus());
      }
    },
  };

  const panelProps = {
    id: panelId,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const list = links();
      const i = list.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      list[(i + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]?.focus();
    },
  };

  return { open, setOpen, close: () => setOpen(false), rootProps, triggerProps, panelProps };
}

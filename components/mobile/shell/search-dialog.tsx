"use client";

import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as Dialog from "@radix-ui/react-dialog";
import { useTheme } from "next-themes";
import { CornerDownLeft, FileText, Moon, Search, Smartphone } from "lucide-react";
import type { MobileItemSummary } from "@/lib/mobile/types";
import type { NavSection } from "@/lib/mobile/nav";
import { KIND_LABEL } from "@/lib/mobile/catalog";
import { Badge, FrameworkIcon } from "../ui/primitives";
import { NAV_ICONS } from "./sidebar";
import { FRAMEWORK_LABEL, usePrefs } from "./prefs";

const itemClass =
  "flex h-11 cursor-default select-none items-center gap-3 rounded-lk px-2.5 text-[13.5px] text-lk-fg outline-none data-[selected=true]:bg-lk-surface-2";

const groupClass =
  "[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[11.5px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-lk-subtle";

export function SearchDialog({
  open,
  onOpenChange,
  nav,
  items,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  nav: NavSection[];
  items: MobileItemSummary[];
}) {
  const router = useRouter();
  const { framework, set } = usePrefs();
  const { resolvedTheme, setTheme } = useTheme();

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const pages = nav.flatMap((s) => s.entries).filter((e) => !e.children);
  const kinds = ["component", "screen", "block"] as const;
  const other = framework === "flutter" ? "react-native" : "flutter";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[200] bg-lk-overlay backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[12vh] z-[201] w-[min(640px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-lk-card border border-lk-border bg-lk-bg shadow-2xl shadow-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]"
        >
          <Dialog.Title className="sr-only">Search mobile library</Dialog.Title>
          <Command label="Search mobile library" loop>
            <div className="flex h-12 items-center gap-2.5 border-b border-lk-border px-3.5">
              <Search size={16} className="shrink-0 text-lk-subtle" aria-hidden />
              <Command.Input
                autoFocus
                placeholder="Search components, screens, blocks…"
                className="h-full flex-1 bg-transparent text-[14.5px] text-lk-fg outline-none placeholder:text-lk-subtle"
              />
              <kbd className="rounded-[5px] border border-lk-border bg-lk-surface px-1.5 py-px font-sans text-[11px] text-lk-muted">Esc</kbd>
            </div>
            <Command.List className="lk-scroll max-h-[min(60vh,440px)] overflow-y-auto p-1.5">
              <Command.Empty className="flex flex-col items-center gap-1 py-12 text-center">
                <Smartphone size={20} className="text-lk-subtle" aria-hidden />
                <span className="text-[13.5px] text-lk-fg">No results</span>
                <span className="text-[12.5px] text-lk-subtle">Try “sheet”, “checkout” or “tabs”.</span>
              </Command.Empty>

              {kinds.map((k) => (
                <Command.Group key={k} heading={KIND_LABEL[k]} className={groupClass}>
                  {items
                    .filter((i) => i.kind === k)
                    .map((i) => (
                      <Command.Item key={i.href} value={`${i.title} ${i.category} ${i.tags.join(" ")} ${k}`} onSelect={() => go(i.href)} className={itemClass}>
                        <Smartphone size={15} className="shrink-0 text-lk-subtle" aria-hidden />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate">{i.title}</span>
                          <span className="truncate text-[12px] text-lk-subtle">{i.description}</span>
                        </span>
                        {i.badge && <Badge kind={i.badge} />}
                        <span className="hidden text-[11.5px] text-lk-subtle sm:inline">{i.category}</span>
                      </Command.Item>
                    ))}
                </Command.Group>
              ))}

              <Command.Group heading="Docs" className={groupClass}>
                {pages.map((p) => {
                  const Icon = NAV_ICONS[p.icon] ?? FileText;
                  return (
                    <Command.Item key={p.href} value={`${p.title} docs`} onSelect={() => go(p.href)} className={itemClass}>
                      <Icon size={15} className="shrink-0 text-lk-subtle" aria-hidden />
                      <span className="flex-1">{p.title}</span>
                      {p.badge && <Badge kind={p.badge} />}
                    </Command.Item>
                  );
                })}
              </Command.Group>

              <Command.Group heading="Actions" className={groupClass}>
                <Command.Item
                  value={`switch framework ${FRAMEWORK_LABEL[other]}`}
                  onSelect={() => {
                    set("framework", other);
                    onOpenChange(false);
                  }}
                  className={itemClass}
                >
                  <FrameworkIcon framework={other} size={15} />
                  <span className="flex-1">Show {FRAMEWORK_LABEL[other]} code</span>
                </Command.Item>
                <Command.Item
                  value="toggle theme dark light"
                  onSelect={() => {
                    setTheme(resolvedTheme === "dark" ? "light" : "dark");
                    onOpenChange(false);
                  }}
                  className={itemClass}
                >
                  <Moon size={15} className="text-lk-subtle" aria-hidden />
                  <span className="flex-1">Toggle {resolvedTheme === "dark" ? "light" : "dark"} mode</span>
                </Command.Item>
              </Command.Group>
            </Command.List>
            <div className="flex h-9 items-center justify-end gap-3 border-t border-lk-border px-3 text-[11.5px] text-lk-subtle">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-lk-border px-1 font-sans">↑</kbd>
                <kbd className="rounded border border-lk-border px-1 font-sans">↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <CornerDownLeft size={11} aria-hidden /> open
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

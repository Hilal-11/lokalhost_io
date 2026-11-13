"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import { useTheme } from "next-themes";
import {
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Component,
  Download,
  GitPullRequest,
  History,
  LayoutGrid,
  LayoutTemplate,
  Monitor,
  Moon,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  Smartphone,
  Sparkles,
  SquareTerminal,
  Sun,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Cover } from "@/components/lk/cover";
import { useUser } from "@/hooks/useUser";
import type { NavEntry, NavIconKey, NavSection } from "@/lib/mobile/nav";
import { PACKAGE_MANAGERS } from "@/lib/mobile/install";
import { Badge, FrameworkIcon, IconButton, Segmented, Tip } from "../ui/primitives";
import { menuContentClass, menuItemClass } from "../ui/menus";
import { usePrefs } from "./prefs";

export const NAV_ICONS: Record<NavIconKey, LucideIcon> = {
  overview: LayoutGrid,
  introduction: BookOpen,
  installation: Download,
  cli: SquareTerminal,
  theming: Palette,
  changelog: History,
  components: Component,
  screens: Smartphone,
  blocks: Boxes,
  templates: LayoutTemplate,
  showcase: Sparkles,
  contributing: GitPullRequest,
};

const isActive = (pathname: string, href: string) => pathname === href;
const contains = (pathname: string, e: NavEntry) =>
  pathname === e.href || (e.children?.some((c) => c.href === pathname) ?? false);

/* ------------------------------------------------------------------ */
/* Workspace switcher                                                 */
/* ------------------------------------------------------------------ */

const WORKSPACES = [
  { label: "Web", hint: "React & Next.js components", href: "/docs" },
  { label: "Mobile", hint: "React Native & Flutter UI", href: "/mobile", current: true },
  { label: "Templates", hint: "Full app & site templates", href: "/templates" },
];

function Logo() {
  return (
    <Image
      src="/logosvglight.svg"
      alt="Lokalhost.io"
      width={28}
      height={28}
      className="size-7 shrink-0 rounded-sm border border-neutral-200"
    />
  );
}

function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const triggerClass = cn(
    "lk-focus lk-transition flex h-10 min-w-0 items-center gap-2 rounded-lk hover:bg-lk-surface data-[state=open]:bg-lk-surface",
    collapsed ? "w-10 justify-center" : "flex-1 px-1.5"
  );
  const triggerBody = (
    <>
      <Logo />
      {!collapsed && (
        <>
          <span className="truncate text-[14px] font-semibold text-lk-fg">lokalhost</span>
          <span className="rounded-full border border-lk-border bg-lk-surface px-1.5 py-px text-[11px] font-medium text-lk-muted">
            Mobile
          </span>
          <ChevronsUpDown size={14} className="ml-auto shrink-0 text-lk-subtle" aria-hidden />
        </>
      )}
    </>
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label="Switch library" className={triggerClass}>
        {triggerBody}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" sideOffset={6} className={cn(menuContentClass, "w-[248px]")}>
          <DropdownMenu.Label className="px-2 pb-1 pt-1.5 text-[11.5px] font-medium text-lk-subtle">Libraries</DropdownMenu.Label>
          {WORKSPACES.map((w) => (
            <DropdownMenu.Item key={w.href} asChild className={cn(menuItemClass, "h-auto py-1.5")}>
              <Link href={w.href}>
                <span className="flex flex-1 flex-col">
                  <span className="text-[13px] font-medium">{w.label}</span>
                  <span className="text-[12px] text-lk-subtle">{w.hint}</span>
                </span>
                {w.current && <Check size={14} className="text-lk-fg" aria-label="Current" />}
              </Link>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1 h-px bg-lk-border" />
          <DropdownMenu.Item asChild className={menuItemClass}>
            <Link href="/">
              <ArrowUpRight size={14} className="text-lk-muted" aria-hidden />
              lokalhost.io home
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Search trigger                                                     */
/* ------------------------------------------------------------------ */

function SearchTrigger({ collapsed, onOpen }: { collapsed: boolean; onOpen: () => void }) {
  const [mac, setMac] = useState(true);
  useEffect(() => setMac(/mac|iphone|ipad/i.test(navigator.userAgent)), []);
  if (collapsed) {
    return (
      <Tip label="Search (⌘K)">
        <IconButton label="Search" onClick={onOpen} className="size-10">
          <Search size={16} />
        </IconButton>
      </Tip>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      className="lk-focus lk-transition flex h-9 w-full items-center gap-2 rounded-lk border border-lk-border bg-lk-bg px-2.5 text-[13.5px] text-lk-subtle hover:border-lk-border-strong hover:text-lk-muted"
    >
      <Search size={15} aria-hidden />
      <span className="flex-1 text-left">Find…</span>
      <kbd className="rounded-[5px] border border-lk-border bg-lk-surface px-1.5 py-px font-sans text-[11px] font-medium text-lk-muted">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* SidebarItem — default / hover / active / badge / expandable        */
/* ------------------------------------------------------------------ */

const rowBase =
  "lk-focus lk-transition group/row flex items-center rounded-lk text-[13.5px] outline-offset-[-2px]";

function SidebarItem({
  entry,
  pathname,
  collapsed,
  open,
  onToggle,
  onNavigate,
}: {
  entry: NavEntry;
  pathname: string;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const Icon = NAV_ICONS[entry.icon];
  const active = isActive(pathname, entry.href);
  const within = contains(pathname, entry);

  if (collapsed) {
    return (
      <Tip label={entry.title}>
        <Link
          href={entry.href}
          aria-label={entry.title}
          aria-current={active ? "page" : undefined}
          onClick={onNavigate}
          className={cn(
            rowBase,
            "relative size-10 justify-center",
            active || within ? "bg-lk-surface-2" : "hover:bg-lk-surface"
          )}
        >
          <Icon size={16} className={active || within ? "text-lk-fg" : "text-lk-muted"} aria-hidden />
          {entry.badge && <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-lk-brand" aria-hidden />}
        </Link>
      </Tip>
    );
  }

  const label = (
    <>
      <Icon size={15} className="shrink-0" aria-hidden />
      <span className="flex-1 truncate">{entry.title}</span>
      {entry.badge && <Badge kind={entry.badge} />}
    </>
  );

  if (!entry.children) {
    return (
      <Link
        href={entry.href}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className={cn(
          rowBase,
          "h-8 gap-2.5 px-2",
          active ? "bg-lk-surface-3 font-medium text-lk-fg" : "text-lk-muted hover:bg-lk-surface hover:text-lk-fg active:bg-lk-surface-2"
        )}
      >
        {label}
      </Link>
    );
  }

  const listId = `nav-${entry.id}`;
  return (
    <div>
      <div
        className={cn(
          "group/row flex h-8 items-center rounded-lk lk-transition",
          active ? "bg-lk-surface-3" : "hover:bg-lk-surface"
        )}
      >
        <Link
          href={entry.href}
          aria-current={active ? "page" : undefined}
          onClick={onNavigate}
          className={cn(
            rowBase,
            "h-8 min-w-0 flex-1 gap-2.5 pl-2 pr-1",
            active || within ? "font-medium text-lk-fg" : "text-lk-muted hover:text-lk-fg"
          )}
        >
          {label}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${open ? "Collapse" : "Expand"} ${entry.title}`}
          className="lk-focus lk-transition mr-0.5 flex size-7 shrink-0 items-center justify-center rounded-[6px] text-lk-subtle outline-offset-[-2px] hover:bg-lk-surface-2 hover:text-lk-fg"
        >
          <ChevronRight size={14} className={cn("transition-transform duration-150", open && "rotate-90")} aria-hidden />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id={listId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
            className="m-0 ml-[17px] list-none overflow-hidden border-l border-lk-border p-0 pl-2"
          >
            {entry.children.map((c) => {
              const on = isActive(pathname, c.href);
              return (
                <li key={c.href} className="py-px first:pt-1 last:pb-1">
                  <Link
                    href={c.href}
                    aria-current={on ? "page" : undefined}
                    onClick={onNavigate}
                    className={cn(
                      rowBase,
                      "h-7 gap-2 px-2 text-[13px]",
                      on
                        ? "relative bg-lk-brand-soft font-medium text-lk-fg before:absolute before:-left-[9px] before:inset-y-1 before:w-[2px] before:rounded-full before:bg-lk-brand"
                        : "text-lk-muted hover:bg-lk-surface hover:text-lk-fg"
                    )}
                  >
                    <span className="flex-1 truncate">{c.title}</span>
                    {c.badge && <Badge kind={c.badge} />}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer controls                                                    */
/* ------------------------------------------------------------------ */

function ThemeButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const order = ["dark", "light", "system"] as const;
  const current = (mounted ? theme : "system") as (typeof order)[number];
  const next = order[(order.indexOf(current) + 1) % order.length] ?? "dark";
  const Icon = current === "light" ? Sun : current === "dark" ? Moon : Monitor;
  return (
    <IconButton label={`Theme: ${current}. Switch to ${next}`} onClick={() => setTheme(next)} className={className}>
      <Icon size={15} />
    </IconButton>
  );
}

function SettingsButton({ className }: { className?: string }) {
  const { framework, pm, lang, set } = usePrefs();
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton label="Preferences" className={className}>
          <Settings2 size={15} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" align="start" sideOffset={8} className={cn(menuContentClass, "flex w-[264px] flex-col gap-3.5 p-3.5")}>
          <p className="m-0 text-[13px] font-medium text-lk-fg">Preferences</p>
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] text-lk-subtle">Framework</span>
            <Segmented
              size="sm"
              role="radiogroup"
              label="Framework"
              value={framework}
              onChange={(v) => set("framework", v)}
              options={[
                { value: "react-native", label: <><FrameworkIcon framework="react-native" size={12} /> React Native</> },
                { value: "flutter", label: <><FrameworkIcon framework="flutter" size={12} /> Flutter</> },
              ]}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] text-lk-subtle">Package manager</span>
            <Segmented size="sm" role="radiogroup" label="Package manager" value={pm} onChange={(v) => set("pm", v)} options={PACKAGE_MANAGERS.map((p) => ({ value: p, label: p }))} />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] text-lk-subtle">React Native language</span>
            <Segmented
              size="sm"
              role="radiogroup"
              label="Code language"
              value={lang}
              onChange={(v) => set("lang", v)}
              options={[
                { value: "ts", label: "TypeScript" },
                { value: "js", label: "JavaScript" },
              ]}
            />
          </div>
          <p className="m-0 text-[11.5px] text-lk-subtle">Saved in this browser.</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Account({ collapsed }: { collapsed: boolean }) {
  const { user } = useUser();
  const name = (user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split("@")[0];
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  const content = user ? (
    <Link
      href="/profile"
      aria-label={collapsed ? `Profile: ${name}` : undefined}
      className={cn("lk-focus lk-transition flex min-w-0 items-center gap-2 rounded-lk hover:bg-lk-surface", collapsed ? "size-10 justify-center" : "h-9 flex-1 px-1.5")}
    >
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="" className="size-6 shrink-0 rounded-full" />
      ) : (
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lk-surface-3 text-[11px] font-semibold text-lk-fg">
          {(name ?? "?").slice(0, 1).toUpperCase()}
        </span>
      )}
      {!collapsed && <span className="truncate text-[13px] text-lk-fg">{name}</span>}
    </Link>
  ) : (
    <a
      href="https://github.com/Hilal-11/lokalhost.io"
      target="_blank"
      rel="noreferrer"
      aria-label={collapsed ? "lokalhost.io on GitHub" : undefined}
      className={cn("lk-focus lk-transition flex min-w-0 items-center gap-2 rounded-lk text-lk-muted hover:bg-lk-surface hover:text-lk-fg", collapsed ? "size-10 justify-center" : "h-9 flex-1 px-1.5")}
    >
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-lk-surface-3 text-lk-fg">
        <FaGithub size={14} aria-hidden />
      </span>
      {!collapsed && <span className="truncate text-[13px]">Star on GitHub</span>}
    </a>
  );

  return collapsed ? <Tip label={user ? (name ?? "Profile") : "GitHub"}>{content}</Tip> : content;
}

/* ------------------------------------------------------------------ */
/* Sidebar body (shared by desktop rail and mobile drawer)            */
/* ------------------------------------------------------------------ */

export function SidebarBody({
  nav,
  collapsed = false,
  onSearch,
  onNavigate,
  onToggleCollapsed,
  showHeader = true,
}: {
  nav: NavSection[];
  collapsed?: boolean;
  onSearch: () => void;
  onNavigate?: () => void;
  onToggleCollapsed?: () => void;
  showHeader?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // reveal the group that holds the current page
  useEffect(() => {
    const owner = nav.flatMap((s) => s.entries).find((e) => e.children && contains(pathname, e));
    if (owner) setOpen((o) => (o[owner.id] ? o : { ...o, [owner.id]: true }));
  }, [pathname, nav]);

  return (
    <div className="flex h-full flex-col">
      {showHeader && (
        <div className={cn("flex h-14 shrink-0 items-center gap-1 px-2.5", collapsed && "justify-center px-0")}>
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>
      )}
      <div className={cn("shrink-0 px-2.5 pb-2", collapsed && "flex justify-center px-0")}>
        <SearchTrigger collapsed={collapsed} onOpen={onSearch} />
      </div>

      <nav aria-label="Mobile library" className={cn("lk-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pb-4", collapsed ? "px-0" : "px-2.5")}>
        {nav.map((section, i) => (
          <div key={section.id}>
            {i > 0 && <hr className={cn("my-2 border-0 border-t border-lk-border", collapsed && "mx-3")} />}
            <h2 className="sr-only">{section.label}</h2>
            <ul className={cn("m-0 flex list-none flex-col gap-px p-0", collapsed && "items-center gap-1")}>
              {section.entries.map((e) => (
                <li key={e.id}>
                  <SidebarItem
                    entry={e}
                    pathname={pathname}
                    collapsed={collapsed}
                    open={!!open[e.id]}
                    onToggle={() => setOpen((o) => ({ ...o, [e.id]: !o[e.id] }))}
                    onNavigate={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}

        {!collapsed && (
          <Cover tone="warm" pattern="dots" className="mt-6 rounded-lk-card border border-lk-border p-3.5">
            <p className="m-0 text-[13px] font-semibold text-lk-fg">Unlock every screen</p>
            <p className="mb-3 mt-1 text-[12px] leading-relaxed text-lk-muted">
              Pro screens, full app templates and Figma files for React Native and Flutter.
            </p>
            <Link href="/pricing" onClick={onNavigate} className="lk-btn lk-btn-sm lk-btn-primary w-full">
              Get All-Access
            </Link>
          </Cover>
        )}
      </nav>

      {/* pinned footer */}
      <div
        className={cn(
          "flex shrink-0 border-t border-lk-border p-2",
          collapsed ? "flex-col items-center gap-1" : "items-center gap-0.5"
        )}
      >
        <Account collapsed={collapsed} />
        <ThemeButton />
        <SettingsButton />
        {onToggleCollapsed && (
          <IconButton label={collapsed ? "Expand sidebar" : "Collapse sidebar"} onClick={onToggleCollapsed}>
            {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </IconButton>
        )}
      </div>
    </div>
  );
}

export function DesktopSidebar({ nav, onSearch }: { nav: NavSection[]; onSearch: () => void }) {
  const { collapsed, set } = usePrefs();
  return (
    <aside
      aria-label="Sidebar"
      className="sticky top-0 hidden h-dvh shrink-0 border-r border-lk-border bg-lk-bg transition-[width] duration-150 ease-[var(--lk-ease)] lg:block"
      style={{ width: collapsed ? "var(--lk-rail-w)" : "var(--lk-sidebar-w)" }}
    >
      <SidebarBody nav={nav} collapsed={collapsed} onSearch={onSearch} onToggleCollapsed={() => set("collapsed", !collapsed)} />
    </aside>
  );
}

export { Logo };

"use client";

import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Copy, ExternalLink, FileText, Link2, QrCode, Sparkles } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import { copyText } from "@/components/mdx/code-view";
import type { Framework } from "@/lib/mobile/types";

const triggerClass =
  "lk-focus lk-transition inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lk border border-lk-border bg-lk-surface px-2.5 text-[12.5px] font-medium text-lk-fg hover:bg-lk-surface-2 active:bg-lk-surface-3 disabled:pointer-events-none disabled:opacity-40 data-[state=open]:bg-lk-surface-2";

const contentClass =
  "z-[150] min-w-[220px] rounded-lk-card border border-lk-border bg-lk-bg p-1 shadow-xl shadow-black/20 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95";

const itemClass =
  "flex h-8 cursor-default select-none items-center gap-2 rounded-[6px] px-2 text-[13px] text-lk-fg outline-none data-[highlighted]:bg-lk-surface-2 data-[disabled]:opacity-40";

/* ------------------------------------------------------------------ */
/* Copy prompt menu                                                   */
/* ------------------------------------------------------------------ */

export function CopyPromptMenu({
  getPrompt,
  getMarkdown,
  compact,
}: {
  getPrompt: () => string;
  getMarkdown: () => string;
  compact?: boolean;
}) {
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(null), 1600);
    return () => clearTimeout(t);
  }, [done]);

  const run = async (key: string, text: string) => {
    if (await copyText(text)) setDone(key);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={triggerClass} aria-label="Copy prompt options">
        {done ? <Check size={14} className="text-lk-success" aria-hidden /> : <Copy size={14} aria-hidden />}
        <span className={cn(compact && "hidden sm:inline")}>{done ? "Copied" : "Copy prompt"}</span>
        <ChevronDown size={13} className="text-lk-muted" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className={contentClass}>
          <DropdownMenu.Item className={itemClass} onSelect={() => run("prompt", getPrompt())}>
            <Sparkles size={14} className="text-lk-muted" aria-hidden />
            Copy as AI prompt
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={() => run("md", getMarkdown())}>
            <FileText size={14} className="text-lk-muted" aria-hidden />
            Copy as Markdown
          </DropdownMenu.Item>
          <DropdownMenu.Item className={itemClass} onSelect={() => run("link", window.location.href)}>
            <Link2 size={14} className="text-lk-muted" aria-hidden />
            Copy page link
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-lk-border" />
          <DropdownMenu.Item
            className={itemClass}
            onSelect={() => window.open(`https://claude.ai/new?q=${encodeURIComponent(getPrompt())}`, "_blank", "noopener")}
          >
            <ExternalLink size={14} className="text-lk-muted" aria-hidden />
            Open in Claude
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Open on device — QR popover                                        */
/* ------------------------------------------------------------------ */

export function QRPopover({ framework, title }: { framework: Framework; title: string }) {
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href.split("#")[0]), []);

  return (
    <Popover.Root>
      <Popover.Trigger className={triggerClass} aria-label="Open on device">
        <QrCode size={14} aria-hidden />
        <span className="hidden md:inline">Open on device</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="end" sideOffset={6} className={cn(contentClass, "w-[260px] p-4")}>
          <p className="m-0 text-[13px] font-medium text-lk-fg">Open on your phone</p>
          <p className="mb-3 mt-1 text-[12.5px] leading-relaxed text-lk-muted">
            {framework === "react-native"
              ? `Scan with your camera to open ${title}. Run the demo in Expo Go after installing it.`
              : `Scan with your camera to open ${title}. Run the demo with flutter run on a connected device.`}
          </p>
          <div className="flex justify-center rounded-lk border border-lk-border bg-white p-3">
            {url ? (
              <QRCodeSVG value={url} size={176} level="M" bgColor="#ffffff" fgColor="#0a0a0a" title={`QR code for ${url}`} />
            ) : (
              <div className="size-[176px] animate-pulse rounded bg-neutral-200" aria-hidden />
            )}
          </div>
          <p className="mb-0 mt-3 truncate text-center font-mono text-[11px] text-lk-subtle" title={url}>
            {url.replace(/^https?:\/\//, "")}
          </p>
          <Popover.Arrow className="fill-lk-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { triggerClass as menuTriggerClass, contentClass as menuContentClass, itemClass as menuItemClass };

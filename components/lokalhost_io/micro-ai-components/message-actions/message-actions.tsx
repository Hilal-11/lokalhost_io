"use client";

import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  ChevronDown,
  Copy,
  MoreHorizontal,
  RefreshCw,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export { BranchSwitcher, BranchContent } from "./branch-switcher";
export type { BranchSwitcherProps, BranchContentProps } from "./branch-switcher";

const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background";

/* ------------------------------------------------------------------ */
/* Root toolbar                                                       */
/* ------------------------------------------------------------------ */

const BAR_CSS = `
.lk-actions[data-visibility="hover"] { opacity: 0; transform: translateY(4px); transition: opacity 180ms cubic-bezier(.22,1,.36,1), transform 180ms cubic-bezier(.22,1,.36,1); }
.group\\/message:hover .lk-actions[data-visibility="hover"],
.group\\/message:focus-within .lk-actions[data-visibility="hover"],
.lk-actions[data-visibility="hover"]:focus-within,
.lk-actions[data-visibility="hover"][data-pinned="true"] { opacity: 1; transform: none; }
@media (hover: none) { .lk-actions[data-visibility="hover"] { opacity: 1; transform: none; } }
.lk-actions[data-visibility="hover"] > * { transition: opacity 160ms ease; opacity: 0; }
.group\\/message:hover .lk-actions > *, .group\\/message:focus-within .lk-actions > *, .lk-actions:focus-within > *, .lk-actions[data-pinned="true"] > *, .lk-actions[data-visibility="always"] > * { opacity: 1; }
${[1, 2, 3, 4, 5, 6, 7, 8].map((i) => `.lk-actions > *:nth-child(${i}) { transition-delay: ${(i - 1) * 20}ms; }`).join("\n")}
@media (prefers-reduced-motion: reduce) { .lk-actions, .lk-actions > * { transition: opacity 120ms ease !important; transform: none !important; } }
`;

export interface MessageActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * "hover" fades the bar in when an ancestor with the `group/message` class is hovered or focused
   * (the <Message> component adds it). Always visible on touch devices. Defaults to "always".
   */
  visibility?: "always" | "hover";
  /** Tooltip open delay in ms. Defaults to 300. */
  tooltipDelay?: number;
}

const MessageActionsRoot = React.forwardRef<HTMLDivElement, MessageActionsProps>(
  ({ visibility = "always", tooltipDelay = 300, className, children, onKeyDown, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const [pinned, setPinned] = React.useState(false);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const items = () =>
      Array.from(innerRef.current?.querySelectorAll<HTMLButtonElement>("[data-roving]:not(:disabled)") ?? []);

    // roving tabindex: exactly one tabbable button
    React.useLayoutEffect(() => {
      const list = items();
      if (!list.length) return;
      const current = list.find((b) => b.tabIndex === 0) ?? list[0];
      list.forEach((b) => (b.tabIndex = b === current ? 0 : -1));
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
      const list = items();
      const i = list.indexOf(document.activeElement as HTMLButtonElement);
      if (i === -1) return;
      e.preventDefault();
      const next =
        e.key === "Home" ? 0 : e.key === "End" ? list.length - 1 : (i + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
      list.forEach((b, j) => (b.tabIndex = j === next ? 0 : -1));
      list[next].focus();
    };

    return (
      <Tooltip.Provider delayDuration={tooltipDelay} skipDelayDuration={150}>
        <PinContext.Provider value={setPinned}>
          <style href="lk-message-actions" precedence="default">
            {BAR_CSS}
          </style>
          <div
            ref={innerRef}
            role="toolbar"
            aria-label="Message actions"
            aria-orientation="horizontal"
            data-visibility={visibility}
            data-pinned={pinned || undefined}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              const t = e.target as HTMLElement;
              if (t.hasAttribute("data-roving")) items().forEach((b) => (b.tabIndex = b === t ? 0 : -1));
            }}
            className={cn("lk-actions flex items-center gap-0.5 font-sans", className)}
            {...props}
          >
            {children}
          </div>
        </PinContext.Provider>
      </Tooltip.Provider>
    );
  }
);
MessageActionsRoot.displayName = "MessageActions";

/** Lets popovers keep a hover-only bar visible while they're open. */
const PinContext = React.createContext<(pinned: boolean) => void>(() => {});

/* ------------------------------------------------------------------ */
/* Base icon button with tooltip                                      */
/* ------------------------------------------------------------------ */

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tooltip + aria-label. */
  label: string;
  /** Shortcut hint shown in the tooltip, e.g. "⇧ C". */
  shortcut?: string;
  /** Tooltip side. Defaults to "bottom". */
  side?: "top" | "bottom";
}

export const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ label, shortcut, side = "bottom", className, children, ...props }, ref) => (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <motion.button
          ref={ref}
          type="button"
          data-roving=""
          aria-label={label}
          whileTap={{ scale: 0.92 }}
          transition={SPRING}
          className={cn(
            "relative flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150",
            "hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
            "aria-pressed:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground",
            ring,
            className
          )}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          {children}
        </motion.button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={6}
          className="z-50 flex items-center gap-2 rounded-md border border-border bg-popover px-2 py-1 text-[12px] font-medium text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95"
        >
          {label}
          {shortcut && <kbd className="rounded border border-border bg-muted px-1 font-mono text-[10.5px] text-muted-foreground">{shortcut}</kbd>}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
);
ActionButton.displayName = "ActionButton";

function Swap({ k, children }: { k: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={k}
        className="flex"
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, transition: { duration: 0.12 } }}
        transition={{ duration: 0.16, ease: EASE }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Copy                                                               */
/* ------------------------------------------------------------------ */

export function stripMarkdown(md: string) {
  return md
    .replace(/```[\w-]*\n?([\s\S]*?)```/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/^>\s?/gm, "")
    .trim();
}

export interface ActionCopyProps {
  /** Markdown copied on click. Shift+click copies plain text. */
  text: string;
  /** Plain-text version. Derived from `text` when omitted. */
  plainText?: string;
  onCopy?: (text: string, format: "markdown" | "plain") => void;
  className?: string;
}

function ActionCopy({ text, plainText, onCopy, className }: ActionCopyProps) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<number | null>(null);
  React.useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);
  const copy = async (e: React.MouseEvent) => {
    const plain = e.shiftKey;
    const value = plain ? plainText ?? stripMarkdown(text) : text;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopy?.(value, plain ? "plain" : "markdown");
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <ActionButton label={copied ? "Copied!" : "Copy"} shortcut={copied ? undefined : "⇧ plain"} onClick={copy} className={className}>
      <Swap k={copied ? "check" : "copy"}>
        {copied ? <Check className="size-4 text-foreground" strokeWidth={2.25} /> : <Copy className="size-4" />}
      </Swap>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </ActionButton>
  );
}

/* ------------------------------------------------------------------ */
/* Regenerate (split button)                                          */
/* ------------------------------------------------------------------ */

export interface RegenerateModel {
  id: string;
  label: string;
  description?: string;
}

export interface ActionRegenerateProps {
  /** Called with an optional model id chosen from the caret menu. */
  onRegenerate?: (modelId?: string) => void;
  /** Keeps the icon spinning while true. */
  regenerating?: boolean;
  /** Adds a caret that opens a model picker. */
  models?: RegenerateModel[];
  className?: string;
}

function ActionRegenerate({ onRegenerate, regenerating = false, models, className }: ActionRegenerateProps) {
  const reduce = useReducedMotion();
  const [spins, setSpins] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const setPinned = React.useContext(PinContext);
  React.useEffect(() => setPinned(open), [open, setPinned]);

  const run = (modelId?: string) => {
    setSpins((s) => s + 1);
    onRegenerate?.(modelId);
  };

  const icon = (
    <motion.span
      className="flex"
      animate={reduce ? { rotate: 0 } : regenerating ? { rotate: [spins * 360, spins * 360 + 360] } : { rotate: spins * 360 }}
      transition={
        regenerating && !reduce
          ? { duration: 0.9, repeat: Infinity, ease: "linear" }
          : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      }
    >
      <RefreshCw className="size-4" />
    </motion.span>
  );

  if (!models?.length) {
    return (
      <ActionButton label={regenerating ? "Regenerating…" : "Regenerate"} shortcut="R" onClick={() => run()} disabled={regenerating} className={className}>
        {icon}
      </ActionButton>
    );
  }

  return (
    <div className={cn("flex items-center rounded-lg", className)}>
      <ActionButton label={regenerating ? "Regenerating…" : "Regenerate"} onClick={() => run()} disabled={regenerating} className="rounded-r-none">
        {icon}
      </ActionButton>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <ActionButton label="Regenerate with…" className="w-5 rounded-l-none">
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING} className="flex">
              <ChevronDown className="size-3" />
            </motion.span>
          </ActionButton>
        </Popover.Trigger>
        <MenuPanel open={open}>
          <p className="px-2.5 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Regenerate with</p>
          {models.map((m) => (
            <MenuItem
              key={m.id}
              onSelect={() => {
                setOpen(false);
                run(m.id);
              }}
            >
              <span className="flex flex-col">
                <span className="text-[13px] font-medium text-foreground">{m.label}</span>
                {m.description && <span className="text-[12px] text-muted-foreground">{m.description}</span>}
              </span>
            </MenuItem>
          ))}
        </MenuPanel>
      </Popover.Root>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared popover menu                                                */
/* ------------------------------------------------------------------ */

function MenuPanel({ open, children, className, align = "start" }: { open: boolean; children: React.ReactNode; className?: string; align?: "start" | "end" }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const list = Array.from(ref.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? []);
    const i = list.indexOf(document.activeElement as HTMLElement);
    const next = (i + (e.key === "ArrowDown" ? 1 : -1) + list.length) % list.length;
    list[next]?.focus();
  };
  return (
    <AnimatePresence>
      {open && (
        <Popover.Portal forceMount>
          <Popover.Content
            asChild
            forceMount
            side="bottom"
            align={align}
            sideOffset={6}
            onKeyDown={onKeyDown}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>("[role=menuitem],button,textarea")?.focus());
            }}
          >
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.12 } }}
              transition={{ duration: 0.18, ease: EASE }}
              style={{ transformOrigin: "var(--radix-popover-content-transform-origin)" }}
              className={cn("z-50 min-w-44 rounded-xl border border-border bg-popover p-1 font-sans text-popover-foreground shadow-md outline-none", className)}
            >
              {children}
            </motion.div>
          </Popover.Content>
        </Popover.Portal>
      )}
    </AnimatePresence>
  );
}

function MenuItem({ onSelect, children, destructive }: { onSelect: () => void; children: React.ReactNode; destructive?: boolean }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] outline-none transition-colors hover:bg-accent focus-visible:bg-accent",
        destructive ? "text-destructive" : "text-foreground"
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Feedback                                                           */
/* ------------------------------------------------------------------ */

export type FeedbackValue = "up" | "down" | null;

export interface ActionFeedbackProps {
  /** Controlled value. */
  value?: FeedbackValue;
  /** Uncontrolled initial value. */
  defaultValue?: FeedbackValue;
  /** Called on every change. `reason`/`comment` come from the thumbs-down popover. */
  onFeedback?: (value: FeedbackValue, reason?: string, comment?: string) => void;
  /** Reason chips for negative feedback. */
  reasons?: string[];
}

const DEFAULT_REASONS = ["Inaccurate", "Not helpful", "Too long", "Unsafe", "Other"];
const PARTICLES = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2 + Math.PI / 6);

function Particles() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {PARTICLES.map((a, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
          initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
          animate={{ x: Math.cos(a) * 14, y: Math.sin(a) * 14, opacity: 0, scale: 0.4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}

function ActionFeedback({ value: valueProp, defaultValue = null, onFeedback, reasons = DEFAULT_REASONS }: ActionFeedbackProps) {
  const reduce = useReducedMotion();
  const [internal, setInternal] = React.useState<FeedbackValue>(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;
  const [burst, setBurst] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [thanks, setThanks] = React.useState(false);
  const setPinned = React.useContext(PinContext);
  React.useEffect(() => setPinned(open), [open, setPinned]);

  const set = (v: FeedbackValue, r?: string, c?: string) => {
    if (valueProp === undefined) setInternal(v);
    onFeedback?.(v, r, c);
  };

  const clickUp = () => {
    const next = value === "up" ? null : "up";
    if (next === "up") setBurst((b) => b + 1);
    set(next);
  };

  const clickDown = () => {
    if (value === "down") {
      set(null);
      return;
    }
    set("down");
    setReason(null);
    setComment("");
    setSent(false);
    setOpen(true);
  };

  const submit = () => {
    setSent(true);
    set("down", reason ?? undefined, comment.trim() || undefined);
    window.setTimeout(() => {
      setOpen(false);
      setThanks(true);
      window.setTimeout(() => setThanks(false), 2000);
    }, 800);
  };

  const layout = !reduce;

  return (
    <>
      <AnimatePresence initial={false} mode="popLayout">
        {value !== "down" && (
          <motion.span
            key="up"
            layout={layout}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
            className="flex"
          >
            <ActionButton label={value === "up" ? "Remove rating" : "Good response"} aria-pressed={value === "up"} onClick={clickUp}>
              <motion.span
                key={burst}
                className="flex"
                initial={false}
                animate={value === "up" && burst && !reduce ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <ThumbsUp className="size-4" fill={value === "up" ? "currentColor" : "none"} />
              </motion.span>
              {value === "up" && burst > 0 && !reduce && <Particles key={`p${burst}`} />}
            </ActionButton>
          </motion.span>
        )}
        {value !== "up" && (
          <motion.span
            key="down"
            layout={layout}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
            className="flex"
          >
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Anchor asChild>
                <ActionButton label={value === "down" ? "Remove rating" : "Bad response"} aria-pressed={value === "down"} onClick={clickDown}>
                  <motion.span
                    className="flex"
                    animate={{ rotate: value === "down" && !reduce ? -10 : 0, y: value === "down" && !reduce ? 1 : 0 }}
                    transition={SPRING}
                  >
                    <ThumbsDown className="size-4" fill={value === "down" ? "currentColor" : "none"} />
                  </motion.span>
                </ActionButton>
              </Popover.Anchor>
              <MenuPanel open={open} className="w-72 p-3">
                <p className="text-[13px] font-medium text-foreground">What went wrong?</p>
                <p className="mb-2.5 text-[12px] text-muted-foreground">Your feedback helps improve future answers.</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label="Reasons">
                  {reasons.map((r) => {
                    const on = reason === r;
                    return (
                      <motion.button
                        key={r}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        aria-pressed={on}
                        onClick={() => setReason(on ? null : r)}
                        className={cn(
                          "h-7 rounded-full border px-2.5 text-[12px] font-medium transition-colors duration-150",
                          on ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground",
                          ring
                        )}
                      >
                        {r}
                      </motion.button>
                    );
                  })}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment (optional)"
                  rows={2}
                  className="mt-2.5 w-full resize-none rounded-lg border border-border bg-background px-2.5 py-2 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/40"
                />
                <div className="mt-2 flex justify-end gap-1.5">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setOpen(false)}
                    className={cn("h-8 rounded-lg px-3 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", ring)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={submit}
                    disabled={sent}
                    className={cn("flex h-8 min-w-[76px] items-center justify-center rounded-lg bg-foreground px-3 text-[12.5px] font-medium text-background shadow-sm transition-colors hover:bg-foreground/90", ring)}
                  >
                    <Swap k={sent ? "sent" : "submit"}>{sent ? <Check className="size-4" strokeWidth={2.5} /> : "Submit"}</Swap>
                  </motion.button>
                </div>
              </MenuPanel>
            </Popover.Root>
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {thanks && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="px-1.5 text-[12px] text-muted-foreground"
            role="status"
          >
            Thanks for the feedback
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Share / Speak / More                                               */
/* ------------------------------------------------------------------ */

export interface ActionShareProps {
  /** Custom share handler. Defaults to the Web Share API, falling back to copying the URL. */
  onShare?: () => void | Promise<void>;
  url?: string;
}

function ActionShare({ onShare, url }: ActionShareProps) {
  const [done, setDone] = React.useState(false);
  const share = async () => {
    try {
      if (onShare) await onShare();
      else {
        const href = url ?? window.location.href;
        if (navigator.share) await navigator.share({ url: href });
        else await navigator.clipboard.writeText(href);
      }
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } catch {
      /* dismissed */
    }
  };
  return (
    <ActionButton label={done ? "Link ready" : "Share"} onClick={share}>
      <Swap k={done ? "done" : "share"}>{done ? <Check className="size-4 text-foreground" strokeWidth={2.25} /> : <Share2 className="size-4" />}</Swap>
    </ActionButton>
  );
}

function Equalizer() {
  const reduce = useReducedMotion();
  return (
    <span className="flex h-4 w-4 items-center justify-center gap-[2px]" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] origin-center rounded-full bg-current"
          style={{ height: 12 }}
          animate={reduce ? { scaleY: 0.6 } : { scaleY: [0.35, 1, 0.5, 0.85, 0.35] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export interface ActionSpeakProps {
  /** Text read aloud with speechSynthesis. Markdown is stripped. */
  text: string;
  /** BCP-47 language, e.g. "en-US". */
  lang?: string;
}

function ActionSpeak({ text, lang }: ActionSpeakProps) {
  const [speaking, setSpeaking] = React.useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  React.useEffect(() => () => {
    if (supported && speaking) window.speechSynthesis.cancel();
  }, [supported, speaking]);

  const toggle = () => {
    if (!supported) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(stripMarkdown(text));
    if (lang) u.lang = lang;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  return (
    <ActionButton label={speaking ? "Stop reading" : "Read aloud"} aria-pressed={speaking} onClick={toggle} disabled={!supported}>
      <Swap k={speaking ? "eq" : "vol"}>{speaking ? <Equalizer /> : <Volume2 className="size-4" />}</Swap>
    </ActionButton>
  );
}

export interface MoreItem {
  label: string;
  icon?: React.ReactNode;
  onSelect: () => void;
  destructive?: boolean;
}

export interface ActionMoreProps {
  items: MoreItem[];
}

function ActionMore({ items }: ActionMoreProps) {
  const [open, setOpen] = React.useState(false);
  const setPinned = React.useContext(PinContext);
  React.useEffect(() => setPinned(open), [open, setPinned]);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <ActionButton label="More">
          <MoreHorizontal className="size-4" />
        </ActionButton>
      </Popover.Trigger>
      <MenuPanel open={open} align="end">
        <div role="menu">
          {items.map((item) => (
            <MenuItem
              key={item.label}
              destructive={item.destructive}
              onSelect={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.icon && <span className="flex text-muted-foreground [&_svg]:size-4">{item.icon}</span>}
              {item.label}
            </MenuItem>
          ))}
        </div>
      </MenuPanel>
    </Popover.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

type MessageActionsComponent = typeof MessageActionsRoot & {
  Copy: typeof ActionCopy;
  Regenerate: typeof ActionRegenerate;
  Feedback: typeof ActionFeedback;
  Share: typeof ActionShare;
  Speak: typeof ActionSpeak;
  More: typeof ActionMore;
  Button: typeof ActionButton;
};

export const MessageActions = MessageActionsRoot as MessageActionsComponent;
MessageActions.Copy = ActionCopy;
MessageActions.Regenerate = ActionRegenerate;
MessageActions.Feedback = ActionFeedback;
MessageActions.Share = ActionShare;
MessageActions.Speak = ActionSpeak;
MessageActions.More = ActionMore;
MessageActions.Button = ActionButton;

export { ActionCopy, ActionRegenerate, ActionFeedback, ActionShare, ActionSpeak, ActionMore };

export default MessageActions;

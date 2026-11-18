"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown, FileText, Paperclip, RotateCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE, SPRING, focusRing, formatBytes, useComposer, type ComposerAttachment } from "./context";

/* ------------------------------------------------------------------ */
/* Attachments                                                        */
/* ------------------------------------------------------------------ */

function ProgressRing({ progress }: { progress: number }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5 -rotate-90" aria-hidden>
      <circle cx="10" cy="10" r="8" fill="none" strokeWidth="2" className="stroke-foreground/15" />
      <motion.circle
        cx="10"
        cy="10"
        r="8"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-foreground"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: Math.max(0.02, progress) }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </svg>
  );
}

function AttachmentChip({ item }: { item: ComposerAttachment }) {
  const { removeAttachment, retryAttachment } = useComposer();
  const reduce = useReducedMotion();
  const isImage = item.type.startsWith("image/") && item.previewUrl;
  const uploading = item.status === "uploading";
  const failed = item.status === "error";

  return (
    <motion.li
      layout={!reduce}
      initial={{ opacity: 0, scale: reduce ? 1 : 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: reduce ? 1 : 0.8, transition: { duration: 0.15 } }}
      transition={SPRING}
      className={cn(
        "group/chip relative flex h-12 items-center gap-2.5 rounded-xl border bg-background pr-8 shadow-sm",
        isImage ? "pl-1" : "pl-2.5",
        failed ? "border-destructive/40" : "border-border"
      )}
    >
      {isImage ? (
        <span className="relative size-10 overflow-hidden rounded-lg border border-border bg-muted">
          <img src={item.previewUrl} alt="" className={cn("size-full object-cover transition", uploading && "opacity-60 blur-[1px]")} />
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/40">
              <ProgressRing progress={item.progress ?? 0} />
            </span>
          )}
        </span>
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {uploading ? <ProgressRing progress={item.progress ?? 0} /> : <FileText className="size-4" />}
        </span>
      )}
      <span className="flex min-w-0 max-w-[140px] flex-col">
        <span className="truncate text-[12.5px] font-medium leading-tight text-foreground">{item.name}</span>
        <span className={cn("truncate text-[11.5px] leading-tight tabular-nums", failed ? "text-destructive" : "text-muted-foreground")}>
          {failed ? item.error ?? "Upload failed" : uploading ? `${Math.round((item.progress ?? 0) * 100)}%` : formatBytes(item.size)}
        </span>
      </span>
      {failed && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => retryAttachment(item.id)}
          aria-label={`Retry uploading ${item.name}`}
          className={cn("flex size-7 items-center justify-center rounded-md text-destructive hover:bg-destructive/10", focusRing)}
        >
          <RotateCw className="size-3.5" />
        </motion.button>
      )}
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={() => removeAttachment(item.id)}
        aria-label={`Remove ${item.name}`}
        className={cn(
          "absolute right-1.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
          focusRing
        )}
      >
        <X className="size-3.5" />
      </motion.button>
    </motion.li>
  );
}

export type ComposerAttachmentsProps = React.HTMLAttributes<HTMLUListElement>;

export function ComposerAttachments({ className, ...props }: ComposerAttachmentsProps) {
  const { attachments } = useComposer();
  return (
    <AnimatePresence initial={false}>
      {attachments.length > 0 && (
        <motion.div
          initial={{ gridTemplateRows: "0fr", opacity: 0 }}
          animate={{ gridTemplateRows: "1fr", opacity: 1 }}
          exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.15 } }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="grid"
        >
          <div className="min-h-0 overflow-hidden">
            <ul role="list" aria-label="Attachments" className={cn("flex flex-wrap gap-2 px-3 pt-3", className)} {...props}>
              <AnimatePresence initial={false} mode="popLayout">
                {attachments.map((a) => (
                  <AttachmentChip key={a.id} item={a} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Attach button                                                      */
/* ------------------------------------------------------------------ */

export interface ComposerAttachButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** Accepted file types, e.g. "image/*,.pdf". */
  accept?: string;
  /** Allow multiple files. Defaults to true. */
  multiple?: boolean;
}

export function ComposerAttachButton({ accept, multiple = true, className, ...props }: ComposerAttachButtonProps) {
  const { addFiles, disabled } = useComposer();
  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        aria-label="Attach files"
        title="Attach files"
        className={cn(
          "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
          focusRing,
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        <Paperclip className="size-4" />
      </motion.button>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Model chip                                                         */
/* ------------------------------------------------------------------ */

export interface ComposerModel {
  id: string;
  label: string;
  /** Short line under the label. */
  description?: string;
  icon?: React.ReactNode;
}

export interface ComposerModelChipProps {
  /** Selectable models. */
  models: ComposerModel[];
  /** Controlled selected id. */
  value?: string;
  /** Uncontrolled initial id. Defaults to the first model. */
  defaultValue?: string;
  /** Called with the new id. */
  onChange?: (id: string) => void;
  className?: string;
}

export function ComposerModelChip({ models, value, defaultValue, onChange, className }: ComposerModelChipProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? models[0]?.id);
  const selectedId = value ?? internal;
  const selected = models.find((m) => m.id === selectedId);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    const i = Math.max(0, models.findIndex((m) => m.id === selectedId));
    setActive(i);
    requestAnimationFrame(() => itemRefs.current[i]?.focus());
  }, [open, models, selectedId]);

  const choose = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const n = models.length;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = (active + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
      setActive(next);
      itemRefs.current[next]?.focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const next = e.key === "Home" ? 0 : n - 1;
      setActive(next);
      itemRefs.current[next]?.focus();
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          aria-label={`Model: ${selected?.label ?? "none"}`}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background pl-2.5 pr-2 text-[12.5px] font-medium text-foreground shadow-sm transition-colors hover:bg-accent data-[state=open]:bg-accent",
            focusRing,
            className
          )}
        >
          {selected?.icon && <span className="flex size-3.5 items-center justify-center text-muted-foreground [&_svg]:size-3.5">{selected.icon}</span>}
          <span className="max-w-[120px] truncate">{selected?.label ?? "Model"}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SPRING} className="flex text-muted-foreground">
            <ChevronDown className="size-3.5" />
          </motion.span>
        </motion.button>
      </Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal forceMount>
            <Popover.Content asChild forceMount side="top" align="start" sideOffset={8} onKeyDown={onKeyDown}>
              <motion.div
                role="listbox"
                aria-label="Choose a model"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.96, y: reduce ? 0 : 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.12 } }}
                transition={{ duration: 0.2, ease: EASE }}
                style={{ transformOrigin: "var(--radix-popover-content-transform-origin)" }}
                className="z-50 w-60 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none"
              >
                {models.map((m, i) => {
                  const isSel = m.id === selectedId;
                  return (
                    <button
                      key={m.id}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      type="button"
                      role="option"
                      aria-selected={isSel}
                      tabIndex={i === active ? 0 : -1}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(m.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-colors",
                        i === active ? "bg-accent" : "bg-transparent"
                      )}
                    >
                      {m.icon && <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4">{m.icon}</span>}
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-[13px] font-medium text-foreground">{m.label}</span>
                        {m.description && <span className="truncate text-[12px] text-muted-foreground">{m.description}</span>}
                      </span>
                      <AnimatePresence>
                        {isSel && (
                          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={SPRING}>
                            <Check className="size-4 text-foreground" strokeWidth={2.25} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Suggestions                                                        */
/* ------------------------------------------------------------------ */

export interface ComposerSuggestion {
  /** Pill text. */
  label: string;
  /** Text typed into the input. Defaults to `label`. */
  value?: string;
  icon?: React.ReactNode;
}

export interface ComposerSuggestionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Suggestion pills. Strings or objects. */
  items: (string | ComposerSuggestion)[];
  /** Called after the typewriter finishes. */
  onSelect?: (value: string) => void;
  /** Typewriter speed, ms per character. Defaults to 8. */
  typeSpeed?: number;
}

export function ComposerSuggestions({ items, onSelect, typeSpeed = 8, className, ...props }: ComposerSuggestionsProps) {
  const { value, setValue, textareaRef, disabled } = useComposer();
  const reduce = useReducedMotion();
  const typing = React.useRef<number | null>(null);
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => () => {
    if (typing.current) window.clearInterval(typing.current);
  }, []);

  const pick = (text: string) => {
    if (typing.current) window.clearInterval(typing.current);
    if (reduce || typeSpeed <= 0) {
      setValue(text);
      textareaRef.current?.focus();
      onSelect?.(text);
      return;
    }
    let i = 0;
    setIsTyping(true);
    typing.current = window.setInterval(() => {
      i += 2;
      setValue(text.slice(0, i));
      if (i >= text.length) {
        if (typing.current) window.clearInterval(typing.current);
        typing.current = null;
        setIsTyping(false);
        const ta = textareaRef.current;
        ta?.focus();
        ta?.setSelectionRange(text.length, text.length);
        onSelect?.(text);
      }
    }, typeSpeed * 2);
  };

  const visible = !value.trim() || isTyping;

  return (
    <AnimatePresence>
      {visible && !isTyping && (
        <motion.div
          key="suggestions"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className={cn("flex flex-wrap justify-center gap-2 pt-3", className)}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {items.map((raw) => {
            const item = typeof raw === "string" ? { label: raw } : raw;
            return (
              <motion.button
                key={item.label}
                type="button"
                disabled={disabled}
                variants={{ hidden: { opacity: 0, y: reduce ? 0 : 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: EASE } } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => pick(item.value ?? item.label)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-[13px] text-muted-foreground shadow-sm transition-colors duration-150 hover:bg-accent hover:text-foreground",
                  focusRing
                )}
              >
                {item.icon && <span className="flex [&_svg]:size-3.5">{item.icon}</span>}
                {item.label}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

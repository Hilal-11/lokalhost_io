"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { AlertCircle, ArrowUp, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ComposerContext,
  EASE,
  SOFT,
  focusRing,
  useComposer,
  type ComposerAttachment,
  type ComposerStatus,
} from "./context";
import {
  ComposerAttachButton,
  ComposerAttachments,
  ComposerModelChip,
  ComposerSuggestions,
} from "./parts";

export * from "./context";
export * from "./parts";

/* ------------------------------------------------------------------ */
/* Root                                                               */
/* ------------------------------------------------------------------ */

export interface ComposerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit" | "defaultValue"> {
  /** Controlled text value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called on every text change. */
  onValueChange?: (value: string) => void;
  /** Called with the trimmed text and current attachments. The input clears and keeps focus. */
  onSubmit?: (value: string, attachments: ComposerAttachment[]) => void;
  /** Called when the user presses Stop or Esc while streaming. */
  onStop?: () => void;
  /** Request lifecycle. "streaming" turns Send into Stop. Defaults to "idle". */
  status?: ComposerStatus;
  /** Inline error shown under the bar when status is "error". */
  errorMessage?: React.ReactNode;
  /** Character limit. Submits are blocked above it. */
  maxLength?: number;
  /** Previously sent messages, newest last. ArrowUp in an empty input recalls them. */
  history?: string[];
  /** Controlled attachments. */
  attachments?: ComposerAttachment[];
  /** Called when attachments change. */
  onAttachmentsChange?: (attachments: ComposerAttachment[]) => void;
  /**
   * Upload handler. Call `onProgress(0..1)` as bytes go up; throw to mark the chip as failed.
   * Without it, files attach instantly.
   */
  onUpload?: (file: File, onProgress: (progress: number) => void) => Promise<void>;
  /** Disable the whole composer. */
  disabled?: boolean;
}

let uid = 0;
const nextId = () => `att-${Date.now().toString(36)}-${(uid++).toString(36)}`;

const ComposerRoot = React.forwardRef<HTMLDivElement, ComposerProps>(
  (
    {
      value: valueProp,
      defaultValue = "",
      onValueChange,
      onSubmit,
      onStop,
      status = "idle",
      errorMessage,
      maxLength,
      history,
      attachments: attachmentsProp,
      onAttachmentsChange,
      onUpload,
      disabled = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const reduce = useReducedMotion();
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = valueProp ?? internalValue;
    const setValue = React.useCallback(
      (v: string) => {
        if (valueProp === undefined) setInternalValue(v);
        onValueChange?.(v);
      },
      [valueProp, onValueChange]
    );

    const [internalAtt, setInternalAtt] = React.useState<ComposerAttachment[]>([]);
    const attachments = attachmentsProp ?? internalAtt;
    const attRef = React.useRef(attachments);
    attRef.current = attachments;
    const setAttachments = React.useCallback(
      (updater: (prev: ComposerAttachment[]) => ComposerAttachment[]) => {
        const next = updater(attRef.current);
        attRef.current = next;
        if (attachmentsProp === undefined) setInternalAtt(next);
        onAttachmentsChange?.(next);
      },
      [attachmentsProp, onAttachmentsChange]
    );

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [blockedCount, setBlocked] = React.useState(0);
    const [sentCount, setSent] = React.useState(0);
    const historyIndex = React.useRef<number | null>(null);

    const isOver = maxLength !== undefined && value.length > maxLength;
    const uploading = attachments.some((a) => a.status === "uploading");
    const canSubmit =
      !disabled && status !== "submitting" && status !== "streaming" && !isOver && !uploading && value.trim().length > 0;

    /* uploads */
    const upload = React.useCallback(
      async (item: ComposerAttachment) => {
        if (!onUpload || !item.file) {
          setAttachments((list) => list.map((a) => (a.id === item.id ? { ...a, status: "done", progress: 1 } : a)));
          return;
        }
        try {
          await onUpload(item.file, (p) =>
            setAttachments((list) => list.map((a) => (a.id === item.id ? { ...a, progress: p } : a)))
          );
          setAttachments((list) => list.map((a) => (a.id === item.id ? { ...a, status: "done", progress: 1 } : a)));
        } catch (err) {
          setAttachments((list) =>
            list.map((a) =>
              a.id === item.id
                ? { ...a, status: "error", error: err instanceof Error ? err.message : "Upload failed" }
                : a
            )
          );
        }
      },
      [onUpload, setAttachments]
    );

    const addFiles = React.useCallback(
      (files: FileList | File[]) => {
        const items: ComposerAttachment[] = Array.from(files).map((file) => ({
          id: nextId(),
          file,
          name: file.name || "pasted-image.png",
          size: file.size,
          type: file.type,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
          progress: 0,
          status: onUpload ? "uploading" : "done",
        }));
        if (!items.length) return;
        setAttachments((list) => [...list, ...items]);
        items.forEach((item) => void upload(item));
      },
      [onUpload, setAttachments, upload]
    );

    const removeAttachment = React.useCallback(
      (id: string) => {
        setAttachments((list) => {
          const gone = list.find((a) => a.id === id);
          if (gone?.previewUrl) URL.revokeObjectURL(gone.previewUrl);
          return list.filter((a) => a.id !== id);
        });
        textareaRef.current?.focus();
      },
      [setAttachments]
    );

    const retryAttachment = React.useCallback(
      (id: string) => {
        const item = attRef.current.find((a) => a.id === id);
        if (!item) return;
        const reset = { ...item, status: "uploading" as const, progress: 0, error: undefined };
        setAttachments((list) => list.map((a) => (a.id === id ? reset : a)));
        void upload(reset);
      },
      [setAttachments, upload]
    );

    // revoke object URLs on unmount
    React.useEffect(
      () => () => attRef.current.forEach((a) => a.previewUrl && URL.revokeObjectURL(a.previewUrl)),
      []
    );

    const submit = React.useCallback(() => {
      if (!canSubmit) {
        if (isOver || value.trim()) setBlocked((n) => n + 1);
        return;
      }
      const text = value.trim();
      setSent((n) => n + 1);
      historyIndex.current = null;
      onSubmit?.(text, attRef.current);
      setValue("");
      setAttachments(() => []);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }, [canSubmit, isOver, value, onSubmit, setValue, setAttachments]);

    const stop = React.useCallback(() => {
      if (status === "streaming" || status === "submitting") onStop?.();
    }, [status, onStop]);

    const recallHistory = React.useCallback(() => {
      if (!history?.length || value) return false;
      const idx = historyIndex.current === null ? history.length - 1 : Math.max(0, historyIndex.current - 1);
      historyIndex.current = idx;
      setValue(history[idx]);
      return true;
    }, [history, value, setValue]);

    /* drag & drop */
    const [dragging, setDragging] = React.useState(false);
    const dragDepth = React.useRef(0);
    const hasFiles = (e: React.DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

    /* suggestions render below the box, everything else inside it */
    const all = React.Children.toArray(children);
    const isSuggestions = (c: React.ReactNode) => React.isValidElement(c) && c.type === ComposerSuggestions;
    const inside = all.filter((c) => !isSuggestions(c));
    const below = all.filter(isSuggestions);

    /* error pulse */
    const [scope, animate] = useAnimate();
    React.useEffect(() => {
      if (status === "error" && scope.current && !reduce) {
        void animate(scope.current, { opacity: [0, 1, 0.55] }, { duration: 0.7, ease: "easeOut" });
      }
    }, [status, animate, scope, reduce]);

    return (
      <ComposerContext.Provider
        value={{
          value,
          setValue,
          status,
          maxLength,
          disabled,
          canSubmit,
          isOver,
          submit,
          stop,
          textareaRef,
          attachments,
          addFiles,
          removeAttachment,
          retryAttachment,
          blockedCount,
          sentCount,
          recallHistory,
        }}
      >
        <div ref={ref} className={cn("w-full font-sans", className)} {...props}>
          <div
            data-status={status}
            onDragEnter={(e) => {
              if (!hasFiles(e) || disabled) return;
              e.preventDefault();
              dragDepth.current += 1;
              setDragging(true);
            }}
            onDragOver={(e) => hasFiles(e) && e.preventDefault()}
            onDragLeave={() => {
              dragDepth.current = Math.max(0, dragDepth.current - 1);
              if (dragDepth.current === 0) setDragging(false);
            }}
            onDrop={(e) => {
              if (!hasFiles(e)) return;
              e.preventDefault();
              dragDepth.current = 0;
              setDragging(false);
              if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
            }}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-background shadow-sm transition-[border-color,box-shadow] duration-150",
              "focus-within:border-foreground/40 focus-within:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_8%,transparent),0_4px_16px_-8px_rgb(0_0_0/0.12)]",
              status === "error" ? "border-destructive/50 focus-within:border-destructive/60" : "border-border",
              disabled && "opacity-60"
            )}
          >
            {/* one-shot destructive pulse */}
            <span ref={scope} aria-hidden className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 ring-2 ring-destructive/40" />
            {inside}

            <AnimatePresence>
              {dragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute inset-1 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-foreground/30 bg-background/90 backdrop-blur-sm"
                >
                  <motion.span
                    initial={{ y: reduce ? 0 : 4 }}
                    animate={{ y: 0 }}
                    className="flex items-center gap-2 text-[13px] font-medium text-foreground"
                  >
                    <Upload className="size-4" />
                    Drop files to attach
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only" aria-live="polite">
              {dragging ? "Drop files to attach them" : ""}
            </span>
          </div>

          <AnimatePresence initial={false}>
            {status === "error" && errorMessage && (
              <motion.div
                initial={{ gridTemplateRows: "0fr", opacity: 0 }}
                animate={{ gridTemplateRows: "1fr", opacity: 1 }}
                exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.15 } }}
                transition={reduce ? { duration: 0 } : SOFT}
                className="grid"
              >
                <div className="min-h-0 overflow-hidden">
                  <p role="alert" className="flex items-center gap-1.5 px-2 pt-2 text-[13px] text-destructive">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {errorMessage}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {below}
        </div>
      </ComposerContext.Provider>
    );
  }
);
ComposerRoot.displayName = "Composer";

/* ------------------------------------------------------------------ */
/* Input                                                              */
/* ------------------------------------------------------------------ */

export interface ComposerInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
  /** Max visible lines before the textarea scrolls. Defaults to 8. */
  maxRows?: number;
}

const LINE = 24; // leading-6
const PAD_Y = 12; // py-3

const ComposerInput = React.forwardRef<HTMLTextAreaElement, ComposerInputProps>(
  ({ maxRows = 8, placeholder = "Ask anything…", className, onKeyDown, onPaste, ...props }, ref) => {
    const { value, setValue, submit, stop, status, textareaRef, addFiles, disabled, recallHistory } = useComposer();
    const reduce = useReducedMotion();
    const ghostRef = React.useRef<HTMLDivElement>(null);
    const [height, setHeight] = React.useState(LINE + PAD_Y * 2);
    const max = LINE * maxRows + PAD_Y * 2;

    React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    React.useLayoutEffect(() => {
      const ghost = ghostRef.current;
      if (!ghost) return;
      const measure = () => setHeight(Math.min(max, Math.max(LINE + PAD_Y * 2, ghost.offsetHeight)));
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(ghost);
      return () => ro.disconnect();
    }, [value, max]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      // never submit while an IME is composing (Hindi, Japanese, Chinese …)
      if (e.nativeEvent.isComposing || e.keyCode === 229) return;
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
        e.preventDefault();
        submit();
      } else if (e.key === "Escape" && (status === "streaming" || status === "submitting")) {
        e.preventDefault();
        stop();
      } else if (e.key === "ArrowUp" && !value && recallHistory()) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      onPaste?.(e);
      const files = Array.from(e.clipboardData.files);
      if (files.length) {
        e.preventDefault();
        addFiles(files);
      }
    };

    const shared = "w-full px-4 py-3 text-[14px] leading-6 [overflow-wrap:anywhere]";

    return (
      <div className="relative">
        <div ref={ghostRef} aria-hidden className={cn(shared, "invisible absolute inset-x-0 top-0 whitespace-pre-wrap")}>
          {value + "​"}
        </div>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          aria-label={props["aria-label"] ?? "Message"}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          style={{ height }}
          className={cn(
            shared,
            "block resize-none bg-transparent text-foreground outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed",
            !reduce && "transition-[height] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
            height >= max ? "overflow-y-auto" : "overflow-y-hidden",
            "[scrollbar-width:thin]",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
ComposerInput.displayName = "Composer.Input";

/* ------------------------------------------------------------------ */
/* Toolbar, Counter, Submit                                           */
/* ------------------------------------------------------------------ */

export type ComposerToolbarProps = React.HTMLAttributes<HTMLDivElement>;

const ComposerToolbar = React.forwardRef<HTMLDivElement, ComposerToolbarProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-1.5 px-2 pb-2", className)} {...props} />
));
ComposerToolbar.displayName = "Composer.Toolbar";

/** Pushes the next items to the right edge of the toolbar. */
export const ComposerSpacer = () => <div className="flex-1" />;

export interface ComposerCounterProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Fraction of maxLength after which the counter appears. Defaults to 0.8. */
  showAt?: number;
}

function ComposerCounter({ showAt = 0.8, className }: ComposerCounterProps) {
  const { value, maxLength, isOver, blockedCount } = useComposer();
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate();
  React.useEffect(() => {
    if (blockedCount && scope.current && !reduce) {
      void animate(scope.current, { x: [0, -3, 3, -2, 2, 0] }, { duration: 0.35 });
    }
  }, [blockedCount, animate, scope, reduce]);
  if (maxLength === undefined) return null;
  const visible = value.length >= maxLength * showAt;
  return (
    <span ref={scope} className="inline-flex">
      <AnimatePresence initial={false}>
        {visible && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: EASE }}
            aria-live="polite"
            className={cn(
              "px-1.5 text-[12px] tabular-nums transition-colors",
              isOver ? "font-medium text-destructive" : "text-muted-foreground",
              className
            )}
          >
            {value.length.toLocaleString()} / {maxLength.toLocaleString()}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export type ComposerSubmitProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

function ComposerSubmit({ className, ...props }: ComposerSubmitProps) {
  const { canSubmit, status, submit, stop, sentCount } = useComposer();
  const reduce = useReducedMotion();
  const streaming = status === "streaming" || status === "submitting";
  const active = canSubmit || streaming;
  const [arrowScope, animateArrow] = useAnimate();

  React.useEffect(() => {
    if (sentCount && arrowScope.current && !reduce) {
      void animateArrow(arrowScope.current, { y: [0, -6, 0] }, { duration: 0.28, ease: EASE });
    }
  }, [sentCount, animateArrow, arrowScope, reduce]);

  return (
    <motion.button
      type="button"
      onClick={streaming ? stop : submit}
      aria-label={streaming ? "Stop generating" : "Send message"}
      aria-disabled={!active || undefined}
      animate={{ scale: active ? 1 : 0.9 }}
      whileTap={active ? { scale: 0.97 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg transition-colors duration-150",
        active
          ? "bg-foreground text-background shadow-sm hover:bg-foreground/90"
          : "cursor-not-allowed bg-muted text-muted-foreground",
        focusRing,
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {streaming ? (
          <motion.span
            key="stop"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="block size-2.5 rounded-[3px] bg-current"
          />
        ) : (
          <motion.span
            key="send"
            initial={{ y: reduce ? 0 : 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: reduce ? 0 : -10, rotate: reduce ? 0 : -45, opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex"
          >
            <span ref={arrowScope} className="flex">
              <ArrowUp className="size-4" strokeWidth={2.25} />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

type ComposerComponent = typeof ComposerRoot & {
  Attachments: typeof ComposerAttachments;
  Input: typeof ComposerInput;
  Toolbar: typeof ComposerToolbar;
  Spacer: typeof ComposerSpacer;
  AttachButton: typeof ComposerAttachButton;
  ModelChip: typeof ComposerModelChip;
  Counter: typeof ComposerCounter;
  Submit: typeof ComposerSubmit;
  Suggestions: typeof ComposerSuggestions;
};

export const Composer = ComposerRoot as ComposerComponent;
Composer.Attachments = ComposerAttachments;
Composer.Input = ComposerInput;
Composer.Toolbar = ComposerToolbar;
Composer.Spacer = ComposerSpacer;
Composer.AttachButton = ComposerAttachButton;
Composer.ModelChip = ComposerModelChip;
Composer.Counter = ComposerCounter;
Composer.Submit = ComposerSubmit;
Composer.Suggestions = ComposerSuggestions;

export { ComposerInput, ComposerToolbar, ComposerCounter, ComposerSubmit };

export interface PromptComposerProps extends Omit<ComposerProps, "children"> {
  placeholder?: string;
  /** Show the attach button. Defaults to true. */
  allowAttachments?: boolean;
  /** Model chip options. Hidden when omitted. */
  models?: React.ComponentProps<typeof ComposerModelChip>["models"];
  model?: string;
  onModelChange?: (id: string) => void;
}

/** Simple default: everything wired up. */
export default function PromptComposer({
  placeholder,
  allowAttachments = true,
  models,
  model,
  onModelChange,
  ...props
}: PromptComposerProps) {
  return (
    <Composer {...props}>
      <Composer.Attachments />
      <Composer.Input placeholder={placeholder} />
      <Composer.Toolbar>
        {allowAttachments && <Composer.AttachButton />}
        {models && <Composer.ModelChip models={models} value={model} onChange={onModelChange} />}
        <Composer.Spacer />
        <Composer.Counter />
        <Composer.Submit />
      </Composer.Toolbar>
    </Composer>
  );
}

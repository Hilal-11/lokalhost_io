"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AlertCircle, ArrowDown, RotateCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Markdown, type MarkdownProps, type StreamAnimation } from "./markdown";

export { Markdown, repairMarkdown, splitBlocks, CopyIconButton } from "./markdown";
export type { MarkdownProps, StreamAnimation } from "./markdown";

const EASE = [0.22, 1, 0.36, 1] as const;
const SOFT = { type: "spring", stiffness: 260, damping: 26 } as const;

/* ------------------------------------------------------------------ */
/* useStreamingText                                                   */
/* ------------------------------------------------------------------ */

export type StreamStatus = "idle" | "pending" | "streaming" | "done" | "error";

export interface UseStreamingTextResult {
  /** Accumulated text so far. */
  text: string;
  /** pending → streaming → done (or error). "idle" when no stream is given. */
  status: StreamStatus;
  /** The error thrown by the stream, if any. */
  error: unknown;
  /** Stop reading. Keeps the text received so far and sets status to "done". */
  stop: () => void;
}

/**
 * Consumes an AsyncIterable<string> (fetch reader, AI SDK text stream, mockStream…)
 * and exposes the accumulated text. Pass a new iterable to restart.
 */
export function useStreamingText(stream: AsyncIterable<string> | null | undefined): UseStreamingTextResult {
  const [text, setText] = React.useState("");
  const [status, setStatus] = React.useState<StreamStatus>(stream ? "pending" : "idle");
  const [error, setError] = React.useState<unknown>(null);
  const iterRef = React.useRef<AsyncIterator<string> | null>(null);
  const stopped = React.useRef(false);

  React.useEffect(() => {
    if (!stream) {
      setStatus("idle");
      return;
    }
    let cancelled = false;
    stopped.current = false;
    setText("");
    setError(null);
    setStatus("pending");
    const it = stream[Symbol.asyncIterator]();
    iterRef.current = it;

    (async () => {
      try {
        for (;;) {
          const { value, done } = await it.next();
          if (cancelled || stopped.current) return;
          if (done) break;
          setStatus("streaming");
          setText((t) => t + value);
        }
        if (!cancelled) setStatus("done");
      } catch (err) {
        if (cancelled || stopped.current) return;
        setError(err);
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      void it.return?.();
    };
  }, [stream]);

  const stop = React.useCallback(() => {
    stopped.current = true;
    void iterRef.current?.return?.();
    setStatus((s) => (s === "streaming" || s === "pending" ? "done" : s));
  }, []);

  return { text, status, error, stop };
}

/* ------------------------------------------------------------------ */
/* Message                                                            */
/* ------------------------------------------------------------------ */

export type MessageRole = "assistant" | "user";
export type MessageStatus = "pending" | "streaming" | "done" | "error";

interface MessageContextValue {
  role: MessageRole;
  status: MessageStatus;
}
const MessageContext = React.createContext<MessageContextValue>({ role: "assistant", status: "done" });
export const useMessage = () => React.useContext(MessageContext);

export interface MessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  /** Who wrote it. User messages render as a right-aligned bubble. Defaults to "assistant". */
  role?: MessageRole;
  /** Lifecycle. "pending" shows the typing dots. Defaults to "done". */
  status?: MessageStatus;
  /** Avatar node for assistant messages. Pass `null` to hide. */
  avatar?: React.ReactNode;
  /** Display name, shown above assistant content. */
  name?: string;
  /** Timestamp shown in the footer when done. */
  timestamp?: React.ReactNode;
}

const DefaultAvatar = () => (
  <span className="flex size-7 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
    <Sparkles className="size-3.5" strokeWidth={1.75} />
  </span>
);

const MessageRoot = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ role = "assistant", status = "done", avatar, name, timestamp, className, children, ...props }, ref) => {
    const reduce = useReducedMotion();
    const isUser = role === "user";
    return (
      <MessageContext.Provider value={{ role, status }}>
        <motion.div
          ref={ref}
          data-role={role}
          data-status={status}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className={cn(
            "group/message flex w-full gap-3 font-sans",
            isUser ? "justify-end" : "justify-start",
            className
          )}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {!isUser && avatar !== null && <div className="shrink-0 pt-0.5">{avatar ?? <DefaultAvatar />}</div>}
          <div className={cn("flex min-w-0 flex-col", isUser ? "max-w-[80%] items-end" : "flex-1")}>
            {!isUser && name && <span className="mb-1 text-[13px] font-medium text-foreground">{name}</span>}
            {children}
            {timestamp !== undefined && <MessageFooter>{timestamp}</MessageFooter>}
          </div>
        </motion.div>
      </MessageContext.Provider>
    );
  }
);
MessageRoot.displayName = "Message";

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */

function TypingDots() {
  const reduce = useReducedMotion();
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-border bg-muted/60 px-3" role="status" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-muted-foreground"
          animate={reduce ? { opacity: [0.4, 1, 0.4] } : { y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export interface MessageContentProps extends Omit<MarkdownProps, "streaming"> {
  /** Render as markdown. Set false for plain text (user messages default to plain). */
  markdown?: boolean;
}

const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ content, animation = "fade", markdown, className, ...props }, ref) => {
    const { role, status } = useMessage();
    const isUser = role === "user";
    const asMarkdown = markdown ?? !isUser;
    const streaming = status === "streaming";

    if (isUser) {
      return (
        <div
          ref={ref}
          className={cn(
            "whitespace-pre-wrap rounded-2xl rounded-br-md border border-border/60 bg-muted px-4 py-2.5 text-[14px] leading-6 text-foreground",
            className
          )}
        >
          {asMarkdown ? <Markdown content={content} animation="none" caret={false} {...props} /> : content}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("relative min-h-7", className)} aria-busy={streaming || status === "pending"}>
        <AnimatePresence mode="popLayout" initial={false}>
          {status === "pending" && !content ? (
            <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
              <TypingDots />
            </motion.div>
          ) : (
            <motion.div key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              {asMarkdown ? (
                <Markdown content={content} streaming={streaming} animation={animation} {...props} />
              ) : (
                <p className="whitespace-pre-wrap text-[14px] leading-7">{content}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* announce once, when complete — avoids screen-reader spam mid-stream */}
        <span className="sr-only" aria-live="polite">
          {status === "done" ? content : ""}
        </span>
      </div>
    );
  }
);
MessageContent.displayName = "Message.Content";

/* ------------------------------------------------------------------ */
/* Footer & Error                                                     */
/* ------------------------------------------------------------------ */

export type MessageFooterProps = React.HTMLAttributes<HTMLDivElement>;

/** Timestamp + actions slot. Fades in once the message is done. */
const MessageFooter = React.forwardRef<HTMLDivElement, MessageFooterProps>(({ className, children, ...props }, ref) => {
  const { status, role } = useMessage();
  return (
    <AnimatePresence>
      {(status === "done" || status === "error") && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          transition={{ duration: 0.2 }}
          className={cn(
            "mt-1.5 flex items-center gap-2 text-[12px] text-muted-foreground",
            role === "user" && "justify-end",
            className
          )}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
MessageFooter.displayName = "Message.Footer";

export interface MessageErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Retry handler. Return a promise to keep the icon spinning until it settles. */
  onRetry?: () => void | Promise<unknown>;
  /** Error text. Defaults to "Something went wrong while generating this response." */
  message?: React.ReactNode;
}

const MessageError = React.forwardRef<HTMLDivElement, MessageErrorProps>(
  ({ onRetry, message = "Something went wrong while generating this response.", className, ...props }, ref) => {
    const { status } = useMessage();
    const reduce = useReducedMotion();
    const [retrying, setRetrying] = React.useState(false);

    React.useEffect(() => {
      if (status !== "error") setRetrying(false);
    }, [status]);

    const retry = async () => {
      setRetrying(true);
      try {
        await onRetry?.();
      } finally {
        window.setTimeout(() => setRetrying(false), 400);
      }
    };

    return (
      <AnimatePresence initial={false}>
        {status === "error" && (
          <motion.div
            ref={ref}
            initial={{ gridTemplateRows: "0fr", opacity: 0 }}
            animate={{ gridTemplateRows: "1fr", opacity: 1 }}
            exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.15 } }}
            transition={reduce ? { duration: 0 } : SOFT}
            className="grid"
            {...(props as React.ComponentProps<typeof motion.div>)}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                role="alert"
                className={cn(
                  "mt-3 flex items-center gap-3 rounded-xl border border-destructive/25 bg-destructive/[0.06] px-3 py-2 text-[13px] text-destructive",
                  className
                )}
              >
                <AlertCircle className="size-4 shrink-0" />
                <span className="flex-1">{message}</span>
                {onRetry && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={retry}
                    disabled={retrying}
                    className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-destructive/30 bg-background px-2.5 text-[12.5px] font-medium text-destructive shadow-sm transition-colors hover:bg-destructive/10 disabled:opacity-70 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <motion.span
                      animate={retrying && !reduce ? { rotate: 360 } : { rotate: 0 }}
                      transition={retrying ? { duration: 0.8, repeat: Infinity, ease: "linear" } : { duration: 0 }}
                      className="flex"
                    >
                      <RotateCw className="size-3.5" />
                    </motion.span>
                    Retry
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);
MessageError.displayName = "Message.Error";

/* ------------------------------------------------------------------ */
/* MessageList — sticks to bottom while streaming                     */
/* ------------------------------------------------------------------ */

export interface MessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Distance from the bottom (px) that still counts as "at bottom". Defaults to 48. */
  threshold?: number;
  /** Class for the inner content wrapper. */
  contentClassName?: string;
}

export const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(
  ({ threshold = 48, className, contentClassName, children, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const stuck = React.useRef(true);
    const [showPill, setShowPill] = React.useState(false);
    React.useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement);

    const scrollToBottom = React.useCallback((smooth = false) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    }, []);

    React.useEffect(() => {
      const content = contentRef.current;
      if (!content) return;
      const ro = new ResizeObserver(() => {
        if (stuck.current) scrollToBottom();
        else setShowPill(true);
      });
      ro.observe(content);
      return () => ro.disconnect();
    }, [scrollToBottom]);

    const onScroll = () => {
      const el = scrollRef.current;
      if (!el) return;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
      stuck.current = atBottom;
      if (atBottom) setShowPill(false);
    };

    return (
      <div className={cn("relative min-h-0", className)}>
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="h-full overflow-y-auto overscroll-contain [scrollbar-gutter:stable] [scrollbar-width:thin]"
          role="log"
          aria-live="off"
          {...props}
        >
          <div ref={contentRef} className={cn("flex flex-col gap-6 p-4", contentClassName)}>
            {children}
          </div>
        </div>
        <AnimatePresence>
          {showPill && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                stuck.current = true;
                setShowPill(false);
                scrollToBottom(true);
              }}
              className="absolute bottom-3 left-1/2 inline-flex h-8 -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-background/95 px-3 text-[12.5px] font-medium text-foreground shadow-md backdrop-blur outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowDown className="size-3.5" />
              New messages
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
MessageList.displayName = "MessageList";

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

type MessageComponent = typeof MessageRoot & {
  Content: typeof MessageContent;
  Footer: typeof MessageFooter;
  Error: typeof MessageError;
};

export const Message = MessageRoot as MessageComponent;
Message.Content = MessageContent;
Message.Footer = MessageFooter;
Message.Error = MessageError;

export { MessageContent, MessageFooter, MessageError };

export interface StreamingMessageProps extends Omit<MessageProps, "children"> {
  /** Markdown content (partial while streaming). */
  content: string;
  /** Word animation. Defaults to "fade". */
  animation?: StreamAnimation;
  /** Retry handler shown when status is "error". */
  onRetry?: () => void | Promise<unknown>;
}

/** Simple default: an assistant message with content + error banner. */
export default function StreamingMessage({ content, animation, onRetry, ...props }: StreamingMessageProps) {
  return (
    <Message {...props}>
      <Message.Content content={content} animation={animation} />
      <Message.Error onRetry={onRetry} />
    </Message>
  );
}

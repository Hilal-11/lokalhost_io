"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mic, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MicPermission, VoiceState } from "./voice-orb";

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const BAR_CSS = `
@keyframes lk-vb-word { from { opacity: 0; filter: blur(3px); } to { opacity: 1; filter: blur(0); } }
.lk-vb-word { animation: lk-vb-word 260ms cubic-bezier(0.22,1,0.36,1) both; }
@media (prefers-reduced-motion: reduce) { .lk-vb-word { animation: none; } }
`;

function MicIcon({ muted }: { muted: boolean }) {
  return (
    <span className="relative flex size-5 items-center justify-center">
      <Mic className="size-5" strokeWidth={1.75} />
      <svg viewBox="0 0 24 24" className="absolute inset-0 size-5" aria-hidden>
        <motion.path
          d="M3 3 21 21"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: muted ? 1 : 0, opacity: muted ? 1 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </span>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export interface VoiceBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onEnded"> {
  /** Conversation state. "muted" shows the slashed mic. */
  state?: VoiceState;
  /** Toggle mute. Space also toggles when the bar itself is focused. */
  onMicToggle?: () => void;
  /** End the session. */
  onEnd?: () => void;
  /** Elapsed seconds. */
  elapsed?: number;
  /** Live transcript; the last two lines are shown. */
  transcript?: string;
  /** Mic permission. "prompt" shows an Allow button, "denied" shows instructions. */
  permission?: MicPermission;
  /** Called by the Allow button. */
  onRequestPermission?: () => void;
}

export const VoiceBar = React.forwardRef<HTMLDivElement, VoiceBarProps>(
  ({ state = "idle", onMicToggle, onEnd, elapsed, transcript, permission = "granted", onRequestPermission, className, onKeyDown, ...props }, ref) => {
    const reduce = useReducedMotion();
    const [endHover, setEndHover] = React.useState(false);
    const muted = state === "muted";
    const words = React.useMemo(() => (transcript ?? "").split(/\s+/).filter(Boolean), [transcript]);

    return (
      <div
        ref={ref}
        role="group"
        aria-label="Voice controls"
        tabIndex={0}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (e.key === " " && e.target === e.currentTarget) {
            e.preventDefault();
            onMicToggle?.();
          }
        }}
        className={cn("flex w-full flex-col items-center gap-4 rounded-2xl font-sans outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
        {...props}
      >
        <style href="lk-voice-bar" precedence="default">
          {BAR_CSS}
        </style>

        {/* transcript — last two lines, older lines slide up under a fade */}
        <div
          className="flex h-12 w-full max-w-md flex-col justify-end overflow-hidden text-center text-[14px] leading-6 text-foreground/90"
          style={{ maskImage: "linear-gradient(to bottom, transparent, #000 45%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 45%)" }}
          aria-live="polite"
        >
          <motion.p layout={reduce ? false : "position"} transition={{ type: "spring", stiffness: 260, damping: 26 }}>
            {words.map((w, i) => (
              <React.Fragment key={i}>
                <span className="lk-vb-word inline-block">{w}</span>{" "}
              </React.Fragment>
            ))}
          </motion.p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {permission === "prompt" || permission === "unknown" ? (
            <motion.div key="prompt" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} className="flex flex-col items-center gap-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={onRequestPermission}
                className={cn("inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-[13.5px] font-medium text-background shadow-sm transition-colors hover:bg-foreground/90", ring)}
              >
                <Mic className="size-4" /> Allow microphone
              </motion.button>
              <p className="text-[12.5px] text-muted-foreground">We only listen while voice mode is on.</p>
            </motion.div>
          ) : permission === "denied" || permission === "unsupported" ? (
            <motion.p key="denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xs text-center text-[13px] leading-5 text-muted-foreground" role="alert">
              {permission === "unsupported"
                ? "This browser can't access a microphone."
                : "Microphone access is blocked. Click the lock icon in the address bar, allow the microphone, then reload."}
            </motion.p>
          ) : (
            <motion.div key="controls" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} className="flex items-center gap-3">
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={onMicToggle}
                aria-label={muted ? "Unmute microphone" : "Mute microphone"}
                aria-pressed={muted}
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border shadow-sm transition-colors duration-150",
                  muted ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:bg-accent",
                  ring
                )}
              >
                <MicIcon muted={muted} />
              </motion.button>

              {elapsed !== undefined && (
                <span className="min-w-[52px] text-center font-mono text-[13px] tabular-nums text-muted-foreground" aria-label={`Elapsed ${fmt(elapsed)}`}>
                  {fmt(elapsed)}
                </span>
              )}

              <motion.button
                type="button"
                layout={!reduce}
                whileTap={{ scale: 0.92 }}
                onClick={onEnd}
                onHoverStart={() => setEndHover(true)}
                onHoverEnd={() => setEndHover(false)}
                onFocus={() => setEndHover(true)}
                onBlur={() => setEndHover(false)}
                aria-label="End voice session"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ borderRadius: 999 }}
                className={cn("flex h-12 min-w-12 items-center justify-center gap-2 bg-destructive px-3.5 text-[13.5px] font-medium text-white shadow-sm", ring)}
              >
                <motion.span layout={!reduce} className="flex">
                  <PhoneOff className="size-5" strokeWidth={1.75} />
                </motion.span>
                <AnimatePresence initial={false} mode="popLayout">
                  {endHover && (
                    <motion.span
                      key="end"
                      layout={!reduce}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ duration: 0.18, delay: 0.04 }}
                      className="whitespace-nowrap pr-0.5"
                    >
                      End
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
VoiceBar.displayName = "VoiceBar";

export default VoiceBar;

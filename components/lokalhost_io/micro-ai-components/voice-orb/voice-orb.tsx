"use client";

import * as React from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

export { VoiceBar } from "./voice-bar";
export type { VoiceBarProps } from "./voice-bar";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "muted" | "error";
export type VoiceOrbVariant = "blob" | "rings" | "bars";
export type MicPermission = "unknown" | "prompt" | "granted" | "denied" | "unsupported";

/* ------------------------------------------------------------------ */
/* Audio helpers                                                      */
/* ------------------------------------------------------------------ */

/** RMS level of an AnalyserNode, mapped to a perceptual 0..1 range. */
export function readLevel(analyser: AnalyserNode, buffer: Uint8Array<ArrayBuffer>) {
  analyser.getByteTimeDomainData(buffer);
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = (buffer[i] - 128) / 128;
    sum += v * v;
  }
  const rms = Math.sqrt(sum / buffer.length);
  return Math.min(1, Math.sqrt(rms * 4));
}

export interface UseMicLevelResult {
  /** Ask for the mic and start measuring. */
  start: () => Promise<void>;
  /** Stop all tracks and close the audio context. */
  stop: () => void;
  /** Smoothed 0..1 level, updated ~15×/s (use `levelRef` for per-frame reads). */
  level: number;
  /** Always-current smoothed level, safe to read inside rAF loops. */
  levelRef: React.RefObject<number>;
  /** The analyser — pass it straight to <VoiceOrb analyser>. */
  analyser: AnalyserNode | null;
  permission: MicPermission;
  /** True while the mic stream is live. */
  active: boolean;
}

export function useMicLevel(): UseMicLevelResult {
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null);
  const [permission, setPermission] = React.useState<MicPermission>("unknown");
  const [level, setLevel] = React.useState(0);
  const [active, setActive] = React.useState(false);
  const levelRef = React.useRef(0);
  const res = React.useRef<{ stream?: MediaStream; ctx?: AudioContext; raf?: number }>({});

  React.useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermission("unsupported");
      return;
    }
    let status: PermissionStatus | undefined;
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((s) => {
        status = s;
        setPermission(s.state === "granted" ? "granted" : s.state === "denied" ? "denied" : "prompt");
        s.onchange = () => setPermission(s.state === "granted" ? "granted" : s.state === "denied" ? "denied" : "prompt");
      })
      .catch(() => setPermission("prompt"));
    return () => {
      if (status) status.onchange = null;
    };
  }, []);

  const stop = React.useCallback(() => {
    const r = res.current;
    if (r.raf) cancelAnimationFrame(r.raf);
    r.stream?.getTracks().forEach((t) => t.stop());
    void r.ctx?.close();
    res.current = {};
    levelRef.current = 0;
    setLevel(0);
    setAnalyser(null);
    setActive(false);
  }, []);

  const start = React.useCallback(async () => {
    stop();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const ctx = new AudioContext();
      const node = ctx.createAnalyser();
      node.fftSize = 512;
      node.smoothingTimeConstant = 0.6;
      ctx.createMediaStreamSource(stream).connect(node);
      const buf = new Uint8Array(new ArrayBuffer(node.fftSize));
      let last = 0;
      const tick = (t: number) => {
        const raw = readLevel(node, buf);
        levelRef.current += (raw - levelRef.current) * 0.15;
        if (t - last > 66) {
          last = t;
          setLevel(levelRef.current);
        }
        res.current.raf = requestAnimationFrame(tick);
      };
      res.current = { stream, ctx, raf: requestAnimationFrame(tick) };
      setAnalyser(node);
      setPermission("granted");
      setActive(true);
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      setPermission(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "prompt");
      throw err;
    }
  }, [stop]);

  React.useEffect(() => stop, [stop]);

  return { start, stop, level, levelRef, analyser, permission, active };
}

/* ------------------------------------------------------------------ */
/* VoiceOrb                                                           */
/* ------------------------------------------------------------------ */

export interface VoiceOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Conversation state. Defaults to "idle". */
  state?: VoiceState;
  /** External 0..1 level (e.g. the AI's output volume). Ignored when `analyser` is set. */
  volume?: number;
  /** Web Audio analyser to read levels from directly. */
  analyser?: AnalyserNode | null;
  /** Per-frame level getter (0..1) — avoids re-rendering on every frame. Wins over `volume`. */
  getVolume?: () => number;
  /** Diameter in px. Defaults to 160. */
  size?: number;
  /** Visual style. Defaults to "blob". */
  variant?: VoiceOrbVariant;
}

interface Targets {
  scale: number;
  deform: number;
  react: number;
  alpha: number;
  tint: number;
}

function targetsFor(state: VoiceState): Targets {
  switch (state) {
    case "listening":
      return { scale: 1, deform: 0.05, react: 1, alpha: 1, tint: 0 };
    case "speaking":
      return { scale: 1.02, deform: 0.08, react: 1.5, alpha: 1, tint: 0 };
    case "thinking":
      return { scale: 0.85, deform: 0, react: 0, alpha: 0.9, tint: 0 };
    case "muted":
      return { scale: 0.94, deform: 0.015, react: 0, alpha: 0.6, tint: 0 };
    case "error":
      return { scale: 0.96, deform: 0.02, react: 0, alpha: 1, tint: 1 };
    default:
      return { scale: 1, deform: 0.03, react: 0, alpha: 1, tint: 0 };
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const LABEL: Record<VoiceState, string> = {
  idle: "Ready",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  muted: "Microphone muted",
  error: "Something went wrong",
};

export const VoiceOrb = React.forwardRef<HTMLDivElement, VoiceOrbProps>(
  ({ state = "idle", volume = 0, analyser, getVolume, size = 160, variant = "blob", className, style, ...props }, ref) => {
    const reduce = useReducedMotion();
    const rootRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const ringRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const barRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const staticRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

    // error shows for 600ms, then settles to idle
    const [shown, setShown] = React.useState<VoiceState>(state);
    React.useEffect(() => {
      setShown(state);
      if (state !== "error") return;
      if (!reduce && rootRef.current) void animate(rootRef.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.4 });
      const t = window.setTimeout(() => setShown("idle"), 600);
      return () => window.clearTimeout(t);
    }, [state, reduce]);

    const live = React.useRef({ volume, analyser, getVolume, state: shown, reduce: !!reduce });
    live.current = { volume, analyser, getVolume, state: shown, reduce: !!reduce };

    React.useEffect(() => {
      const root = rootRef.current;
      if (!root) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d") ?? null;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }

      let raf = 0;
      let visible = true;
      let frame = 0;
      let colors = { fg: "#111", muted: "#888", bg: "#fff", danger: "#e5484d" };
      const readColors = () => {
        const cs = getComputedStyle(root);
        colors = {
          fg: cs.getPropertyValue("--foreground").trim() || colors.fg,
          muted: cs.getPropertyValue("--muted-foreground").trim() || colors.muted,
          bg: cs.getPropertyValue("--background").trim() || colors.bg,
          danger: cs.getPropertyValue("--destructive").trim() || colors.danger,
        };
      };
      readColors();

      const cur: Targets & { level: number; lag: number[] } = { ...targetsFor(live.current.state), level: 0, lag: [0, 0, 0] };
      const buf = new Uint8Array(new ArrayBuffer(512));
      const start = performance.now();

      const draw = (now: number) => {
        raf = requestAnimationFrame(draw);
        if (!visible || document.hidden) return;
        frame++;
        if (frame % 30 === 0) readColors();
        const { volume: vol, analyser: an, getVolume: gv, state: st, reduce: rm } = live.current;
        const t = (now - start) / 1000;
        const target = targetsFor(st);

        let raw = an ? readLevel(an, buf) : Math.max(0, Math.min(1, gv ? gv() : vol));
        if (st === "thinking" || st === "muted" || st === "error") raw = 0;
        cur.level = lerp(cur.level, raw, 0.15);
        cur.lag = cur.lag.map((l, i) => lerp(l, cur.level, 0.15 / (i + 1)));
        const k = 0.08; // ~300ms morph between states
        cur.scale = lerp(cur.scale, target.scale, k);
        cur.deform = lerp(cur.deform, target.deform, k);
        cur.react = lerp(cur.react, target.react, k);
        cur.alpha = lerp(cur.alpha, target.alpha, k);
        cur.tint = lerp(cur.tint, target.tint, 0.12);

        const breathe = st === "idle" && !rm ? 1 + 0.015 * (1 - Math.cos((t / 4) * Math.PI * 2)) : 1;
        const lv = cur.level * cur.react;

        if (rm) {
          if (staticRef.current) staticRef.current.style.opacity = String((0.55 + cur.level * 0.45) * cur.alpha);
          return;
        }

        if (variant === "blob" && ctx && canvas) {
          const S = size * dpr;
          ctx.clearRect(0, 0, S, S);
          const cx = S / 2;
          const cy = S / 2;
          const R = S * 0.34 * cur.scale * breathe * (1 + lv * 0.12);
          const d = cur.deform + lv * 0.1;
          const N = 96;
          ctx.save();
          ctx.globalAlpha = cur.alpha;
          ctx.beginPath();
          for (let i = 0; i <= N; i++) {
            const a = (i / N) * Math.PI * 2;
            const w =
              Math.sin(a * 3 + t * 1.3) * 0.5 +
              Math.sin(a * 5 - t * 1.7 + 1.3) * 0.3 +
              Math.sin(a * 7 + t * 0.9 + 2.1) * 0.2;
            const r = R * (1 + d * w);
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          const g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R * 1.15);
          g.addColorStop(0, colors.fg);
          g.addColorStop(1, colors.muted);
          ctx.shadowColor = colors.fg;
          ctx.shadowBlur = (18 + lv * 30) * dpr;
          ctx.fillStyle = g;
          ctx.fill();
          ctx.shadowBlur = 0;
          // soft inner glow
          const hl = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, 0, cx - R * 0.3, cy - R * 0.35, R * 0.9);
          hl.addColorStop(0, colors.bg);
          hl.addColorStop(1, "transparent");
          ctx.globalAlpha = cur.alpha * 0.22;
          ctx.fillStyle = hl;
          ctx.fill();
          if (cur.tint > 0.01) {
            ctx.globalAlpha = cur.alpha * cur.tint * 0.75;
            ctx.fillStyle = colors.danger;
            ctx.fill();
          }
          ctx.restore();
        }

        if (variant === "rings") {
          ringRefs.current.forEach((el, i) => {
            if (!el) return;
            const s = cur.scale * breathe * (0.55 + i * 0.2) * (1 + cur.lag[i] * cur.react * (0.35 - i * 0.06));
            el.style.transform = `scale(${s.toFixed(4)})`;
            el.style.opacity = String(cur.alpha * (i === 0 ? 1 : 0.55 - i * 0.12 + cur.lag[i] * 0.3));
          });
        }

        if (variant === "bars") {
          const weights = [0.5, 0.8, 1, 0.8, 0.5];
          barRefs.current.forEach((el, i) => {
            if (!el) return;
            const wobble = 0.65 + 0.35 * Math.sin(t * 9 + i * 1.7);
            const idle = st === "thinking" ? 0.3 + 0.2 * Math.sin(t * 4 - i * 0.8) : 0.22 * breathe;
            const h = Math.min(1, idle + lv * weights[i] * wobble * 0.9);
            el.style.transform = `scaleY(${h.toFixed(4)})`;
            el.style.opacity = String(cur.alpha);
          });
        }
      };
      raf = requestAnimationFrame(draw);

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(root);
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
      };
    }, [size, variant]);

    const thinking = shown === "thinking";

    return (
      <div
        ref={rootRef}
        className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
        style={{ width: size, height: size, ...style }}
        {...props}
      >
        <span className="sr-only" role="status" aria-live="polite">
          {LABEL[shown]}
        </span>
        <div aria-hidden className="absolute inset-0">
          {reduce ? (
            <span ref={staticRef} className="absolute inset-[16%] rounded-full bg-gradient-to-br from-foreground to-muted-foreground shadow-lg transition-opacity" />
          ) : variant === "blob" ? (
            <canvas ref={canvasRef} className="size-full" style={{ width: size, height: size }} />
          ) : variant === "rings" ? (
            [2, 1, 0].map((i) => (
              <span
                key={i}
                ref={(el) => {
                  ringRefs.current[i] = el;
                }}
                className={cn(
                  "absolute inset-0 rounded-full will-change-transform",
                  i === 0 ? "bg-gradient-to-br from-foreground to-muted-foreground shadow-lg" : "border border-foreground/40 bg-foreground/[0.04]"
                )}
              />
            ))
          ) : (
            <span className="absolute inset-[22%] flex items-center justify-center gap-[6%] rounded-full border border-border bg-background shadow-sm">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  className="h-[46%] w-[8%] origin-center rounded-full bg-foreground will-change-transform"
                  style={{ transform: "scaleY(0.22)" }}
                />
              ))}
            </span>
          )}

          {/* thinking orbit */}
          <svg
            viewBox="0 0 100 100"
            className={cn("absolute inset-0 size-full transition-opacity duration-300", thinking ? "opacity-100" : "opacity-0")}
            style={thinking && !reduce ? { animation: "lk-orb-orbit 1.2s linear infinite" } : undefined}
          >
            <circle cx="50" cy="50" r="46" fill="none" strokeWidth="1" className="stroke-foreground/10" />
            <circle cx="50" cy="50" r="46" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="40 250" className="stroke-foreground" />
          </svg>
          <style href="lk-orb" precedence="default">{`@keyframes lk-orb-orbit { to { transform: rotate(360deg); } }`}</style>
        </div>

        <AnimatePresence>
          {shown === "muted" && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              className="absolute bottom-[10%] right-[10%] flex size-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md"
              aria-hidden
            >
              <MicOff className="size-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
VoiceOrb.displayName = "VoiceOrb";

export default VoiceOrb;

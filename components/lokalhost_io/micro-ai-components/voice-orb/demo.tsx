"use client";

import * as React from "react";
import { VoiceOrb, VoiceBar, useMicLevel, type VoiceOrbVariant, type VoiceState } from "./voice-orb";
import { DemoBar, DemoButton, Segmented } from "../_demo/controls";

const CYCLE: { state: VoiceState; ms: number; say?: string }[] = [
  { state: "idle", ms: 1800 },
  { state: "listening", ms: 3200, say: "Can you suggest a quick dinner with what's in my fridge?" },
  { state: "thinking", ms: 1600 },
  { state: "speaking", ms: 4200, say: "Sure. With eggs, spinach and feta you can make a ten-minute frittata. Want the steps?" },
];

export default function VoiceOrbDemo() {
  const [mode, setMode] = React.useState<"simulated" | "microphone">("simulated");
  const [variant, setVariant] = React.useState<VoiceOrbVariant>("blob");
  const [size, setSize] = React.useState(168);
  const [state, setState] = React.useState<VoiceState>("idle");
  const [muted, setMuted] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [transcript, setTranscript] = React.useState("");
  const volumeRef = React.useRef(0);
  const stateRef = React.useRef<VoiceState>("idle");
  const mic = useMicLevel();

  // elapsed timer
  React.useEffect(() => {
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // simulated conversation
  React.useEffect(() => {
    if (mode !== "simulated") return;
    let i = 0;
    let cancelled = false;
    const timers: number[] = [];
    const step = () => {
      if (cancelled) return;
      const s = CYCLE[i % CYCLE.length];
      setState(s.state);
      if (s.say) {
        const words = s.say.split(" ");
        setTranscript("");
        words.forEach((w, k) => timers.push(window.setTimeout(() => setTranscript((t) => (t ? `${t} ${w}` : w)), (k * s.ms * 0.85) / words.length)));
      }
      i++;
      timers.push(window.setTimeout(step, s.ms));
    };
    step();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [mode]);

  // fake speech envelope for listening / speaking
  React.useEffect(() => {
    if (mode !== "simulated") return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const s = (t - t0) / 1000;
      const syllables = Math.max(0, Math.sin(s * 9) * 0.5 + Math.sin(s * 3.7) * 0.35 + Math.sin(s * 15) * 0.15);
      const talking = stateRef.current === "listening" || stateRef.current === "speaking";
      volumeRef.current = talking ? syllables * (0.55 + 0.45 * Math.sin(s * 0.9) ** 2) : 0;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  // real mic
  React.useEffect(() => {
    if (mode !== "microphone") {
      mic.stop();
      return;
    }
    setTranscript("");
    setState(mic.active ? "listening" : "idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, mic.active]);

  const shown: VoiceState = muted ? "muted" : state;
  stateRef.current = state;
  const getVolume = React.useCallback(() => volumeRef.current, []);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6 font-sans">
      <div className="flex h-[260px] items-center justify-center">
        <VoiceOrb
          state={shown}
          variant={variant}
          size={size}
          getVolume={mode === "simulated" ? getVolume : undefined}
          analyser={mode === "microphone" ? mic.analyser : undefined}
        />
      </div>

      <VoiceBar
        state={shown}
        elapsed={elapsed}
        transcript={mode === "simulated" ? transcript : mic.active ? "Speak — the orb follows your voice." : ""}
        permission={mode === "microphone" && !mic.active ? (mic.permission === "denied" || mic.permission === "unsupported" ? mic.permission : "prompt") : "granted"}
        onRequestPermission={() => void mic.start().catch(() => undefined)}
        onMicToggle={() => setMuted((m) => !m)}
        onEnd={() => {
          setMuted(false);
          setElapsed(0);
          setState("error");
          window.setTimeout(() => setState("idle"), 700);
          if (mode === "microphone") mic.stop();
        }}
      />

      <div className="flex w-full flex-col items-center gap-3 border-t border-border pt-5">
        <DemoBar>
          <Segmented label="Source" value={mode} onChange={setMode} options={["simulated", "microphone"] as const} />
          <Segmented label="Variant" value={variant} onChange={setVariant} options={["blob", "rings", "bars"] as const} />
        </DemoBar>
        <label className="flex items-center gap-3 text-[12.5px] text-muted-foreground">
          Size
          <input type="range" min={96} max={220} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-40 accent-foreground" />
          <span className="w-10 tabular-nums">{size}px</span>
        </label>
        {mode === "simulated" && (
          <DemoBar>
            {(["idle", "listening", "thinking", "speaking", "error"] as const).map((s) => (
              <DemoButton key={s} className="h-7 px-2 text-[11.5px] capitalize" active={state === s} onClick={() => setState(s)}>
                {s}
              </DemoButton>
            ))}
          </DemoBar>
        )}
      </div>
    </div>
  );
}

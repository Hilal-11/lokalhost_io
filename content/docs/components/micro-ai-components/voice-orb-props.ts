import { PropRow } from "@/components/mdx/props-table";

export const voiceOrbProps: PropRow[] = [
  { name: "state", type: "\"idle\" | \"listening\" | \"thinking\" | \"speaking\" | \"muted\" | \"error\"", description: "Conversation state. Every change morphs smoothly. Defaults to \"idle\"." },
  { name: "volume", type: "number", description: "External 0..1 level (e.g. the AI's output volume)." },
  { name: "getVolume", type: "() => number", description: "Per-frame level getter — read from a ref so nothing re-renders 60×/s. Wins over volume." },
  { name: "analyser", type: "AnalyserNode | null", description: "Web Audio analyser read directly inside the animation loop. Wins over both." },
  { name: "size", type: "number", description: "Diameter in px. Defaults to 160." },
  { name: "variant", type: "\"blob\" | \"rings\" | \"bars\"", description: "Canvas blob, concentric rings, or a 5-bar waveform. Defaults to \"blob\"." },
];

export const voiceBarProps: PropRow[] = [
  { name: "state", type: "VoiceState", description: "\"muted\" draws a slash across the mic." },
  { name: "onMicToggle", type: "() => void", description: "Toggle mute. Space does the same while the bar is focused." },
  { name: "onEnd", type: "() => void", description: "End the session." },
  { name: "elapsed", type: "number", description: "Elapsed seconds, shown as mm:ss." },
  { name: "transcript", type: "string", description: "Live transcript; the last two lines are shown." },
  { name: "permission", type: "\"unknown\" | \"prompt\" | \"granted\" | \"denied\" | \"unsupported\"", description: "prompt shows an “Allow microphone” button, denied shows instructions. Defaults to \"granted\"." },
  { name: "onRequestPermission", type: "() => void", description: "Called by the Allow button — usually mic.start()." },
];

export const useMicLevelProps: PropRow[] = [
  { name: "start", type: "() => Promise<void>", description: "Ask for the mic and begin measuring." },
  { name: "stop", type: "() => void", description: "Stop tracks and close the AudioContext." },
  { name: "level", type: "number", description: "Smoothed 0..1 level, updated ~15×/s." },
  { name: "levelRef", type: "RefObject<number>", description: "Always-current level for rAF loops." },
  { name: "analyser", type: "AnalyserNode | null", description: "Pass straight to <VoiceOrb analyser>." },
  { name: "permission", type: "MicPermission", description: "Live permission state." },
  { name: "active", type: "boolean", description: "True while the mic stream is open." },
];

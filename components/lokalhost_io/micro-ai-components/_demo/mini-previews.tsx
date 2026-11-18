"use client";

/**
 * Small, self-looping previews of the Micro AI UI components.
 * Used by the landing-page showcase and the /docs overview cards.
 * Not part of the registry.
 */

import * as React from "react";
import { Brain, Gauge, Globe, Mail, Search, Zap, FilePlus2, Settings, UserPlus, Moon } from "lucide-react";
import { Composer, type ComposerStatus } from "../prompt-composer/prompt-composer";
import { Message, type MessageStatus } from "../streaming-message/streaming-message";
import { Reasoning, type ReasoningStep } from "../reasoning-panel/reasoning-panel";
import { ToolCall, type ToolCallStatus } from "../tool-call/tool-call";
import { AgentPlan, type PlanStep } from "../agent-plan/agent-plan";
import { CitationProvider, Citation, type CitationSource } from "../citations/citations";
import { VoiceOrb, type VoiceState } from "../voice-orb/voice-orb";
import { AICommandPalette, Kbd } from "../ai-command/ai-command";
import { ImageGen, type ImageGenStatus } from "../image-gen/image-gen";
import { MessageActions, BranchSwitcher, BranchContent } from "../message-actions/message-actions";
import { mockStream, sleep } from "@/lib/mock-stream";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Runs `run` in a loop until unmount; `run` gets an AbortSignal. */
function useLoop(run: (signal: AbortSignal) => Promise<void>, deps: React.DependencyList = []) {
  React.useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      while (!ctrl.signal.aborted) {
        try {
          await run(ctrl.signal);
        } catch {
          return;
        }
      }
    })();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const MODELS = [
  { id: "fast", label: "Fast", icon: <Zap /> },
  { id: "smart", label: "Smart", icon: <Gauge /> },
  { id: "reasoning", label: "Reasoning", icon: <Brain /> },
];

/* ------------------------------------------------------------------ */
/* Prompt composer                                                    */
/* ------------------------------------------------------------------ */

const PROMPTS = ["Build a pricing page with three tiers", "Summarize this PDF in five bullets", "Write a launch tweet for our API"];

export function MiniComposer() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<ComposerStatus>("idle");
  const touched = React.useRef(false);

  useLoop(async (signal) => {
    for (const p of PROMPTS) {
      if (touched.current) return sleep(100000, signal);
      await sleep(900, signal);
      for (let i = 1; i <= p.length; i += 2) {
        if (touched.current) return;
        setValue(p.slice(0, i));
        await sleep(28, signal);
      }
      setValue(p);
      await sleep(700, signal);
      if (touched.current) return;
      setValue("");
      setStatus("streaming");
      await sleep(1800, signal);
      setStatus("idle");
    }
  });

  return (
    <div className="w-full max-w-md" onPointerDown={() => (touched.current = true)} onFocusCapture={() => (touched.current = true)}>
      <Composer
        value={value}
        onValueChange={setValue}
        status={status}
        onSubmit={() => {
          setStatus("streaming");
          window.setTimeout(() => setStatus("idle"), 2000);
        }}
        onStop={() => setStatus("idle")}
      >
        <Composer.Input placeholder="Ask anything…" />
        <Composer.Toolbar>
          <Composer.AttachButton />
          <Composer.ModelChip models={MODELS} defaultValue="smart" />
          <Composer.Spacer />
          <Composer.Submit />
        </Composer.Toolbar>
      </Composer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Streaming message                                                  */
/* ------------------------------------------------------------------ */

const SHORT_ANSWER = `Use a **300ms debounce** for search inputs:

- One request per pause, not per keystroke
- Pair it with an \`AbortController\``;

export function MiniStreaming() {
  const [text, setText] = React.useState("");
  const [status, setStatus] = React.useState<MessageStatus>("pending");
  useLoop(async (signal) => {
    setText("");
    setStatus("pending");
    await sleep(900, signal);
    for await (const t of mockStream(SHORT_ANSWER, { wpm: 420, signal })) {
      setStatus("streaming");
      setText((s) => s + t);
    }
    setStatus("done");
    await sleep(3200, signal);
  });
  return (
    <div className="flex w-full max-w-md flex-col gap-3 text-left">
      <Message role="user">
        <Message.Content content="How should I debounce search?" />
      </Message>
      <div className="min-h-[124px]">
        <Message status={status}>
          <Message.Content content={text} animation="blur" />
        </Message>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reasoning                                                          */
/* ------------------------------------------------------------------ */

const R_STEPS = ["Reading the question", "Searching the docs", "Comparing options"];

export function MiniReasoning() {
  const [thinking, setThinking] = React.useState(true);
  const [steps, setSteps] = React.useState<ReasoningStep[]>([]);
  const [run, setRun] = React.useState(0);
  useLoop(async (signal) => {
    setRun((r) => r + 1);
    setThinking(true);
    setSteps(R_STEPS.map((t, i) => ({ id: t, title: t, status: i === 0 ? "active" : "pending" })));
    for (let i = 0; i < R_STEPS.length; i++) {
      await sleep(1100, signal);
      setSteps((s) => s.map((x, j) => ({ ...x, status: j <= i ? "done" : j === i + 1 ? "active" : "pending" })));
    }
    setThinking(false);
    await sleep(3000, signal);
  });
  return (
    <div className="w-full max-w-xs text-left">
      <Reasoning key={run} isStreaming={thinking} steps={steps}>
        <Reasoning.Trigger />
        <Reasoning.Content />
      </Reasoning>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tool call                                                          */
/* ------------------------------------------------------------------ */

export function MiniToolCall() {
  const [status, setStatus] = React.useState<ToolCallStatus>("pending");
  const [t, setT] = React.useState<{ s?: number; e?: number }>({});
  const [email, setEmail] = React.useState<ToolCallStatus>("awaiting-approval");
  useLoop(async (signal) => {
    setStatus("pending");
    setT({});
    await sleep(700, signal);
    const s = Date.now();
    setStatus("running");
    setT({ s });
    await sleep(1800, signal);
    setStatus("success");
    setT({ s, e: Date.now() });
    await sleep(3200, signal);
  });
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 text-left">
      <ToolCall name="search_web" title="Searching the web" icon={Globe} status={status} startedAt={t.s} endedAt={t.e} input={{ query: "fetch cache revalidate" }} output={status === "success" ? { results: 3 } : undefined} />
      <ToolCall
        name="send_email"
        title="Email the team"
        icon={Mail}
        status={email}
        approvalDescription="Sends one email. Can't be undone."
        onApprove={async () => {
          await sleep(500);
          setEmail("success");
          window.setTimeout(() => setEmail("awaiting-approval"), 3500);
        }}
        onDeny={() => {
          setEmail("cancelled");
          window.setTimeout(() => setEmail("awaiting-approval"), 2500);
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agent plan                                                         */
/* ------------------------------------------------------------------ */

const PLAN = ["Research competitors", "Draft hero copy", "Generate layout", "Deploy preview"];

export function MiniAgentPlan({ variant = "vertical" }: { variant?: "vertical" | "compact" }) {
  const [steps, setSteps] = React.useState<PlanStep[]>(PLAN.map((title, i) => ({ id: `p${i}`, title, status: "todo" })));
  useLoop(async (signal) => {
    setSteps(PLAN.map((title, i) => ({ id: `p${i}`, title, status: "todo" })));
    await sleep(600, signal);
    for (let i = 0; i < PLAN.length; i++) {
      const now = Date.now();
      setSteps((s) => s.map((x, j) => (j === i ? { ...x, status: "active", startedAt: now } : x)));
      await sleep(1300, signal);
      setSteps((s) => s.map((x, j) => (j === i ? { ...x, status: "done", endedAt: Date.now() } : x)));
    }
    await sleep(2600, signal);
  });
  return (
    <div className="w-full max-w-sm text-left">
      <AgentPlan title="Building your landing page" steps={steps} variant={variant} collapsible={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Citations                                                          */
/* ------------------------------------------------------------------ */

const SOURCES: CitationSource[] = [
  { id: "a", url: "https://en.wikipedia.org/wiki/Honey_bee", title: "Honey bee — Wikipedia", snippet: "A colony holds one queen, a few hundred drones and tens of thousands of workers.", highlight: "tens of thousands of workers" },
  { id: "b", url: "https://www.nationalgeographic.com/animals/invertebrates/facts/honeybee", title: "Honeybee facts", snippet: "Bees share flower locations through the waggle dance.", highlight: "waggle dance" },
  { id: "c", url: "https://www.fao.org/pollination/en", title: "Pollinators and food security", snippet: "Three quarters of leading food crops benefit from animal pollination.", highlight: "Three quarters" },
];

export function MiniCitations() {
  return (
    <CitationProvider sources={SOURCES}>
      <p className="max-w-sm text-left text-[14px] leading-7 text-foreground/90">
        A hive holds tens of thousands of workers <Citation ids={["a"]} /> who share where flowers are through the waggle dance{" "}
        <Citation ids={["b"]} />. Bees pollinate most leading food crops <Citation ids={["c", "a"]} />.
      </p>
    </CitationProvider>
  );
}

/* ------------------------------------------------------------------ */
/* Voice orb                                                          */
/* ------------------------------------------------------------------ */

const VOICE: { s: VoiceState; ms: number }[] = [
  { s: "idle", ms: 1600 },
  { s: "listening", ms: 2600 },
  { s: "thinking", ms: 1400 },
  { s: "speaking", ms: 3000 },
];

export function MiniVoiceOrb({ size = 120 }: { size?: number }) {
  const [state, setState] = React.useState<VoiceState>("idle");
  const stateRef = React.useRef(state);
  stateRef.current = state;
  useLoop(async (signal) => {
    for (const v of VOICE) {
      setState(v.s);
      await sleep(v.ms, signal);
    }
  });
  const t0 = React.useRef(0);
  const getVolume = React.useCallback(() => {
    if (stateRef.current !== "listening" && stateRef.current !== "speaking") return 0;
    if (!t0.current) t0.current = performance.now();
    const s = (performance.now() - t0.current) / 1000;
    return Math.max(0, Math.sin(s * 9) * 0.5 + Math.sin(s * 3.7) * 0.35 + Math.sin(s * 15) * 0.15) * 0.9;
  }, []);
  return (
    <div className="flex flex-col items-center gap-3">
      <VoiceOrb state={state} size={size} getVolume={getVolume} />
      <span className="h-5 text-[12.5px] font-medium capitalize text-muted-foreground">{state === "idle" ? "Tap to talk" : `${state}…`}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AI command                                                         */
/* ------------------------------------------------------------------ */

const noop = () => undefined;
const CMDS = [
  { id: "new", label: "New document", icon: <FilePlus2 />, shortcut: ["⌘", "N"], group: "Create", onSelect: noop },
  { id: "invite", label: "Invite teammate", icon: <UserPlus />, group: "Create", onSelect: noop },
  { id: "theme", label: "Toggle dark mode", icon: <Moon />, group: "Settings", onSelect: noop },
  { id: "settings", label: "Open settings", icon: <Settings />, shortcut: ["⌘", ","], group: "Settings", onSelect: noop },
];

async function* askMini(q: string) {
  await sleep(400);
  yield* mockStream(`Here's a quick take on **“${q}”**: start small, measure one number, then iterate.`, { wpm: 700 });
}

export function MiniAICommand() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-2.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-[260px] items-center gap-2.5 rounded-xl border border-border bg-background px-3 text-[13.5px] text-muted-foreground shadow-sm transition-colors hover:bg-accent/60 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search or ask AI…</span>
        <span className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <span className="text-[12px] text-muted-foreground">Type a question, press Tab</span>
      <AICommandPalette open={open} onOpenChange={setOpen} commands={CMDS} onAsk={askMini} hotkey={false} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Image gen                                                          */
/* ------------------------------------------------------------------ */

export function MiniImageGen({ seed = "lokalhost-lake" }: { seed?: string }) {
  const [g, setG] = React.useState<{ status: ImageGenStatus; progress?: number; eta?: number }>({ status: "queued" });
  const [run, setRun] = React.useState(0);
  useLoop(async (signal) => {
    setRun((r) => r + 1);
    setG({ status: "queued" });
    await sleep(900, signal);
    for (let p = 0; p <= 100; p += 4) {
      setG({ status: "generating", progress: p, eta: Math.max(0, (100 - p) / 25) });
      await sleep(110, signal);
    }
    setG({ status: "done" });
    await sleep(4200, signal);
  });
  return (
    <div className="w-full max-w-[260px]">
      <ImageGen
        key={run}
        {...g}
        src={g.status === "done" ? `https://picsum.photos/seed/${seed}-${run % 3}/600/600` : undefined}
        prompt="A quiet mountain lake at sunrise"
        aspectRatio="1:1"
        disableLightbox
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Message actions                                                    */
/* ------------------------------------------------------------------ */

const VERSIONS = [
  "A **monorepo** keeps every package in one repo so shared types stay in sync.",
  "Think of a monorepo as one workspace: apps and libraries change together, atomically.",
  "Pick a monorepo when packages ship together; separate repos when they don't.",
];

export function MiniMessageActions() {
  const [v, setV] = React.useState(1);
  return (
    <div className="w-full max-w-sm text-left">
      <Message avatar={null}>
        <BranchContent current={v}>
          <Message.Content content={VERSIONS[v - 1]} />
        </BranchContent>
        <div className="-ml-2 mt-1 flex items-center gap-0.5">
          <BranchSwitcher current={v} total={VERSIONS.length} onChange={setV} />
          <MessageActions>
            <MessageActions.Copy text={VERSIONS[v - 1]} />
            <MessageActions.Regenerate onRegenerate={() => setV((x) => (x % VERSIONS.length) + 1)} />
            <MessageActions.Feedback />
          </MessageActions>
        </div>
      </Message>
    </div>
  );
}

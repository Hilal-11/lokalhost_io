"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Copy, FileCode2, Package, Sparkles, Terminal } from "lucide-react";
import { SiFlutter, SiNextdotjs, SiReact } from "react-icons/si";
import { cn } from "@/lib/utils";
import { component as registryItems } from "@/registry/registry-components";
import { REGISTRY_BASE } from "@/lib/registry";
import CodeBlock from "@/components/lokalhost_io/code-blocks/code-block";

/* ----------------------------------------------------------------------- */
/*  Data                                                                    */
/* ----------------------------------------------------------------------- */

type Platform = "web" | "react-native" | "flutter";
type PM = "npm" | "pnpm" | "yarn" | "bun";
type StepKind = "shell" | "code";

interface Step {
  id: string;
  title: string;
  hint: string;
  kind: StepKind;
}

const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode; preview?: boolean }[] = [
  { id: "web", label: "Web", icon: <SiNextdotjs className="size-3.5" /> },
  { id: "react-native", label: "React Native", icon: <SiReact className="size-3.5" />, preview: true },
  { id: "flutter", label: "Flutter", icon: <SiFlutter className="size-3.5" />, preview: true },
];

const PMS: PM[] = ["npm", "pnpm", "yarn", "bun"];
const RUNNER: Record<PM, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

const STEPS: Record<Platform, Step[]> = {
  web: [
    { id: "init", title: "Initialise shadcn", hint: "Once per project. Skip if you already use shadcn.", kind: "shell" },
    { id: "add", title: "Add a component", hint: "Copies the source into your repo and installs its dependencies.", kind: "shell" },
    { id: "use", title: "Import and use it", hint: "It's your code now — edit anything.", kind: "code" },
  ],
  "react-native": [
    { id: "registry", title: "Register the namespace", hint: "Add @lokalhost to components.json once.", kind: "code" },
    { id: "add", title: "Add a component", hint: "Lands in components/ui with its dependencies.", kind: "shell" },
    { id: "use", title: "Import and use it", hint: "Works with Expo and bare React Native.", kind: "code" },
  ],
  flutter: [
    { id: "add", title: "Add a widget", hint: "Writes to lib/widgets and runs flutter pub add.", kind: "shell" },
    { id: "use", title: "Import and use it", hint: "Plain Dart — theme it like any widget.", kind: "code" },
  ],
};

/** Featured web components with a usage snippet. Everything else comes from the registry. */
const WEB_PICKS: { name: string; label: string; importName: string; usage: string }[] = [
  {
    name: "prompt-composer",
    label: "Prompt Composer",
    importName: "PromptComposer",
    usage: `import PromptComposer from "@/components/lokalhost_io/micro-ai-components/prompt-composer/prompt-composer";

export default function Chat() {
  const [status, setStatus] = useState<"idle" | "streaming">("idle");
  return (
    <PromptComposer
      status={status}
      onSubmit={(text) => send(text)}
      onStop={() => setStatus("idle")}
    />
  );
}`,
  },
  {
    name: "streaming-message",
    label: "Streaming Message",
    importName: "Message",
    usage: `import { Message, useStreamingText } from "@/components/lokalhost_io/micro-ai-components/streaming-message/streaming-message";

export function Answer({ stream }: { stream: AsyncIterable<string> }) {
  const { text, status } = useStreamingText(stream);
  return (
    <Message status={status === "idle" ? "pending" : status}>
      <Message.Content content={text} animation="blur" />
    </Message>
  );
}`,
  },
  {
    name: "reasoning-panel",
    label: "Reasoning Panel",
    importName: "Reasoning",
    usage: `import { Reasoning } from "@/components/lokalhost_io/micro-ai-components/reasoning-panel/reasoning-panel";

<Reasoning isStreaming={isThinking}>
  <Reasoning.Trigger />
  <Reasoning.Content>{reasoning}</Reasoning.Content>
</Reasoning>`,
  },
  {
    name: "tool-call",
    label: "Tool Call",
    importName: "ToolCall",
    usage: `import { ToolCall } from "@/components/lokalhost_io/micro-ai-components/tool-call/tool-call";

<ToolCall
  name="search_web"
  title="Searching the web"
  status="running"
  input={{ query: "next.js caching" }}
  startedAt={Date.now()}
/>`,
  },
  {
    name: "voice-orb",
    label: "Voice Orb",
    importName: "VoiceOrb",
    usage: `import { VoiceOrb, useMicLevel } from "@/components/lokalhost_io/micro-ai-components/voice-orb/voice-orb";

export function Voice() {
  const mic = useMicLevel();
  return <VoiceOrb state="listening" analyser={mic.analyser} />;
}`,
  },
  {
    name: "ai-command",
    label: "AI Command",
    importName: "AICommandPalette",
    usage: `import { AICommandPalette } from "@/components/lokalhost_io/micro-ai-components/ai-command/ai-command";

<AICommandPalette
  commands={commands}
  onAsk={(query) => streamAnswer(query)}
/>`,
  },
  {
    name: "image-gen",
    label: "Image Gen",
    importName: "ImageGen",
    usage: `import { ImageGen } from "@/components/lokalhost_io/micro-ai-components/image-gen/image-gen";

<ImageGen
  status={job.status}
  progress={job.progress}
  src={job.url}
  prompt={prompt}
  aspectRatio="4:3"
/>`,
  },
  {
    name: "download-button",
    label: "Download Button",
    importName: "DownloadButtonGroup",
    usage: `import DownloadButtonGroup from "@/components/lokalhost_io/buttons/download-button";

<DownloadButtonGroup
  highlightDetected
  config={{ mac: { downloadUrl: "/app.dmg" } }}
/>`,
  },
];

const MOBILE_PICKS = [
  { name: "bottom-sheet", label: "Bottom Sheet", rn: "BottomSheet", dart: "LkBottomSheet" },
  { name: "button", label: "Button", rn: "Button", dart: "LkButton" },
  { name: "toast", label: "Toast", rn: "Toast", dart: "LkToast" },
  { name: "tabs", label: "Tabs", rn: "Tabs", dart: "LkTabs" },
];

const RN_REGISTRY = `{
  "registries": {
    "@lokalhost": "${REGISTRY_BASE}/r/mobile/{name}.json"
  }
}`;

const EASE = [0.22, 1, 0.36, 1] as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950";

/* ----------------------------------------------------------------------- */
/*  Helpers                                                                 */
/* ----------------------------------------------------------------------- */

function useCopy(timeout = 1600) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string, key = text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), timeout);
    } catch {
      /* clipboard blocked */
    }
  };
  return { copied, copy };
}

function CopySwap({ on }: { on: boolean }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={on ? "y" : "n"}
        initial={{ scale: 0.5, opacity: 0, rotate: on ? -15 : 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.16, ease: EASE }}
        className="flex"
      >
        {on ? <Check className="size-3.5" strokeWidth={2.5} /> : <Copy className="size-3.5" />}
      </motion.span>
    </AnimatePresence>
  );
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: React.ReactNode }[];
  label: string;
  size?: "sm" | "md";
}) {
  const id = useId();
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-[10px] border border-neutral-200 bg-neutral-100/80 p-[3px] dark:border-neutral-800 dark:bg-neutral-900",
        size === "sm" ? "h-8" : "h-9"
      )}
    >
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "relative flex h-full items-center gap-1.5 rounded-[7px] font-medium transition-colors",
            size === "sm" ? "px-2.5 text-[12px]" : "px-3 text-[12.5px]",
            value === o.id ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
            ring
          )}
        >
          {value === o.id && (
            <motion.span
              layoutId={`${id}-seg`}
              className="absolute inset-0 rounded-[7px] border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:border-neutral-700 dark:bg-neutral-800"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Terminal                                                                */
/* ----------------------------------------------------------------------- */

interface OutputLine {
  text: string;
  tone?: "ok" | "muted" | "file";
}

function TerminalPane({
  command,
  output,
  pm,
  setPm,
  showPm,
}: {
  command: string;
  output: OutputLine[];
  pm: PM;
  setPm: (p: PM) => void;
  showPm: boolean;
}) {
  const reduce = useReducedMotion();
  const { copied, copy } = useCopy();
  const [play, setPlay] = useState(0);
  useEffect(() => setPlay((p) => p + 1), [command]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 px-3 dark:border-neutral-800">
        <span className="flex items-center gap-2 pl-1 text-[12.5px] font-medium text-neutral-500 dark:text-neutral-400">
          <Terminal className="size-4" />
          Terminal
        </span>
        {showPm && (
          <Segmented size="sm" label="Package manager" value={pm} onChange={setPm} options={PMS.map((p) => ({ id: p, label: p }))} />
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 font-mono text-[12.5px] leading-6 [scrollbar-width:thin]">
        {/* command row */}
        <div className="group flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-3.5 pr-1.5 dark:border-neutral-800 dark:bg-neutral-900/60">
          <span className="select-none pt-px text-neutral-400 dark:text-neutral-600">$</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.code
              key={command}
              initial={{ opacity: 0, y: reduce ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{ duration: 0.2, ease: EASE }}
              className="min-w-0 flex-1 break-all pt-px text-left text-neutral-900 dark:text-neutral-100"
            >
              {command}
            </motion.code>
          </AnimatePresence>
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => copy(command)}
            aria-label={copied === command ? "Copied" : "Copy command"}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100",
              ring
            )}
          >
            <CopySwap on={copied === command} />
          </motion.button>
          <span className="sr-only" aria-live="polite">
            {copied === command ? "Command copied" : ""}
          </span>
        </div>

        {/* simulated output */}
        <motion.ol
          key={play}
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.16, delayChildren: reduce ? 0 : 0.15 } } }}
          className="flex flex-col"
          aria-label="What this command does"
        >
          {output.map((line, i) => (
            <motion.li
              key={`${play}-${i}`}
              variants={{ hidden: { opacity: 0, x: reduce ? 0 : -4 }, show: { opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE } } }}
              className={cn(
                "flex items-start gap-2 [overflow-wrap:anywhere]",
                line.tone === "file" && "pl-5 text-neutral-500 dark:text-neutral-400",
                line.tone === "muted" && "text-neutral-400 dark:text-neutral-600",
                (!line.tone || line.tone === "ok") && "text-neutral-700 dark:text-neutral-300"
              )}
            >
              {line.tone === "ok" && <Check className="mt-1 size-3.5 shrink-0 text-neutral-900 dark:text-neutral-100" strokeWidth={2.5} />}
              {line.tone === "file" && <FileCode2 className="mt-1 size-3.5 shrink-0" />}
              <span>{line.text}</span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Main                                                                    */
/* ----------------------------------------------------------------------- */

function MainInstallationSetupAndCLIGuide() {
  const reduce = useReducedMotion();
  const [platform, setPlatform] = useState<Platform>("web");
  const [stepIndex, setStepIndex] = useState(1);
  const [pm, setPm] = useState<PM>("npm");
  const [webPick, setWebPick] = useState(WEB_PICKS[0].name);
  const [mobilePick, setMobilePick] = useState(MOBILE_PICKS[0].name);
  const { copied, copy } = useCopy(2000);

  const steps = STEPS[platform];
  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const changePlatform = (p: Platform) => {
    setPlatform(p);
    setStepIndex(STEPS[p].findIndex((s) => s.id === "add"));
  };

  const web = WEB_PICKS.find((w) => w.name === webPick) ?? WEB_PICKS[0];
  const mobile = MOBILE_PICKS.find((m) => m.name === mobilePick) ?? MOBILE_PICKS[0];
  const item = useMemo(() => registryItems.find((r) => r.name === webPick), [webPick]);
  const registryUrl = `${REGISTRY_BASE}/r/${webPick}.json`;
  const docsHref = item?.files?.[0]
    ? `/docs/components/${webPick === "download-button" ? "buttons" : "micro-ai-components"}/${webPick}`
    : "/docs";

  /* what the right pane shows */
  const view = useMemo((): { type: "shell"; command: string; output: OutputLine[]; showPm: boolean } | { type: "code"; code: string; file: string; lang: string } => {
    if (platform === "web") {
      if (step.id === "init")
        return {
          type: "shell",
          showPm: true,
          command: `${RUNNER[pm]} shadcn@latest init`,
          output: [
            { text: "Detected Next.js + Tailwind CSS v4", tone: "ok" },
            { text: "Wrote components.json", tone: "ok" },
            { text: "Created lib/utils.ts (the cn helper)", tone: "ok" },
            { text: "Ready — add any component next.", tone: "muted" },
          ],
        };
      if (step.id === "add") {
        const deps = item?.dependencies ?? [];
        const files = (item?.files ?? []).map((f) => (typeof f === "string" ? f : f.path));
        const nested = (item?.registryDependencies ?? []).map((u) => u.split("/").pop()?.replace(".json", "")).filter(Boolean);
        return {
          type: "shell",
          showPm: true,
          command: `${RUNNER[pm]} shadcn@latest add ${registryUrl}`,
          output: [
            { text: `Resolved ${webPick} from the lokalhost registry`, tone: "ok" },
            ...(nested.length ? [{ text: `Also adding ${nested.join(", ")}`, tone: "ok" as const }] : []),
            ...(deps.length ? [{ text: `Installed ${deps.join(", ")}`, tone: "ok" as const }] : []),
            { text: `Created ${files.length} file${files.length === 1 ? "" : "s"}`, tone: "ok" },
            ...files.map((f) => ({ text: f, tone: "file" as const })),
          ],
        };
      }
      return { type: "code", code: web.usage, file: "app/page.tsx", lang: "tsx" };
    }
    if (platform === "react-native") {
      if (step.id === "registry") return { type: "code", code: RN_REGISTRY, file: "components.json", lang: "json" };
      if (step.id === "add")
        return {
          type: "shell",
          showPm: true,
          command: `${RUNNER[pm]} shadcn@latest add @lokalhost/${mobile.name}`,
          output: [
            { text: `Resolved @lokalhost/${mobile.name}`, tone: "ok" },
            { text: "Installed npm dependencies", tone: "ok" },
            { text: `Created components/ui/${mobile.name}.tsx`, tone: "ok" },
          ],
        };
      return {
        type: "code",
        file: "app/index.tsx",
        lang: "tsx",
        code: `import { ${mobile.rn} } from "@/components/ui/${mobile.name}";

export default function Screen() {
  return <${mobile.rn} />;
}`,
      };
    }
    if (step.id === "add")
      return {
        type: "shell",
        showPm: false,
        command: `npx lokalhost@latest add ${mobile.name} --flutter`,
        output: [
          { text: `Resolved ${mobile.name} (Flutter)`, tone: "ok" },
          { text: "Ran flutter pub add for required packages", tone: "ok" },
          { text: `Created lib/widgets/lk_${mobile.name.replace(/-/g, "_")}.dart`, tone: "ok" },
        ],
      };
    return {
      type: "code",
      file: "lib/main.dart",
      lang: "dart",
      code: `import 'widgets/lk_${mobile.name.replace(/-/g, "_")}.dart';

@override
Widget build(BuildContext context) {
  return ${mobile.dart}();
}`,
    };
  }, [platform, step.id, pm, item, registryUrl, webPick, web.usage, mobile]);

  const aiPrompt =
    platform === "web"
      ? `Add the "${webPick}" component from the lokalhost.io shadcn registry to this project. Run: npx shadcn@latest add ${registryUrl} — then import it where it fits and keep its Tailwind classes. Docs: ${REGISTRY_BASE}${docsHref}`
      : `Add the lokalhost.io ${platform === "flutter" ? "Flutter" : "React Native"} "${mobile.name}" component to this app following ${REGISTRY_BASE}/mobile/cli`;

  const showPicker = step.id === "add" || step.id === "use";

  return (
    <section className="container w-full max-w-[1580px] px-4 pt-16 font-sans sm:px-6 xl:px-0" aria-labelledby="install-guide-title">
      {/* header */}
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between text-left">
        <div className="max-w-xl">
          <span className="inline-flex text-left items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-widest text-neutral-500 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
            <Package className="size-3" /> Get started
          </span>
          <h2 id="install-guide-title" className="mt-3 text-2xl text-left font-semibold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100">
            Install in under a minute.
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-left text-neutral-500 dark:text-neutral-400">
            One command copies the source into your repo and installs what it needs. No package to update, no lock-in — the code is yours.
          </p>
        </div>
        <Segmented
          label="Platform"
          value={platform}
          onChange={changePlatform}
          options={PLATFORMS.map((p) => ({ id: p.id, label: <>{p.icon}{p.label}</> }))}
        />
      </div>

      {/* main card */}
      <div className="grid overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-24px_rgba(0,0,0,0.14)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        {/* steps */}
        <div className="flex flex-col border-b border-neutral-200 p-3 sm:p-4 lg:border-b-0 lg:border-r dark:border-neutral-800">
          <ol className="flex flex-col gap-1" aria-label="Installation steps">
            {steps.map((s, i) => {
              const active = s.id === step.id;
              const done = i < stepIndex;
              return (
                <li key={`${platform}-${s.id}`}>
                  <button
                    type="button"
                    onClick={() => setStepIndex(i)}
                    aria-current={active ? "step" : undefined}
                    className={cn("group relative flex w-full items-start gap-3.5 rounded-xl p-3 text-left transition-colors", !active && "hover:bg-neutral-50 dark:hover:bg-neutral-900/60", ring)}
                  >
                    {active && (
                      <motion.span
                        layoutId={reduce ? undefined : "install-step"}
                        className="absolute inset-0 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <span
                      className={cn(
                        "relative mt-px flex size-6 shrink-0 items-center justify-center rounded-full border text-[11.5px] font-semibold tabular-nums transition-colors",
                        active
                          ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                          : done
                            ? "border-neutral-300 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
                            : "border-neutral-200 bg-white text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-500"
                      )}
                    >
                      {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                    </span>
                    <span className="relative min-w-0 flex-1">
                      <span className={cn("block text-[14px] font-medium", active ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-300")}>
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-5 text-neutral-500 dark:text-neutral-400">{s.hint}</span>
                    </span>
                    <ChevronRight className={cn("relative mt-1 size-4 shrink-0 transition-all", active ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-300 group-hover:translate-x-0.5 dark:text-neutral-700")} />
                  </button>
                </li>
              );
            })}
          </ol>

          {/* component picker */}
          <AnimatePresence initial={false}>
            {showPicker && (
              <motion.div
                initial={{ gridTemplateRows: "0fr", opacity: 0 }}
                animate={{ gridTemplateRows: "1fr", opacity: 1 }}
                exit={{ gridTemplateRows: "0fr", opacity: 0, transition: { duration: 0.15 } }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
                className="grid"
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="mx-3 mt-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                    <p className="mb-2.5 text-[11px] font-medium tracking-wider text-neutral-400 dark:text-neutral-500">Pick a component</p>
                    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Component">
                      {(platform === "web" ? WEB_PICKS.map((w) => ({ name: w.name, label: w.label })) : MOBILE_PICKS).map((c) => {
                        const on = (platform === "web" ? webPick : mobilePick) === c.name;
                        return (
                          <motion.button
                            key={c.name}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => (platform === "web" ? setWebPick(c.name) : setMobilePick(c.name))}
                            className={cn(
                              "h-7 rounded-full border px-2.5 text-[12px] font-medium transition-colors duration-150",
                              on
                                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100",
                              ring
                            )}
                          >
                            {c.label}
                          </motion.button>
                        );
                      })}
                      {platform === "web" && (
                        <Link
                          href="/docs"
                          className={cn("inline-flex h-7 items-center gap-1 rounded-full px-2 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100", ring)}
                        >
                          All {registryItems.length}+ <ArrowRight className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* next / prev */}
          <div className="mt-auto flex items-center justify-between gap-2 px-3 pt-5">
            {PLATFORMS.find((p) => p.id === platform)?.preview ? (
              <p className="text-[12px] leading-5 text-neutral-500 dark:text-neutral-400">
                Mobile registry is in preview —{" "}
                <Link href="/mobile/cli" className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-800 dark:text-neutral-200 dark:decoration-neutral-700">
                  read the CLI notes
                </Link>
              </p>
            ) : (
              <span className="text-[12px] text-neutral-500 dark:text-neutral-400">
                Step {stepIndex + 1} of {steps.length}
              </span>
            )}
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setStepIndex((i) => (i + 1) % steps.length)}
              className={cn(
                "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 text-[12.5px] font-medium text-neutral-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-neutral-100",
                ring
              )}
            >
              {stepIndex === steps.length - 1 ? "Start over" : "Next step"}
              <ArrowRight className="size-3.5" />
            </motion.button>
          </div>
        </div>

        {/* right pane */}
        <div className="min-h-[380px] bg-white lg:h-[460px] dark:bg-neutral-950">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${platform}-${step.id}-${view.type}`}
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, ease: EASE }}
              className="h-full"
            >
              {view.type === "shell" ? (
                <TerminalPane command={view.command} output={view.output} pm={pm} setPm={setPm} showPm={view.showPm} />
              ) : (
                <div className="flex h-full flex-col p-4">
                  <CodeBlock code={view.code} fileName={view.file} language={view.lang} maxHeight={platform === "web" ? 340 : 300} className="w-full" />
                  {platform === "web" && step.id === "use" && (
                    <Link
                      href={docsHref}
                      className={cn("mt-3 inline-flex items-center gap-1 self-start text-[12.5px] font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100", ring)}
                    >
                      {web.label} docs — props, examples, accessibility <ArrowUpRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}

export default MainInstallationSetupAndCLIGuide;

"use client";

import * as React from "react";
import { Brain, Code2, FileSearch, Gauge, Lightbulb, PenLine, Zap } from "lucide-react";
import { Composer, type ComposerStatus, type ComposerModel } from "./prompt-composer";
import { Message, MessageList } from "../streaming-message/streaming-message";
import { mockStream, sleep } from "@/lib/mock-stream";

export const DEMO_MODELS: ComposerModel[] = [
  { id: "fast", label: "Fast", description: "Quick answers, everyday tasks", icon: <Zap /> },
  { id: "smart", label: "Smart", description: "Balanced quality and speed", icon: <Gauge /> },
  { id: "reasoning", label: "Reasoning", description: "Thinks longer on hard problems", icon: <Brain /> },
];

const SUGGESTIONS = [
  { label: "Build a landing page", value: "Build a landing page for a note-taking app with a hero, features and pricing.", icon: <Code2 /> },
  { label: "Summarize a PDF", value: "Summarize the attached PDF in five bullet points.", icon: <FileSearch /> },
  { label: "Brainstorm names", value: "Brainstorm ten short, memorable names for a developer tools startup.", icon: <Lightbulb /> },
  { label: "Polish my writing", value: "Rewrite this paragraph so it's clearer and more confident:", icon: <PenLine /> },
];

/** Fake upload with progress; files named "fail*" error so you can try Retry. */
async function fakeUpload(file: File, onProgress: (p: number) => void) {
  for (let p = 0.1; p <= 1; p += 0.15) {
    await sleep(120 + Math.random() * 120);
    onProgress(Math.min(1, p));
  }
  if (file.name.toLowerCase().startsWith("fail")) throw new Error("Upload failed");
}

/** Empty-state hero composer. */
export function ComposerHeroDemo() {
  const [status, setStatus] = React.useState<ComposerStatus>("idle");
  const [model, setModel] = React.useState("smart");
  const [history, setHistory] = React.useState<string[]>([]);
  const timer = React.useRef<number | null>(null);

  const send = (text: string) => {
    setHistory((h) => [...h, text]);
    setStatus("streaming");
    timer.current = window.setTimeout(() => setStatus("idle"), 3000);
  };
  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setStatus("idle");
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6 py-6 font-sans">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">What can I help you build?</h2>
        <p className="mt-1.5 text-[14px] text-muted-foreground">Drop files, paste images, or pick a starting point.</p>
      </div>
      <Composer className="w-full" status={status} onSubmit={send} onStop={stop} maxLength={4000} history={history} onUpload={fakeUpload}>
        <Composer.Attachments />
        <Composer.Input placeholder="Ask anything…" />
        <Composer.Toolbar>
          <Composer.AttachButton accept="image/*,.pdf,.txt,.md,.csv" />
          <Composer.ModelChip models={DEMO_MODELS} value={model} onChange={setModel} />
          <Composer.Spacer />
          <Composer.Counter />
          <Composer.Submit />
        </Composer.Toolbar>
        <Composer.Suggestions items={SUGGESTIONS} />
      </Composer>
    </div>
  );
}

type ChatMsg = { id: number; role: "user" | "assistant"; content: string; status: "pending" | "streaming" | "done" };

const REPLIES = [
  "Sure — here's a quick plan:\n\n1. **Hero** with a one-line promise and a primary CTA\n2. **Three features** with icons and short copy\n3. **Pricing** with a free tier\n\nWant me to generate the code?",
  "Good question. The short answer is *it depends on your traffic*, but for most apps a 300ms debounce and an `AbortController` cover 95% of cases.",
];

/** Composer pinned to the bottom of a chat. */
export function ComposerChatDemo() {
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    { id: 1, role: "user", content: "Can you help me plan a landing page?", status: "done" },
    { id: 2, role: "assistant", content: REPLIES[0], status: "done" },
  ]);
  const [status, setStatus] = React.useState<ComposerStatus>("idle");
  const abort = React.useRef<AbortController | null>(null);

  const send = async (text: string) => {
    const ctrl = new AbortController();
    abort.current = ctrl;
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", content: text, status: "done" }, { id: id + 1, role: "assistant", content: "", status: "pending" }]);
    setStatus("streaming");
    try {
      await sleep(600, ctrl.signal);
      for await (const t of mockStream(REPLIES[1], { wpm: 650, signal: ctrl.signal })) {
        setMessages((m) => m.map((x) => (x.id === id + 1 ? { ...x, content: x.content + t, status: "streaming" } : x)));
      }
    } catch {
      /* stopped */
    }
    setMessages((m) => m.map((x) => (x.id === id + 1 ? { ...x, status: "done" } : x)));
    setStatus("idle");
  };

  return (
    <div className="flex h-[480px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background font-sans shadow-sm">
      <MessageList className="flex-1" contentClassName="p-5">
        {messages.map((m) => (
          <Message key={m.id} role={m.role} status={m.status}>
            <Message.Content content={m.content} />
          </Message>
        ))}
      </MessageList>
      <div className="border-t border-border bg-muted/20 p-3">
        <Composer status={status} onSubmit={send} onStop={() => abort.current?.abort()}>
          <Composer.Attachments />
          <Composer.Input placeholder="Reply…" />
          <Composer.Toolbar>
            <Composer.AttachButton />
            <Composer.ModelChip models={DEMO_MODELS} defaultValue="fast" />
            <Composer.Spacer />
            <Composer.Submit />
          </Composer.Toolbar>
        </Composer>
      </div>
    </div>
  );
}

export default function PromptComposerDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <ComposerHeroDemo />
      <ComposerChatDemo />
    </div>
  );
}

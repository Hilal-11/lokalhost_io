"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Reasoning, type ReasoningStep } from "./reasoning-panel";
import { Message } from "../streaming-message/streaming-message";
import { mockStream, sleep } from "@/lib/mock-stream";
import { DemoBar, DemoButton, DemoFrame, Segmented } from "../_demo/controls";

const REASONING = `Let me break this down. The user wants to cache API responses in a Next.js app.

First, what kind of data is it? Product listings change maybe once an hour, so a time-based revalidation fits better than on-demand.

Options: fetch cache with \`next.revalidate\`, \`unstable_cache\` for non-fetch work, or a CDN header. The fetch cache is the least code and already deduped per request.

Edge case: personalised data must never be cached at the route level — keep that dynamic.

So: recommend \`revalidate: 3600\` on the fetch, tag it, and call \`revalidateTag\` from the admin mutation.`;

const ANSWER = `Use the built-in **fetch cache** with a one-hour window and a tag you can bust on demand:

\`\`\`ts
const res = await fetch(url, { next: { revalidate: 3600, tags: ["products"] } });
\`\`\`

Then call \`revalidateTag("products")\` from the server action that edits products. Keep anything personalised dynamic.`;

const STEP_TITLES = ["Reading the question", "Searching the docs", "Comparing caching options", "Checking edge cases", "Drafting the answer"];

export default function ReasoningPanelDemo() {
  const [mode, setMode] = React.useState<"text" | "steps">("text");
  const [autoCollapse, setAutoCollapse] = React.useState(true);
  const [run, setRun] = React.useState(0);
  const [thinking, setThinking] = React.useState(false);
  const [reasoning, setReasoning] = React.useState("");
  const [steps, setSteps] = React.useState<ReasoningStep[]>([]);
  const [answer, setAnswer] = React.useState("");
  const [answerStatus, setAnswerStatus] = React.useState<"pending" | "streaming" | "done">("pending");

  React.useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;
    (async () => {
      setReasoning("");
      setAnswer("");
      setAnswerStatus("pending");
      setSteps(STEP_TITLES.map((title, i) => ({ id: title, title, status: i === 0 ? "active" : "pending" })));
      setThinking(true);
      try {
        if (mode === "text") {
          // ~6s of thinking
          for await (const t of mockStream(REASONING, { wpm: 1000, jitter: 0.5, signal })) setReasoning((r) => r + t);
        } else {
          for (let i = 0; i < STEP_TITLES.length; i++) {
            await sleep(1200, signal);
            setSteps((s) => s.map((st, j) => ({ ...st, status: j <= i ? "done" : j === i + 1 ? "active" : "pending" })));
          }
        }
        setThinking(false);
        await sleep(350, signal);
        for await (const t of mockStream(ANSWER, { wpm: 700, jitter: 0.4, signal })) {
          setAnswerStatus("streaming");
          setAnswer((a) => a + t);
        }
        setAnswerStatus("done");
      } catch {
        /* aborted */
      }
    })();
    return () => ctrl.abort();
  }, [run, mode]);

  return (
    <DemoFrame className="max-w-xl">
      <div className="flex min-h-[380px] flex-col gap-3">
        <Reasoning key={`${run}-${mode}`} isStreaming={thinking} autoCollapse={autoCollapse} steps={mode === "steps" ? steps : undefined}>
          <Reasoning.Trigger />
          <Reasoning.Content>{reasoning}</Reasoning.Content>
        </Reasoning>
        {(answer || !thinking) && (
          <Message status={answerStatus} avatar={null}>
            <Message.Content content={answer} />
          </Message>
        )}
      </div>
      <DemoBar>
        <DemoButton onClick={() => setRun((r) => r + 1)}>
          <RotateCcw className="size-3.5" /> Replay
        </DemoButton>
        <DemoButton active={autoCollapse} onClick={() => setAutoCollapse((v) => !v)}>
          Auto-collapse
        </DemoButton>
        <Segmented label="Content mode" value={mode} onChange={setMode} options={["text", "steps"] as const} />
      </DemoBar>
    </DemoFrame>
  );
}

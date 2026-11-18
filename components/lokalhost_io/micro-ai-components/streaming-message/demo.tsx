"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Message, MessageList, type MessageStatus, type StreamAnimation } from "./streaming-message";
import { mockStream, sleep } from "@/lib/mock-stream";
import { DemoBar, DemoButton, DemoFrame, Segmented } from "../_demo/controls";

export const DEMO_QUESTION = "How should I debounce a search input in React without extra libraries?";

export const DEMO_ANSWER = `## Debouncing a search input

Debouncing waits until the user **stops typing** for a moment before running the expensive work — usually a network request. In React, the cleanest approach is a tiny hook built on \`useEffect\` and a timer.

### Why it matters

- Fewer requests: one call per pause instead of one per keystroke
- Less flicker: results don't jump around while the user is still typing
- Lower cost: rate-limited APIs and AI endpoints stay well under quota

### A reusable hook

\`\`\`ts
import { useEffect, useState } from "react";

export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // reset on every keystroke
  }, [value, delay]);

  return debounced;
}
\`\`\`

Use it by keeping the raw input in state and fetching only when the debounced value changes. Pair it with an \`AbortController\` so a slow, stale response can never overwrite a newer one.

### Picking a delay

| Delay | Feels like | Good for |
| --- | --- | --- |
| 150ms | Instant | Local filtering |
| 300ms | Responsive | Search APIs |
| 500ms | Deliberate | Expensive AI calls |

Start at **300ms** and adjust after watching real users type. If results must update on every key, consider throttling instead.`;

export default function StreamingMessageDemo() {
  const [run, setRun] = React.useState(0);
  const [animation, setAnimation] = React.useState<StreamAnimation>("fade");
  const [failNext, setFailNext] = React.useState(false);
  const [text, setText] = React.useState("");
  const [status, setStatus] = React.useState<MessageStatus>("pending");

  React.useEffect(() => {
    const ctrl = new AbortController();
    const shouldFail = failNext;
    (async () => {
      setText("");
      setStatus("pending");
      try {
        await sleep(700, ctrl.signal);
        let count = 0;
        for await (const t of mockStream(DEMO_ANSWER, { wpm: 600, jitter: 0.5, signal: ctrl.signal })) {
          setStatus("streaming");
          setText((s) => s + t);
          if (shouldFail && ++count > 70) throw new Error("network");
        }
        setStatus("done");
      } catch (err) {
        if (!ctrl.signal.aborted) {
          setStatus("error");
          setFailNext(false);
        }
        void err;
      }
    })();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return (
    <DemoFrame className="max-w-2xl">
      <MessageList className="h-[460px] rounded-xl border border-border bg-background" contentClassName="p-5">
        <Message role="user">
          <Message.Content content={DEMO_QUESTION} />
        </Message>
        <Message status={status} name="Assistant" timestamp="Just now">
          <Message.Content content={text} animation={animation} />
          <Message.Error onRetry={() => setRun((r) => r + 1)} />
        </Message>
      </MessageList>
      <DemoBar>
        <DemoButton onClick={() => setRun((r) => r + 1)}>
          <RotateCcw className="size-3.5" /> Replay
        </DemoButton>
        <Segmented label="Word animation" value={animation} onChange={setAnimation} options={["fade", "blur", "none"] as const} />
        <DemoButton
          onClick={() => {
            setFailNext(true);
            setRun((r) => r + 1);
          }}
        >
          <AlertCircle className="size-3.5" /> Simulate error
        </DemoButton>
      </DemoBar>
    </DemoFrame>
  );
}

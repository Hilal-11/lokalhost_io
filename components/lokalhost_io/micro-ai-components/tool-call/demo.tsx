"use client";

import * as React from "react";
import { FileText, Globe, Mail, RotateCcw } from "lucide-react";
import { ToolCall, ToolCallGroup, type ToolCallStatus } from "./tool-call";
import { DemoBar, DemoButton } from "../_demo/controls";

type Call = {
  id: string;
  name: string;
  title: string;
  icon: typeof Globe;
  status: ToolCallStatus;
  input: unknown;
  output?: unknown;
  error?: string;
  startedAt?: number;
  endedAt?: number;
};

const RESULTS = [
  { title: "Caching and Revalidating — Next.js Docs", url: "nextjs.org/docs/app/building-your-application/caching", snippet: "Next.js improves performance by caching rendering work and data requests." },
  { title: "unstable_cache API Reference", url: "nextjs.org/docs/app/api-reference/functions/unstable_cache", snippet: "Cache the results of expensive operations like database queries." },
  { title: "Understanding the fetch cache", url: "vercel.com/guides/fetch-cache", snippet: "How tags and revalidate work together across deployments." },
];

const initial = (): Call[] => [
  {
    id: "search",
    name: "search_web",
    title: "Searching the web",
    icon: Globe,
    status: "pending",
    input: { query: "next.js fetch cache revalidate tags", max_results: 3, recency: "year" },
  },
  {
    id: "read",
    name: "read_file",
    title: "Reading app/products/page.tsx",
    icon: FileText,
    status: "pending",
    input: { path: "app/products/page.tsx", encoding: "utf-8" },
  },
  {
    id: "email",
    name: "send_email",
    title: "Send summary to the team",
    icon: Mail,
    status: "pending",
    input: { to: ["team@example.com"], subject: "Caching plan for /products", body: { sections: ["Problem", "Proposal", "Rollout"], attachments: 0 } },
  },
];

function SearchResults({ output }: { output: unknown }) {
  const items = (output as { results: typeof RESULTS }).results;
  return (
    <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
      {items.map((r) => (
        <li key={r.url} className="flex flex-col gap-0.5 bg-background px-3 py-2.5">
          <span className="text-[13px] font-medium text-foreground">{r.title}</span>
          <span className="truncate font-mono text-[11.5px] text-muted-foreground">{r.url}</span>
          <span className="text-[12.5px] text-muted-foreground">{r.snippet}</span>
        </li>
      ))}
    </ul>
  );
}

const STATUSES: ToolCallStatus[] = ["pending", "running", "success", "error", "awaiting-approval", "cancelled"];

export default function ToolCallDemo() {
  const [calls, setCalls] = React.useState<Call[]>(initial);
  const [run, setRun] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  const patch = React.useCallback((id: string, p: Partial<Call>) => setCalls((cs) => cs.map((c) => (c.id === id ? { ...c, ...p } : c))), []);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  React.useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setCalls(initial());
    const t0 = Date.now();
    later(300, () => patch("search", { status: "running", startedAt: Date.now() }));
    later(2300, () => patch("search", { status: "success", endedAt: Date.now(), output: { results: RESULTS } }));
    later(2600, () => patch("read", { status: "running", startedAt: Date.now() }));
    later(3700, () => patch("read", { status: "error", endedAt: Date.now(), error: "ENOENT: file not found (the agent guessed the wrong path)" }));
    void t0;
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const retryRead = () => {
    patch("read", { status: "running", startedAt: Date.now(), endedAt: undefined, error: undefined, input: { path: "app/(shop)/products/page.tsx", encoding: "utf-8" } });
    later(1100, () => {
      patch("read", { status: "success", endedAt: Date.now(), output: { lines: 48, exports: ["default", "revalidate"], preview: "export const revalidate = 60;\nexport default async function Page() { … }" } });
      later(500, () => patch("email", { status: "awaiting-approval" }));
    });
  };

  const approve = () =>
    new Promise<void>((resolve) => {
      later(500, () => {
        patch("email", { status: "running", startedAt: Date.now() });
        resolve();
        later(1300, () => patch("email", { status: "success", endedAt: Date.now(), output: { id: "msg_8f2c", delivered: true } }));
      });
    });

  return (
    <div className="flex w-full max-w-xl flex-col gap-5 font-sans">
      <div className="flex flex-col gap-3">
        <div className="self-end rounded-2xl rounded-br-md border border-border/60 bg-muted px-4 py-2.5 text-[14px] text-foreground">
          Find how to cache /products, check our page file, then email the team.
        </div>
        <ToolCallGroup>
          {calls.map((c) => (
            <ToolCall
              key={c.id}
              name={c.name}
              title={c.title}
              icon={c.icon}
              status={c.status}
              input={c.input}
              output={c.output}
              error={c.error}
              startedAt={c.startedAt}
              endedAt={c.endedAt}
              defaultOpen={c.id === "search"}
              renderOutput={c.id === "search" ? (o) => <SearchResults output={o} /> : undefined}
              onRetry={c.id === "read" ? retryRead : undefined}
              approvalDescription={c.id === "email" ? "Sends one email to team@example.com with the caching plan. This can't be undone." : undefined}
              onApprove={c.id === "email" ? approve : undefined}
              onDeny={c.id === "email" ? () => patch("email", { status: "cancelled" }) : undefined}
            />
          ))}
        </ToolCallGroup>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Manual status</span>
          <DemoButton onClick={() => setRun((r) => r + 1)}>
            <RotateCcw className="size-3.5" /> Replay
          </DemoButton>
        </div>
        {calls.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-1.5">
            <code className="w-24 shrink-0 font-mono text-[11.5px] text-muted-foreground">{c.name}</code>
            <DemoBar className="justify-start">
              {STATUSES.map((s) => (
                <DemoButton
                  key={s}
                  active={c.status === s}
                  className="h-7 px-2 text-[11.5px]"
                  onClick={() =>
                    patch(c.id, {
                      status: s,
                      startedAt: s === "pending" || s === "awaiting-approval" ? undefined : c.startedAt ?? Date.now() - 1200,
                      endedAt: s === "running" ? undefined : s === "pending" || s === "awaiting-approval" ? undefined : Date.now(),
                      error: s === "error" ? "Simulated failure" : undefined,
                    })
                  }
                >
                  {s}
                </DemoButton>
              ))}
            </DemoBar>
          </div>
        ))}
      </div>
    </div>
  );
}

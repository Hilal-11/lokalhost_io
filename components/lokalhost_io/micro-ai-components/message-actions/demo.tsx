"use client";

import * as React from "react";
import { Bookmark, Flag, Pencil } from "lucide-react";
import { MessageActions, BranchSwitcher, BranchContent, type FeedbackValue } from "./message-actions";
import { Message } from "../streaming-message/streaming-message";

const VERSIONS = [
  "A **monorepo** keeps every package in one repository, so shared types and tooling stay in sync and refactors land in a single commit.",
  "Think of a monorepo as one big workspace: apps and libraries live side by side, use the same lint and test setup, and can change together atomically.",
  "Use a monorepo when your packages ship together. If teams release on independent schedules, separate repos with published packages may be simpler.",
];

const FIRST = "React Server Components run on the server and send a serialized tree to the client, so **no JavaScript ships** for them unless they render a client component.";
const LATEST = "To share state between server and client components, keep it in the URL (search params) or pass serializable props down. Client-only state lives in a client component near the leaf.";

const MODELS = [
  { id: "fast", label: "Fast", description: "Quicker, shorter" },
  { id: "smart", label: "Smart", description: "Balanced" },
  { id: "reasoning", label: "Reasoning", description: "Thinks longer" },
];

export default function MessageActionsDemo() {
  const [log, setLog] = React.useState<string[]>([]);
  const [branch, setBranch] = React.useState(1);
  const [regenerating, setRegenerating] = React.useState(false);
  const push = (line: string) => setLog((l) => [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}  ${line}`, ...l].slice(0, 6));

  const onFeedback = (v: FeedbackValue, reason?: string, comment?: string) =>
    push(`feedback → ${v ?? "cleared"}${reason ? ` · ${reason}` : ""}${comment ? ` · "${comment}"` : ""}`);

  const regenerate = (model?: string) => {
    setRegenerating(true);
    push(`regenerate${model ? ` with ${model}` : ""}`);
    window.setTimeout(() => setRegenerating(false), 1400);
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8 font-sans">
      {/* 1 — hover visibility */}
      <Message>
        <Message.Content content={FIRST} />
        <MessageActions visibility="hover" className="-ml-2 mt-1">
          <MessageActions.Copy text={FIRST} onCopy={(_, f) => push(`copy (${f})`)} />
          <MessageActions.Feedback onFeedback={onFeedback} />
          <MessageActions.Regenerate onRegenerate={regenerate} />
        </MessageActions>
      </Message>

      {/* 2 — three branches */}
      <Message>
        <BranchContent current={branch}>
          <Message.Content content={VERSIONS[branch - 1]} />
        </BranchContent>
        <div className="-ml-2 mt-1 flex items-center gap-1">
          <BranchSwitcher current={branch} total={VERSIONS.length} onChange={(n) => { setBranch(n); push(`branch → ${n}/${VERSIONS.length}`); }} />
          <MessageActions visibility="hover">
            <MessageActions.Copy text={VERSIONS[branch - 1]} onCopy={(_, f) => push(`copy (${f})`)} />
            <MessageActions.Feedback onFeedback={onFeedback} />
          </MessageActions>
        </div>
      </Message>

      {/* 3 — latest, always visible */}
      <Message>
        <Message.Content content={LATEST} />
        <MessageActions visibility="always" className="-ml-2 mt-1">
          <MessageActions.Copy text={LATEST} onCopy={(_, f) => push(`copy (${f})`)} />
          <MessageActions.Regenerate onRegenerate={regenerate} regenerating={regenerating} models={MODELS} />
          <MessageActions.Feedback onFeedback={onFeedback} />
          <MessageActions.Speak text={LATEST} />
          <MessageActions.Share onShare={() => push("share")} />
          <MessageActions.More
            items={[
              { label: "Edit response", icon: <Pencil />, onSelect: () => push("edit") },
              { label: "Save to notes", icon: <Bookmark />, onSelect: () => push("save") },
              { label: "Report", icon: <Flag />, onSelect: () => push("report"), destructive: true },
            ]}
          />
        </MessageActions>
      </Message>

      {/* console */}
      <div className="rounded-xl border border-border bg-muted/30">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Events</span>
          <button type="button" onClick={() => setLog([])} className="text-[11.5px] text-muted-foreground transition-colors hover:text-foreground">
            Clear
          </button>
        </div>
        <ol className="h-[132px] overflow-hidden px-3 py-2 font-mono text-[12px] leading-5 text-muted-foreground" aria-live="polite">
          {log.length === 0 ? <li className="text-muted-foreground/60">Hover a message and try the actions…</li> : log.map((l, i) => <li key={`${l}-${i}`} className={i === 0 ? "text-foreground" : undefined}>{l}</li>)}
        </ol>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  Bell,
  Calendar,
  FilePlus2,
  FolderOpen,
  Github,
  LayoutDashboard,
  LogOut,
  Moon,
  Search,
  Settings,
  Share2,
  UserPlus,
} from "lucide-react";
import { AICommandPalette, InlineAI, Kbd, type InlineAIAction, type PaletteCommand } from "./ai-command";
import { mockStream, sleep } from "@/lib/mock-stream";

const noop = () => undefined;

const COMMANDS: PaletteCommand[] = [
  { id: "new-doc", label: "New document", icon: <FilePlus2 />, shortcut: ["⌘", "N"], group: "Create", onSelect: noop },
  { id: "new-project", label: "New project", icon: <FolderOpen />, group: "Create", onSelect: noop },
  { id: "invite", label: "Invite teammate", icon: <UserPlus />, group: "Create", keywords: ["share", "member"], onSelect: noop },
  { id: "schedule", label: "Schedule meeting", icon: <Calendar />, group: "Create", onSelect: noop },
  { id: "dashboard", label: "Go to dashboard", icon: <LayoutDashboard />, shortcut: ["G", "D"], group: "Navigate", onSelect: noop },
  { id: "search-files", label: "Search files", icon: <Search />, shortcut: ["⌘", "P"], group: "Navigate", onSelect: noop },
  { id: "notifications", label: "Open notifications", icon: <Bell />, group: "Navigate", onSelect: noop },
  { id: "repo", label: "Open GitHub repository", icon: <Github />, group: "Navigate", onSelect: noop },
  { id: "theme", label: "Toggle dark mode", icon: <Moon />, shortcut: ["⌘", "J"], group: "Settings", keywords: ["theme", "light"], onSelect: noop },
  { id: "settings", label: "Open settings", icon: <Settings />, shortcut: ["⌘", ","], group: "Settings", onSelect: noop },
  { id: "share", label: "Share workspace", icon: <Share2 />, group: "Settings", onSelect: noop },
  { id: "logout", label: "Log out", icon: <LogOut />, group: "Settings", onSelect: noop },
];

async function* ask(query: string) {
  await sleep(500);
  const answer = `Here's a quick take on **“${query}”**:

- Start with the smallest version that proves the idea.
- Measure one number that tells you it works — for most features that's activation, not sign-ups.
- Ship it behind a flag, watch real usage for a week, then decide.

Want me to turn this into a checklist?`;
  yield* mockStream(answer, { wpm: 700 });
}

const SAMPLE =
  "Our new dashboard have a lot of improvments that makes it more faster and also more easier to use for the teams, and we think that you will really like the way it is looking now.";

const REWRITES: Record<string, (t: string) => string> = {
  shorter: () => "The new dashboard is faster and easier for teams to use.",
  "fix-grammar": () =>
    "Our new dashboard has a lot of improvements that make it faster and easier for teams to use, and we think you'll really like how it looks now.",
  improve: () => "The redesigned dashboard is noticeably faster and simpler for teams — and we think you'll love the new look.",
  longer: (t) => `${t.replace(/\.$/, "")}. Pages load in under a second, navigation is grouped by task, and every chart can be shared with one click.`,
  tone: () => "Good news: the new dashboard is faster, friendlier and built around how your team actually works.",
  translate: () => "Nuestro nuevo panel es más rápido y fácil de usar para los equipos, y creemos que te encantará su nuevo aspecto.",
};

async function* rewrite(action: InlineAIAction, text: string, instruction?: string) {
  await sleep(350);
  const out = action === "custom" ? `${text.replace(/\.$/, "")} (${instruction?.toLowerCase()}).` : (REWRITES[action] ?? REWRITES.improve)(text);
  yield* mockStream(out, { wpm: 900 });
}

export function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false);
  const [inserted, setInserted] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-3 font-sans">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-[300px] items-center gap-2.5 rounded-xl border border-border bg-background px-3 text-[13.5px] text-muted-foreground shadow-sm transition-colors hover:bg-accent/60 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search or ask AI…</span>
        <span className="flex gap-1">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>
      <p className="text-[12.5px] text-muted-foreground">Try “invite”, or type a question and press Tab.</p>
      {inserted && <p className="max-w-sm truncate text-[12px] text-muted-foreground">Inserted: {inserted}</p>}
      <AICommandPalette open={open} onOpenChange={setOpen} commands={COMMANDS} onAsk={ask} onInsert={(t) => setInserted(t.slice(0, 80))} />
    </div>
  );
}

export function InlineAIDemo() {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState(SAMPLE);
  return (
    <div className="flex w-full max-w-xl flex-col gap-2 font-sans">
      <label htmlFor="inline-ai-demo" className="text-[12.5px] font-medium text-muted-foreground">
        Select some text, then press <Kbd>⌘</Kbd> <Kbd>J</Kbd> or click “Ask AI”.
      </label>
      <textarea
        id="inline-ai-demo"
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={5}
        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-[14.5px] leading-7 text-foreground shadow-sm outline-none transition-colors focus:border-foreground/40"
      />
      <div className="flex justify-end">
        <button type="button" onClick={() => setValue(SAMPLE)} className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">
          Reset text
        </button>
      </div>
      <InlineAI targetRef={ref} onRun={rewrite} />
    </div>
  );
}

export default function AICommandDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-12">
      <CommandPaletteDemo />
      <InlineAIDemo />
    </div>
  );
}

"use client";

import * as React from "react";
import { RotateCcw, RotateCw } from "lucide-react";
import { AgentPlan, type PlanStep } from "./agent-plan";
import { DemoBar, DemoButton, Segmented } from "../_demo/controls";

const base = (): PlanStep[] => [
  { id: "research", title: "Research competitors", description: "Scan five landing pages in the same category for structure and messaging.", status: "todo", substeps: [
    { id: "r1", title: "Collect URLs", status: "todo" },
    { id: "r2", title: "Extract section layout", status: "todo" },
    { id: "r3", title: "Summarise positioning", status: "todo" },
  ] },
  { id: "copy", title: "Draft hero copy", description: "Three headline options with supporting subtext.", status: "todo" },
  { id: "design", title: "Generate layout", description: "Hero, feature grid, social proof and pricing sections.", status: "todo", substeps: [
    { id: "d1", title: "Hero section", status: "todo" },
    { id: "d2", title: "Feature grid", status: "todo" },
    { id: "d3", title: "Pricing table", status: "todo" },
  ] },
  { id: "images", title: "Create illustrations", status: "todo" },
  { id: "build", title: "Build components", description: "React + Tailwind, responsive down to 375px.", status: "todo" },
  { id: "deploy", title: "Deploy preview", status: "todo" },
];

export default function AgentPlanDemo() {
  const [steps, setSteps] = React.useState<PlanStep[]>(base);
  const [variant, setVariant] = React.useState<"vertical" | "compact">("vertical");
  const [run, setRun] = React.useState(0);
  const timers = React.useRef<number[]>([]);

  const set = React.useCallback((id: string, patch: Partial<PlanStep>, sub?: { id: string; status: PlanStep["status"] }) => {
    setSteps((list) =>
      list.map((s) =>
        s.id !== id ? s : { ...s, ...patch, substeps: sub ? s.substeps?.map((x) => (x.id === sub.id ? { ...x, status: sub.status } : x)) : patch.substeps ?? s.substeps }
      )
    );
  }, []);

  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const continueFrom = React.useCallback((start: number) => {
    const t = (ms: number) => start + ms;
    at(t(0), () => set("images", { status: "active", startedAt: Date.now() }));
    at(t(1200), () => set("images", { status: "done", endedAt: Date.now() }));
    at(t(1300), () => set("build", { status: "active", startedAt: Date.now() }));
    at(t(3000), () => set("build", { status: "done", endedAt: Date.now() }));
    at(t(3100), () => set("a11y", { status: "active", startedAt: Date.now() }));
    at(t(4000), () => set("a11y", { status: "done", endedAt: Date.now() }));
    at(t(4100), () => set("deploy", { status: "active", startedAt: Date.now() }));
    at(t(5200), () => set("deploy", { status: "done", endedAt: Date.now() }));
  }, [set]);

  const retry = React.useCallback(() => {
    set("images", { status: "todo", meta: undefined });
    continueFrom(200);
  }, [set, continueFrom]);

  React.useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setSteps(base());
    at(300, () => set("research", { status: "active", startedAt: Date.now() }, { id: "r1", status: "active" }));
    at(900, () => set("research", {}, { id: "r1", status: "done" }));
    at(950, () => set("research", {}, { id: "r2", status: "active" }));
    at(1600, () => set("research", {}, { id: "r2", status: "done" }));
    at(1650, () => set("research", {}, { id: "r3", status: "active" }));
    at(2300, () => set("research", { status: "done", endedAt: Date.now() }, { id: "r3", status: "done" }));
    at(2400, () => set("copy", { status: "active", startedAt: Date.now() }));
    at(3800, () => set("copy", { status: "done", endedAt: Date.now() }));
    at(3900, () => set("design", { status: "active", startedAt: Date.now() }, { id: "d1", status: "active" }));
    at(4600, () => set("design", {}, { id: "d1", status: "done" }));
    // the agent re-plans: inserts an accessibility pass before deploying
    at(4800, () =>
      setSteps((list) => {
        const i = list.findIndex((s) => s.id === "deploy");
        const next = [...list];
        next.splice(i, 0, { id: "a11y", title: "Accessibility pass", description: "Added by the agent after reviewing the layout.", status: "todo" });
        return next;
      })
    );
    at(4700, () => set("design", {}, { id: "d2", status: "active" }));
    at(5400, () => set("design", {}, { id: "d2", status: "done" }));
    at(5450, () => set("design", {}, { id: "d3", status: "active" }));
    at(6200, () => set("design", { status: "done", endedAt: Date.now() }, { id: "d3", status: "done" }));
    at(6300, () => set("images", { status: "active", startedAt: Date.now() }));
    at(7600, () =>
      set("images", {
        status: "failed",
        endedAt: Date.now(),
        meta: (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/[0.06] px-2.5 py-2 text-[12.5px] text-destructive">
            <span className="flex-1">Image model timed out after 60s.</span>
            <DemoButton className="h-7 px-2 text-[12px]" onClick={() => retryRef.current()}>
              <RotateCw className="size-3" /> Retry from here
            </DemoButton>
          </div>
        ),
      })
    );
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const retryRef = React.useRef(retry);
  retryRef.current = retry;

  return (
    <div className="flex w-full max-w-lg flex-col gap-5 font-sans">
      <AgentPlan title="Building your landing page" steps={steps} variant={variant} />
      <DemoBar>
        <DemoButton onClick={() => setRun((r) => r + 1)}>
          <RotateCcw className="size-3.5" /> Replay
        </DemoButton>
        <Segmented label="Variant" value={variant} onChange={setVariant} options={["vertical", "compact"] as const} />
      </DemoBar>
    </div>
  );
}

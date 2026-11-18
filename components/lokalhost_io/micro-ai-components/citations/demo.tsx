"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { CitationProvider, MarkdownCitation, SourcesStrip, remarkCitations, type CitationDisplay, type CitationSource } from "./citations";
import { Markdown } from "../streaming-message/markdown";
import { mockStream, sleep } from "@/lib/mock-stream";
import { DemoBar, DemoButton, Segmented } from "../_demo/controls";
import type { Components } from "react-markdown";

export const DEMO_SOURCES: CitationSource[] = [
  {
    id: "s1",
    url: "https://en.wikipedia.org/wiki/Honey_bee",
    title: "Honey bee — Wikipedia",
    snippet: "A honey bee colony typically contains one queen, a few hundred drones and tens of thousands of worker bees that forage, build comb and tend the brood.",
    highlight: "tens of thousands of worker bees",
    publishedAt: "2026-09-12",
  },
  {
    id: "s2",
    url: "https://www.nationalgeographic.com/animals/invertebrates/facts/honeybee",
    title: "Honeybee facts and photos",
    snippet: "Honeybees communicate the location of flowers through the waggle dance, encoding direction relative to the sun and distance in the dance's duration.",
    highlight: "waggle dance",
    publishedAt: "2025-04-03",
    author: "National Geographic",
  },
  {
    id: "s3",
    url: "https://www.nature.com/articles/honeybee-navigation",
    title: "How bees use polarised light to navigate",
    snippet: "Foragers rely on patterns of polarised skylight to keep a heading even when the sun itself is hidden behind clouds.",
    highlight: "polarised skylight",
    publishedAt: "2024-11-20",
  },
  {
    id: "s4",
    url: "https://www.fao.org/pollination/en",
    title: "Pollinators and food security",
    snippet: "Around three quarters of the world's leading food crops benefit to some degree from animal pollination, with bees the most important group.",
    highlight: "three quarters of the world's leading food crops",
    publishedAt: "2025-01-15",
  },
  {
    id: "s5",
    url: "https://www.usda.gov/pollinators",
    title: "Pollinator health — USDA",
    snippet: "Colony losses are driven by a mix of parasites such as Varroa mites, pesticide exposure, poor nutrition and habitat loss.",
    highlight: "Varroa mites",
    publishedAt: "2026-02-08",
  },
  {
    id: "s6",
    url: "https://www.smithsonianmag.com/science-nature/bees-honey",
    title: "Why honey never spoils",
    snippet: "Its low moisture, acidity and a little hydrogen peroxide from bee enzymes make honey hostile to bacteria, so sealed jars last for centuries.",
    highlight: "hostile to bacteria",
    publishedAt: "2023-07-30",
  },
];

const ANSWER = `Honey bees live in highly organised colonies: one queen, a few hundred drones and **tens of thousands of workers** [1]. Workers share where flowers are through the *waggle dance*, which encodes direction and distance [2], and they keep their bearing using polarised light even on cloudy days [3].

They matter far beyond honey — about three quarters of leading food crops benefit from animal pollination, with bees the most important group [4]. Colony losses come from several pressures at once, including Varroa mites and pesticides [5, 4].

And the honey itself? Low moisture and natural acidity make it hostile to bacteria, so it can last for centuries [6].`;

const REMARK = [remarkCitations];
const COMPONENTS = { citation: MarkdownCitation } as unknown as Components;

export default function CitationsDemo() {
  const [display, setDisplay] = React.useState<CitationDisplay>("number");
  const [run, setRun] = React.useState(0);
  const [text, setText] = React.useState("");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      setText("");
      setDone(false);
      try {
        await sleep(300, ctrl.signal);
        for await (const t of mockStream(ANSWER, { wpm: 650, signal: ctrl.signal })) setText((s) => s + t);
        setDone(true);
      } catch {
        /* aborted */
      }
    })();
    return () => ctrl.abort();
  }, [run]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-5 font-sans">
      <CitationProvider key={run} sources={DEMO_SOURCES} display={display}>
        <div className="flex flex-col gap-4">
          <p className="text-[13px] font-medium text-muted-foreground">Why are honey bees so important?</p>
          <Markdown content={text} streaming={!done} remarkPlugins={REMARK} components={COMPONENTS} />
          <SourcesStrip show={done} max={4} />
        </div>
      </CitationProvider>
      <DemoBar>
        <DemoButton onClick={() => setRun((r) => r + 1)}>
          <RotateCcw className="size-3.5" /> Replay
        </DemoButton>
        <Segmented label="Chip display" value={display} onChange={setDisplay} options={["number", "domain"] as const} />
      </DemoBar>
    </div>
  );
}

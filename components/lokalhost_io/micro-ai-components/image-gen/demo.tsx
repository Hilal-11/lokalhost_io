"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { ImageGen, ImageGenGrid, type ImageAspect, type ImageGenProps, type ImageReveal } from "./image-gen";
import { DemoBar, Segmented } from "../_demo/controls";

const DIMS: Record<ImageAspect, [number, number]> = { "1:1": [800, 800], "4:3": [960, 720], "16:9": [1120, 630], "9:16": [630, 1120] };
const picsum = (seed: string, a: ImageAspect, blur = false) => {
  const [w, h] = DIMS[a];
  return blur ? `https://picsum.photos/seed/${seed}/${Math.round(w / 10)}/${Math.round(h / 10)}?blur=2` : `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

type Gen = Pick<ImageGenProps, "status" | "progress" | "src" | "previewSrc" | "eta">;

/** Drives a fake generation: queued → generating (progress, ETA, previews) → done / error. */
function useFakeGeneration(seed: string, aspect: ImageAspect, run: number, opts: { delay?: number; duration?: number; fail?: boolean } = {}) {
  const { delay = 0, duration = 6000, fail = false } = opts;
  const [g, setG] = React.useState<Gen>({ status: "queued" });
  React.useEffect(() => {
    setG({ status: "queued" });
    let raf = 0;
    let last = 0;
    const startAt = performance.now() + 900 + delay;
    const tick = (t: number) => {
      if (t < startAt || t - last < 80) {
        raf = requestAnimationFrame(tick);
        return;
      }
      last = t;
      const p = Math.min(1, (t - startAt) / duration);
      const eased = 1 - Math.pow(1 - p, 1.6);
      if (fail && p > 0.55) {
        setG({ status: "error" });
        return;
      }
      if (p >= 1) {
        setG({ status: "done", src: picsum(seed, aspect) });
        return;
      }
      setG({
        status: "generating",
        progress: eased * 100,
        eta: ((1 - p) * duration) / 1000,
        previewSrc: p > 0.35 ? picsum(seed, aspect, true) : undefined,
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seed, aspect, run, delay, duration, fail]);
  return g;
}

export default function ImageGenDemo() {
  const [prompt, setPrompt] = React.useState("A quiet mountain lake at sunrise, mist over the water, 35mm film");
  const [draft, setDraft] = React.useState(prompt);
  const [aspect, setAspect] = React.useState<ImageAspect>("4:3");
  const [reveal, setReveal] = React.useState<ImageReveal>("radial");
  const [run, setRun] = React.useState(0);
  const [gridRun, setGridRun] = React.useState(0);
  const [retried, setRetried] = React.useState(false);
  const [retryRun, setRetryRun] = React.useState(0);
  const seed = `${prompt.length}-${run}`;
  const gridSeed = `${prompt.length}-g${gridRun}`;

  const single = useFakeGeneration(seed, aspect, run);
  const g0 = useFakeGeneration(`${gridSeed}-a`, "1:1", gridRun, { delay: 0, duration: 4200 });
  const g1 = useFakeGeneration(`${gridSeed}-b`, "1:1", gridRun, { delay: 200, duration: 4700 });
  const g2 = useFakeGeneration(`${gridSeed}-c`, "1:1", gridRun * 1000 + retryRun, { delay: retried ? 0 : 400, duration: 5200, fail: !retried });
  const g3 = useFakeGeneration(`${gridSeed}-d`, "1:1", gridRun, { delay: 600, duration: 5700 });

  const generate = () => {
    if (!draft.trim()) return;
    setPrompt(draft.trim());
    setRetried(false);
    setRun((r) => r + 1);
    setGridRun((r) => r + 1);
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6 font-sans">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
        className="flex items-center gap-2 rounded-2xl border border-border bg-background p-1.5 pl-4 shadow-sm transition-[border-color] focus-within:border-foreground/40"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Image prompt"
          placeholder="Describe an image…"
          className="h-8 flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          aria-label="Generate"
          className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm transition-colors hover:bg-foreground/90 active:scale-[0.97] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>

      <DemoBar>
        <Segmented label="Aspect ratio" value={aspect} onChange={(a) => { setAspect(a); setRun((r) => r + 1); }} options={["1:1", "4:3", "16:9", "9:16"] as const} />
        <Segmented label="Reveal" value={reveal} onChange={(r) => { setReveal(r); setRun((x) => x + 1); }} options={["radial", "wipe", "fade"] as const} />
      </DemoBar>

      <div className="mx-auto w-full" style={{ maxWidth: aspect === "9:16" ? 300 : undefined }}>
        <ImageGen
          {...single}
          prompt={prompt}
          aspectRatio={aspect}
          reveal={reveal}
          onRegenerate={() => setRun((r) => r + 1)}
          onVariation={() => setGridRun((r) => r + 1)}
          onUpscale={() => undefined}
          onRetry={() => setRun((r) => r + 1)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Variations</p>
        <ImageGenGrid
          columns={4}
          items={[g0, g1, g2, g3].map((g, i) => ({
            ...g,
            id: `v${i}`,
            prompt,
            aspectRatio: "1:1" as const,
            reveal,
            disableLightbox: false,
            error: i === 2 ? "Safety filter timeout" : undefined,
            onRetry:
              i === 2
                ? () => {
                    setRetried(true);
                    setRetryRun((r) => r + 1);
                  }
                : undefined,
          }))}
        />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, animate, motion, useReducedMotion } from "motion/react";
import { AlertTriangle, Check, Copy, Download, Maximize2, RefreshCw, RotateCw, Sparkles, X, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShimmerText } from "../shimmer-text/shimmer-text";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 400, damping: 30 } as const;
const ring = "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type ImageGenStatus = "queued" | "generating" | "done" | "error";
export type ImageAspect = "1:1" | "4:3" | "16:9" | "9:16";
export type ImageReveal = "radial" | "wipe" | "fade";

const RATIO: Record<ImageAspect, string> = { "1:1": "1 / 1", "4:3": "4 / 3", "16:9": "16 / 9", "9:16": "9 / 16" };

/* ------------------------------------------------------------------ */
/* Noise                                                              */
/* ------------------------------------------------------------------ */

function Noise({ running, frozen }: { running: boolean; frozen?: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const W = 96;
    const H = 96;
    canvas.width = W;
    canvas.height = H;
    const img = ctx.createImageData(W, H);
    const paint = () => {
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };
    paint();
    if (!running || frozen || reduce) return;
    let raf = 0;
    let last = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden || t - last < 1000 / 24) return;
      last = t;
      paint();
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [running, frozen, reduce]);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full opacity-[0.09] mix-blend-multiply [image-rendering:pixelated] dark:opacity-[0.12] dark:mix-blend-screen" />;
}

/* ------------------------------------------------------------------ */
/* Small buttons                                                      */
/* ------------------------------------------------------------------ */

function OverlayButton({ label, onClick, children, className }: { label: string; onClick?: () => void; children: React.ReactNode; className?: string }) {
  return (
    <motion.button
      type="button"
      variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.2, ease: EASE }}
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg border border-white/15 bg-black/35 text-white backdrop-blur-md transition-colors hover:bg-black/55",
        "outline-none focus-visible:ring-2 focus-visible:ring-white/80",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

function DownloadButton({ onDownload }: { onDownload?: () => void | Promise<unknown> }) {
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle");
  const run = async () => {
    if (state === "busy") return;
    setState("busy");
    try {
      await Promise.all([onDownload?.(), new Promise((r) => setTimeout(r, 650))]);
      setState("done");
      window.setTimeout(() => setState("idle"), 1500);
    } catch {
      setState("idle");
    }
  };
  return (
    <OverlayButton label={state === "done" ? "Downloaded" : "Download"} onClick={run}>
      <AnimatePresence mode="popLayout" initial={false}>
        {state === "idle" && (
          <motion.span key="i" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex">
            <Download className="size-4" />
          </motion.span>
        )}
        {state === "busy" && (
          <motion.svg key="b" viewBox="0 0 20 20" className="size-4 -rotate-90" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.2" />
            <motion.circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65, ease: "easeInOut" }} />
          </motion.svg>
        )}
        {state === "done" && (
          <motion.span key="d" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={SPRING} className="flex">
            <Check className="size-4" strokeWidth={2.5} />
          </motion.span>
        )}
      </AnimatePresence>
    </OverlayButton>
  );
}

function CopyPromptChip({ prompt }: { prompt: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <OverlayButton
      label={copied ? "Prompt copied" : "Copy prompt"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(prompt);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        } catch {
          /* blocked */
        }
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={copied ? "c" : "p"} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="flex">
          {copied ? <Check className="size-4" strokeWidth={2.5} /> : <Copy className="size-3.5" />}
        </motion.span>
      </AnimatePresence>
    </OverlayButton>
  );
}

/* ------------------------------------------------------------------ */
/* ImageGen                                                           */
/* ------------------------------------------------------------------ */

export interface ImageGenProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Lifecycle. Defaults to "queued". */
  status?: ImageGenStatus;
  /** 0..100. Omit for an indeterminate bar. */
  progress?: number;
  /** Final image URL. */
  src?: string;
  /** Low-res intermediate frame; crossfades in, getting sharper as progress rises. */
  previewSrc?: string;
  /** Frame ratio — fixed from the first render so nothing shifts. Defaults to "1:1". */
  aspectRatio?: ImageAspect;
  /** The prompt. Used for alt text and "Copy prompt". */
  prompt: string;
  /** Seconds remaining. */
  eta?: number;
  /** How the final image appears. Defaults to "radial". */
  reveal?: ImageReveal;
  /** Error text. */
  error?: string;
  onDownload?: () => void | Promise<unknown>;
  onRegenerate?: () => void;
  onVariation?: () => void;
  onUpscale?: () => void;
  onRetry?: () => void;
  /** Disable the click-to-open lightbox. */
  disableLightbox?: boolean;
}

export const ImageGen = React.forwardRef<HTMLDivElement, ImageGenProps>(
  (
    {
      status = "queued",
      progress,
      src,
      previewSrc,
      aspectRatio = "1:1",
      prompt,
      eta,
      reveal = "radial",
      error,
      onDownload,
      onRegenerate,
      onVariation,
      onUpscale,
      onRetry,
      disableLightbox,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const reduce = useReducedMotion();
    const uid = React.useId();
    const frameRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => frameRef.current as HTMLDivElement);
    const [decoded, setDecoded] = React.useState<string | null>(null);
    const [lightbox, setLightbox] = React.useState(false);
    const [hover, setHover] = React.useState(false);

    // decode before revealing — never show a half-loaded image
    React.useEffect(() => {
      if (status !== "done" || !src) {
        setDecoded(null);
        return;
      }
      let cancelled = false;
      const img = new Image();
      img.src = src;
      img
        .decode()
        .catch(() => undefined)
        .then(() => !cancelled && setDecoded(src));
      return () => {
        cancelled = true;
      };
    }, [status, src]);

    React.useEffect(() => {
      if (status === "error" && !reduce && frameRef.current) {
        void animate(frameRef.current, { x: [0, -5, 5, -3, 3, 0] }, { duration: 0.4 });
      }
    }, [status, reduce]);

    const pct = progress === undefined ? undefined : Math.max(0, Math.min(100, progress));
    const generating = status === "generating";
    const ready = status === "done" && decoded === src && !!src;
    const mode: ImageReveal = reduce ? "fade" : reveal;
    const clip =
      mode === "radial"
        ? { initial: "circle(0% at 50% 50%)", animate: "circle(75% at 50% 50%)" }
        : mode === "wipe"
          ? { initial: "inset(0% 0% 100% 0%)", animate: "inset(0% 0% 0% 0%)" }
          : undefined;

    const label =
      status === "done"
        ? undefined
        : status === "error"
          ? `Image generation failed: ${prompt}`
          : `Generating image: ${prompt}${pct !== undefined ? `, ${Math.round(pct)}%` : ""}`;

    return (
      <>
        <div
          ref={frameRef}
          role={ready ? undefined : "img"}
          aria-label={label}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
          className={cn(
            "group/img relative w-full overflow-hidden rounded-xl border border-border bg-muted font-sans shadow-sm",
            className
          )}
          style={{ aspectRatio: RATIO[aspectRatio], ...style }}
          {...props}
        >
          {/* waiting surface */}
          <AnimatePresence>
            {!ready && (
              <motion.div key="wait" className="absolute inset-0" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}>
                <div className={cn("absolute inset-0 transition-[filter,opacity] duration-500", status === "error" && "opacity-60 grayscale")}>
                  <Noise running={generating || status === "queued"} frozen={status === "error"} />
                  {generating && !reduce && (
                    <span aria-hidden className="lk-img-sweep absolute -inset-1/2 bg-[linear-gradient(115deg,transparent_40%,color-mix(in_oklab,var(--foreground)_7%,transparent)_50%,transparent_60%)]" />
                  )}
                </div>

                <AnimatePresence>
                  {previewSrc && generating && (
                    <motion.img
                      key={previewSrc}
                      src={previewSrc}
                      alt=""
                      aria-hidden
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 size-full object-cover"
                      style={{ filter: `blur(${(16 * (1 - (pct ?? 0) / 100)).toFixed(1)}px)`, transform: "scale(1.06)" }}
                    />
                  )}
                </AnimatePresence>

                {/* center states */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <AnimatePresence mode="wait" initial={false}>
                    {status === "queued" && (
                      <motion.span key="q" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background/80 px-3 text-[12.5px] font-medium shadow-sm backdrop-blur">
                        <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                        <ShimmerText>In queue…</ShimmerText>
                      </motion.span>
                    )}
                    {generating && !previewSrc && (
                      <motion.span key="g" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2 text-muted-foreground">
                        <motion.span animate={reduce ? undefined : { rotate: [0, 14, -8, 0], scale: [1, 1.12, 0.96, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="flex">
                          <Sparkles className="size-5" strokeWidth={1.5} />
                        </motion.span>
                        <ShimmerText className="text-[12.5px] font-medium">Generating</ShimmerText>
                      </motion.span>
                    )}
                    {status === "error" && (
                      <motion.div key="e" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2.5 text-center" role="alert">
                        <span className="flex size-9 items-center justify-center rounded-full border border-destructive/30 bg-background text-destructive shadow-sm">
                          <AlertTriangle className="size-4" />
                        </span>
                        <span className="text-[13px] font-medium text-foreground">{error ?? "Generation failed"}</span>
                        {onRetry && (
                          <motion.button
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={onRetry}
                            className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-[12.5px] font-medium text-foreground shadow-sm transition-colors hover:bg-accent", ring)}
                          >
                            <RotateCw className="size-3.5" /> Retry
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* progress */}
                {generating && (
                  <>
                    {pct !== undefined && (
                      <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1">
                        <span className="rounded-full border border-border bg-background/85 px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-foreground shadow-sm backdrop-blur">
                          {Math.round(pct)}%
                        </span>
                        {eta !== undefined && eta > 0 && (
                          <span className="rounded-full bg-background/70 px-1.5 text-[11px] tabular-nums text-muted-foreground backdrop-blur">~{Math.ceil(eta)}s</span>
                        )}
                      </div>
                    )}
                    <div
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      aria-label="Generation progress"
                      className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-foreground/10"
                    >
                      {pct !== undefined ? (
                        <motion.div className="h-full origin-left bg-foreground" initial={false} animate={{ scaleX: pct / 100 }} transition={{ type: "spring", stiffness: 120, damping: 24 }} />
                      ) : (
                        <motion.div className="h-full w-1/3 bg-foreground" animate={reduce ? { opacity: [0.4, 1, 0.4] } : { x: ["-100%", "300%"] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }} />
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* final image */}
          {ready && (
            <motion.div
              className="absolute inset-0"
              initial={clip ? { clipPath: clip.initial } : { opacity: 0 }}
              animate={clip ? { clipPath: clip.animate } : { opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <button
                type="button"
                disabled={disableLightbox}
                onClick={() => setLightbox(true)}
                aria-label="Open image"
                className={cn("absolute inset-0 overflow-hidden", disableLightbox ? "cursor-default" : "cursor-zoom-in", "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring")}
              >
                <motion.img
                  layoutId={reduce || lightbox ? undefined : `${uid}-image`}
                  src={src}
                  alt={prompt}
                  draggable={false}
                  initial={reduce ? { opacity: 0 } : { filter: "blur(20px)", scale: 1.04 }}
                  animate={reduce ? { opacity: 1 } : { filter: "blur(0px)", scale: hover ? 1.02 : 1 }}
                  transition={{ filter: { duration: 0.7, ease: EASE }, scale: { duration: hover ? 0.5 : 0.7, ease: EASE }, opacity: { duration: 0.3 } }}
                  className={cn("size-full object-cover", lightbox && "opacity-0")}
                />
              </button>

              {/* hover / focus overlay */}
              <motion.div
                initial="hidden"
                animate={hover ? "show" : "hidden"}
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } }}
                className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 via-black/25 to-transparent p-2.5 pt-12 group-focus-within/img:opacity-100 [&_button]:pointer-events-auto"
              >
                <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }} className="flex gap-1.5 group-focus-within/img:[&>*]:!opacity-100 group-focus-within/img:[&>*]:!translate-y-0">
                  <DownloadButton onDownload={onDownload ?? (() => downloadUrl(src as string, prompt))} />
                  {onVariation && (
                    <OverlayButton label="Variations" onClick={onVariation}>
                      <Layers className="size-4" />
                    </OverlayButton>
                  )}
                  {onUpscale && (
                    <OverlayButton label="Upscale" onClick={onUpscale}>
                      <Maximize2 className="size-3.5" />
                    </OverlayButton>
                  )}
                  {onRegenerate && (
                    <OverlayButton label="Regenerate" onClick={onRegenerate}>
                      <RefreshCw className="size-3.5" />
                    </OverlayButton>
                  )}
                </motion.div>
                <motion.div variants={{ hidden: {}, show: {} }} className="group-focus-within/img:[&>*]:!opacity-100 group-focus-within/img:[&>*]:!translate-y-0">
                  <CopyPromptChip prompt={prompt} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
          <style href="lk-image-gen" precedence="default">{`
            @keyframes lk-img-sweep { from { transform: translateX(-60%); } to { transform: translateX(60%); } }
            .lk-img-sweep { animation: lk-img-sweep 2.6s cubic-bezier(0.4,0,0.2,1) infinite; }
          `}</style>
        </div>

        {/* lightbox */}
        <Dialog.Root open={lightbox} onOpenChange={setLightbox}>
          <AnimatePresence>
            {lightbox && src && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild forceMount>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md" />
                </Dialog.Overlay>
                <Dialog.Content asChild forceMount aria-describedby={undefined}>
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none sm:p-10" onClick={() => setLightbox(false)}>
                    <Dialog.Title className="sr-only">{prompt}</Dialog.Title>
                    <motion.img
                      layoutId={reduce ? undefined : `${uid}-image`}
                      initial={reduce ? { opacity: 0 } : undefined}
                      animate={reduce ? { opacity: 1 } : undefined}
                      exit={reduce ? { opacity: 0 } : undefined}
                      transition={{ type: "spring", stiffness: 300, damping: 32 }}
                      src={src}
                      alt={prompt}
                      onClick={(e) => e.stopPropagation()}
                      className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                      style={{ aspectRatio: RATIO[aspectRatio] }}
                    />
                    <Dialog.Close asChild>
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Close"
                        className={cn("absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md", ring)}
                      >
                        <X className="size-4" />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </AnimatePresence>
        </Dialog.Root>
      </>
    );
  }
);
ImageGen.displayName = "ImageGen";

async function downloadUrl(url: string, prompt: string) {
  const name = `${prompt.slice(0, 40).replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "image"}.jpg`;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href, download: name });
    a.click();
    URL.revokeObjectURL(href);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/* ------------------------------------------------------------------ */
/* Grid                                                               */
/* ------------------------------------------------------------------ */

export interface ImageGenGridProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: (ImageGenProps & { id?: string })[];
  /** Defaults to 2. */
  columns?: 1 | 2 | 3 | 4;
  /** Selected index (controlled). */
  selected?: number | null;
  onSelect?: (index: number | null) => void;
}

export function ImageGenGrid({ items, columns = 2, selected: selectedProp, onSelect, className, ...props }: ImageGenGridProps) {
  const reduce = useReducedMotion();
  const [internal, setInternal] = React.useState<number | null>(null);
  const selected = selectedProp !== undefined ? selectedProp : internal;
  const pick = (i: number) => {
    const next = selected === i ? null : i;
    if (selectedProp === undefined) setInternal(next);
    onSelect?.(next);
  };
  const cols = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-2 sm:grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" }[columns];

  return (
    <div className={cn("grid gap-2.5", cols, className)} role="listbox" aria-label="Generated images" {...props}>
      {items.map((item, i) => {
        const isSel = selected === i;
        const dim = selected !== null && selected !== undefined && !isSel;
        return (
          <motion.div
            key={item.id ?? i}
            role="option"
            aria-selected={isSel}
            tabIndex={item.status === "done" ? 0 : -1}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: dim ? 0.6 : 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE, delay: reduce ? 0 : i * 0.2, opacity: { duration: 0.2 } }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
                e.preventDefault();
                pick(i);
              }
            }}
            onClickCapture={(e) => {
              // select on click; the lightbox opens on double click in grids
              if (item.status !== "done") return;
              if ((e.target as HTMLElement).closest("[aria-label='Open image']") && e.detail < 2) {
                e.preventDefault();
                e.stopPropagation();
                pick(i);
              }
            }}
            className={cn("relative rounded-xl transition-shadow duration-200", isSel && "ring-2 ring-foreground ring-offset-2 ring-offset-background", ring)}
          >
            <ImageGen {...item} />
            <AnimatePresence>
              {isSel && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                  className="pointer-events-none absolute left-2 top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-background shadow-md"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ImageGen;

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AppWindow, ArrowRight, Code2, Maximize2, Minimize2, Moon, RotateCcw, Sun } from "lucide-react";
import { SiAndroid, SiApple } from "react-icons/si";
import { cn } from "@/lib/utils";
import type { CodeFile } from "@/lib/mobile/docs.server";
import type { FlowStep, Framework, MobileItemSummary } from "@/lib/mobile/types";
import { CodeBlock } from "../ui/code-block";
import { CopyPromptMenu, QRPopover } from "../ui/menus";
import { IconButton, RegistryChip, Segmented, SkeletonBlock } from "../ui/primitives";
import { DEVICES, FitScale, PhoneFrame, Scaled, defaultDevice, frameSize, type Device, type PhonePlatform, type PhoneTheme } from "./phone-frame";
import { OVERLAY_STATUS_BAR, PREVIEWS } from "./previews";

/* ------------------------------------------------------------------ */
/* One frame: live preview, or a static screenshot fallback.          */
/* ------------------------------------------------------------------ */

export function PhoneScreen({
  step,
  device,
  theme,
  interactive = true,
}: {
  step: FlowStep;
  device: Device;
  theme: PhoneTheme;
  interactive?: boolean;
}) {
  const Preview = step.preview ? PREVIEWS[step.preview] : null;
  return (
    <PhoneFrame
      device={device}
      theme={theme}
      interactive={interactive}
      label={`${step.title} on ${device.name}, ${theme} mode`}
      overlayStatusBar={step.preview ? OVERLAY_STATUS_BAR.has(step.preview) : !!step.image}
    >
      {Preview ? (
        <Preview />
      ) : step.image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={step.image} alt={step.title} className="absolute inset-0 size-full object-cover" />
          <span className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-medium text-white">
            Static screenshot
          </span>
        </>
      ) : null}
    </PhoneFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Preview controls                                                   */
/* ------------------------------------------------------------------ */

function DeviceSelect({ platform, value, onChange }: { platform: PhonePlatform; value: string; onChange: (id: string) => void }) {
  const id = useId();
  return (
    <span className="relative inline-flex">
      <label htmlFor={id} className="sr-only">
        Device
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="lk-focus lk-transition h-7 appearance-none rounded-lk border border-lk-border bg-lk-surface pl-2.5 pr-7 text-[12.5px] font-medium text-lk-fg hover:bg-lk-surface-2"
      >
        {DEVICES.filter((d) => d.platform === platform).map((d) => (
          <option key={d.id} value={d.id}>
            {d.name} · {d.width}×{d.height}
          </option>
        ))}
      </select>
      <svg aria-hidden className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-lk-muted" viewBox="0 0 12 12" fill="none">
        <path d="M3 4.5 6 7.5l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* PreviewPanel — [Preview] [Code] + toolbar                           */
/* ------------------------------------------------------------------ */

export function PreviewPanel({
  item,
  files,
  registry,
  framework,
  getPrompt,
  getMarkdown,
}: {
  item: MobileItemSummary;
  files: CodeFile[];
  registry: string;
  framework: Framework;
  getPrompt: () => string;
  getMarkdown: () => string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [platform, setPlatform] = useState<PhonePlatform>("ios");
  const [deviceId, setDeviceId] = useState(defaultDevice("ios").id);
  const [themeOverride, setThemeOverride] = useState<PhoneTheme | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [replay, setReplay] = useState(0);
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const panelId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageH, setStageH] = useState(0);

  // server and first client render agree on "dark"; follow the site theme after mount
  const theme: PhoneTheme = themeOverride ?? (mounted && resolvedTheme === "light" ? "light" : "dark");
  const device = DEVICES.find((d) => d.id === deviceId) ?? defaultDevice(platform);
  const size = frameSize(device);
  const steps: FlowStep[] = item.flow ?? [{ title: item.title, preview: item.preview }];
  const isFlow = steps.length > 1;

  const changePlatform = (p: PhonePlatform) => {
    setPlatform(p);
    setDeviceId(defaultDevice(p).id);
  };

  // fullscreen: Esc closes, body scroll locked
  useEffect(() => {
    if (!fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  // gallery scale depends on stage height
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStageH(el.clientHeight));
    ro.observe(el);
    setStageH(el.clientHeight);
    return () => ro.disconnect();
  }, [tab, fullscreen]);

  const galleryScale = Math.max(0.3, Math.min(0.72, (stageH - 96) / size.height));

  return (
    <section
      aria-label={`${item.title} preview`}
      className={cn(
        "flex flex-col overflow-hidden border border-lk-border bg-lk-bg",
        fullscreen ? "fixed inset-0 z-[120] rounded-none border-0" : "rounded-lk-card"
      )}
    >
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lk-border bg-lk-bg-subtle px-2 py-2 sm:px-3">
        <Segmented
          label="View"
          value={tab}
          onChange={setTab}
          controls={panelId}
          options={[
            { value: "preview", label: <><AppWindow size={14} aria-hidden /> Preview</> },
            { value: "code", label: <><Code2 size={14} aria-hidden /> Code</> },
          ]}
        />
        <div className="flex min-w-0 items-center gap-1.5">
          <RegistryChip name={registry} className="hidden max-w-[240px] sm:inline-flex" />
          <CopyPromptMenu getPrompt={getPrompt} getMarkdown={getMarkdown} compact />
          <IconButton label={fullscreen ? "Exit fullscreen" : "Fullscreen"} onClick={() => setFullscreen((f) => !f)}>
            {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </IconButton>
        </div>
      </div>

      {tab === "preview" ? (
        <div id={`${panelId}-preview`} role="tabpanel" className={cn("relative flex flex-col lk-dots", fullscreen ? "min-h-0 flex-1" : "h-[680px] md:h-[min(820px,calc(100dvh-160px))] md:min-h-[620px]")}>
          {/* device controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-3 pt-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <Segmented
                size="sm"
                role="radiogroup"
                label="Platform"
                value={platform}
                onChange={changePlatform}
                options={[
                  { value: "ios", label: <><SiApple size={12} aria-hidden /> iOS</> },
                  { value: "android", label: <><SiAndroid size={12} aria-hidden /> Android</> },
                ]}
              />
              <Segmented
                size="sm"
                role="radiogroup"
                label="Preview theme"
                value={theme}
                onChange={(t) => setThemeOverride(t)}
                options={[
                  { value: "light", label: <Sun size={13} aria-hidden />, ariaLabel: "Light" },
                  { value: "dark", label: <Moon size={13} aria-hidden />, ariaLabel: "Dark" },
                ]}
              />
              <DeviceSelect platform={platform} value={device.id} onChange={setDeviceId} />
            </div>
            <div className="flex items-center gap-1.5">
              <IconButton label="Restart preview" onClick={() => setReplay((r) => r + 1)} className="size-7">
                <RotateCcw size={14} />
              </IconButton>
              <QRPopover framework={framework} title={item.title} />
            </div>
          </div>

          {/* stage */}
          <div ref={stageRef} className="relative min-h-0 flex-1">
            {!ready && !isFlow && (
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
                <SkeletonBlock className="h-[78%] w-auto aspect-[9/19] rounded-[44px]" />
              </div>
            )}
            {isFlow ? (
              <div className="lk-scroll absolute inset-0 flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-6 pb-4" key={`${replay}-${device.id}`}>
                {steps.map((s, i) => (
                  <div key={s.title} className="flex shrink-0 snap-center items-center gap-4 first:ml-auto last:mr-auto">
                    <figure className="m-0 flex flex-col items-center gap-3">
                      <figcaption className="flex items-center gap-2 text-[12.5px] text-lk-muted">
                        <span className="flex size-5 items-center justify-center rounded-full border border-lk-border bg-lk-bg font-mono text-[11px] text-lk-fg">
                          {i + 1}
                        </span>
                        {s.title}
                      </figcaption>
                      {stageH > 0 ? (
                        <Scaled width={size.width} height={size.height} scale={galleryScale}>
                          <PhoneScreen step={s} device={device} theme={theme} />
                        </Scaled>
                      ) : (
                        <SkeletonBlock className="h-[520px] w-[250px] rounded-[36px]" />
                      )}
                    </figure>
                    {i < steps.length - 1 && <ArrowRight size={18} className="mt-8 shrink-0 text-lk-subtle" aria-hidden />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FitScale key={`${replay}-${device.id}`} width={size.width} height={size.height} padding={40} onReady={() => setReady(true)}>
                  <PhoneScreen step={steps[0]} device={device} theme={theme} />
                </FitScale>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id={`${panelId}-code`} role="tabpanel" className={cn(fullscreen && "min-h-0 flex-1 overflow-auto")}>
          <CodeBlock files={files} bare maxHeight={fullscreen ? undefined : 620} />
        </div>
      )}
    </section>
  );
}

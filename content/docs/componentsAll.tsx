"use client";

import React, { useState, type ComponentType } from "react";
import Image from "next/image";
import { DownloadButton } from "@/components/lokalhost_io/buttons/download-button";
import ComposerActions from "@/components/lokalhost_io/micro-ai-components/ComposerActions";
import {
  MiniAgentPlan,
  MiniAICommand,
  MiniCitations,
  MiniComposer,
  MiniImageGen,
  MiniMessageActions,
  MiniReasoning,
  MiniStreaming,
  MiniToolCall,
  MiniVoiceOrb,
} from "@/components/lokalhost_io/micro-ai-components/_demo/mini-previews";
import InstallCommand from "@/components/lokalhost_io/micro-ai-components/install-command";
import CopyPageMarkdown from "@/components/lokalhost_io/micro-ai-components/copy-page-markdown";
import { ModelPicker, defaultModels } from "@/components/lokalhost_io/micro-ai-components/model-picker";
import ModelsSelector from "@/components/lokalhost_io/micro-ai-components/models-selector";

/* ------------------------------------------------------------------ */
/* Card previews for the /docs overview, keyed by docs URL.           */
/* Add an entry here when you add a new component page.               */
/* ------------------------------------------------------------------ */

const DownloadButtonPreview = () => (
  <div className="flex flex-col items-center gap-2.5">
    <DownloadButton platform="mac" iconPosition="right" />
    <DownloadButton platform="windows" variant="secondary" iconPosition="right" />
    <DownloadButton platform="linux" variant="secondary" iconPosition="right" />
  </div>
);

/** Shrinks a live preview to fit the 230px overview card. */
const Fit = ({ children, scale = 0.82, width = 420 }: { children: React.ReactNode; scale?: number; width?: number }) => (
  <div className="flex items-center justify-center" style={{ width, transform: `scale(${scale})` }}>
    {children}
  </div>
);

const LayeredShots = ({ back, front, alt }: { back: string; front: string; alt: string }) => (
  <div className="relative h-full w-full">
    <Image
      src={back}
      alt={alt}
      width={520}
      height={360}
      className="absolute left-[6%] top-[12%] w-[78%] rounded-lg border border-neutral-200 shadow-md transition-transform duration-500 group-hover:-translate-y-1 dark:border-neutral-800"
    />
    <Image
      src={front}
      alt={alt}
      width={420}
      height={300}
      className="absolute right-[5%] top-[38%] w-[62%] rounded-lg border border-neutral-200 shadow-xl transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-2 dark:border-neutral-800"
    />
  </div>
);

const SingleShot = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative flex h-full w-full items-end justify-center">
    <Image
      src={src}
      alt={alt}
      width={360}
      height={420}
      className="w-[70%] translate-y-6 rounded-t-lg border border-b-0 border-neutral-200 shadow-xl transition-transform duration-500 group-hover:translate-y-3 dark:border-neutral-800"
    />
  </div>
);

const InstallCommandPreview = () => (
  <div className="w-full max-w-[380px] px-4">
    <InstallCommand
      title="Terminal"
      commands={{
        pnpm: "pnpm dlx shadcn@latest add https://localhostui.com/r/install-command.json",
        npm: "npx shadcn@latest add https://localhostui.com/r/install-command.json",
        yarn: "yarn dlx shadcn@latest add https://localhostui.com/r/install-command.json",
        bun: "bunx --bun shadcn@latest add https://localhostui.com/r/install-command.json",
      }}
    />
  </div>
);

const CopyPageMarkdownPreview = () => <CopyPageMarkdown />;

/** Also used by content/docs/components/micro-ai-components/model-picker.mdx */
export const ModelPickerComponent = () => {
  const [selectedId, setSelectedId] = useState("gpt-5-2");
  return (
    <ModelPicker
      models={defaultModels}
      selectedModelId={selectedId}
      onSelectModel={(model) => setSelectedId(model.id)}
      autoFocus={false}
    />
  );
};

export const componentPreviews: Record<string, ComponentType> = {
  "/docs/components/buttons/download-button": DownloadButtonPreview,
  "/docs/components/code-blocks/component-preview": () => (
    <LayeredShots
      back="/components-images/component-preview-a.png"
      front="/components-images/component-preview-b.png"
      alt="Component preview with code tab"
    />
  ),
  "/docs/components/code-blocks/code-block": () => (
    <LayeredShots
      back="/components-images/code-block-a.png"
      front="/components-images/code-block-b.png"
      alt="Syntax highlighted code block"
    />
  ),
  "/docs/components/micro-ai-components/install-command": InstallCommandPreview,
  "/docs/components/micro-ai-components/copy-page-markdown": CopyPageMarkdownPreview,
  "/docs/components/micro-ai-components/model-picker": () => (
    <SingleShot src="/components-images/model-picker.png" alt="Model picker" />
  ),
  "/docs/components/micro-ai-components/models-selector": () => <ModelsSelector />,
  "/docs/components/micro-ai-components/prompt-composer": () => (
    <Fit scale={0.78} width={440}>
      <MiniComposer />
    </Fit>
  ),
  "/docs/components/micro-ai-components/streaming-message": () => (
    <Fit scale={0.72} width={440}>
      <MiniStreaming />
    </Fit>
  ),
  "/docs/components/micro-ai-components/reasoning-panel": () => (
    <Fit width={320}>
      <MiniReasoning />
    </Fit>
  ),
  "/docs/components/micro-ai-components/message-actions": () => (
    <Fit width={380}>
      <MiniMessageActions />
    </Fit>
  ),
  "/docs/components/micro-ai-components/tool-call": () => (
    <Fit scale={0.72} width={420}>
      <MiniToolCall />
    </Fit>
  ),
  "/docs/components/micro-ai-components/agent-plan": () => (
    <Fit scale={0.8} width={380}>
      <MiniAgentPlan variant="compact" />
    </Fit>
  ),
  "/docs/components/micro-ai-components/citations": () => (
    <Fit scale={0.86} width={400}>
      <MiniCitations />
    </Fit>
  ),
  "/docs/components/micro-ai-components/voice-orb": () => <MiniVoiceOrb size={140} />,
  "/docs/components/micro-ai-components/ai-command": () => <MiniAICommand />,
  "/docs/components/micro-ai-components/image-gen": () => (
    <Fit scale={0.72} width={260}>
      <MiniImageGen />
    </Fit>
  ),
  "/docs/components/micro-ai-components/composer-actions": () => (
    <div className="flex h-full w-full items-start justify-center pt-3" style={{ transform: "scale(0.72)", transformOrigin: "top center" }}>
      <ComposerActions open />
    </div>
  ),
};

export default componentPreviews;

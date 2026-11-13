"use client";

import React, { useState, type ComponentType } from "react";
import Image from "next/image";
import { FaApple } from "react-icons/fa";
import { DiWindows } from "react-icons/di";
import { FcLinux } from "react-icons/fc";
import DownloadButtonGroup from "@/components/lokalhost_io/buttons/download-button";
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
    <DownloadButtonGroup
      config={{ windows: { downloadUrl: "" } }}
      buttonProps={{ label: "Download for Windows", icon: <DiWindows size={18} />, iconPosition: "right" }}
      size="md"
      platforms={["windows"]}
    />
    <DownloadButtonGroup
      config={{ linux: { downloadUrl: "" } }}
      buttonProps={{ label: "Download for Linux", icon: <FcLinux size={18} />, iconPosition: "right" }}
      wrapperColorClassName="bg-blue-400"
      colorClassName="bg-blue-500"
      size="md"
      platforms={["linux"]}
    />
    <DownloadButtonGroup
      config={{ mac: { downloadUrl: "" } }}
      buttonProps={{ label: "Download for Mac", icon: <FaApple size={18} />, iconPosition: "right" }}
      wrapperColorClassName="bg-yellow-400"
      colorClassName="bg-yellow-500"
      size="md"
      platforms={["mac"]}
    />
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
        pnpm: "pnpm dlx shadcn@latest add https://lokalhost.io/r/install-command.json",
        npm: "npx shadcn@latest add https://lokalhost.io/r/install-command.json",
        yarn: "yarn dlx shadcn@latest add https://lokalhost.io/r/install-command.json",
        bun: "bunx --bun shadcn@latest add https://lokalhost.io/r/install-command.json",
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
};

export default componentPreviews;

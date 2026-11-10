
"use client"
import React, { useState } from 'react'
import { cn } from "@/lib/utils";
import { FaApple } from "react-icons/fa";
import { DiWindows } from "react-icons/di";
import { FcLinux } from "react-icons/fc";
import DownloadButtonGroup from "@/components/lokalhost_io/buttons/download-button";
import Link from 'next/link';
import { ComponentPreview } from '@/components/lokalhost_io/code-blocks/component-preview';
import InstallCommand from "@/components/lokalhost_io/micro-ai-components/install-command";
import CodeBlock from "@/components/lokalhost_io/code-blocks/code-block";
import Image from 'next/image';
import { RiGrokAiFill } from 'react-icons/ri';
import CopyPageMarkdown from '@/components/lokalhost_io/micro-ai-components/copy-page-markdown';
import { ModelPicker , defaultModels } from '@/components/lokalhost_io/micro-ai-components/model-picker';
import ComposerActions from "@/components/lokalhost_io/micro-ai-components/ComposerActions"
import ModelsSelector from "@/components/lokalhost_io/micro-ai-components/models-selector"

const DownloadButton = () => (
  <div className="flex flex-col gap-2.5 w-full px-4 justify-center items-center">
    <DownloadButtonGroup
      config={{
                windows: { downloadUrl: ""},
              }}
                            buttonProps={{
                              label: "Download For Windows",
                              icon: <DiWindows size={20} />,
                              iconPosition: "right",
                            }}
                            size="md"
      platforms={['windows']}
    /> 
    <DownloadButtonGroup
    config={{
                linux: { downloadUrl: ""},
              }}
                            buttonProps={{
                              label: "Download For Linux",
                              icon: <FcLinux size={20} />,
                              iconPosition: "right",
                            }}
                            wrapperColorClassName="bg-blue-400"
                            colorClassName="bg-blue-500"
                            size="md"
    platforms={['linux']}
  /> 
  <DownloadButtonGroup
              config={{
                              mac: { downloadUrl: ""},
                            }}
                            buttonProps={{
                              label: "Download For Mac",
                              icon: <FaApple size={20} />,
                              iconPosition: "right",
                            }}
                            wrapperColorClassName="bg-yellow-400"
                            colorClassName="bg-yellow-500"
                            size="md"
              platforms={['mac']}
            />
  </div>
);


const CodePreviewComponent = () => (
  <div className="flex w-full h-full justify-center items-center overflow-hidden pt-6 relative">
    <Image className="object-cover rounded-lg" src="/components-images/component-preview-a.png" alt="Code block preview showing syntax highlighted TypeScript" width={500} height={400} />
    <Image className="absolute top-16 left-46 rounded-lg" src="/components-images/component-preview-b.png" alt="Code block preview showing syntax highlighted TypeScript" width={400} height={400} />
  </div>
);

const CodeBlockComponent = () => (
  <div className="flex w-full h-full justify-center items-center overflow-hidden relative">
    <Image className="object-cover rounded-lg" src="/components-images/code-block-a.png" alt="Code block preview showing syntax highlighted TypeScript" width={500} height={400} />
    <Image className="absolute top-16 left-46 rounded-lg" src="/components-images/code-block-b.png" alt="Code block preview showing syntax highlighted TypeScript" width={400} height={400} />
  </div>
);

const InstallCommandComponent = () => (
  <div className="flex flex-col gap-2.5 w-full px-4">
     <InstallCommand
       title="Terminal"
       commands={{
         pnpm: "pnpm dlx shadcn@latest add https://lokalhost-io-i2di.vercel.app",
         npm: "npx shadcn@latest add https://lokalhost-io-i2di.vercel.app",
         yarn: "yarn dlx shadcn@latest add https://lokalhost-io-i2di.vercel.app",
         bun: "bunx --bun shadcn@latest add https://lokalhost-io-i2di.vercel.app",
       }}
     />
  </div>
);

const CopyPageMarkdownsComponent = () => (
    <CopyPageMarkdown
      extraItems={[
        {
          id: "open-grok",
          label: "Open in Grok",
          icon: <RiGrokAiFill size={18} />,
          external: true,
          onSelect: () => window.open(`https://grok.com/...`, "_blank"),
        },
      ]}
    />
);

export const ModelPickerComponent = () => {
  const [selectedId, setSelectedId] = useState("gpt-5-2")
    return(
      <ModelPicker
        models={defaultModels}
        selectedModelId={selectedId}
        onSelectModel={(model) => setSelectedId(model.id)}
      />
  )
}

const ModelPickerComponent2 = () => (
  <div className="flex justify-center items-center">
    <Image className="relative top-20 w-full h-full object-contain" src={'/components-images/model-picker.png'} alt={"model picker Component"} width={300} height={400}/>
  </div>
)

const ComposerActionsComponent = () => (
  <div className="flex justify-center items-center">
    <Image className="relative top-18 w-full h-full object-contain" src={'/components-images/composer.png'} alt={"Composer Component"} width={300} height={400}/>
  </div>
)

const ModelsSelectorComponent = () => (
  <div className="flex justify-center items-center w-full h-full ">
    <ModelsSelector />
  </div>
);

const SkeletonToast = () => (
  <div className="flex flex-col gap-2 w-full px-3">
    {[
      "border-l-4 border-emerald-400 bg-white dark:bg-neutral-900",
      "border-l-4 border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900",
      "border-l-4 border-neutral-600 dark:border-neutral-500 bg-white dark:bg-neutral-900",
    ].map((cls, i) => (
      <div key={i} className={cn("w-full rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 flex items-center gap-2.5 shadow-sm", cls)}>
        <div className="w-3.5 h-3.5 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-1.5 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-3/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonPricing = () => (
  <div className="flex gap-2.5 w-full px-3">
    {[false, true].map((highlighted, i) => (
      <div key={i} className={cn("flex-1 rounded-xl p-3 flex flex-col gap-2 border", highlighted ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-800 dark:border-neutral-200" : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800")}>
        <div className={cn("h-1.5 w-1/2 rounded-full", highlighted ? "bg-neutral-600 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-700")} />
        <div className={cn("h-4 w-3/4 rounded-md", highlighted ? "bg-neutral-700 dark:bg-neutral-300" : "bg-neutral-200 dark:bg-neutral-800")} />
        <div className="flex flex-col gap-1 mt-1">
          {[...Array(3)].map((_, j) => (
            <div key={j} className={cn("h-1.5 rounded-full", highlighted ? "bg-neutral-700 dark:bg-neutral-300" : "bg-neutral-100 dark:bg-neutral-800/50", j === 0 ? "w-4/5" : j === 1 ? "w-3/5" : "w-2/3")} />
          ))}
        </div>
        <div className={cn("h-6 w-full rounded-lg mt-1", highlighted ? "bg-white dark:bg-neutral-900" : "bg-neutral-800 dark:bg-neutral-700")} />
      </div>
    ))}
  </div>
);

const SkeletonAvatar = () => (
  <div className="flex flex-col gap-3 items-center w-full px-4">
    <div className="flex items-center -space-x-2">
      {["bg-neutral-300 dark:bg-neutral-700", "bg-neutral-400 dark:bg-neutral-600", "bg-neutral-600 dark:bg-neutral-500", "bg-neutral-800 dark:bg-neutral-400"].map((cls, i) => (
        <div key={i} className={cn("w-9 h-9 rounded-full border-2 border-white dark:border-neutral-900", cls)} />
      ))}
      <div className="w-9 h-9 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <span className="text-[8px] font-mono font-bold text-neutral-500">+8</span>
      </div>
    </div>
    <div className="flex gap-3 items-center">
      <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="h-1.5 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
      </div>
    </div>
  </div>
);

const SkeletonInput = () => (
  <div className="flex flex-col gap-2.5 w-full px-4">
    {[
      { label: "w-1/4", style: "rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950" },
      { label: "w-1/3", style: "rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900" },
    ].map(({ label, style }, i) => (
      <div key={i} className="flex flex-col gap-1">
        <div className={cn("h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700", label)} />
        <div className={cn("h-8 w-full px-3 flex items-center gap-2", style)}>
          <div className="h-1.5 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    ))}
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0" />
      <div className="h-1.5 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    </div>
  </div>
);

// ─── Skeleton map ─────────────────────────────────────────────────────────────
const SKELETONS = [
  { component: DownloadButton,    label: "Download Button", link: "docs/components/buttons/download-button"     },
  { component: CodePreviewComponent,  label: "Code Preview" , link: "docs/components/code-blocks/component-preview"   },
  { component: CodeBlockComponent,   label: "Code-Block" , link: "docs/components/code-blocks/code-block"    },
  { component: InstallCommandComponent,    label: "Install Command" , link: "docs/components/micro-ai-components/install-command"     },
  { component: CopyPageMarkdownsComponent,   label: "Copy page markdown" , link: "docs/components/micro-ai-components/copy-page-markdown"    },
  { component: ModelPickerComponent2,   label: "Model Picker" , link: "docs/components/micro-ai-components/model-picker"    },
  { component: ComposerActionsComponent,  label: "Composer Actions model" , link: "docs/components/micro-ai-components/ComposerActions"   },
  { component: ModelsSelectorComponent,   label: "Model Selector" , link: "docs/components/micro-ai-components/models-selector"    },
  { component: SkeletonToast,   label: "Toast" , link: "/"    },
  { component: SkeletonPricing, label: "Pricing", link: "/"   },
  { component: SkeletonAvatar,  label: "Avatar", link: "/"    },
  { component: SkeletonInput,   label: "Input" , link: "/"    },
];

// ─── Main component ───────────────────────────────────────────────────────────
function ComponentsList() {
  return (
    <div className="w-full container max-w-[1580px] relative pb-8">
      <div className="w-full">

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 py-5 gap-5">
          {SKELETONS.map(({ component: Skeleton, label, link }, index) => (
            <Link key={index} href={link} className="no-underline">
            <div
              key={index}
              className={cn(
                "cursor-pointer group relative w-full lg:h-[320px] h-[320px] rounded-xl",
                "bg-white dark:bg-neutral-950",
                "border border-neutral-200 dark:border-neutral-800",
                "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]",
                "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
                "overflow-hidden flex flex-col",
                "hover:border-neutral-300 dark:hover:border-neutral-700"
              )}
            >
              {/* skeleton preview area */}
              <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                {/* subtle inner bg texture */}
                <Skeleton />
              </div>
              {/* Label footer */}
              <div className="shrink-0 h-[44px] px-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-between">
                <span className="text-sm font-sans font-semibold text-neutral-500 dark:text-neutral-500 no-underline">
                  {label}
                </span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>


    </div>
  );
}
export default ComponentsList


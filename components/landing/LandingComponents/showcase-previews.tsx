"use client";

import DownloadButtonGroup from "@/components/lokalhost_io/buttons/download-button";
import InstallCommand from "@/components/lokalhost_io/micro-ai-components/install-command";
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

export type ShowcasePreviewId =
  | "composer"
  | "voice-orb"
  | "streaming"
  | "reasoning"
  | "tool-call"
  | "image-gen"
  | "agent-plan"
  | "citations"
  | "ai-command"
  | "message-actions"
  | "download"
  | "install-command";

const INSTALL = "https://localhostui.com/r/prompt-composer.json";

/** Live previews for the landing showcase. Loaded lazily (client only) by ComponentsShowcase. */
export default function ShowcasePreview({ id }: { id: ShowcasePreviewId }) {
  switch (id) {
    case "composer":
      return <MiniComposer />;
    case "voice-orb":
      return <MiniVoiceOrb size={132} />;
    case "streaming":
      return <MiniStreaming />;
    case "reasoning":
      return <MiniReasoning />;
    case "tool-call":
      return <MiniToolCall />;
    case "image-gen":
      return <MiniImageGen />;
    case "agent-plan":
      return <MiniAgentPlan />;
    case "citations":
      return <MiniCitations />;
    case "ai-command":
      return <MiniAICommand />;
    case "message-actions":
      return <MiniMessageActions />;
    case "download":
      return <DownloadButtonGroup highlightDetected className="flex flex-col items-center gap-2.5" />;
    case "install-command":
      return (
        <div className="w-full max-w-sm">
          <InstallCommand
            title="Terminal"
            commands={{
              pnpm: `pnpm dlx shadcn@latest add ${INSTALL}`,
              npm: `npx shadcn@latest add ${INSTALL}`,
              yarn: `yarn dlx shadcn@latest add ${INSTALL}`,
              bun: `bunx --bun shadcn@latest add ${INSTALL}`,
            }}
          />
        </div>
      );
  }
}

"use client";

import { useId, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { FileCode2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PACKAGE_MANAGERS,
  installCommand,
  registryCommand,
  type PackageManager,
} from "@/lib/registry";
import { CodeView, CopyButton } from "./code-view";
import { pmIcons } from "./preview";

/* ------------------------------------------------------------------ */
/* Segmented control with a sliding pill                              */
/* ------------------------------------------------------------------ */

function Segmented<T extends string>({
  value,
  options,
  onChange,
  size = "md",
}: {
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  const id = useId();
  return (
    <div role="tablist" className="inline-flex w-fit items-center gap-0.5 rounded-xl border border-neutral-200 bg-neutral-100/80 p-1 dark:border-neutral-800 dark:bg-neutral-900">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          type="button"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative flex items-center gap-1.5 rounded-lg font-medium transition-colors",
            size === "sm" ? "h-6 px-2.5 text-[12px]" : "h-7 px-3 text-[13px]",
            value === o.value ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
          )}
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${id}`}
              className="absolute inset-0 rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
              transition={{ type: "spring", bounce: 0.18, duration: 0.4 }}
            />
          )}
          <span className="relative flex items-center gap-1.5">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Code panel used by every step                                      */
/* ------------------------------------------------------------------ */

function CodePanel({
  code,
  language,
  fileName,
  collapsible,
  header,
}: {
  code: string;
  language: string;
  fileName?: string;
  collapsible?: boolean;
  header?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="flex min-w-0 items-center gap-2 text-[12.5px] text-neutral-500 dark:text-neutral-400">
          {header ?? (
            <>
              {fileName ? <FileCode2 size={14} className="shrink-0" /> : <Terminal size={14} className="shrink-0" />}
              <span className="truncate font-mono">{fileName ?? "Terminal"}</span>
            </>
          )}
        </div>
        <CopyButton text={code} />
      </div>
      <CodeView code={code} language={language} lineNumbers={!!fileName} collapsible={collapsible} collapsedHeight={320} />
    </div>
  );
}

function CommandPanel({ build }: { build: (pm: PackageManager) => string }) {
  const [pm, setPm] = useState<PackageManager>("npm");
  return (
    <CodePanel
      code={build(pm)}
      language="bash"
      header={
        <Segmented
          size="sm"
          value={pm}
          onChange={setPm}
          options={PACKAGE_MANAGERS.map((p) => ({
            value: p,
            label: (
              <>
                {pmIcons[p]}
                {p}
              </>
            ),
          }))}
        />
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Steps                                                              */
/* ------------------------------------------------------------------ */

function Steps({ steps }: { steps: { title: string; content: ReactNode }[] }) {
  return (
    <ol className="relative m-0 list-none p-0">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-[12px] font-semibold text-neutral-700 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                {i + 1}
              </span>
              {!last && <span className="mt-1 w-px flex-1 bg-gradient-to-b from-neutral-200 to-neutral-200/0 dark:from-neutral-800 dark:to-neutral-800/0" />}
            </div>
            <div className={cn("min-w-0 flex-1", !last && "pb-8")}>
              <p className="mb-3 mt-1 text-[14.5px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">{step.title}</p>
              {step.content}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* InstallationTabs                                                   */
/* ------------------------------------------------------------------ */

export interface InstallationTabsProps {
  registry?: string | null;
  dependencies?: string;
  utilsFileName?: string | null;
  utilsCode?: string;
  componentFileName: string;
  componentCode: string;
  language?: string;
}

export function InstallationTabs({
  registry,
  dependencies,
  utilsFileName = "lib/utils.ts",
  utilsCode,
  componentFileName,
  componentCode,
  language = "tsx",
}: InstallationTabsProps) {
  const [mode, setMode] = useState<"cli" | "manual">(registry ? "cli" : "manual");

  const manualSteps: { title: string; content: ReactNode }[] = [];
  if (dependencies?.trim()) {
    manualSteps.push({
      title: "Install dependencies",
      content: <CommandPanel build={(pm) => installCommand(dependencies.trim(), pm)} />,
    });
  }
  if (utilsFileName && utilsCode) {
    manualSteps.push({
      title: "Add the util file",
      content: <CodePanel code={utilsCode} language="ts" fileName={utilsFileName} />,
    });
  }
  manualSteps.push({
    title: "Copy the source code",
    content: <CodePanel code={componentCode} language={language} fileName={componentFileName} collapsible />,
  });
  manualSteps.push({
    title: "Update the import paths to match your project setup.",
    content: null,
  });

  return (
    <div className="not-prose my-6 flex flex-col gap-5">
      {registry && (
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: "cli", label: "CLI" },
            { value: "manual", label: "Manual" },
          ]}
        />
      )}
      <motion.div key={mode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        {mode === "cli" && registry ? (
          <Steps
            steps={[
              {
                title: "Run the following command",
                content: <CommandPanel build={(pm) => registryCommand(registry, pm)} />,
              },
            ]}
          />
        ) : (
          <Steps steps={manualSteps} />
        )}
      </motion.div>
    </div>
  );
}

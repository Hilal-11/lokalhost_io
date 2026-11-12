"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { Terminal } from "lucide-react";
import type { FrameworkDoc } from "@/lib/mobile/docs.server";
import { CodeBlock, CommandBlock, SnippetBlock } from "./code-block";
import { Segmented } from "./primitives";

/* ------------------------------------------------------------------ */
/* Vertical stepper: numbered dots joined by a 1px line.              */
/* ------------------------------------------------------------------ */

export function InstallStepper({ steps }: { steps: { title: ReactNode; body?: ReactNode }[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {steps.map((s, i) => (
        <li key={i} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 pb-8 last:pb-0">
          {i < steps.length - 1 && (
            <span aria-hidden className="absolute bottom-0 left-[13.5px] top-8 w-px bg-lk-border" />
          )}
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-full border border-lk-border bg-lk-surface font-mono text-[12px] font-medium text-lk-fg"
          >
            {i + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <h4 className="m-0 text-[14px] font-medium text-lk-fg">{s.title}</h4>
            {s.body && <div className="mt-3 flex flex-col gap-3 text-[14px] text-lk-muted">{s.body}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[5px] border border-lk-border bg-lk-surface px-1.5 py-0.5 font-mono text-[12.5px] text-lk-fg">
      {children}
    </code>
  );
}

/* ------------------------------------------------------------------ */
/* Installation section — [CLI] [Manual]                              */
/* ------------------------------------------------------------------ */

export function Installation({ doc, uses }: { doc: FrameworkDoc; uses: { title: string; href: string }[] }) {
  const [mode, setMode] = useState<"cli" | "manual">("cli");
  const isRn = doc.framework === "react-native";
  const [demo, main, theme] = doc.files;

  const usesNote =
    uses.length > 0 ? (
      <p className="m-0 text-[13px]">
        Also installs{" "}
        {uses.map((u, i) => (
          <span key={u.href}>
            <Link href={u.href} className="lk-focus rounded text-lk-fg underline decoration-lk-border-strong underline-offset-4 hover:decoration-lk-fg">
              {u.title}
            </Link>
            {i < uses.length - 1 ? ", " : ""}
          </span>
        ))}
        .
      </p>
    ) : null;

  const cliSteps = [
    {
      title: "Run the following command",
      body: (
        <>
          <CommandBlock commands={doc.cli} />
          {usesNote}
        </>
      ),
    },
    {
      title: "Import and use it",
      body: (
        <p className="m-0">
          The source is copied to <InlineCode>{doc.target}</InlineCode> — it’s yours to edit.
        </p>
      ),
    },
  ];

  const manualSteps = [
    ...(doc.deps
      ? [
          {
            title: "Install the dependencies",
            body: (
              <>
                <SnippetBlock snippet={doc.deps} title={isRn ? "Expo" : "Flutter"} icon={<Terminal size={13} aria-hidden />} lineNumbers={false} />
                {isRn && (
                  <p className="m-0 text-[13px]">
                    Bare React Native? Install with your package manager, then run <InlineCode>npx pod-install</InlineCode>.
                    {doc.dependencies.includes("react-native-reanimated") && (
                      <> Add the Reanimated Babel plugin if your template doesn’t already include it.</>
                    )}
                  </p>
                )}
              </>
            ),
          },
        ]
      : []),
    {
      title: "Add the theme tokens (once per project)",
      body: <CodeBlock files={[theme]} maxHeight={280} />,
    },
    {
      title: "Copy the source into your project",
      body: <CodeBlock files={[main]} maxHeight={360} />,
    },
    {
      title: "Update the import paths to match your project",
      body: (
        <p className="m-0">
          {isRn ? (
            <>
              Snippets import from <InlineCode>@/components/ui</InlineCode> and <InlineCode>@/lib/theme</InlineCode>. Add a{" "}
              <InlineCode>@/*</InlineCode> path alias in <InlineCode>tsconfig.json</InlineCode> or switch to relative imports.
            </>
          ) : (
            <>
              Widgets import <InlineCode>../theme/lk_theme.dart</InlineCode>. Keep the folder layout or replace with{" "}
              <InlineCode>package:your_app/…</InlineCode> imports.
            </>
          )}
          {uses.length > 0 && <> Repeat for: {uses.map((u) => u.title).join(", ")}.</>}
        </p>
      ),
    },
    {
      title: "Try the demo",
      body: <CodeBlock files={[demo]} maxHeight={300} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Segmented
        label="Installation method"
        value={mode}
        onChange={setMode}
        controls="install"
        options={[
          { value: "cli", label: "CLI" },
          { value: "manual", label: "Manual" },
        ]}
        className="self-start"
      />
      <div id={`install-${mode}`} role="tabpanel">
        <InstallStepper steps={mode === "cli" ? cliSteps : manualSteps} />
      </div>
    </div>
  );
}

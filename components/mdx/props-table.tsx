"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PropRow {
  name: string;
  type: string;
  description: string;
  /** Default value. If omitted, a trailing "Defaults to X." in the description is used. */
  default?: string;
  required?: boolean;
}

export interface PropsTableProps {
  rows: PropRow[];
  className?: string;
  /** Optional caption shown above the table, e.g. the component name. */
  title?: string;
  /** Rows shown before "Show all". Defaults to 8. */
  initialRows?: number;
}

const DEFAULT_RE = /\s*Defaults? to\s+(.+?)\.?\s*$/i;

function splitDefault(row: PropRow): { description: string; def?: string } {
  if (row.default !== undefined) return { description: row.description, def: row.default };
  const m = row.description.match(DEFAULT_RE);
  if (!m) return { description: row.description };
  return {
    description: row.description.replace(DEFAULT_RE, "").trim(),
    def: m[1],
  };
}

function parseLiteralUnion(type: string): string[] | null {
  const parts = type.split("|").map((p) => p.trim());
  return parts.length > 1 && parts.every((p) => /^".*"$/.test(p)) ? parts : null;
}

const chip =
  "inline-flex items-center rounded-md border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[12px] leading-none text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300";

function TypeCell({ type }: { type: string }) {
  const union = parseLiteralUnion(type);
  if (union) {
    return (
      <div className="flex flex-wrap gap-1">
        {union.map((v) => (
          <code key={v} className={chip}>
            {v}
          </code>
        ))}
      </div>
    );
  }
  return <code className={cn(chip, "whitespace-normal break-words leading-snug")}>{type}</code>;
}

export default function PropsTable({ rows, className, title, initialRows = 8 }: PropsTableProps) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = rows.length > initialRows + 2;
  const visible = collapsible && !expanded ? rows.slice(0, initialRows) : rows;

  return (
    <div className={cn("not-prose my-6", className)} data-slot="props-table">
      {title && <p className="mb-2 font-mono text-[13px] font-medium text-neutral-500 dark:text-neutral-400">{title}</p>}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
                {["Prop", "Type", "Default", "Description"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => {
                const { description, def } = splitDefault(row);
                return (
                  <tr
                    key={row.name}
                    className="border-b border-neutral-200/70 transition-colors last:border-0 hover:bg-neutral-50/70 dark:border-neutral-800/70 dark:hover:bg-neutral-900/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3 align-top">
                      <code className={cn(chip, "font-medium text-neutral-900 dark:text-neutral-100")}>
                        {row.name}
                        {row.required && (
                          <span className="ml-0.5 text-rose-500" title="Required">
                            *
                          </span>
                        )}
                      </code>
                    </td>
                    <td className="max-w-[280px] px-4 py-3 align-top">
                      <TypeCell type={row.type} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-[12.5px] text-neutral-600 dark:text-neutral-400">
                      {def ?? <span className="text-neutral-400 dark:text-neutral-600">—</span>}
                    </td>
                    <td className="px-4 py-3 align-top text-[13.5px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {collapsible && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-black" />
        )}
      </div>

      {collapsible && (
        <div className={cn("flex justify-center", !expanded ? "-mt-5 relative" : "mt-3")}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:-translate-y-px hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
          >
            {expanded ? "Show less" : `Show all ${rows.length} props`}
            <ChevronDown size={13} className={cn("transition-transform duration-200", expanded && "rotate-180")} />
          </button>
        </div>
      )}
    </div>
  );
}

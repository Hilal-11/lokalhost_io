import type { PropDef } from "@/lib/mobile/types";

/* Bordered rows, no zebra, mono pills. Scrolls horizontally on small screens. */
export function MobilePropsTable({ props }: { props: PropDef[] }) {
  if (!props.length) return null;
  return (
    <div className="lk-scroll overflow-x-auto rounded-lk-card border border-lk-border" tabIndex={0} role="region" aria-label="Props">
      <table className="m-0 w-full min-w-[640px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-lk-border bg-lk-surface">
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 text-[12.5px] font-medium text-lk-fg">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-lk-border align-top last:border-b-0">
              <td className="whitespace-nowrap px-4 py-3">
                <code className="rounded-[5px] bg-lk-surface px-1.5 py-0.5 font-mono text-[12px] text-lk-fg">{p.name}</code>
                {p.required && (
                  <span className="ml-1.5 text-[11px] text-lk-subtle" title="Required">
                    required
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <code className="inline-block max-w-[280px] break-words rounded-[5px] bg-lk-surface px-1.5 py-0.5 font-mono text-[12px] text-lk-muted">
                  {p.type}
                </code>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-lk-muted">{p.default ?? "—"}</td>
              <td className="px-4 py-3 leading-relaxed text-lk-muted">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

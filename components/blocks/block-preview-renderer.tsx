"use client";

import * as React from "react";
import { blockLoaders } from "@/components/lokalhost_io/blocks";

/** Message the preview iframe sends to its parent whenever its height changes. */
export const BLOCK_HEIGHT_MESSAGE = "lk-block-height";

/**
 * Renders one block by key and keeps the parent frame informed of its height,
 * so docs previews never show an inner scrollbar or empty space.
 */
export function BlockPreviewRenderer({ id }: { id: string }) {
  const [Comp, setComp] = React.useState<React.ComponentType | null>(null);
  const [missing, setMissing] = React.useState(false);

  React.useEffect(() => {
    const load = blockLoaders[id];
    if (!load) {
      setMissing(true);
      return;
    }
    let alive = true;
    load()
      .then((m) => alive && setComp(() => m.default))
      .catch(() => alive && setMissing(true));
    return () => {
      alive = false;
    };
  }, [id]);

  React.useEffect(() => {
    if (window.parent === window) return;
    const post = () =>
      window.parent.postMessage({ type: BLOCK_HEIGHT_MESSAGE, id, height: document.documentElement.scrollHeight }, window.location.origin);
    post();
    const ro = new ResizeObserver(post);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [id, Comp]);

  if (missing) {
    return (
      <div className="flex min-h-[320px] items-center justify-center p-8 text-center font-sans text-sm text-neutral-500">
        No preview loader registered for “{id}”. Add it to components/lokalhost_io/blocks/index.ts.
      </div>
    );
  }
  if (!Comp) return <div className="min-h-[320px]" aria-busy="true" />;
  return <Comp />;
}

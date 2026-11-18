import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { BlockArt as ArtKind } from "@/lib/blocks/catalog";

/* Monochrome wireframes for category covers until real screenshots exist. */

const line = "rounded-full bg-neutral-200 dark:bg-neutral-800";
const soft = "rounded-full bg-neutral-100 dark:bg-neutral-800/60";
const ink = "bg-neutral-900 dark:bg-neutral-200";
const box = "rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900";

const Bar = ({ w, className }: { w: string; className?: string }) => <div className={cn("h-1.5", line, className)} style={{ width: w }} />;

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex h-full w-full flex-col gap-3 p-5", className)}>{children}</div>;
}

function MiniNav() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className={cn("size-3.5 rounded", ink)} />
        <Bar w="44px" />
      </div>
      <div className="flex gap-2">
        <Bar w="22px" />
        <Bar w="22px" />
        <Bar w="22px" />
      </div>
      <div className={cn("h-4 w-11 rounded-md", ink)} />
    </div>
  );
}

function HeroCopy({ center = true }: { center?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-2", center && "items-center")}>
      <div className={cn("h-3.5 w-24 rounded-full border border-neutral-200 dark:border-neutral-800")} />
      <div className={cn("h-3 w-4/5 rounded", ink)} />
      <div className={cn("h-3 w-3/5 rounded", ink)} />
      <Bar w="70%" className="mt-1" />
      <Bar w="50%" className={soft} />
      <div className="mt-1 flex gap-1.5">
        <div className={cn("h-5 w-16 rounded-md", ink)} />
        <div className={cn("h-5 w-14 rounded-md", box)} />
      </div>
    </div>
  );
}

const ART: Record<ArtKind, () => ReactNode> = {
  landing: () => (
    <Frame>
      <MiniNav />
      <div className="flex flex-1 items-center justify-center">
        <HeroCopy />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-10", box)} />
        ))}
      </div>
    </Frame>
  ),
  hero: () => (
    <Frame className="justify-center">
      <HeroCopy />
      <div className={cn("mx-auto mt-1 h-16 w-4/5", box)} />
    </Frame>
  ),
  features: () => (
    <Frame className="justify-center">
      <Bar w="40%" className="mx-auto" />
      <div className="grid grid-cols-3 gap-2.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={cn("flex flex-col gap-1.5 p-2", box)}>
            <div className="size-3.5 rounded bg-neutral-200 dark:bg-neutral-700" />
            <Bar w="80%" />
            <Bar w="60%" className={soft} />
          </div>
        ))}
      </div>
    </Frame>
  ),
  bento: () => (
    <Frame>
      <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-2">
        <div className={cn("col-span-2", box)} />
        <div className={box} />
        <div className={box} />
        <div className={cn("col-span-2", box)} />
      </div>
    </Frame>
  ),
  logos: () => (
    <Frame className="justify-center">
      <Bar w="45%" className="mx-auto" />
      <div className="mt-2 grid grid-cols-4 gap-3">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="size-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <Bar w="60%" />
          </div>
        ))}
      </div>
    </Frame>
  ),
  testimonials: () => (
    <Frame className="justify-center">
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("flex flex-col gap-1.5 p-2.5", box, i === 1 && "-translate-y-2")}>
            <Bar w="90%" className={soft} />
            <Bar w="75%" className={soft} />
            <Bar w="85%" className={soft} />
            <div className="mt-1 flex items-center gap-1.5">
              <div className="size-4 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <Bar w="50%" />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  ),
  pricing: () => (
    <Frame className="justify-center">
      <div className="grid grid-cols-3 items-end gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("flex flex-col gap-1.5 p-2.5", i === 1 ? "rounded-lg bg-neutral-900 dark:bg-neutral-100" : box, i === 1 ? "h-28" : "h-24")}>
            <div className={cn("h-1.5 w-1/2 rounded-full", i === 1 ? "bg-neutral-600 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-700")} />
            <div className={cn("h-3 w-2/3 rounded", i === 1 ? "bg-neutral-500 dark:bg-neutral-400" : "bg-neutral-300 dark:bg-neutral-700")} />
            <div className={cn("mt-auto h-4 rounded-md", i === 1 ? "bg-white dark:bg-neutral-900" : ink)} />
          </div>
        ))}
      </div>
    </Frame>
  ),
  cta: () => (
    <Frame className="justify-center">
      <div className={cn("flex flex-col items-center gap-2 p-5", box)}>
        <div className={cn("h-3 w-3/5 rounded", ink)} />
        <Bar w="70%" className={soft} />
        <div className="mt-1 flex gap-1.5">
          <div className={cn("h-5 w-16 rounded-md", ink)} />
          <div className="h-5 w-14 rounded-md border border-neutral-200 dark:border-neutral-700" />
        </div>
      </div>
    </Frame>
  ),
  faq: () => (
    <Frame className="justify-center">
      <Bar w="35%" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={cn("flex items-center justify-between px-3 py-2", box)}>
          <Bar w={`${50 + i * 8}%`} />
          <div className="size-2.5 rounded-sm border border-neutral-300 dark:border-neutral-600" />
        </div>
      ))}
    </Frame>
  ),
  navbar: () => (
    <Frame className="justify-center gap-4">
      <div className={cn("px-3 py-2.5", box)}>
        <MiniNav />
      </div>
      <div className={cn("ml-auto flex w-2/5 flex-col gap-1.5 p-2.5", box)}>
        <Bar w="80%" />
        <Bar w="60%" className={soft} />
        <Bar w="70%" className={soft} />
      </div>
    </Frame>
  ),
  footer: () => (
    <Frame className="justify-end">
      <div className={cn("grid grid-cols-4 gap-3 p-3", box)}>
        <div className="flex flex-col gap-1.5">
          <div className={cn("size-3.5 rounded", ink)} />
          <Bar w="80%" className={soft} />
        </div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Bar w="60%" />
            <Bar w="80%" className={soft} />
            <Bar w="70%" className={soft} />
          </div>
        ))}
      </div>
    </Frame>
  ),
  background: () => (
    <div
      className="h-full w-full text-neutral-300 dark:text-neutral-700"
      style={{
        backgroundImage:
          "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
      }}
    />
  ),
  illustration: () => (
    <Frame className="items-center justify-center">
      <div className="relative size-28">
        <div className="absolute inset-0 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700" />
        <div className="absolute inset-5 rounded-full border border-neutral-300 dark:border-neutral-700" />
        <div className={cn("absolute inset-10 rounded-full", ink)} />
        <div className={cn("absolute -right-2 top-4 h-6 w-12", box)} />
        <div className={cn("absolute -left-3 bottom-5 h-6 w-10", box)} />
      </div>
    </Frame>
  ),
  shader: () => (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute -inset-10 rotate-[-18deg] bg-[repeating-linear-gradient(90deg,var(--color-neutral-200)_0_14px,var(--color-neutral-300)_14px_28px,var(--color-neutral-100)_28px_42px)] opacity-80 [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_60%,transparent)] dark:bg-[repeating-linear-gradient(90deg,var(--color-neutral-800)_0_14px,var(--color-neutral-700)_14px_28px,var(--color-neutral-900)_28px_42px)]" />
    </div>
  ),
  auth: () => (
    <Frame className="items-center justify-center">
      <div className={cn("flex w-44 flex-col gap-2 p-3", box)}>
        <div className={cn("mx-auto size-4 rounded", ink)} />
        <Bar w="60%" className="mx-auto" />
        <div className="h-5 rounded-md border border-neutral-200 dark:border-neutral-700" />
        <div className="h-5 rounded-md border border-neutral-200 dark:border-neutral-700" />
        <div className={cn("h-5 rounded-md", ink)} />
      </div>
    </Frame>
  ),
  contact: () => (
    <Frame className="justify-center">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <div className={cn("h-3 w-4/5 rounded", ink)} />
          <Bar w="90%" className={soft} />
          <Bar w="70%" className={soft} />
          <div className="mt-2 flex items-center gap-1.5">
            <div className="size-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <Bar w="50%" />
          </div>
        </div>
        <div className={cn("flex flex-col gap-1.5 p-2.5", box)}>
          <div className="h-4 rounded border border-neutral-200 dark:border-neutral-700" />
          <div className="h-4 rounded border border-neutral-200 dark:border-neutral-700" />
          <div className="h-8 rounded border border-neutral-200 dark:border-neutral-700" />
          <div className={cn("h-4 rounded", ink)} />
        </div>
      </div>
    </Frame>
  ),
};

export function BlockArt({ kind, className }: { kind: ArtKind; className?: string }) {
  const Art = ART[kind];
  return (
    <div aria-hidden className={cn("pointer-events-none h-full w-full select-none", className)}>
      <Art />
    </div>
  );
}

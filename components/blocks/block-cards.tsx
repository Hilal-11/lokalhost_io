import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockArt } from "./block-art";
import { categoryHref, countBlocks, type BlockCategory } from "@/lib/blocks/catalog";

const ring =
  "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-black";

export function CountChip({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-md border px-2 text-[11.5px] font-medium tabular-nums",
        count > 0
          ? "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
          : "border-dashed border-neutral-300 text-neutral-400 dark:border-neutral-700 dark:text-neutral-500",
        className
      )}
    >
      {count > 0 ? `${count} block${count === 1 ? "" : "s"}` : "Coming soon"}
    </span>
  );
}

/** Category tile used on /docs/blocks (cover + title + count + description). */
export function CategoryCard({ category, priority = false }: { category: BlockCategory; priority?: boolean }) {
  const count = countBlocks(category.slug);
  return (
    <Link
      href={categoryHref(category.slug)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 font-sans",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow,transform] duration-300",
        "hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.25)]",
        "dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700 dark:hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.9)]",
        ring
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200/80 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50">
        {category.cover ? (
          <Image
            src={category.cover}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
            <BlockArt kind={category.art} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-3 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-[16px] font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {category.title}
            <CountChip count={count} />
          </h3>
          <ChevronRight className="size-4 shrink-0 text-neutral-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:text-neutral-700 dark:group-hover:text-neutral-100" />
        </div>
        <p className="line-clamp-2 text-[13px] leading-5 text-neutral-500 dark:text-neutral-400">{category.description}</p>
      </div>
    </Link>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1 font-sans text-[13px] text-neutral-500 dark:text-neutral-400">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3.5 text-neutral-300 dark:text-neutral-700" />}
          {it.href ? (
            <Link href={it.href} className={cn("transition-colors hover:text-neutral-900 dark:hover:text-neutral-100", ring)}>
              {it.label}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-neutral-900 dark:text-neutral-100">
              {it.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

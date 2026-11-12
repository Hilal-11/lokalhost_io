import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Layout: content column + optional right rail (≥1280px).            */
/* ------------------------------------------------------------------ */

export function PageLayout({ children, rail }: { children: ReactNode; rail?: ReactNode }) {
  return (
    <div className="flex justify-center">
      <article className="min-w-0 flex-1 px-4 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-10">
        <div className="mx-auto w-full max-w-[var(--lk-content-max)]">{children}</div>
      </article>
      {rail && (
        <aside
          aria-label="On this page"
          className="lk-scroll sticky top-0 hidden h-dvh w-[var(--lk-toc-w)] shrink-0 overflow-y-auto py-10 pr-6 xl:block"
        >
          {rail}
        </aside>
      )}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { title: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 text-[13px] text-lk-subtle">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.title}-${i}`} className="flex items-center gap-1">
              {it.href && !last ? (
                <Link href={it.href} className="lk-focus lk-transition rounded hover:text-lk-fg">
                  {it.title}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "font-medium text-lk-fg")}>
                  {it.title}
                </span>
              )}
              {!last && <ChevronRight size={13} className="text-lk-border-strong" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)] md:items-start md:gap-10">
        <h1 className="m-0 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-lk-fg sm:text-[36px]">{title}</h1>
        {description && <p className="m-0 text-[15px] leading-relaxed text-lk-muted md:pt-2 md:text-right">{description}</p>}
      </div>
      {children && <div className="mt-6 flex flex-wrap items-center gap-3">{children}</div>}
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

interface Neighbour {
  title: string;
  href: string;
  kind?: string;
}

function NeighbourCard({ n, dir }: { n: Neighbour; dir: "prev" | "next" }) {
  const next = dir === "next";
  return (
    <Link
      href={n.href}
      className={cn(
        "lk-focus lk-transition group flex flex-col gap-1 rounded-lk-card border border-lk-border p-4 hover:border-lk-border-strong hover:bg-lk-bg-subtle",
        next && "items-end text-right"
      )}
    >
      <span className="flex items-center gap-1 text-[12px] text-lk-subtle">
        {!next && <ArrowLeft size={13} className="lk-transition group-hover:-translate-x-0.5" aria-hidden />}
        {next ? "Next" : "Previous"}
        {n.kind && <span className="text-lk-border-strong">·</span>}
        {n.kind}
        {next && <ArrowRight size={13} className="lk-transition group-hover:translate-x-0.5" aria-hidden />}
      </span>
      <span className="text-[15px] font-medium text-lk-fg">{n.title}</span>
    </Link>
  );
}

const SPONSOR_SLOTS = ["Your logo", "Your logo", "Your logo"];

export function PageFooter({
  previous,
  next,
  editPath,
}: {
  previous?: Neighbour;
  next?: Neighbour;
  /** repo-relative path for "Edit on GitHub" */
  editPath?: string;
}) {
  return (
    <footer className="mt-16 flex flex-col gap-8">
      {(previous || next) && (
        <nav aria-label="Pagination" className="grid gap-3 sm:grid-cols-2">
          {previous ? <NeighbourCard n={previous} dir="prev" /> : <span className="hidden sm:block" />}
          {next && <NeighbourCard n={next} dir="next" />}
        </nav>
      )}
      <div className="flex flex-col gap-4 border-t border-lk-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-lk-subtle">
          <span>Powered by</span>
          {SPONSOR_SLOTS.map((s, i) => (
            <a
              key={i}
              href="mailto:hello@lokalhost.io?subject=Sponsor%20lokalhost.io%20mobile"
              className="lk-focus lk-transition inline-flex items-center gap-1.5 rounded text-lk-muted hover:text-lk-fg"
            >
              <span className="flex size-5 items-center justify-center rounded border border-dashed border-lk-border-strong">
                <Plus size={11} aria-hidden />
              </span>
              {s}
            </a>
          ))}
        </div>
        {editPath && (
          <a
            href={`https://github.com/Hilal-11/lokalhost.io/edit/main/${editPath}`}
            target="_blank"
            rel="noreferrer"
            className="lk-focus lk-transition inline-flex w-fit items-center gap-1.5 rounded text-[13px] text-lk-muted hover:text-lk-fg"
          >
            <Pencil size={13} aria-hidden />
            Edit on GitHub
          </a>
        )}
      </div>
    </footer>
  );
}

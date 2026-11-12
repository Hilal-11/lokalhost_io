import { PageLayout } from "@/components/mobile/page/chrome";

/** Route-level skeleton: breadcrumb, header, preview panel. */
export default function Loading() {
  const bar = "animate-pulse rounded-lk bg-lk-surface-2";
  return (
    <PageLayout>
      <div aria-busy="true" aria-label="Loading" className="flex flex-col gap-6">
        <div className={`${bar} h-3.5 w-40`} />
        <div className="flex flex-col gap-3 md:flex-row md:justify-between">
          <div className={`${bar} h-9 w-64`} />
          <div className={`${bar} h-4 w-80`} />
        </div>
        <div className="overflow-hidden rounded-lk-card border border-lk-border">
          <div className="flex h-12 items-center justify-between border-b border-lk-border px-3">
            <div className={`${bar} h-7 w-40`} />
            <div className={`${bar} h-7 w-52`} />
          </div>
          <div className="flex h-[560px] items-center justify-center lk-dots">
            <div className={`${bar} h-[460px] w-[220px] rounded-[40px]`} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

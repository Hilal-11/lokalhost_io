"use client";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { cn } from "@/lib/utils";

// ─── Shared skeleton primitives ───────────────────────────────────────────────
const Bar = ({ w = "w-full", h = "h-1.5", bg = "bg-neutral-200 dark:bg-neutral-800", extra = "" }) => (
  <div className={cn("rounded-full", w, h, bg, extra)} />
);
const Block = ({ className = "", children }: { className?: string; children?: React.ReactNode }) => (
  <div className={cn("rounded-lg", className)}>{children}</div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE SKELETONS
// ═══════════════════════════════════════════════════════════════════════════════

// 1 — SaaS Hero + Features
const LPSaaS = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    {/* nav */}
    <div className="flex items-center justify-between px-2 py-1.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center gap-1.5">
        <Block className="w-4 h-4 bg-neutral-900 dark:bg-neutral-400" />
        <Bar w="w-14" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <div className="flex items-center gap-2">
        <Bar w="w-6" h="h-1.5" />
        <Bar w="w-6" h="h-1.5" />
        <Bar w="w-6" h="h-1.5" />
        <Block className="h-5 w-14 rounded-full bg-neutral-900 dark:bg-neutral-600" />
      </div>
    </div>
    {/* hero */}
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2">
      <Block className="h-4 w-20 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800" />
      <Block className="h-6 w-4/5 bg-neutral-900 dark:bg-neutral-200" />
      <Block className="h-6 w-3/5 bg-neutral-700 dark:bg-neutral-400" />
      <Bar w="w-4/5" bg="bg-neutral-200 dark:bg-neutral-800" />
      <Bar w="w-3/5" bg="bg-neutral-100 dark:bg-neutral-800/60" />
      <div className="flex gap-2 mt-1">
        <Block className="h-7 w-24 bg-neutral-900 dark:bg-neutral-600 rounded-xl" />
        <Block className="h-7 w-20 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl" />
      </div>
      <Bar w="w-32" h="h-1" bg="bg-neutral-100 dark:bg-neutral-800/40" extra="mt-1" />
    </div>
    {/* feature row */}
    <div className="grid grid-cols-3 gap-1.5">
      {[...Array(3)].map((_, i) => (
        <Block key={i} className="p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-1">
          <Block className="w-4 h-4 rounded-md bg-neutral-200 dark:bg-neutral-700" />
          <Bar w="w-full" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
          <Bar w="w-3/4" h="h-1" bg="bg-neutral-100 dark:bg-neutral-800/50" />
        </Block>
      ))}
    </div>
  </div>
);

// 2 — Product Hunt style launch
const LPProductLaunch = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex justify-between items-center">
      <Bar w="w-20" bg="bg-neutral-800 dark:bg-neutral-300" />
      <div className="flex gap-1.5">
        {[...Array(3)].map((_, i) => <Block key={i} className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800" />)}
      </div>
    </div>
    <div className="flex-1 grid grid-cols-5 gap-3 items-center">
      {/* left copy */}
      <div className="col-span-3 flex flex-col gap-2">
        <Block className="h-4 w-20 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800" />
        <Block className="h-5 w-full bg-neutral-900 dark:bg-neutral-200 rounded-lg" />
        <Block className="h-5 w-4/5 bg-neutral-700 dark:bg-neutral-400 rounded-lg" />
        <Bar w="w-full" bg="bg-neutral-200 dark:bg-neutral-800" />
        <Bar w="w-4/5" bg="bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="flex gap-2 mt-1">
          <Block className="h-6 w-20 rounded-lg bg-orange-500 dark:bg-orange-700" />
          <Block className="h-6 w-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex -space-x-1">
            {[...Array(4)].map((_, i) => <Block key={i} className="w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-700 border border-white dark:border-neutral-900" />)}
          </div>
          <Bar w="w-16" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
      {/* right visual */}
      <div className="col-span-2 flex flex-col gap-2">
        <Block className="w-full aspect-square rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-neutral-800 dark:to-neutral-700 border border-neutral-200 dark:border-neutral-700" />
      </div>
    </div>
    {/* logos */}
    <div className="flex justify-center gap-3">
      {[...Array(5)].map((_, i) => <Block key={i} className="h-3 w-10 rounded bg-neutral-100 dark:bg-neutral-800" />)}
    </div>
  </div>
);

// 3 — Waitlist / early access
const LPWaitlist = () => (
  <div className="flex flex-col w-full h-full overflow-hidden bg-neutral-950 dark:bg-neutral-950 rounded-lg">
    {/* noise texture overlay hint */}
    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
    <div className="flex flex-col items-center justify-center flex-1 gap-3 px-4 py-3 relative">
      <Block className="w-8 h-8 rounded-xl bg-white/10 border border-white/20" />
      <div className="flex flex-col items-center gap-1.5">
        <Block className="h-5 w-3/4 rounded-lg bg-white/80" />
        <Block className="h-5 w-1/2 rounded-lg bg-white/60" />
        <Bar w="w-4/5" bg="bg-white/20" extra="mt-1" />
        <Bar w="w-2/3" bg="bg-white/10" />
      </div>
      <div className="flex w-full gap-1.5 mt-1">
        <Block className="flex-1 h-7 rounded-lg bg-white/10 border border-white/20" />
        <Block className="h-7 w-16 rounded-lg bg-white/90" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1">
          {[...Array(4)].map((_, i) => <Block key={i} className="w-4 h-4 rounded-full bg-white/30 border border-neutral-900" />)}
        </div>
        <Bar w="w-20" h="h-1" bg="bg-white/20" />
      </div>
    </div>
    {/* bottom bar */}
    <div className="h-8 border-t border-white/10 flex items-center justify-center gap-4 px-4">
      {[...Array(4)].map((_, i) => <Bar key={i} w="w-8" h="h-1" bg="bg-white/20" />)}
    </div>
  </div>
);

// 4 — Mobile app landing
const LPMobileApp = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Block className="w-5 h-5 rounded-xl bg-neutral-900 dark:bg-neutral-500" />
        <Bar w="w-12" bg="bg-neutral-800 dark:bg-neutral-300" />
      </div>
      <Block className="h-5 w-14 rounded-full bg-neutral-900 dark:bg-neutral-600" />
    </div>
    <div className="flex-1 flex gap-3 items-center">
      <div className="flex-1 flex flex-col gap-2">
        <Block className="h-4 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" />
        <Block className="h-4 w-full rounded-lg bg-neutral-900 dark:bg-neutral-200" />
        <Block className="h-4 w-4/5 rounded-lg bg-neutral-700 dark:bg-neutral-400" />
        <Bar w="w-full" bg="bg-neutral-200 dark:bg-neutral-800" extra="mt-1" />
        <Bar w="w-3/4" bg="bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="flex gap-1.5 mt-1">
          <Block className="h-5 w-16 rounded-md bg-neutral-900 dark:bg-neutral-700" />
          <Block className="h-5 w-16 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
        </div>
      </div>
      {/* Phone mockup */}
      <div className="w-14 shrink-0">
        <div className="w-full h-[100px] rounded-2xl border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 overflow-hidden flex flex-col p-1.5 gap-1 shadow-lg">
          <div className="mx-auto w-6 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <Block className="flex-1 rounded-md bg-neutral-200 dark:bg-neutral-800" />
          <Block className="h-4 w-full rounded-md bg-neutral-900 dark:bg-neutral-600" />
        </div>
      </div>
    </div>
    {/* store badges */}
    <div className="flex gap-2">
      {["App Store", "Google Play"].map((s) => (
        <Block key={s} className="flex-1 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
      ))}
    </div>
  </div>
);

// 5 — Agency / creative studio
const LPAgency = () => (
  <div className="flex flex-col w-full h-full gap-0 overflow-hidden bg-neutral-900 dark:bg-neutral-950 rounded-lg px-3 py-2.5">
    <div className="flex items-center justify-between mb-2">
      <Bar w="w-16" bg="bg-white/60" />
      <div className="flex gap-2">{[...Array(3)].map((_, i) => <Bar key={i} w="w-8" bg="bg-white/20" />)}</div>
    </div>
    <div className="flex-1 grid grid-cols-5 gap-2">
      <div className="col-span-3 flex flex-col justify-center gap-2">
        <Block className="h-5 w-full rounded-lg bg-white/80" />
        <Block className="h-5 w-4/5 rounded-lg bg-white/60" />
        <Bar w="w-3/4" bg="bg-white/20" extra="mt-1" />
        <Bar w="w-2/3" bg="bg-white/15" />
        <div className="flex gap-2 mt-2">
          <Block className="h-6 w-20 rounded-lg bg-white/90" />
          <Block className="h-6 w-6 rounded-full bg-white/10 border border-white/20" />
        </div>
      </div>
      <div className="col-span-2 grid grid-rows-2 gap-2">
        <Block className="rounded-xl bg-white/5 border border-white/10" />
        <div className="grid grid-cols-2 gap-2">
          <Block className="rounded-xl bg-white/10 border border-white/10" />
          <Block className="rounded-xl bg-white/5 border border-white/10" />
        </div>
      </div>
    </div>
    <div className="h-7 border-t border-white/10 mt-2 flex items-center justify-between px-1">
      <div className="flex gap-2">{[...Array(5)].map((_, i) => <Bar key={i} w="w-8" h="h-1" bg="bg-white/20" />)}</div>
      <Bar w="w-12" h="h-1" bg="bg-white/10" />
    </div>
  </div>
);

// 6 — Pricing / subscription
const LPPricing = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex flex-col items-center gap-1">
      <Bar w="w-1/3" bg="bg-neutral-800 dark:bg-neutral-300" />
      <Bar w="w-1/2" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
    </div>
    {/* toggle */}
    <div className="flex justify-center">
      <Block className="h-5 w-28 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
    </div>
    {/* pricing cards */}
    <div className="flex-1 flex gap-2">
      {[false, true, false].map((hot, i) => (
        <div key={i} className={cn("flex-1 rounded-xl p-2 flex flex-col gap-1.5 border", hot ? "bg-neutral-900 dark:bg-neutral-800 border-neutral-800" : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800")}>
          {hot && <Block className="h-3 w-full rounded-full bg-amber-400/20 border border-amber-400/30 mx-auto" />}
          <Bar w={hot ? "w-1/2" : "w-2/3"} bg={hot ? "bg-neutral-600 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-700"} />
          <Block className={cn("h-4 w-3/4 rounded-md", hot ? "bg-neutral-600 dark:bg-neutral-300" : "bg-neutral-200 dark:bg-neutral-800")} />
          <div className="flex flex-col gap-1 mt-0.5">
            {[...Array(3)].map((_, j) => <Bar key={j} w={j === 0 ? "w-full" : j === 1 ? "w-4/5" : "w-3/5"} h="h-1" bg={hot ? "bg-neutral-700 dark:bg-neutral-400" : "bg-neutral-100 dark:bg-neutral-800/50"} />)}
          </div>
          <Block className={cn("h-5 w-full rounded-lg mt-auto", hot ? "bg-amber-400 dark:bg-amber-500" : "bg-neutral-800 dark:bg-neutral-700")} />
        </div>
      ))}
    </div>
    <Bar w="w-2/3" h="h-1" bg="bg-neutral-100 dark:bg-neutral-800/40" extra="mx-auto" />
  </div>
);

// 7 — Newsletter / blog
const LPNewsletter = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex items-center justify-between">
      <Bar w="w-16" bg="bg-neutral-800 dark:bg-neutral-300" />
      <div className="flex gap-2">{[...Array(3)].map((_, i) => <Bar key={i} w="w-8" />)}</div>
    </div>
    {/* featured post */}
    <div className="h-16 rounded-xl overflow-hidden relative flex flex-col justify-end p-2">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950" />
      <div className="relative flex flex-col gap-1">
        <Block className="h-3.5 w-4 rounded-full bg-emerald-400/70" />
        <Bar w="w-3/4" h="h-2" bg="bg-white/80" />
        <Bar w="w-1/2" h="h-1" bg="bg-white/40" />
      </div>
    </div>
    {/* articles grid */}
    <div className="flex-1 grid grid-cols-3 gap-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1">
          <Block className={cn("h-10 rounded-lg", i === 1 ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-100 dark:bg-neutral-800")} />
          <Bar w="w-full" h="h-1" />
          <Bar w="w-4/5" h="h-1" />
          <Bar w="w-1/2" h="h-1" bg="bg-neutral-100 dark:bg-neutral-800/50" />
        </div>
      ))}
    </div>
    {/* subscribe strip */}
    <div className="flex gap-1.5">
      <Block className="flex-1 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
      <Block className="h-6 w-14 rounded-lg bg-neutral-900 dark:bg-neutral-600" />
    </div>
  </div>
);

// 8 — Developer tool / OSS
const LPDevTool = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <Block className="w-4 h-4 rounded bg-neutral-900 dark:bg-neutral-400" />
        <Bar w="w-14" bg="bg-neutral-800 dark:bg-neutral-300" />
      </div>
      <div className="flex gap-1.5 items-center">
        <Block className="h-5 w-16 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <Block className="h-5 w-5 rounded-full bg-neutral-800 dark:bg-neutral-600" />
      </div>
    </div>
    <div className="flex-1 flex gap-3 items-center">
      <div className="flex-1 flex flex-col gap-2">
        <Block className="h-4 w-20 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
        <Block className="h-4 w-full rounded-lg bg-neutral-900 dark:bg-neutral-200" />
        <Block className="h-4 w-4/5 rounded-lg bg-neutral-700 dark:bg-neutral-400" />
        <Bar w="w-full" bg="bg-neutral-200 dark:bg-neutral-800" extra="mt-1" />
        <Bar w="w-3/4" bg="bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="flex gap-2 mt-2">
          <Block className="h-6 w-20 rounded-lg bg-neutral-900 dark:bg-neutral-600" />
          <Block className="h-6 w-20 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        </div>
      </div>
      {/* terminal */}
      <div className="w-[90px] shrink-0 h-20 rounded-xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 p-2 flex flex-col gap-1.5">
        <div className="flex gap-1">
          {["bg-red-400/60", "bg-yellow-400/60", "bg-green-400/60"].map((c, i) => <Block key={i} className={cn("w-1.5 h-1.5 rounded-full", c)} />)}
        </div>
        {[["bg-green-400/60 w-8", "bg-neutral-600 w-12"], ["bg-blue-400/40 w-12", "bg-neutral-600 w-6"], ["bg-neutral-700 w-16"], ["bg-yellow-400/40 w-10"]].map((row, i) => (
          <div key={i} className="flex gap-1.5" style={{ paddingLeft: i > 0 ? 8 : 0 }}>
            {row.map((cls, j) => <Bar key={j} w="" h="h-1" bg="" extra={cn("rounded-full", cls)} />)}
          </div>
        ))}
      </div>
    </div>
    {/* stat strip */}
    <div className="flex gap-3 justify-center">
      {[["12k+", "Stars"], ["98%", "Uptime"], ["MIT", "License"]].map(([v, l]) => (
        <div key={l} className="flex flex-col items-center gap-0.5">
          <Bar w="w-8" h="h-2" bg="bg-neutral-800 dark:bg-neutral-300" />
          <Bar w="w-6" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
        </div>
      ))}
    </div>
  </div>
);

// 9 — Fintech / Dashboard hero
const LPFintech = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex items-center justify-between">
      <Bar w="w-14" bg="bg-neutral-800 dark:bg-neutral-300" />
      <div className="flex items-center gap-1.5">
        <Block className="h-5 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <Block className="h-5 w-14 rounded-full bg-neutral-900 dark:bg-neutral-600" />
      </div>
    </div>
    <div className="flex-1 flex gap-3 items-center">
      <div className="flex-1 flex flex-col gap-2">
        <Block className="h-4 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800" />
        <Block className="h-5 w-full rounded-lg bg-neutral-900 dark:bg-neutral-200" />
        <Block className="h-5 w-3/5 rounded-lg bg-neutral-700 dark:bg-neutral-400" />
        <Bar w="w-full" bg="bg-neutral-200 dark:bg-neutral-800" extra="mt-1" />
        <Bar w="w-2/3" bg="bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="flex gap-2 mt-2">
          <Block className="h-6 w-24 rounded-xl bg-emerald-600 dark:bg-emerald-700" />
          <Block className="h-6 w-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        </div>
      </div>
      {/* mini dashboard card */}
      <div className="w-[88px] shrink-0 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow p-2 flex flex-col gap-1.5">
        <Bar w="w-2/3" h="h-1" bg="bg-neutral-300 dark:bg-neutral-700" />
        <Bar w="w-full" h="h-3" bg="bg-neutral-800 dark:bg-neutral-300" />
        <div className="flex items-end gap-0.5 h-8">
          {[30, 60, 45, 80, 50, 70, 55].map((h, i) => (
            <div key={i} className={cn("flex-1 rounded-sm", i === 3 ? "bg-emerald-500 dark:bg-emerald-600" : "bg-neutral-100 dark:bg-neutral-800")} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Block className="w-2 h-2 rounded-full bg-emerald-400" />
          <Bar w="w-8" h="h-1" bg="bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
    {/* trust logos */}
    <div className="flex justify-center gap-3">
      {[...Array(4)].map((_, i) => <Block key={i} className="h-3 w-10 rounded bg-neutral-100 dark:bg-neutral-800" />)}
    </div>
  </div>
);

// 10 — HR / Team tool
const LPTeam = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex items-center justify-between">
      <Bar w="w-16" bg="bg-neutral-800 dark:bg-neutral-300" />
      <Block className="h-5 w-14 rounded-full bg-neutral-900 dark:bg-neutral-600" />
    </div>
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-2 text-center">
      <div className="flex -space-x-2 mb-1">
        {["bg-neutral-200 dark:bg-neutral-700", "bg-neutral-300 dark:bg-neutral-600", "bg-neutral-500 dark:bg-neutral-500", "bg-neutral-700 dark:bg-neutral-400", "bg-neutral-900 dark:bg-neutral-300"].map((cls, i) => (
          <Block key={i} className={cn("w-7 h-7 rounded-full border-2 border-white dark:border-neutral-900", cls)} />
        ))}
      </div>
      <Block className="h-5 w-4/5 rounded-lg bg-neutral-900 dark:bg-neutral-200" />
      <Block className="h-5 w-3/5 rounded-lg bg-neutral-700 dark:bg-neutral-400" />
      <Bar w="w-4/5" bg="bg-neutral-200 dark:bg-neutral-800" />
      <Bar w="w-2/3" bg="bg-neutral-100 dark:bg-neutral-800/60" />
      <div className="flex gap-2 mt-1">
        <Block className="h-6 w-24 rounded-xl bg-neutral-900 dark:bg-neutral-600" />
        <Block className="h-6 w-20 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-1.5">
      {[["50+", "Integrations"], ["99.9%", "Uptime"], ["24/7", "Support"]].map(([v, l]) => (
        <div key={l} className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-1 items-center">
          <Bar w="w-6" h="h-2" bg="bg-neutral-800 dark:bg-neutral-300" />
          <Bar w="w-8" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
        </div>
      ))}
    </div>
  </div>
);

// 11 — Event / Conference
const LPEvent = () => (
  <div className="flex flex-col w-full h-full overflow-hidden rounded-lg">
    {/* hero band */}
    <div className="h-28 bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900 dark:from-neutral-900 dark:to-neutral-950 relative flex flex-col items-center justify-center gap-1.5 px-3">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg,rgba(255,255,255,0.1) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.1) 75%,transparent 75%)", backgroundSize: "8px 8px" }} />
      <Block className="h-3 w-16 rounded-full bg-white/20 border border-white/30" />
      <Bar w="w-3/4" h="h-3" bg="bg-white/80" />
      <Bar w="w-1/2" h="h-1.5" bg="bg-white/50" />
      <div className="flex gap-2 mt-1">
        <Block className="h-5 w-16 rounded-lg bg-white/90" />
        <Block className="h-5 w-16 rounded-lg bg-white/10 border border-white/30" />
      </div>
    </div>
    {/* speaker grid */}
    <div className="flex-1 flex flex-col gap-2 px-3 py-2">
      <Bar w="w-1/3" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
      <div className="grid grid-cols-4 gap-1.5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Block className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <Bar w="w-full" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
            <Bar w="w-3/4" h="h-1" bg="bg-neutral-100 dark:bg-neutral-800/50" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 12 — Portfolio / personal brand
const LPPortfolio = () => (
  <div className="flex flex-col w-full h-full gap-2 px-3 py-2.5 overflow-hidden">
    <div className="flex items-center justify-between">
      <Bar w="w-14" bg="bg-neutral-800 dark:bg-neutral-200" />
      <div className="flex gap-3">{[...Array(3)].map((_, i) => <Bar key={i} w="w-8" />)}</div>
    </div>
    <div className="flex-1 grid grid-cols-2 gap-3 items-center">
      <div className="flex flex-col gap-2">
        <Bar w="w-2/3" h="h-1.5" bg="bg-neutral-800 dark:bg-neutral-200" />
        <Bar w="w-full" h="h-1.5" bg="bg-neutral-800 dark:bg-neutral-200" />
        <Bar w="w-1/2" h="h-1.5" bg="bg-neutral-400 dark:bg-neutral-600" />
        <Bar w="w-4/5" bg="bg-neutral-200 dark:bg-neutral-800" extra="mt-1" />
        <Bar w="w-3/5" bg="bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="flex gap-2 mt-2">
          <Block className="h-6 w-16 rounded-full bg-neutral-900 dark:bg-neutral-200" />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => <Block key={i} className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />)}
          </div>
        </div>
      </div>
      <div className="relative flex items-center justify-center">
        <Block className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-700 dark:to-neutral-500 shadow-lg" />
        <Block className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow" />
      </div>
    </div>
    {/* project cards */}
    <div className="flex gap-1.5">
      {[...Array(3)].map((_, i) => (
        <Block key={i} className={cn("flex-1 h-8 rounded-lg border", i === 1 ? "bg-neutral-900 dark:bg-neutral-700 border-neutral-800" : "bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800")} />
      ))}
    </div>
  </div>
);

// ─── Template metadata ─────────────────────────────────────────────────────────
const LANDING_PAGES = [
  { component: LPSaaS,          label: "SaaS Hero",          tag: "SaaS"      },
  { component: LPProductLaunch, label: "Product Launch",     tag: "Launch"    },
  { component: LPWaitlist,      label: "Waitlist / Access",  tag: "Early"     },
  { component: LPMobileApp,     label: "Mobile App",         tag: "App"       },
  { component: LPAgency,        label: "Agency / Studio",    tag: "Creative"  },
  { component: LPPricing,       label: "Pricing Page",       tag: "Commerce"  },
  { component: LPNewsletter,    label: "Newsletter / Blog",  tag: "Content"   },
  { component: LPDevTool,       label: "Dev Tool / OSS",     tag: "Dev"       },
  { component: LPFintech,       label: "Fintech / Finance",  tag: "Finance"   },
  { component: LPTeam,          label: "Team / HR Tool",     tag: "Business"  },
  { component: LPEvent,         label: "Event / Conference", tag: "Event"     },
  { component: LPPortfolio,     label: "Portfolio",          tag: "Personal"  },
];

// ─── Main component ────────────────────────────────────────────────────────────
function LandingPagesShowcase() {
  return (
    <div className="w-full container max-w-[1580px] max-h-[1024px] lg:max-h-[870px]  overflow-hidden relative pb-16">
      <div className="w-full">

        {/* ── Header ── */}
        <div className="w-full max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Free to use
            </span>
          </div>
          <h1 className="font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 tracking-tight">
            Landing Pages by{" "}
            <span className="font-mono text-neutral-500 dark:text-neutral-500">lokalhost.io</span>
          </h1>
          <p className="text-sm font-sans font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Pixel-perfect, conversion-ready landing pages for every product and audience — built with React &amp; Next.js.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:px-10 py-10 gap-5 mask-b-from-20% to-95%">
          {LANDING_PAGES.map(({ component: Skeleton, label, tag }, index) => (
            <div
              key={index}
              className={cn(
                "group relative w-full lg:h-[260px] h-[250px] rounded-xl overflow-hidden flex flex-col",
                "bg-white dark:bg-neutral-950",
                "border border-neutral-200 dark:border-neutral-800",
                "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]",
                "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
                "hover:shadow-[0_4px_20px_rgba(0,0,0,0.09),0_1px_4px_rgba(0,0,0,0.05)]",
                "dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.55)]",
                "hover:border-neutral-300 dark:hover:border-neutral-700",
                "hover:-translate-y-1",
                "transition-all duration-300 ease-out"
              )}
            >
              {/* ── Preview area ── */}
              <div className="flex-1 relative overflow-hidden">
                {/* dot grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.018] dark:opacity-[0.035] pointer-events-none z-0"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(0,0,0,1) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />
                {/* skeleton */}
                <div className="relative z-10 w-full h-full">
                  <Skeleton />
                </div>
                {/* Coming Soon hover overlay */}
                <div className={cn(
                  "absolute inset-0 z-20 flex flex-col items-center justify-center gap-2",
                  "bg-white/85 dark:bg-neutral-950/90 backdrop-blur-[3px]",
                  "opacity-0 group-hover:opacity-100",
                  "transition-all duration-300"
                )}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600">{label}</p>
                </div>
              </div>

              {/* ── Footer strip ── */}
              <div className="shrink-0 h-[44px] px-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1 shrink-0">
                    {["bg-neutral-300 dark:bg-neutral-700", "bg-neutral-200 dark:bg-neutral-800", "bg-neutral-200 dark:bg-neutral-800"].map((cls, i) => (
                      <span key={i} className={cn("w-1.5 h-1.5 rounded-full", cls)} />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-500 truncate">{label}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
                    <span className="w-1 h-1 rounded-full bg-amber-400" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Soon</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">{tag}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="absolute bottom-0 w-full flex justify-center">
        <Link
          href="/landing-pages"
          className={cn(
            "flex gap-2 items-center justify-center relative bottom-2",
            "font-sans font-medium text-sm px-8 py-2.5 rounded-lg",
            "border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-700",
            "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
            "text-neutral-100",
            "shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]",
            "hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
            "transition-all duration-200"
          )}
        >
          Browse All Landing Pages
          <HiOutlineExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default LandingPagesShowcase;
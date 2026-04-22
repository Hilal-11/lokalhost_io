"use client";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { SiReact, SiFlutter } from "react-icons/si";
import { PiDeviceMobileFill } from "react-icons/pi";
import { cn } from "@/lib/utils";

// ─── Reusable primitives ──────────────────────────────────────────────────────
const B = ({ w = "w-full", h = "h-1.5", bg = "bg-neutral-200 dark:bg-neutral-800", cls = "" }) => (
  <div className={cn("rounded-full", w, h, bg, cls)} />
);
const Blk = ({ 
  className = "", 
  children, 
  style 
}: { 
  className?: string; 
  children?: React.ReactNode; 
  style?: React.CSSProperties 
}) => (
  <div className={cn("rounded-lg", className)} style={style}>
    {children}
  </div>
);


// ─── Mini phone wrapper ───────────────────────────────────────────────────────
function Phone({ w = 68, h = 120, children, className = "" }: { w?: number; h?: number; children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("relative flex flex-col overflow-hidden rounded-[16px] border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-[0_6px_20px_-4px_rgba(0,0,0,0.15)] dark:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.6)]", className)}
      style={{ width: w, height: h, flexShrink: 0 }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded-b-lg z-10" />
      <div className="flex-1 pt-4 pb-2 px-2 flex flex-col gap-1.5 overflow-hidden">{children}</div>
      <div className="mx-auto mb-1.5 w-7 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}

// ═══════════════════════════════════════════
// MOBILE APP TEMPLATES (left column)
// ═══════════════════════════════════════════

// 1 — E-commerce app
const AppEcommerce = () => (
  <div className="flex gap-2 justify-center items-end w-full">
    <Phone w={64} h={110} className="mb-4 opacity-70 rotate-[-5deg]">
      <B w="w-full" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
      <Blk className="flex-1 bg-neutral-100 dark:bg-neutral-800" />
      <Blk className="h-5 bg-neutral-900 dark:bg-neutral-600 rounded-xl" />
    </Phone>
    <Phone w={74} h={130}>
      <div className="flex items-center gap-1 mb-0.5">
        <Blk className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-800" />
        <B w="w-12" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <div className="grid grid-cols-2 gap-1 flex-1">
        {[...Array(4)].map((_, i) => (
          <Blk key={i} className={cn("rounded-lg flex flex-col overflow-hidden", i % 2 === 0 ? "bg-neutral-100 dark:bg-neutral-800" : "bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800")}>
            <Blk className={cn("flex-1", i % 2 === 0 ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-100 dark:bg-neutral-800")} />
            <div className="p-1"><B w="w-full" h="h-1" bg="bg-neutral-300 dark:bg-neutral-700" /></div>
          </Blk>
        ))}
      </div>
    </Phone>
    <Phone w={64} h={110} className="mb-4 opacity-70 rotate-[5deg]">
      <div className="flex items-center gap-1">
        <Blk className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <B w="w-10" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <Blk className="flex-1 bg-neutral-100 dark:bg-neutral-800" />
      <Blk className="h-4 bg-neutral-800 dark:bg-neutral-600 rounded-lg" />
    </Phone>
  </div>
);

// 2 — Social / Feed app
const AppSocial = () => (
  <div className="flex justify-center w-full">
    <Phone w={80} h={136}>
      <div className="flex items-center justify-between px-0.5">
        <B w="w-12" bg="bg-neutral-800 dark:bg-neutral-300" />
        <div className="flex gap-1">
          <Blk className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <Blk className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      {/* stories row */}
      <div className="flex gap-1.5 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5 shrink-0">
            <Blk className={cn("w-7 h-7 rounded-full border-2", i === 0 ? "border-neutral-800 dark:border-neutral-400 bg-neutral-200 dark:bg-neutral-700" : "border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800")} />
            <B w="w-6" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
          </div>
        ))}
      </div>
      {/* post */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex items-center gap-1">
          <Blk className="w-5 h-5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          <B w="w-10" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
        </div>
        <Blk className="flex-1 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => <Blk key={i} className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700" />)}
        </div>
      </div>
    </Phone>
  </div>
);

// 3 — Finance / Wallet
const AppFinance = () => (
  <div className="flex justify-center w-full">
    <Phone w={80} h={136} className="!bg-neutral-950 !border-neutral-800">
      <div className="flex items-center justify-between px-0.5">
        <B w="w-10" bg="bg-white/40" />
        <Blk className="w-4 h-4 rounded-full bg-white/20" />
      </div>
      {/* balance card */}
      <Blk className="rounded-xl bg-white/10 border border-white/10 p-2 flex flex-col gap-1">
        <B w="w-12" h="h-1" bg="bg-white/30" />
        <B w="w-3/4" h="h-3" bg="bg-white/70" />
        <div className="flex gap-2 mt-0.5">
          <Blk className="flex-1 h-4 rounded-lg bg-white/10 border border-white/10" />
          <Blk className="flex-1 h-4 rounded-lg bg-white/20 border border-white/10" />
        </div>
      </Blk>
      {/* mini chart */}
      <div className="flex items-end gap-0.5 h-8">
        {[40, 65, 45, 80, 55, 75, 60, 90].map((h, i) => (
          <div key={i} className={cn("flex-1 rounded-sm", i === 7 ? "bg-emerald-400" : "bg-white/15")} style={{ height: `${h}%` }} />
        ))}
      </div>
      {/* action row */}
      <div className="flex justify-around">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Blk className="w-6 h-6 rounded-full bg-white/10 border border-white/20" />
            <B w="w-5" h="h-1" bg="bg-white/20" />
          </div>
        ))}
      </div>
    </Phone>
  </div>
);

// 4 — Health & Fitness
const AppHealth = () => (
  <div className="flex gap-2 justify-center items-center w-full">
    <Phone w={74} h={126}>
      <div className="flex items-center justify-between px-0.5">
        <B w="w-12" bg="bg-neutral-800 dark:bg-neutral-300" />
        <Blk className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </div>
      {/* ring */}
      <div className="flex justify-center py-1">
        <div className="w-14 h-14 rounded-full border-4 border-neutral-200 dark:border-neutral-800 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 dark:border-emerald-500" style={{ clipPath: "polygon(50% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%, 0% 0%)" }} />
          <B w="w-5" h="h-2" bg="bg-neutral-800 dark:bg-neutral-300" />
        </div>
      </div>
      {/* stats */}
      <div className="grid grid-cols-3 gap-1">
        {[...Array(3)].map((_, i) => (
          <Blk key={i} className="p-1 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-0.5 items-center">
            <B w="w-4" h="h-2" bg={i === 0 ? "bg-emerald-400/50" : "bg-neutral-200 dark:bg-neutral-700"} />
            <B w="w-5" h="h-1" bg="bg-neutral-100 dark:bg-neutral-800/60" />
          </Blk>
        ))}
      </div>
      <Blk className="h-5 rounded-xl bg-neutral-900 dark:bg-neutral-600" />
    </Phone>
  </div>
);

// 5 — Messaging / Chat
const AppChat = () => (
  <div className="flex justify-center w-full">
    <Phone w={80} h={136}>
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1">
          <Blk className="w-5 h-5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
          <div className="flex flex-col gap-0.5">
            <B w="w-10" h="h-1.5" bg="bg-neutral-800 dark:bg-neutral-300" />
            <B w="w-7" h="h-1" bg="bg-emerald-400" />
          </div>
        </div>
        <div className="flex gap-1">
          <Blk className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700" />
          <Blk className="w-4 h-4 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      {/* messages */}
      <div className="flex-1 flex flex-col gap-1.5 px-0.5">
        <div className="flex justify-start">
          <Blk className="max-w-[70%] h-6 rounded-xl rounded-tl-none bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" style={{ width: 56 }} />
        </div>
        <div className="flex justify-end">
          <Blk className="h-6 rounded-xl rounded-tr-none bg-neutral-900 dark:bg-neutral-700" style={{ width: 48 }} />
        </div>
        <div className="flex justify-start">
          <Blk className="h-10 rounded-xl rounded-tl-none bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" style={{ width: 64 }} />
        </div>
        <div className="flex justify-end">
          <Blk className="h-6 rounded-xl rounded-tr-none bg-neutral-900 dark:bg-neutral-700" style={{ width: 40 }} />
        </div>
      </div>
      {/* input */}
      <div className="flex gap-1">
        <Blk className="flex-1 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <Blk className="w-6 h-6 rounded-full bg-neutral-900 dark:bg-neutral-600" />
      </div>
    </Phone>
  </div>
);

// 6 — Travel / Booking
const AppTravel = () => (
  <div className="flex justify-center w-full">
    <Phone w={80} h={136}>
      {/* hero image */}
      <Blk className="h-16 -mx-2 -mt-0 rounded-b-xl overflow-hidden bg-gradient-to-b from-neutral-300 to-neutral-500 dark:from-neutral-700 dark:to-neutral-900 relative">
        <div className="absolute bottom-2 left-2 flex flex-col gap-0.5">
          <B w="w-20" h="h-1.5" bg="bg-white/80" />
          <B w="w-12" h="h-1" bg="bg-white/50" />
        </div>
      </Blk>
      {/* search bar */}
      <Blk className="h-7 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center px-2 gap-1.5">
        <Blk className="w-3 h-3 rounded bg-neutral-300 dark:bg-neutral-600" />
        <B w="w-2/3" h="h-1.5" bg="bg-neutral-100 dark:bg-neutral-800" />
      </Blk>
      {/* cards */}
      <div className="flex gap-1.5 flex-1">
        {[...Array(2)].map((_, i) => (
          <Blk key={i} className="flex-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 overflow-hidden flex flex-col">
            <Blk className="h-10 bg-neutral-200 dark:bg-neutral-800" />
            <div className="p-1 flex flex-col gap-0.5">
              <B w="w-full" h="h-1" bg="bg-neutral-300 dark:bg-neutral-700" />
              <B w="w-2/3" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </Blk>
        ))}
      </div>
    </Phone>
  </div>
);

// ═══════════════════════════════════════════
// MOBILE UI BLOCKS (right column)
// ═══════════════════════════════════════════

// 1 — Bottom Tab Bar
const UITabBar = () => (
  <div className="flex flex-col gap-2 w-full px-3">
    <B w="w-1/4" bg="bg-neutral-300 dark:bg-neutral-700" />
    <Blk className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg overflow-hidden">
      <div className="flex items-center justify-around py-2.5 px-3">
        {[true, false, false, false, false].map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Blk className={cn("w-5 h-5 rounded-lg", active ? "bg-neutral-900 dark:bg-neutral-300" : "bg-neutral-200 dark:bg-neutral-800")} />
            <B w="w-4" h="h-1" bg={active ? "bg-neutral-900 dark:bg-neutral-300" : "bg-neutral-100 dark:bg-neutral-800/60"} />
          </div>
        ))}
      </div>
    </Blk>
    {/* floating variant */}
    <Blk className="w-[80%] mx-auto rounded-2xl bg-neutral-900 dark:bg-neutral-800 shadow-xl overflow-hidden">
      <div className="flex items-center justify-around py-2 px-3">
        {[true, false, false, false].map((active, i) => (
          <Blk key={i} className={cn("w-5 h-5 rounded-full", active ? "bg-white dark:bg-neutral-200" : "bg-white/20 dark:bg-white/10")} />
        ))}
      </div>
    </Blk>
  </div>
);

// 2 — Product Card
const UIProductCard = () => (
  <div className="flex gap-2 w-full px-3">
    {[false, true].map((featured, i) => (
      <Blk key={i} className={cn("flex-1 rounded-2xl overflow-hidden flex flex-col border", featured ? "border-neutral-300 dark:border-neutral-600 shadow-md" : "border-neutral-100 dark:border-neutral-800")}>
        <Blk className={cn("h-16", featured ? "bg-neutral-200 dark:bg-neutral-700" : "bg-neutral-100 dark:bg-neutral-800")} />
        <div className="p-2 flex flex-col gap-1">
          <B w="w-full" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
          <B w="w-2/3" h="h-2" bg="bg-neutral-800 dark:bg-neutral-300" />
          <div className="flex items-center justify-between mt-0.5">
            <B w="w-8" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
            <Blk className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-neutral-600" />
          </div>
        </div>
      </Blk>
    ))}
  </div>
);

// 3 — Auth Screen block
const UIAuth = () => (
  <div className="w-full px-3">
    <Blk className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md p-3 flex flex-col gap-2">
      <div className="flex flex-col items-center gap-1 pb-1">
        <Blk className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-neutral-300" />
        <B w="w-24" h="h-2" bg="bg-neutral-800 dark:bg-neutral-300" />
        <B w="w-16" h="h-1.5" bg="bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Blk className="h-7 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <Blk className="h-7 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
      </div>
      <Blk className="h-7 w-full rounded-xl bg-neutral-900 dark:bg-neutral-600" />
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
        <B w="w-4" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex-1 h-px bg-neutral-100 dark:bg-neutral-800" />
      </div>
      <div className="flex gap-2">
        <Blk className="flex-1 h-6 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <Blk className="flex-1 h-6 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
      </div>
    </Blk>
  </div>
);

// 4 — Notification / Toast
const UINotification = () => (
  <div className="flex flex-col gap-2 w-full px-3">
    {[
      { accent: "border-l-4 border-emerald-400", dot: "bg-emerald-400", w: "w-28" },
      { accent: "border-l-4 border-blue-400", dot: "bg-blue-400", w: "w-20" },
      { accent: "border-l-4 border-amber-400", dot: "bg-amber-400", w: "w-24" },
    ].map(({ accent, dot, w }, i) => (
      <Blk key={i} className={cn("w-full rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 px-3 py-2 flex items-center gap-2.5 shadow-sm", accent)}>
        <Blk className={cn("w-4 h-4 rounded-full shrink-0", dot)} />
        <div className="flex flex-col gap-0.5 flex-1">
          <B w="w-1/3" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
          <B w={w} h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <B w="w-6" h="h-1" bg="bg-neutral-100 dark:bg-neutral-800/60" />
      </Blk>
    ))}
  </div>
);

// 5 — Profile / Avatar block
const UIProfile = () => (
  <div className="w-full px-3">
    <Blk className="w-full rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md overflow-hidden">
      <Blk className="h-10 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
      <div className="px-3 pb-3">
        <Blk className="w-12 h-12 rounded-full bg-neutral-300 dark:bg-neutral-600 border-2 border-white dark:border-neutral-900 -mt-6 mb-1.5 shadow" />
        <B w="w-20" h="h-2" bg="bg-neutral-800 dark:bg-neutral-300" />
        <B w="w-28" h="h-1.5" bg="bg-neutral-200 dark:bg-neutral-800" cls="mt-1" />
        <div className="flex gap-4 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <B w="w-6" h="h-2" bg="bg-neutral-800 dark:bg-neutral-300" />
              <B w="w-8" h="h-1" bg="bg-neutral-200 dark:bg-neutral-800" />
            </div>
          ))}
        </div>
        <Blk className="h-6 w-full rounded-xl bg-neutral-900 dark:bg-neutral-600 mt-2" />
      </div>
    </Blk>
  </div>
);

// 6 — Settings list
const UISettings = () => (
  <div className="flex flex-col gap-1.5 w-full px-3">
    <B w="w-1/4" bg="bg-neutral-300 dark:bg-neutral-700" cls="mb-0.5" />
    {[...Array(4)].map((_, i) => (
      <Blk key={i} className="w-full h-9 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Blk className="w-5 h-5 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          <B w="w-16" h="h-1.5" bg="bg-neutral-300 dark:bg-neutral-700" />
        </div>
        {i < 2
          ? <Blk className="w-8 h-4 rounded-full bg-neutral-900 dark:bg-neutral-600" />
          : <Blk className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
        }
      </Blk>
    ))}
  </div>
);

// ─── Data ────────────────────────────────────────────────────────────────────
const APPS = [
  { component: AppEcommerce, label: "E-Commerce App",   tech: "React Native" },
  { component: AppSocial,    label: "Social / Feed",    tech: "Flutter"      },
  { component: AppFinance,   label: "Finance / Wallet", tech: "React Native" },
  { component: AppHealth,    label: "Health & Fitness", tech: "Flutter"      },
  { component: AppChat,      label: "Messaging / Chat", tech: "React Native" },
  { component: AppTravel,    label: "Travel / Booking", tech: "Flutter"      },
];

const BLOCKS = [
  { component: UITabBar,       label: "Bottom Tab Bar",    tech: "Component" },
  { component: UIProductCard,  label: "Product Card",      tech: "Component" },
  { component: UIAuth,         label: "Auth Screen",       tech: "Component" },
  { component: UINotification, label: "Notification",      tech: "Component" },
  { component: UIProfile,      label: "Profile Block",     tech: "Component" },
  { component: UISettings,     label: "Settings List",     tech: "Component" },
];

// ─── Shared card ─────────────────────────────────────────────────────────────
function ShowcaseCard({ Skeleton, label, tech, techColor }: { Skeleton: React.FC; label: string; tech: string; techColor: string }) {
  return (
    <div className={cn(
      "group relative w-full h-[220px] rounded-xl overflow-hidden flex flex-col",
      "bg-white dark:bg-neutral-950",
      "border border-neutral-200 dark:border-neutral-800",
      "shadow-[0_1px_4px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]",
      "dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
      "hover:shadow-[0_4px_20px_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.06)]",
      "dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.65)]",
      "hover:border-neutral-300 dark:hover:border-neutral-700",
      "hover:-translate-y-1",
      "transition-all duration-300 ease-out"
    )}>
      {/* preview */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.016] dark:opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,1) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <Skeleton />
        </div>
        {/* hover overlay */}
        <div className={cn("absolute inset-0 z-20 flex flex-col items-center justify-center gap-2", "bg-white/88 dark:bg-neutral-950/90 backdrop-blur-[3px]", "opacity-0 group-hover:opacity-100", "transition-all duration-300")}>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">Coming Soon</span>
          </div>
          <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">{label}</p>
        </div>
      </div>
      {/* footer */}
      <div className="shrink-0 h-[40px] px-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] font-mono font-semibold text-neutral-500 dark:text-neutral-500 truncate">{label}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40">
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Soon</span>
          </div>
          <div className={cn("px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-widest", techColor)}>
            {tech}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Column header ────────────────────────────────────────────────────────────
function ColumnHeader({ icon: Icon, iconClass, title, subtitle, count }: { icon: React.ElementType; iconClass: string; title: string; subtitle: string; count: number }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <Icon className={cn("w-4.5 h-4.5", iconClass)} />
        </div>
        <div>
          <h2 className="text-base font-sans font-bold text-neutral-800 dark:text-neutral-200 leading-tight">{title}</h2>
          <p className="text-[11px] font-sans text-neutral-400 dark:text-neutral-600">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest">{count}+ coming</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function MobileAppsAndUIBlocks() {
  return (
    <div className="w-full container max-w-[1580px] pt-20 pb-10">

      {/* ── Page header ── */}
      <div className="w-full mx-auto px-4 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm mb-4">
          <PiDeviceMobileFill className="w-3 h-3 text-neutral-500" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Cross-platform</span>
        </div>
        <h1 className="font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 tracking-tight">
          Mobile Apps &amp; UI Blocks by{" "}
          <span className="font-mono text-neutral-500 dark:text-neutral-500">lokalhost.io</span>
        </h1>
        <p className="text-sm font-sans font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Full mobile app templates and reusable UI components built for{" "}
          <span className="inline-flex items-center gap-1 font-semibold text-blue-500"><SiReact className="w-3 h-3" />React Native</span>
          {" "}and{" "}
          <span className="inline-flex items-center gap-1 font-semibold text-sky-500"><SiFlutter className="w-3 h-3" />Flutter</span>.
        </p>
      </div>

      {/* ── Two-column grid ── */}
      <div className="">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">

          {/* ══ LEFT: Mobile App Templates ══════════════════════════════ */}
          <div className={cn(
            "w-full flex flex-col rounded-2xl overflow-hidden p-5",
            "bg-neutral-50 dark:bg-neutral-900",
            "border border-neutral-200 dark:border-neutral-800",
            "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]",
            "dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          )}>
            <ColumnHeader
              icon={PiDeviceMobileFill}
              iconClass="text-neutral-700 dark:text-neutral-300"
              title="Mobile App Templates"
              subtitle="React Native · Flutter · Expo"
              count={20}
            />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {APPS.map(({ component: Comp, label, tech }) => (
                <ShowcaseCard
                  key={label}
                  Skeleton={Comp}
                  label={label}
                  tech={tech}
                  techColor={tech === "Flutter"
                    ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200/60 dark:border-sky-800/40 text-sky-600 dark:text-sky-500"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200/60 dark:border-blue-800/40 text-blue-600 dark:text-blue-500"
                  }
                />
              ))}
            </div>

            {/* column CTA */}
            <div className="mt-5 flex justify-center">
              <Link href="/mobile/apps" className={cn(
                "flex gap-2 items-center text-xs font-mono font-semibold px-5 py-2 rounded-lg",
                "border-t border-l border-r border-neutral-800 dark:border-neutral-700",
                "bg-gradient-to-b from-neutral-700 to-neutral-900",
                "text-neutral-100",
                "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "hover:shadow-[0_3px_12px_rgba(0,0,0,0.25)]",
                "hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              )}>
                Browse App Templates
                <HiOutlineExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ══ RIGHT: Mobile UI Blocks ════════════════════════════════ */}
          <div className={cn(
            "w-full flex flex-col rounded-2xl overflow-hidden p-5",
            "bg-neutral-50 dark:bg-neutral-900",
            "border border-neutral-200 dark:border-neutral-800",
            "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]",
            "dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          )}>
            <ColumnHeader
              icon={SiReact}
              iconClass="text-blue-500"
              title="Mobile UI Blocks"
              subtitle="Reusable components · Screens · Patterns"
              count={50}
            />
            <div className="grid grid-cols-2 lg:grid-cols-3  gap-4">
              {BLOCKS.map(({ component: Comp, label, tech }) => (
                <ShowcaseCard
                  key={label}
                  Skeleton={Comp}
                  label={label}
                  tech={tech}
                  techColor="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-500"
                />
              ))}
            </div>

            {/* column CTA */}
            <div className="mt-5 flex justify-center">
              <Link href="/mobile/ui-blocks" className={cn(
                "flex gap-2 items-center text-xs font-mono font-semibold px-5 py-2 rounded-lg",
                "border-t border-l border-r border-neutral-800 dark:border-neutral-700",
                "bg-gradient-to-b from-neutral-700 to-neutral-900",
                "text-neutral-100",
                "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "hover:shadow-[0_3px_12px_rgba(0,0,0,0.25)]",
                "hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              )}>
                Browse UI Blocks
                <HiOutlineExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default MobileAppsAndUIBlocks;
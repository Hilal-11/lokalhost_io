"use client"
import { useState } from "react"
import { IoMdSearch } from "react-icons/io";
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { AnimatedGridPatternDemo } from '../designs/AnimatedGridPattern';
import { LuFigma } from "react-icons/lu";
import AnnoncementBadge from "@/components/landing/AnnoncementBadge";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { PiDeviceMobileFill } from 'react-icons/pi';
import { SiReact } from "react-icons/si";
import { cn } from "@/lib/utils";
import { SiFlutter } from "react-icons/si";
import { SiTypescript, SiTailwindcss } from "react-icons/si";
import { PiDeviceTabletFill } from "react-icons/pi";
import { HiLightningBolt, HiColorSwatch, HiCubeTransparent, HiTemplate } from "react-icons/hi";
import { MdDarkMode, MdAnimation } from "react-icons/md";
// ─── Mini phone skeleton ───────────────────────────────────────────────────────
function PhoneMockup({
  className,
  children,
  tilt = 0,
}: {
  className?: string;
  children?: React.ReactNode;
  tilt?: number;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden",
        "w-[140px] shrink-0",
        "rounded-[28px]",
        "border-[3px] border-neutral-200 dark:border-neutral-700",
        "bg-white dark:bg-neutral-950",
        "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15),0_4px_16px_rgba(0,0,0,0.06)]",
        "dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]",
        className
      )}
      style={{ transform: `rotate(${tilt}deg)`, height: 280 }}
    >
      {/* notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-neutral-200 dark:bg-neutral-700 rounded-b-xl z-10" />

      {/* screen content */}
      <div className="flex-1 flex flex-col pt-5 px-2.5 pb-2.5 gap-2 mt-1 overflow-hidden">
        {children}
      </div>

      {/* home bar */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
    </div>
  );
}

// ─── Phone screen content variants ────────────────────────────────────────────

// Dashboard screen
function ScreenDashboard() {
  return (
    <>
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-2 w-20 rounded bg-neutral-800 dark:bg-neutral-300" />
        </div>
        <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {[["bg-neutral-800 dark:bg-neutral-600", "text-white"], ["bg-neutral-100 dark:bg-neutral-800", ""]].map(([bg, _], i) => (
          <div key={i} className={cn("rounded-xl p-2 flex flex-col gap-1", bg)}>
            <div className={cn("w-4 h-4 rounded-lg", i === 0 ? "bg-white/20" : "bg-neutral-200 dark:bg-neutral-700")} />
            <div className={cn("h-3 w-8 rounded", i === 0 ? "bg-white/80" : "bg-neutral-800 dark:bg-neutral-400")} />
            <div className={cn("h-1 w-10 rounded-full", i === 0 ? "bg-white/40" : "bg-neutral-200 dark:bg-neutral-700")} />
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-2 flex flex-col gap-1.5">
        <div className="h-1.5 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="flex-1 flex items-end gap-1">
          {[45, 70, 50, 85, 60, 75].map((h, i) => (
            <div key={i} className={cn("flex-1 rounded-sm", i === 3 ? "bg-neutral-700 dark:bg-neutral-500" : "bg-neutral-200 dark:bg-neutral-800")} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="flex justify-around py-1 border-t border-neutral-100 dark:border-neutral-800">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cn("w-4 h-4 rounded-md", i === 0 ? "bg-neutral-800 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-800")} />
        ))}
      </div>
    </>
  );
}

// E-commerce app screen
function ScreenStore() {
  return (
    <>
      <div className="flex items-center gap-2 px-1">
        <div className="flex-1 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 relative">
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-400" />
        </div>
      </div>
      <div className="flex gap-1.5 overflow-hidden">
        {["bg-neutral-800 dark:bg-neutral-700", "bg-neutral-100 dark:bg-neutral-800", "bg-neutral-100 dark:bg-neutral-800"].map((cls, i) => (
          <div key={i} className={cn("px-2.5 py-1 rounded-full text-center shrink-0", cls)}>
            <div className={cn("h-1.5 w-6 rounded-full", i === 0 ? "bg-white/70" : "bg-neutral-400 dark:bg-neutral-600")} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5 flex-1">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <div className={cn("h-12", i % 2 === 0 ? "bg-neutral-200 dark:bg-neutral-800" : "bg-neutral-100 dark:bg-neutral-900")} />
            <div className="px-1.5 pb-1.5 flex flex-col gap-1">
              <div className="h-1 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-1.5 w-2/3 rounded-full bg-neutral-800 dark:bg-neutral-400" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Onboarding/Auth screen
function ScreenAuth() {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-1">
        <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-neutral-200 flex items-center justify-center shadow-md">
          <div className="w-6 h-6 rounded-md bg-white/30 dark:bg-neutral-900/30" />
        </div>
        <div className="h-2.5 w-3/4 rounded-md bg-neutral-800 dark:bg-neutral-300" />
        <div className="h-1.5 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-1.5 w-3/5 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
      </div>
      <div className="flex flex-col gap-2 px-1">
        <div className="h-7 w-full rounded-xl bg-neutral-900 dark:bg-neutral-200 shadow-sm" />
        <div className="h-7 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <div className="flex items-center gap-1.5 justify-center">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-1.5 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="flex gap-1.5 justify-center">
          <div className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
          <div className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        </div>
      </div>
    </>
  );
}

// ─── Floating chip ────────────────────────────────────────────────────────────
function FloatingChip({ icon: Icon, label, sub, className }: { icon: React.ElementType; label: string; sub: string; className?: string }) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-xl",
      "bg-white dark:bg-neutral-950",
      "border border-neutral-200 dark:border-neutral-800",
      "shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
      "backdrop-blur-sm",
      className
    )}>
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <Icon className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
      </span>
      <div className="flex flex-col leading-none gap-0.5">
        <span className="text-[10px] font-mono font-bold text-neutral-800 dark:text-neutral-200">{label}</span>
        <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">{sub}</span>
      </div>
    </div>
  );
}



function Mobile() {
  
  const [activeFilter, setActiveFilter] = useState<'All' | 'Free' | 'Premium'>('All');
  
  return (
    <div className="relative">
            <AnimatedGridPatternDemo />
            <div className="relative w-full container max-w-[1580px] pt-10 h-auto z-40">
               <AnnoncementBadge aboutBadge={"Lokalhost.io cross-platform mobile apps are Coming soon"}/>

            <div className="z-50 w-full grid grid-cols-1 lg:grid-cols-2 gap-4 items-center pb-16">

        {/* ════ LEFT: Copy ════════════════════════════════════════════════ */}
        <div className="z-50 w-full h-auto mx-auto pt-6 lg:pt-20 px-5 lg:px-10">

          {/* Coming soon status pill */}
          <div className="flex justify-center lg:justify-start mb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
              <span className="flex gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Coming Soon — In Development
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="w-full mx-auto text-center lg:text-left">
            <h1 className="font-sans font-bold text-3xl lg:text-4xl text-neutral-800 dark:text-neutral-200 leading-[1.2] tracking-tight">
              High quality mobile apps &amp; UI Blocks for{" "}
              <span className="relative inline-block">
                <span className="relative z-10">React Native</span>
                <span className="absolute bottom-0.5 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-blue-400/60 to-cyan-400/60" />
              </span>
              {" &amp; "}
              <span className="relative inline-block">
                <span className="relative z-10">Flutter</span>
                <span className="absolute bottom-0.5 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-[#F6D5F7]/80 to-[#54C5F8]/80" />
              </span>
            </h1>
            <p className="lg:px-0 mx-auto py-4 font-sans font-medium text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md lg:max-w-none">
              A curated library of production-ready mobile templates and reusable UI components — built for cross-platform apps. Whether you&apos;re a freelancer, startup, or enterprise team, ship faster with lokalhost.io.
            </p>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5">
            {[
              { icon: SiReact, label: "React Native", color: "text-blue-500" },
              { icon: SiFlutter, label: "Flutter", color: "text-sky-500" },
              { icon: PiDeviceMobileFill, label: "iOS & Android", color: "text-neutral-600 dark:text-neutral-400" },
            ].map(({ icon: Icon, label, color }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-[11px] font-mono font-semibold text-neutral-500 dark:text-neutral-400">
                <Icon className={cn("w-3 h-3", color)} />
                {label}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center pb-5 gap-3">
            <button className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-sans font-semibold",
              "border border-orange-300/60",
              "bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7]",
              "text-neutral-700",
              "shadow-sm hover:shadow-md hover:brightness-105",
              "hover:-translate-y-0.5 active:scale-[0.98]",
              "transition-all duration-200"
            )}>
              <LuFigma className="w-3.5 h-3.5" />
              Figma Designs
            </button>

            <button className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-sans font-semibold",
              "border-t border-l border-r border-neutral-800 dark:border-neutral-700",
              "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
              "text-neutral-100",
              "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
              "hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]",
              "hover:-translate-y-0.5 active:scale-[0.98]",
              "transition-all duration-200"
            )}>
              Explore Mobile Apps
              <HiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notify me strip */}
          <div className="flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 text-xs font-sans text-neutral-400 dark:text-neutral-600">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              Be the first to know when we launch
              <span className="text-neutral-800 dark:text-neutral-200 font-semibold font-mono underline decoration-dashed underline-offset-2 cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-400 transition-colors">
                Notify me →
              </span>
            </div>
          </div>
        </div>

        {/* ════ RIGHT: Phone mockups ═══════════════════════════════════════ */}
        <div className="relative h-[420px] lg:h-[520px] flex items-center justify-center p-6 overflow-hidden">

          {/* Radial glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[380px] h-[380px] rounded-full bg-neutral-200 dark:bg-neutral-800/40 blur-[80px] opacity-50 dark:opacity-30" />
          </div>

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Phones arrangement */}
          <div className="relative flex items-end justify-center gap-4 z-10">

            {/* Left phone — tilted */}
            <PhoneMockup tilt={-6} className="mb-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
              <ScreenAuth />
            </PhoneMockup>

            {/* Center phone — upright, elevated */}
            <PhoneMockup tilt={0} className="-mt-8 z-20 opacity-100 shadow-[0_30px_80px_-10px_rgba(0,0,0,0.22)] dark:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7)]" style={{ width: 156 } as React.CSSProperties}>
              <ScreenDashboard />
            </PhoneMockup>

            {/* Right phone — tilted */}
            <PhoneMockup tilt={6} className="mb-6 opacity-80 hover:opacity-100 transition-opacity duration-300">
              <ScreenStore />
            </PhoneMockup>
          </div>

          {/* Coming Soon overlay badge — centered over phones */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-neutral-950/90 border border-neutral-200 dark:border-neutral-800 shadow-lg backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                Screens are in development
              </span>
            </div>
          </div>

          {/* Floating tech chips */}
          <FloatingChip
            icon={SiReact}
            label="React Native"
            sub="Cross-platform"
            className="absolute left-0 top-1/3 -translate-y-1/2 z-30 rotate-[-3deg]"
          />
          <FloatingChip
            icon={SiFlutter}
            label="Flutter"
            sub="iOS & Android"
            className="absolute right-0 bottom-1/3 z-30 rotate-[3deg]"
          />

          {/* lokalhost.io watermark */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
            <span className="text-[10px] font-mono font-semibold text-neutral-300 dark:text-neutral-700 tracking-widest uppercase">
              lokalhost.io
            </span>
          </div>
        </div>

      </div>       

           

            <section className="h-auto pt-4 mx-auto border border-dashed border-neutral-300 dark:border-neutral-700 mt-10 bg-neutral-50 dark:bg-neutral-900 z-50">
                <div className="flex flex-wrap justify-between gap-2 items-center w-full pt-0 pb-4 border-b border-dashed border-neutral-300 dark:border-neutral-700 px-5">
                    <div>
                      <SortMobile />
                    </div>
                    <div className="flex items-center gap-1">
                          <InputGroup className="flex items-center justify-center">
                              <InputGroupInput placeholder="Search Template:- " className="hidden lg:flex md:flex"/>
                              <InputGroupButton variant="secondary" className="bg-transparent flex items-center justify-center"><IoMdSearch className="text-lg mx-auto mr-px"/></InputGroupButton>
                          </InputGroup>
                    <ButtonGroup>
                        <Button 
                            variant={activeFilter === 'All' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('All')}
                            className={activeFilter === 'All' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            All
                        </Button>
                        <Button 
                            variant={activeFilter === 'Free' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Free')}
                            className={activeFilter === 'Free' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Free
                        </Button>
                        <Button 
                            variant={activeFilter === 'Premium' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Premium')}
                            className={activeFilter === 'Premium' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Premium
                        </Button>
                    </ButtonGroup>
                    </div>
                </div> 

              <div className="w-full h-auto grid grid-cols-1 gap-4 lg:gap-0 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 border-t border-dashed border-neutral-300 dark:border-neutral-700 justify-evenly items-center">
                    {CELLS.map(({ label, icon, tech, content: Content }, i) => {
                      const isSecondRow = i >= 4;
                      return (
                        <div
                          key={label}
                          className={cn(
                            "w-full h-[400px] px-6 border border-dashed border-neutral-300 dark:border-neutral-700 py-5 pb-5",
                            isSecondRow && "border"
                          )}
                        >
                          <Cell label={label} icon={icon} tech={tech}>
                            <Content />
                          </Cell>
                        </div>
                      );
                    })}
                  </div>
            </section>
            </div>

          <CTA />   
    </div>
  )
}

export default Mobile



import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BsListUl } from "react-icons/bs";
import { TbBrandReact } from "react-icons/tb";
import { FaFlutter } from "react-icons/fa6";
import { TbBlocks } from "react-icons/tb";
import CTA from "@/components/landing/CTA";
function SortMobile() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-56 bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-100">
        <SelectValue className="font-sans font-medium" placeholder="Sort" />
      </SelectTrigger>
      <SelectContent className="">
        <SelectGroup className="">
          <SelectLabel className="font-sans font-medium">Sort</SelectLabel>
          <SelectItem value="All"><span><BsListUl /></span> All</SelectItem>
          <SelectItem value="react-native"> <span><TbBrandReact /></span> React Native Apps</SelectItem>
          <SelectItem value="react-native-blocks"><span><TbBlocks /></span>React Native UI Blocks</SelectItem>
          <SelectItem value="flutter"> <span><FaFlutter /></span> Flutter Apps</SelectItem>
          <SelectItem value="flutter-blocks"><span><TbBlocks /></span>Flutter UI Blocks</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}



function ComingSoonPill() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-500">
        Coming Soon
      </span>
    </div>
  );
}

// ─── Phone skeleton ───────────────────────────────────────────────────────────
function MiniPhone({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "relative flex flex-col overflow-hidden",
      "rounded-[18px] border-2 border-neutral-200 dark:border-neutral-700",
      "bg-white dark:bg-neutral-950",
      "shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)]",
      className
    )}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded-b-lg z-10" />
      <div className="flex-1 pt-4 pb-2 px-2 flex flex-col gap-1.5 overflow-hidden">
        {children}
      </div>
      <div className="mx-auto mb-1.5 w-8 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}

// ─── Grid cell wrapper ────────────────────────────────────────────────────────
function Cell({ label, icon: Icon, tech, children, className }: {
  label: string;
  icon: React.ElementType;
  tech?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group relative flex flex-col justify-between h-full", className)}>
      {/* Top meta */}
      <div className="flex items-start justify-between gap-2 pb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
            <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          </div>
          <p className="text-sm font-sans font-semibold text-neutral-700 dark:text-neutral-300 leading-tight">
            {label}
          </p>
          {tech && (
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">{tech}</span>
          )}
        </div>
        <ComingSoonPill />
      </div>

      {/* Main visual */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}

// ─── Individual cell content ──────────────────────────────────────────────────

// 1 — UI Component Library
function CellComponents() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-2">
        {["bg-neutral-900 dark:bg-neutral-300", "bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"].map((cls, i) => (
          <div key={i} className={cn("flex-1 h-9 rounded-xl", cls)} />
        ))}
      </div>
      <div className="flex gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={cn("flex-1 h-16 rounded-xl border", i === 1 ? "bg-neutral-900 dark:bg-neutral-800 border-neutral-800" : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800")} />
        ))}
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {["w-12", "w-16", "w-10", "w-14", "w-8"].map((w, i) => (
          <div key={i} className={cn("h-5 rounded-full", w, i % 2 === 0 ? "bg-neutral-200 dark:bg-neutral-800" : "bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700")} />
        ))}
      </div>
    </div>
  );
}

// 2 — Navigation & Routing
function CellNavigation() {
  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <MiniPhone className="w-[110px] h-[180px]">
        {/* top bar */}
        <div className="flex items-center justify-between px-0.5">
          <div className="w-4 h-4 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-1.5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          <div className="w-4 h-4 rounded bg-neutral-100 dark:bg-neutral-800" />
        </div>
        <div className="flex-1 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800" />
        {/* bottom tab bar */}
        <div className="flex justify-around py-1.5 border-t border-neutral-100 dark:border-neutral-800">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={cn("flex flex-col items-center gap-0.5")}>
              <div className={cn("w-4 h-4 rounded-md", i === 0 ? "bg-neutral-800 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-800")} />
              <div className={cn("h-0.5 w-3 rounded-full", i === 0 ? "bg-neutral-800 dark:bg-neutral-400" : "bg-transparent")} />
            </div>
          ))}
        </div>
      </MiniPhone>
      <div className="flex gap-2 w-full">
        {["Stack", "Tab", "Drawer"].map((t, i) => (
          <div key={t} className={cn("flex-1 h-6 rounded-lg flex items-center justify-center", i === 0 ? "bg-neutral-900 dark:bg-neutral-700" : "bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700")}>
            <span className="text-[9px] font-mono font-bold text-neutral-400 dark:text-neutral-500">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3 — Dark Mode Support
function CellDarkMode() {
  return (
    <div className="w-full flex gap-3 items-center justify-center">
      {/* light phone */}
      <MiniPhone className="w-[90px] h-[155px]">
        <div className="h-1.5 w-3/4 rounded-full bg-neutral-800 mx-auto" />
        <div className="flex-1 rounded-lg bg-neutral-100 border border-neutral-200" />
        <div className="flex gap-1">
          <div className="flex-1 h-7 rounded-lg bg-neutral-800" />
          <div className="flex-1 h-7 rounded-lg bg-neutral-200 border border-neutral-300" />
        </div>
      </MiniPhone>
      {/* arrow */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-6 h-px bg-neutral-300 dark:bg-neutral-700 relative">
          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-neutral-400 border-y-2 border-y-transparent" />
        </div>
        <span className="text-[8px] font-mono text-neutral-400 rotate-0">theme</span>
      </div>
      {/* dark phone */}
      <MiniPhone className="w-[90px] h-[155px] !bg-neutral-950 !border-neutral-700">
        <div className="h-1.5 w-3/4 rounded-full bg-neutral-200 mx-auto" />
        <div className="flex-1 rounded-lg bg-neutral-800 border border-neutral-700" />
        <div className="flex gap-1">
          <div className="flex-1 h-7 rounded-lg bg-neutral-200" />
          <div className="flex-1 h-7 rounded-lg bg-neutral-700 border border-neutral-600" />
        </div>
      </MiniPhone>
    </div>
  );
}

// 4 — Performance & Animation
function CellAnimation() {
  return (
    <div className="w-full flex flex-col gap-3">
      <MiniPhone className="w-full h-[160px]">
        <div className="flex-1 flex flex-col gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
              style={{ transform: `translateX(${i * 4}px)`, opacity: 1 - i * 0.2 }}
            />
          ))}
        </div>
        <div className="flex gap-1.5 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={cn("rounded-full", i === 0 ? "w-3 h-1.5 bg-neutral-800 dark:bg-neutral-300" : "w-1.5 h-1.5 bg-neutral-200 dark:bg-neutral-700")} />
          ))}
        </div>
      </MiniPhone>
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div className="h-full w-3/4 rounded-full bg-neutral-700 dark:bg-neutral-400" />
        </div>
        <span className="text-[9px] font-mono text-neutral-400">60fps</span>
      </div>
    </div>
  );
}

// 5 — Cross-Platform Compatibility
function CellCrossPlatform() {
  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <div className="flex items-end gap-3 justify-center">
        <MiniPhone className="w-[80px] h-[130px]">
          <div className="flex-1 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-5 rounded-lg bg-neutral-900 dark:bg-neutral-600 mt-1" />
        </MiniPhone>
        {/* tablet */}
        <div className={cn(
          "relative flex flex-col overflow-hidden",
          "w-[120px] h-[110px] rounded-[14px] border-2 border-neutral-200 dark:border-neutral-700",
          "bg-white dark:bg-neutral-950",
          "shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
        )}>
          <div className="flex-1 p-2 flex gap-1.5">
            <div className="w-8 bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 rounded-l-md" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-1.5 w-4/5 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
              <div className="flex-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 mt-1" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center">
        <SiReact className="w-4 h-4 text-blue-400" />
        <span className="text-[9px] font-mono text-neutral-400">+</span>
        <SiFlutter className="w-4 h-4 text-sky-400" />
        <span className="text-[9px] font-mono text-neutral-400 mx-1">→</span>
        <span className="text-[9px] font-mono font-bold text-neutral-500 dark:text-neutral-400">iOS & Android</span>
      </div>
    </div>
  );
}

// 6 — Theming & Design System
function CellTheme() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid grid-cols-5 gap-1.5">
        {[
          "bg-neutral-900 dark:bg-neutral-100",
          "bg-neutral-700 dark:bg-neutral-300",
          "bg-neutral-400",
          "bg-neutral-200 dark:bg-neutral-700",
          "bg-neutral-100 dark:bg-neutral-800",
        ].map((cls, i) => (
          <div key={i} className={cn("h-8 rounded-lg", cls)} />
        ))}
      </div>
      <div className="flex gap-2">
        {[14, 16, 20, 24].map((size, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className={cn("rounded bg-neutral-800 dark:bg-neutral-200")} style={{ width: size, height: size * 0.6 }} />
            <div className={cn("rounded-full bg-neutral-200 dark:bg-neutral-700 w-4 h-1")} />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {["rounded-sm", "rounded-lg", "rounded-xl", "rounded-full"].map((r, i) => (
          <div key={i} className={cn("flex-1 h-7 border-2 border-neutral-300 dark:border-neutral-700 bg-transparent", r)} />
        ))}
      </div>
    </div>
  );
}

// 7 — TypeScript + Expo support
function CellStack() {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* code block style */}
      <div className="rounded-xl bg-neutral-900 dark:bg-neutral-950 border border-neutral-800 p-3 flex flex-col gap-2">
        {[
          ["bg-blue-400/50 w-12", "bg-neutral-600 w-16", "bg-purple-400/40 w-8"],
          ["bg-neutral-700 w-4", "bg-green-400/40 w-20", "bg-neutral-600 w-6"],
          ["bg-yellow-400/40 w-16", "bg-neutral-600 w-10"],
          ["bg-neutral-700 w-8", "bg-blue-400/50 w-12", "bg-neutral-600 w-14"],
        ].map((row, i) => (
          <div key={i} className="flex gap-2 items-center" style={{ paddingLeft: i === 1 || i === 2 ? 12 : 0 }}>
            {row.map((cls, j) => <div key={j} className={cn("h-1.5 rounded-full", cls)} />)}
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {[
          { Icon: SiTypescript, label: "TypeScript", color: "text-blue-500" },
          { Icon: SiReact, label: "Expo", color: "text-blue-400" },
          { Icon: SiFlutter, label: "Flutter", color: "text-sky-400" },
        ].map(({ Icon, label, color }) => (
          <div key={label} className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <Icon className={cn("w-3 h-3", color)} />
            <span className="text-[9px] font-mono font-semibold text-neutral-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8 — Ready-made screens / templates
function CellScreens() {
  return (
    <div className="w-full flex gap-2 justify-center">
      {[ScreenA, ScreenB, ScreenC].map((Screen, i) => (
        <MiniPhone key={i} className={cn("w-[74px] h-[140px]", i === 1 ? "-mt-3" : "")}>
          <Screen />
        </MiniPhone>
      ))}
    </div>
  );
}

function ScreenA() {
  return (
    <>
      <div className="h-1.5 w-2/3 rounded-full bg-neutral-800 dark:bg-neutral-300 mx-auto" />
      <div className="flex-1 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-5 rounded-xl bg-neutral-900 dark:bg-neutral-600" />
    </>
  );
}
function ScreenB() {
  return (
    <>
      <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-700 mx-auto" />
      <div className="h-1.5 w-3/4 rounded-full bg-neutral-300 dark:bg-neutral-700 mx-auto" />
      <div className="flex-1 flex flex-col gap-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        ))}
      </div>
    </>
  );
}
function ScreenC() {
  return (
    <>
      <div className="flex gap-1">
        <div className="flex-1 h-14 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex-1 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          <div className="flex-1 rounded-xl bg-neutral-900 dark:bg-neutral-600" />
        </div>
      </div>
      <div className="h-1.5 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-1.5 w-3/5 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
    </>
  );
}

// ─── Cell config ──────────────────────────────────────────────────────────────
const CELLS = [
  { label: "UI Component Library",    icon: HiCubeTransparent,  tech: "React Native · Flutter",   content: CellComponents     },
  { label: "Navigation & Routing",    icon: PiDeviceMobileFill, tech: "Stack · Tab · Drawer",     content: CellNavigation     },
  { label: "Dark Mode Support",       icon: MdDarkMode,         tech: "Adaptive theming",         content: CellDarkMode       },
  { label: "Smooth Animations",       icon: MdAnimation,        tech: "60fps · Reanimated",       content: CellAnimation      },
  { label: "Cross-Platform",          icon: PiDeviceTabletFill, tech: "iOS · Android · Web",      content: CellCrossPlatform  },
  { label: "Design System",           icon: HiColorSwatch,      tech: "Tokens · Typography",      content: CellTheme          },
  { label: "TypeScript & Expo",       icon: HiLightningBolt,    tech: "Type-safe · Fast refresh", content: CellStack          },
  { label: "Pre-built Screens",       icon: HiTemplate,         tech: "Auth · Dashboard · Store", content: CellScreens        },
];
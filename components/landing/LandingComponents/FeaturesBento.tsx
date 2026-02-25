"use client"
import React, { forwardRef, useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useInView, AnimatePresence, type Variants } from "motion/react"
import Image from "next/image";
import { Ripple } from '@/components/ui/ripple';
import { IoPhonePortraitOutline } from "react-icons/io5";
import { TbBrandAuth0, TbBrandFramerMotion } from "react-icons/tb";
import { LuFigma } from "react-icons/lu";
import { TbBackground } from "react-icons/tb";
import { PiCubeDuotone, PiTerminalFill } from "react-icons/pi";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { SiShadcnui } from 'react-icons/si';
import { Terminal, TypingAnimation, AnimatedSpan } from '@/components/ui/terminal';
import { cn } from "@/lib/utils"
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { FiUserCheck } from "react-icons/fi";

/* ─────────────────────────────────────────────
   Tilt Card – magnetic 3-D perspective on hover
───────────────────────────────────────────── */
function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 400, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 400, damping: 30 })
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
      className={cn("relative group", className)}
    >
      {/* Gradient spotlight that tracks cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([lx, ly]) =>
              `radial-gradient(200px circle at ${lx}% ${ly}%, rgba(255,255,255,0.06), transparent 70%)`
          ),
        }}
      />
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Shimmer border on hover
───────────────────────────────────────────── */
function ShimmerBorder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-700",
        className
      )}
      style={{
        background:
          "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
        backgroundSize: "200% 200%",
        animation: "shimmer 2s linear infinite",
      }}
    />
  )
}

/* ─────────────────────────────────────────────
   Floating badge – subtle levitation
───────────────────────────────────────────── */
function FloatingBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold bg-neutral-900 dark:bg-neutral-800 border border-neutral-700 text-neutral-300 px-2.5 py-1 rounded-full"
    >
      {children}
    </motion.span>
  )
}

/* ─────────────────────────────────────────────
   Count-up number
───────────────────────────────────────────── */
function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = to / 50
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setValue(to); clearInterval(timer) }
      else setValue(Math.floor(start))
    }, 20)
    return () => clearInterval(timer)
  }, [inView, to])

  return <span ref={ref}>{value}{suffix}</span>
}

/* ─────────────────────────────────────────────
   Stagger container variants
───────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function FeaturesBento() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes borderSpin {
          0%   { background-position: 0% 50% }
          50%  { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        .animated-border::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03), rgba(255,255,255,0.12));
          background-size: 300% 300%;
          animation: borderSpin 4s ease infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .animated-border:hover::before { opacity: 1; }
        .feature-card { transition: box-shadow 0.4s ease; }
        .feature-card:hover { box-shadow: 0 0 40px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06); }
      `}</style>

      <div className="w-full h-full" ref={sectionRef}>
        {/* ── Header ── */}
        <div className="w-full mx-auto pt-8 pb-8 lg:pt-20 relative lg:pb-20 px-2 overflow-hidden">

          {/* ── Subtle line grid (light) ── */}
          <div
            className="pointer-events-none absolute inset-0 z-0 dark:hidden"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* ── Subtle line grid (dark) ── */}
          <div
            className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* ── Radial fade mask — light ── */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] dark:hidden"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, white 100%)",
            }}
          />
          {/* ── Radial fade mask — dark ── */}
          <div
            className="pointer-events-none absolute inset-0 z-[1] hidden dark:block"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(0,0,0,0.95) 100%)",
            }}
          />

          {/* ── Corner accent lines ── */}
          <div className="pointer-events-none absolute inset-0 z-[2]">
            {/* top-left */}
            <div className="absolute top-6 left-6 w-12 h-px bg-gradient-to-r from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute top-6 left-6 w-px h-12 bg-gradient-to-b from-neutral-300 dark:from-neutral-700 to-transparent" />
            {/* top-right */}
            <div className="absolute top-6 right-6 w-12 h-px bg-gradient-to-l from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute top-6 right-6 w-px h-12 bg-gradient-to-b from-neutral-300 dark:from-neutral-700 to-transparent" />
            {/* bottom-left */}
            <div className="absolute bottom-6 left-6 w-12 h-px bg-gradient-to-r from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute bottom-6 left-6 w-px h-12 bg-gradient-to-t from-neutral-300 dark:from-neutral-700 to-transparent" />
            {/* bottom-right */}
            <div className="absolute bottom-6 right-6 w-12 h-px bg-gradient-to-l from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute bottom-6 right-6 w-px h-12 bg-gradient-to-t from-neutral-300 dark:from-neutral-700 to-transparent" />
          </div>

          {/* ── Glowing orb behind heading ── */}
          <div
            className="pointer-events-none absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[180px] rounded-full blur-3xl opacity-30 dark:opacity-20"
            style={{ background: "radial-gradient(ellipse, rgba(163,163,163,0.5) 0%, transparent 70%)" }}
          />

          {/* ── Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex justify-center mb-4"
          >
            <FloatingBadge>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Features
            </FloatingBadge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 tracking-tight"
          >
            All Essential Features in{" "}
            <motion.span
              className="font-mono text-neutral-500 dark:text-neutral-500 relative inline-block"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              one place
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ originX: 0.5 }}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 px-8 lg:px-2 text-center text-sm lg:text-[17px] font-sans font-medium text-neutral-500 dark:text-neutral-400 lg:w-1/2 mx-auto leading-relaxed"
          >
            Features that lokalhost.io provides.
          </motion.p>
        </div>

        {/* ── Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-0 lg:gap-0 border-b border-dashed px-px"
        >

          {/* ── Card 1: Seamless Integration (wide) ── */}
          <motion.div variants={cardVariants} className="w-full lg:col-span-2">
            <TiltCard className="w-full relative h-full lg:h-[340px] border-r border-dashed border-t flex flex-wrap justify-start animated-border feature-card overflow-hidden group">
              {/* Subtle noise overlay */}
              <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

              <div className="w-full lg:w-[70%] lg:px-4 pt-8 space-y-6 relative z-10">
                <div className="space-y-3 pl-5 pr-5 lg:pr-10">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h1 className="text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                      Seamless Integration and{" "}
                      <span className="text-neutral-500">Opinionated,</span>{" "}
                      Yet Fully Customizable
                    </h1>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="text-left font-sans font-medium text-[15px] text-neutral-600 dark:text-neutral-400"
                  >
                    Experience seamless integration with opinionated yet fully customizable components, designed to accelerate development across the entire React ecosystem, including React.js, Next.js, and more. Start fast with strong defaults and scale confidently as your product grows.
                  </motion.p>

                  {/* Animated stat pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="flex gap-2 flex-wrap pt-1"
                  >
                    {[
                      { label: "Components", value: 80, suffix: "+" },
                      { label: "Frameworks", value: 3, suffix: "" },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        whileHover={{ scale: 1.05, y: -1 }}
                        className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-mono"
                      >
                        <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                          <CountUp to={stat.value} suffix={stat.suffix} />
                        </span>
                        <span className="text-neutral-400">{stat.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className="hidden lg:flex md:flex w-full lg:w-[30%] items-center justify-center relative top-4 left-4 bottom-0 z-10">
                <TechEcosystemOrbit />
              </div>

              {/* Hover glow at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/0 dark:from-neutral-950/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </TiltCard>
          </motion.div>

          {/* ── Card 2: Copy-Paste ── */}
          <motion.div variants={cardVariants}>
            <TiltCard className="relative h-[340px] w-full border border-dashed overflow-hidden animated-border feature-card group">
              <div className="space-y-4 pt-6 px-5 lg:px-10 relative z-10">
                <h1 className="text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                  Copy–Paste or{" "}
                  <motion.span
                    className="relative inline-block"
                    whileHover={{ color: "#a3a3a3" }}
                  >
                    CLI Install
                    <motion.span
                      className="absolute bottom-0 left-0 h-px w-full bg-neutral-400"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    />
                  </motion.span>
                </h1>
                <p className="text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2">
                  Install components your way — copy and paste directly into your codebase or use the CLI for faster setup. No lock-in, no magic, just clean code that becomes part of your project.
                </p>
              </div>
              <div className="lg:px-10 px-5 pt-4 relative z-10">
                <TerminalDemo />
              </div>
              <ShimmerBorder />
            </TiltCard>
          </motion.div>

          {/* ── Card 3: Purpose-Driven ── */}
          <motion.div variants={cardVariants}>
            <TiltCard className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t animated-border feature-card group">
              <div className="pt-5 px-5 lg:px-6 relative z-10">
                <AnimatedBeamMultipleOutputDemo />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2 pl-5 pr-5 lg:pr-10 absolute bottom-4 z-20"
              >
                <h1 className="text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200">Purpose-Driven Platform</h1>
                <p className="text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400">
                  Everything on lokalhost.io is built with intent — focused on solving real product needs, not adding unnecessary noise.
                </p>
              </motion.div>
              {/* Bottom gradient fade */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent pointer-events-none z-10" />
            </TiltCard>
          </motion.div>

          {/* ── Card 4: Templates ── */}
          <motion.div variants={cardVariants}>
            <TiltCard className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t animated-border feature-card group">
              <div className="space-y-3 pt-4 px-5 lg:px-10 relative z-10">
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <h1 className="text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                    Businesses and Startup-Ready{" "}
                    <span className="text-neutral-500 dark:text-neutral-400">Templates</span>
                  </h1>
                </motion.div>
                <p className="text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2">
                  Templates built for businesses and startups, designed with real-world layouts, functional flows, and production use in mind.
                </p>
              </div>

              {/* Animated image stack with hover lift */}
              <div className="flex w-full h-full items-start justify-center px-10 pt-5 relative z-10">
                {[
                  { src: "http://localhost:3000/templates/hero-block-1-light.webp", z: "z-10", width: "w-[200px]", pos: "absolute left-1 top-18 -rotate-3", delay: 0 },
                  { src: "https://res.cloudinary.com/dou5rypdf/image/upload/v1760629285/Screenshot_2025-10-05_232843_pjfcdu.png", z: "z-20", width: "w-[380px]", pos: "relative", delay: 0.1 },
                  { src: "http://localhost:3000/templates/hero-block-9-light.webp", z: "z-10", width: "w-[200px]", pos: "absolute right-1 top-18 rotate-3", delay: 0 },
                ].map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.04, zIndex: 30 }}
                    transition={{ duration: 0.5, delay: img.delay, type: "spring", stiffness: 300, damping: 22 }}
                    className={cn(img.pos, img.z, "cursor-pointer")}
                  >
                    <Image
                      width={200}
                      height={200}
                      className={cn("rounded-md object-cover border shadow-lg", img.width)}
                      alt="templates"
                      src={img.src}
                    />
                  </motion.div>
                ))}
              </div>
            </TiltCard>
          </motion.div>

          {/* ── Card 5: Custom Work ── */}
          <motion.div variants={cardVariants}>
            <TiltCard className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t animated-border feature-card group">
              <div className="space-y-4 pt-10 lg:pt-6 px-5 lg:px-8 relative z-10">
                <motion.h1
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200"
                >
                  Custom Work &{" "}
                  <span className="text-neutral-500">Dedicated Support</span>
                </motion.h1>
                <p className="text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2">
                  Need something custom? The lokalhost.io team is available for client work — whether you want to build a SaaS, a business website, or a complete cross-platform mobile app, we're here to make it possible with full deployment and unlimited changes.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="w-full flex items-end justify-end pr-8 gap-2 relative z-20 mt-2"
              >
                {["Talk to us.", "Explore Templates"].map((label) => (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="text-xs flex gap-1 items-center justify-center border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 cursor-pointer font-sans font-medium px-3 py-1.5 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden group/btn"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
                    />
                    {label}
                  </motion.button>
                ))}
              </motion.div>

              <Ripple />
            </TiltCard>
          </motion.div>

        </motion.div>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────
   Tech Ecosystem Orbit
───────────────────────────────────────────── */
export function TechEcosystemOrbit() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={30} radius={140}>
        <IoPhonePortraitOutline className="text-3xl" />
        <TbBrandAuth0 className="text-3xl" />
        <LuFigma className="text-3xl" />
        <PiCubeDuotone className="text-3xl" />
        <TbBackground className="text-3xl" />
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={70}>
        <FaReact className="text-xl" />
        <RiNextjsFill className="text-xl" />
        <RiTailwindCssFill className="text-xl" />
        <TbBrandFramerMotion className="text-xl" />
        <SiShadcnui className="text-xl" />
      </OrbitingCircles>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-neutral-200 dark:border-neutral-800 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-[140px] h-[140px] rounded-full border border-dashed border-neutral-200 dark:border-neutral-700 pointer-events-none"
      />
      <div className="flex justify-center items-center z-10">
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <PiTerminalFill className="text-3xl" />
        </motion.div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Terminal Demo
───────────────────────────────────────────── */
export function TerminalDemo() {
  return (
    <Terminal>
      <TypingAnimation className="text-left">&gt;npx shadcn@latest add @lokalhost/components</TypingAnimation>
      <AnimatedSpan className="text-green-500 text-left">✔ Preflight checks.</AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-left">✔ Verifying framework. Found Next.js.</AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-left">✔ Validating Tailwind CSS.</AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-left">✔ Validating import alias.</AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-left">✔ Writing components.json.</AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-left">✔ Checking registry.</AnimatedSpan>
    </Terminal>
  )
}

/* ─────────────────────────────────────────────
   Animated Beam Demo
───────────────────────────────────────────── */
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  )
)
Circle.displayName = "Circle"

export function AnimatedBeamMultipleOutputDemo({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className={cn("relative flex h-[250px] w-full items-center justify-center p-10", className)}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10 p-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}><FiUserCheck className="text-3xl" /></Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <PiTerminalFill className="text-4xl text-neutral-800" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}><FaReact className="text-xl" /></Circle>
          <Circle ref={div2Ref}><RiNextjsFill className="text-xl" /></Circle>
          <Circle ref={div3Ref}><RiTailwindCssFill className="text-xl" /></Circle>
          <Circle ref={div4Ref}><TbBrandFramerMotion className="text-xl" /></Circle>
          <Circle ref={div5Ref}><SiShadcnui className="text-xl" /></Circle>
        </div>
      </div>
      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div4Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div6Ref} duration={3} />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div7Ref} duration={3} />
    </div>
  )
}
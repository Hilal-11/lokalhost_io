"use client"
import React, { forwardRef, useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useInView, type Variants } from "motion/react"
import { Globe } from "@/components/ui/globe"
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { IoPhonePortraitOutline } from "react-icons/io5"
import { TbBrandAuth0, TbBrandFramerMotion } from "react-icons/tb"
import { LuFigma } from "react-icons/lu"
import { TbBackground } from "react-icons/tb"
import { PiCubeDuotone, PiTerminalFill } from "react-icons/pi"
import { RiPagesLine, RiTailwindCssFill, RiNextjsFill } from "react-icons/ri"
import { FaReact } from "react-icons/fa"
import { OrbitingCircles } from '@/components/ui/orbiting-circles'
import { SiShadcnui, SiReact, SiNextdotjs, SiTypescript } from 'react-icons/si'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import { ComponentsMarquee } from '../MicroComponents/templatesScrolling'
import { TerminalDemo } from './FeaturesBento'
import { StripedPattern } from '../../magicui/striped-pattern'

/* ─────────────────────────────────────────────
   Re-usable: Tilt Card with cursor spotlight
───────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 400, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 400, damping: 30 })
  const glowX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glowY = useTransform(y, [-0.5, 0.5], [0, 100])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className={cn("relative group", className)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([lx, ly]) => `radial-gradient(180px circle at ${lx}% ${ly}%, rgba(255,255,255,0.055), transparent 70%)`
          ),
        }}
      />
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Re-usable: Floating badge
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
   Re-usable: Count-up
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
   Stagger variants
───────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

/* ─────────────────────────────────────────────
   Feature icon card – with magnetic hover
───────────────────────────────────────────── */
function FeatureIconCard({ icon: Icon, title, link_to, index }: {
  icon: React.ElementType
  title: string
  link_to: string
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.04 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative h-24 bg-white dark:bg-black border border-dashed rounded-sm shadow-sm flex items-center justify-center overflow-hidden cursor-pointer group/card"
    >
      {/* animated shimmer sweep on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={hovered ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      {/* faint glow at bottom */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-neutral-100/60 dark:from-neutral-900/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      <Link href={link_to} className="w-full">
        <div className="w-full space-y-2 relative z-10">
          <motion.p
            animate={hovered ? { scale: 1.15, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center text-5xl flex justify-center items-center text-neutral-700 dark:text-neutral-300"
          >
            <Icon />
          </motion.p>
          <h1 className="text-center font-sans font-medium text-xs text-neutral-800 dark:text-neutral-300">
            {title}
          </h1>
        </div>
      </Link>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Image stack card
───────────────────────────────────────────── */
function ImageStack({ images }: { images: string[] }) {
  return (
    <div className="flex justify-center items-end relative px-4">
      {images.map((src, i) => {
        const isCenter = i === Math.floor(images.length / 2)
        const offset = (i - Math.floor(images.length / 2)) * 12
        return (
          <motion.div
            key={src}
            initial={{ opacity: 0, y: 30, rotate: offset * 0.8 }}
            whileInView={{ opacity: 1, y: 0, rotate: offset * 0.4 }}
            whileHover={{ y: -10, scale: 1.05, rotate: 0, zIndex: 30,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            transition={{
              delay: i * 0.06,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ zIndex: isCenter ? 20 : 10 - Math.abs(i - Math.floor(images.length / 2)) }}
            className="cursor-pointer"
          >
            <Image
              width={200}
              height={200}
              className="border rounded-sm object-cover w-[380px] shadow-md"
              alt="template preview"
              src={src}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
function ComponentsBento() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: "-80px" })

  const featureItems = [
    { id: "components", title: "Components", icon: PiCubeDuotone,       link_to: "/docs" },
    { id: "templates",  title: "Templates",  icon: RiPagesLine,          link_to: "templates" },
    { id: "ui-kits",    title: "UI Kits",    icon: LuFigma,              link_to: "designs" },
    { id: "mobile",     title: "Mobile",     icon: IoPhonePortraitOutline, link_to: "" },
    { id: "auth-kits",  title: "Auth Kits",  icon: TbBrandAuth0,         link_to: "authdocs" },
  ]

  return (
    <>
      <style>{`
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

        {/* ── Header (same as FeaturesBento) ── */}
        <div className="w-full mx-auto pb-8 relative overflow-hidden">

          {/* dot grid – light */}
          <div className="pointer-events-none absolute inset-0 z-0 dark:hidden"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
          {/* dot grid – dark */}
          <div className="pointer-events-none absolute inset-0 z-0 hidden dark:block"
            style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

          {/* radial fade – light */}
          <div className="pointer-events-none absolute inset-0 z-[1] dark:hidden"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, white 100%)" }} />
          {/* radial fade – dark */}
          <div className="pointer-events-none absolute inset-0 z-[1] hidden dark:block"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 20%, rgba(0,0,0,0.95) 100%)" }} />

          {/* corner accents */}
          <div className="pointer-events-none absolute inset-0 z-[2]">
            <div className="absolute top-6 left-6 w-12 h-px bg-gradient-to-r from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute top-6 left-6 w-px h-12 bg-gradient-to-b from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute top-6 right-6 w-12 h-px bg-gradient-to-l from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute top-6 right-6 w-px h-12 bg-gradient-to-b from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute bottom-6 left-6 w-12 h-px bg-gradient-to-r from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute bottom-6 left-6 w-px h-12 bg-gradient-to-t from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute bottom-6 right-6 w-12 h-px bg-gradient-to-l from-neutral-300 dark:from-neutral-700 to-transparent" />
            <div className="absolute bottom-6 right-6 w-px h-12 bg-gradient-to-t from-neutral-300 dark:from-neutral-700 to-transparent" />
          </div>

          {/* orb glow */}
          <div className="pointer-events-none absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[180px] rounded-full blur-3xl opacity-25 dark:opacity-15"
            style={{ background: "radial-gradient(ellipse, rgba(163,163,163,0.5) 0%, transparent 70%)" }} />

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex justify-center mb-4 pt-8 lg:pt-20"
          >
            <FloatingBadge>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Components
            </FloatingBadge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 tracking-tight"
          >
            Explore 10+ Premium{" "}
            <motion.span
              className="font-mono text-neutral-500 dark:text-neutral-500 relative inline-block"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Lokalhost.io
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                style={{ originX: 0.5 }}
              />
            </motion.span>{" "}
            Components
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 text-center text-sm lg:text-[17px] font-sans font-medium text-neutral-500 dark:text-neutral-400 mx-auto lg:w-1/2 px-5 pb-8 lg:pb-0 leading-relaxed"
          >
            Quickly build stunning web interfaces — from landing pages and marketing sites to e-commerce and dashboards with unlimited theme options.
          </motion.p>
        </div>

        {/* ── Bento Grid ── */}

                
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-10 border-l relative h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 lg:gap-0 border-b border-r border-dashed px-px"
        >
          {/* ── Card 1: What is Lokalhost ── */}
          <motion.div variants={cardVariants} className="w-full lg:col-span-2">
            <TiltCard className="relative lg:h-[340px] h-auto border-r border-dashed border-t flex flex-wrap justify-start animated-border feature-card group">
              <div className="pt-7 px-4 lg:pl-14 w-full relative z-10">
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-left text-2xl lg:text-3xl font-sans font-bold text-neutral-800 dark:text-neutral-300"
                >
                  What Lokalhost.io is?
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="text-left pt-3 text-xs lg:text-[15px] lg:pl-2 font-sans font-medium text-neutral-700 dark:text-neutral-400"
                >
                  A unified ecosystem built for modern product development, covering web and mobile UI, design systems, authentication, motion, and creative assets — all optimized for production use.
                </motion.p>

                <div className="pt-6 pl-2">
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex gap-1 text-sm font-sans font-bold text-neutral-800 dark:text-neutral-300 items-center"
                  >
                    <motion.span
                      animate={{ rotate: [0, 0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      className="text-xl"
                    >
                      <PiTerminalFill />
                    </motion.span>
                    What lokalhost provides?
                  </motion.p>

                  <div className="pt-5 w-full grid grid-cols-2 lg:grid-cols-5 items-center gap-2 lg:gap-3 px-3 py-3">
                    {featureItems.map((item, i) => (
                      <FeatureIconCard key={item.id} {...item} index={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* bottom edge fade */}
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white/30 dark:from-neutral-950/30 to-transparent pointer-events-none z-20" />
            </TiltCard>
          </motion.div>
          {/* ── Card 2: Foundational Components ── */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <TiltCard className="relative w-full h-[340px] border border-dashed animated-border feature-card overflow-hidden group">
              <div className="px-4 pt-5 relative z-10">
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-left text-2xl lg:text-3xl font-sans font-bold text-neutral-800 dark:text-neutral-300"
                >
                  Foundational and{" "}
                  <motion.span
                    className="relative inline-block text-neutral-500"
                    whileHover={{ scale: 1.02 }}
                  >
                    Functional Components
                    <motion.span
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                      style={{ originX: 0.5 }}
                    />
                  </motion.span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  className="text-left pt-2 pl-2 text-[15px] font-sans font-medium text-neutral-700 dark:text-neutral-400"
                >
                  Foundational components built to support real functionality, covering common UI patterns used in everyday application development.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="pt-6 relative z-10"
              >
                <ComponentsMarquee />
              </motion.div>
            </TiltCard>
          </motion.div>
          {/* ── Card 3: Built for Production (Globe) ── */}
          <motion.div variants={cardVariants}>
            <TiltCard className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t animated-border feature-card group">
              <div className="flex flex-col w-full h-full overflow-hidden gap-3">
                <div className="px-4 pt-4 z-30 w-full relative">
                  <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-left text-xl lg:text-2xl font-sans font-bold text-neutral-800 dark:text-neutral-300"
                  >
                    Built for Production,{" "}
                    <span className="text-neutral-500">Ready to ship</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="text-left text-xs lg:text-sm lg:pl-2 font-sans font-medium text-neutral-700 dark:text-neutral-400"
                  >
                    Built with real-world standards, ready to ship without extra work.
                  </motion.p>

                  {/* Stat pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="flex gap-2 flex-wrap pt-3"
                  >
                    {[{ label: "Components", to: 80, suffix: "+" }, { label: "Templates", to: 20, suffix: "+" }].map((s) => (
                      <motion.div
                        key={s.label}
                        whileHover={{ scale: 1.06, y: -1 }}
                        className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 rounded-lg px-2.5 py-1 text-xs font-mono"
                      >
                        <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                          <CountUp to={s.to} suffix={s.suffix} />
                        </span>
                        <span className="text-neutral-400">{s.label}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="w-full flex justify-end gap-2 lg:px-2 pt-3 pb-2">
                    {["Explore components", "Read Docs"].map((label) => (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="text-xs flex gap-1 items-center justify-center border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 cursor-pointer font-sans font-medium px-4 py-1 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06)] relative overflow-hidden group/btn"
                      >
                        <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="relative bottom-14 flex justify-center items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <Globe />
                  </motion.div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
          {/* ── Card 4: CLI Install ── */}
          <motion.div variants={cardVariants}>
            <TiltCard className="px-2 relative overflow-hidden h-[340px] w-full border-r border-dashed border-t animated-border feature-card group">
              <div className="px-4 pt-4 space-y-2 relative z-10">
                <motion.h1
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200"
                >
                  CLI Install{" "}
                  <motion.span
                    className="font-mono text-neutral-500 relative inline-block"
                    whileHover={{ scale: 1.04 }}
                  >
                    Support
                    <motion.span
                      className="absolute -bottom-0.5 left-0 h-px w-full bg-gradient-to-r from-transparent via-neutral-400 to-transparent"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                      style={{ originX: 0 }}
                    />
                  </motion.span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2"
                >
                  Easily install components, templates, and blocks via CLI — powered by Shadcn registry for seamless integration.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-3 relative z-10"
              >
                <TerminalDemo />
              </motion.div>
            </TiltCard>
          </motion.div>

          {/* ── Card 5: Bento / Dashboards / Headers (wide) ── */}
          <motion.div variants={cardVariants} className="lg:col-span-2">
            <TiltCard className="relative overflow-hidden h-[340px] w-full border-dashed border-t animated-border feature-card group">

              {/* ── text ── */}
              <div className="px-5 pt-5 space-y-2 relative z-10">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 }}
                  className="text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200"
                >
                  Explore Bento Grids, Dashboards,{" "}
                  <span className="text-neutral-500 dark:text-neutral-400">Headers, Landings…</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.22 }}
                  className="text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400"
                >
                  Build faster with production-ready layouts designed for real-world applications.
                </motion.p>
              </div>

              {/* ── image row pinned to bottom, overflowing ── */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-4 pb-0">
                {[
                  { src: "/templates/components1.png", rotate: -4, delay: 0.05, y: 30 },
                  { src: "/templates/components5.png", rotate: -2, delay: 0.12, y: 20 },
                  { src: "/templates/components2.png", rotate:  0, delay: 0.18, y: 10 },
                  { src: "/templates/components4.png", rotate:  2, delay: 0.12, y: 20 },
                  { src: "/templates/components3.png", rotate:  4, delay: 0.05, y: 30 },
                ].map(({ src, rotate, delay, y: yOffset }, i) => {
                  const isCenter = i === 2
                  return (
                    <motion.div
                      key={src}
                      initial={{ opacity: 0, y: 60, rotate: rotate * 2 }}
                      whileInView={{ opacity: 1, y: yOffset, rotate }}
                      whileHover={{
                        y: yOffset - 18,
                        scale: 1.06,
                        rotate: 0,
                        zIndex: 40,
                        transition: { type: "spring", stiffness: 280, damping: 22 },
                      }}
                      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
                      style={{ zIndex: isCenter ? 20 : 10 - Math.abs(i - 2) }}
                      className="relative cursor-pointer flex-shrink-0 shadow-xl rounded-t-md overflow-hidden"
                    >
                      <Image
                        width={320}
                        height={220}
                        className={cn(
                          "rounded-t-md object-cover border border-neutral-200 dark:border-neutral-700",
                          isCenter ? "w-[200px] lg:w-[240px]" : "w-[150px] lg:w-[180px]"
                        )}
                        alt="template preview"
                        src={src}
                      />
                      {/* per-image hover shine */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  )
                })}
              </div>

              {/* bottom-up gradient so images blend into card */}
              <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white dark:from-neutral-950 to-transparent pointer-events-none z-30" />
              {/* left / right side fades */}
              <div className="absolute inset-y-0 left-0  w-10 bg-gradient-to-r from-white dark:from-neutral-950 to-transparent pointer-events-none z-30" />
              <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white dark:from-neutral-950 to-transparent pointer-events-none z-30" />
            </TiltCard>
          </motion.div>  
        </motion.div>

        {/* ── CTA strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex items-center justify-center py-10 lg:py-16 border-b border-dashed relative lg:mask-x-from-60% mask-x-from-70% to-100%"
        >
          <StripedPattern />
          <Link href="/docs">
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="z-20 relative inline-block border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 cursor-pointer font-sans font-medium px-10 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] overflow-hidden group/cta"
            >
              <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
              Explore Components
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </>
  )
}

export default ComponentsBento

/* ─────────────────────────────────────────────
   Animated Beam Demo
───────────────────────────────────────────── */
const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn("z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] cursor-pointer", className)}
    >
      {children}
    </motion.div>
  )
)
Circle.displayName = "Circle"

export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div className="relative flex h-[100px] w-full items-center justify-center px-3 pb-5" ref={containerRef}>
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}><SiReact className="text-2xl" /></Circle>
          <Circle ref={div5Ref}><TbBrandFramerMotion className="text-2xl" /></Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}><SiNextdotjs className="text-2xl" /></Circle>
          <Circle ref={div4Ref} className="size-16"><PiTerminalFill className="text-3xl" /></Circle>
          <Circle ref={div6Ref}><RiTailwindCssFill className="text-2xl" /></Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}><SiTypescript className="text-2xl" /></Circle>
          <Circle ref={div7Ref}><SiShadcnui className="text-2xl" /></Circle>
        </div>
      </div>
      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
      <AnimatedBeam containerRef={containerRef} fromRef={div5Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse />
      <AnimatedBeam containerRef={containerRef} fromRef={div7Ref} toRef={div4Ref} curvature={75} endYOffset={10} reverse />
    </div>
  )
}

/* ─────────────────────────────────────────────
   Orbiting Circles Demo
───────────────────────────────────────────── */
export function OrbitingCirclesDemo() {
  return (
    <div className="absolute top-16 left-28 flex h-full w-full flex-col items-center justify-center">
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
      <div className="flex justify-center items-center">
        <PiTerminalFill className="text-3xl" />
      </div>
    </div>
  )
}
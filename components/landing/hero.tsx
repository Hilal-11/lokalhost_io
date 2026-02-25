"use client";
import type React from "react";
import { useState } from "react";
import { motion } from "motion/react"
import AnnoncementBadge from "./AnnoncementBadge";
import { cn } from "@/lib/utils";
import {  useTheme } from "next-themes"
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { ContainerTextFlip } from "./animate_hero_tags"
import TemplatesShowcaseBento from "./LandingComponents/TemplatesShowcaseBento";
import { IoMdSend } from "react-icons/io";
import TailoredSignal from "./MicroComponents/TailoredSignal";
import { MarqueeTemplates } from "./MicroComponents/templatesScrolling";
import FeaturesBento from "./LandingComponents/FeaturesBento";
import ComponentsBento from "./LandingComponents/ComponentsBento"
import DesignsBento from "./LandingComponents/DesignsBento"
import nProgress from "nprogress";
import ComponentsShowcase, { TemplatesBlockList } from "./LandingComponents/ComponentsShowcase";
import LandingPagesShowcase from "./LandingComponents/LandingPagesShowcase";
import MobileAppsAndUIBlocks from "./LandingComponents/MobileAppaAndUIBlocks"; 
interface IServiceType {
    button_name: string,
    button_link: string
}
interface IHeroSectionSevice {
    id: string | number
    sercice_name: string,
    service_disc: string,
    service_link: string,
    service_light_image: string,
    service_dark_image: string,
    service_buttons: IServiceType[]
}
export interface ITemplate {
  image: string;
  to?: string;
}



export function HeroSection() {

  const { theme } = useTheme();


   const handleLinkClick = () => {
      nProgress.start()
    }

  return (
    <div className="w-full container max-w-[1580px] h-auto mx-auto  py-8 lg:py-16 flex flex-col items-center justify-center text-center gap-6">
      <motion.span
       initial={{opacity: 0 , y: -100}}
       animate={{opacity: 1 , y: 0}}
       transition={{ delay: 0.2, duration: 0.98 , ease: 'easeInOut'}}
       className="absolute top-0 left-0 lg:-top-28 lg:left-40 w-[60px] lg:w-[170px] h-[300px] lg:h-[600px] bg-neutral-300 dark:bg-neutral-800 blur-2xl rounded-b-full -rotate-45 "></motion.span>
      
      {/* Simple clean grid - more visible on left */}
      <div className="absolute inset-0 h-[850px] lg:h-[950px] bg-[linear-gradient(to_right,#d4d4d428_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d428_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#52525240_1px,transparent_1px),linear-gradient(to_bottom,#52525240_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_right,#000_0%,rgba(0,0,0,0.7)_35%,rgba(0,0,0,0.3)_65%,transparent_100%)]" />
      
      {/* Subtle fog effect */}
      <div className="absolute inset-0 h-[850px] lg:h-[950px] bg-gradient-to-r from-transparent via-white/[0.02] to-white/[0.05] dark:from-transparent dark:via-black/[0.02] dark:to-black/[0.05]" />

      <div className="w-full h-auto px-0 lg:px-4 py-6">
        <AnnoncementBadge aboutBadge={"Templates & Marketing UI Blocks, Mobile apps, UI design kits & more"}/>
        <div className="mt-8 text-center flex-col gap-4">
          <h1 className="font-sans font-bold text-2xl lg:text-5xl text-neutral-800 dark:text-neutral-200 pb-2">A Complete Ecosystem for Designing, Building, and Scaling Modern Web & Mobile Applications.</h1>
          <ContainerTextFlip/>
          <p className={cn(
          "font-sans font-medium text-[15px] lg:text-[16px] pt-4",
          "text-neutral-500 dark:text-neutral-400",
          "leading-relaxed max-w-2xl mx-auto",
          "px-4 lg:px-0"
        )}>
          A unified ecosystem for modern product development — covering web &amp; mobile UI, design systems,
          authentication, motion, and creative assets.{" "}
          <span className="text-neutral-700 dark:text-neutral-300 font-semibold">All optimized for production.</span>
        </p>
        </div>

        <div className="flex mx-auto mt-2 mb-2">
          <TailoredSignal />
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <motion.button
            transition={{ duration: 0.28 , ease: "easeInOut"}}
            whileHover={{ y: -3 }}
            whileTap={{ y: -4 }}
            onClick={handleLinkClick}
          className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 dark:border-neutral-400 relative overflow-hidden cursor-pointer font-sans font-medium px-10 py-2 rounded-lg bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center gap-2"><span><IoMdSend className="text-lg text-neutral-700"/></span>Explore Templets</motion.button>
          <motion.button
              transition={{ duration: 0.28 , ease: "easeInOut"}}
              whileHover={{ y: -3}}
              whileTap={{ y: -4 }}
              onClick={handleLinkClick}
          className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium px-10 py-2 rounded-lg bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">Components Documentation
          </motion.button>
          
        </div>
      </div>
{/*  */}


    <div className="relative h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t gap-4 md:gap-0 lg:gap-0 border-b border-dashed px-px">

            {/* corner circle decorations */}
            <span className="absolute h-[160px] w-[160px] rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 -top-20 -left-20" />
            <span className="absolute h-[160px] w-[160px] rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 -top-20 -right-20" />

            {SERVICES.map((service) => {
              const { Shader } = service;
              return (
                <Link onClick={handleLinkClick} key={service.id} href={service.link} prefetch>
                  <motion.div
                    whileHover="hovered"
                    initial="idle"
                    className={cn(
                      "group cursor-pointer relative h-[400px]",
                      "bg-neutral-50 dark:bg-neutral-950",
                      "flex flex-col overflow-hidden w-full border border-dashed border-neutral-300 dark:border-neutral-700",
                      "shadow-[0px_1px_3px_rgba(0,0,0,0.04),0px_4px_12px_rgba(0,0,0,0.04)]",
                      "dark:shadow-[0px_2px_8px_rgba(0,0,0,0.3)]",
                      "transition-shadow duration-300",
                      "hover:shadow-[0px_4px_24px_rgba(0,0,0,0.10)] dark:hover:shadow-[0px_4px_24px_rgba(0,0,0,0.6)]"
                    )}
                  >
                    {/* ── Shader visual (top 70%) ── */}
                    <motion.div
                      variants={{
                        idle:    { scale: 1 },
                        hovered: { scale: 1.02 },
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex-1 relative"
                    >
                      {/* wrap shader in a function so we can pass hovered state */}
                      <ShaderWrapper Shader={Shader} />
                    </motion.div>

                    {/* ── Footer strip (bottom 30%) ── */}
                    <motion.div
                      variants={{
                        idle:    { y: 0 },
                        hovered: { y: -2 },
                      }}
                      transition={{ duration: 0.35 }}
                      className="relative shrink-0 px-5 flex flex-col gap-2.5 py-4 bg-neutral-50 dark:bg-neutral-950 border-t border-dashed border-neutral-300 dark:border-neutral-700"
                    >
                      {/* service name + desc */}
                      <div>
                        <h3 className="font-sans font-semibold text-[16px] text-left text-neutral-800 dark:text-neutral-200 leading-tight">
                          {service.name}
                        </h3>
                        <p className="text-[12px] font-sans font-medium text-neutral-500 dark:text-neutral-400 text-left mt-0.5 leading-snug">
                          {service.disc}
                        </p>
                      </div>

                      {/* buttons */}
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ y: -4, scale: 0.97 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className={cn(
                            "cursor-pointer border-t border-l border-r border-neutral-800 dark:border-neutral-700",
                            "rounded-md py-1.5 px-4 whitespace-nowrap",
                            "font-sans font-medium text-xs text-neutral-100",
                            "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
                            "shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                            "hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]",
                            "transition-shadow duration-200"
                          )}
                        >
                          {service.primaryBtn}
                        </motion.button>

                        <motion.button
                          whileHover={{ y: -2 }}
                          whileTap={{ y: -4 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="cursor-pointer flex gap-1 items-center font-sans font-medium text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors duration-200"
                        >
                          {service.secondaryBtn}
                          <HiOutlineExternalLink className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
    </div>

        
        <div className="w-full h-auto mt-10 mb-10">
          <MarqueeTemplates/>
        </div>
        <div className="w-full container max-w-[1580px]">
          <ComponentsShowcase/>
        </div>
        <div className="w-full container max-w-[1580px]">
          <TemplatesBlockList/>
        </div>
        <div className="pt-16">
          <LandingPagesShowcase />
        </div>
        <div>
          <MobileAppsAndUIBlocks />
        </div>
        <div className="mt-16 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <FeaturesBento />
        </div>
        <div className="mt-20 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <ComponentsBento/>
        </div>
        <div className="mt-20 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <TemplatesShowcaseBento/>
        </div>
        <div className="mt-20 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <DesignsBento />
        </div>
    </div>
  );
}



// 1 ── Web Components — floating UI component blocks orbiting a central card
function ShaderComponents({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">

      {/* radial glow */}
      <div className={cn("absolute inset-0 transition-opacity duration-700", hovered ? "opacity-100" : "opacity-40")}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-neutral-300 dark:bg-neutral-700 blur-[60px]" />
      </div>

      {/* animated grid lines */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,1) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* center main card */}
      <motion.div
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-20 w-44 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-3 flex flex-col gap-2.5"
      >
        {/* card header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {["bg-red-400/60","bg-yellow-400/60","bg-green-400/60"].map((c,i) => <span key={i} className={cn("w-2 h-2 rounded-full",c)} />)}
          </div>
          <div className="h-1.5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        </div>
        {/* skeleton rows */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-1.5 w-4/5 rounded-full bg-neutral-100 dark:bg-neutral-800" />
        </div>
        {/* mini buttons */}
        <div className="flex gap-1.5">
          <div className="flex-1 h-6 rounded-lg bg-neutral-900 dark:bg-neutral-600" />
          <div className="flex-1 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        </div>
        {/* badge row */}
        <div className="flex gap-1 flex-wrap">
          {["w-10","w-14","w-8","w-12"].map((w,i) => (
            <div key={i} className={cn("h-4 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700",w)} />
          ))}
        </div>
      </motion.div>

      {/* floating satellite cards */}
      {[
        { x: -90, y: -60, delay: 0,   rotate: -8,  w: "w-24", content: "button" },
        { x:  90, y: -55, delay: 0.1, rotate:  6,  w: "w-20", content: "input"  },
        { x: -85, y:  65, delay: 0.2, rotate:  5,  w: "w-22", content: "badge"  },
        { x:  88, y:  60, delay: 0.3, rotate: -6,  w: "w-20", content: "toast"  },
      ].map(({ x, y, delay, rotate, w, content }, i) => (
        <motion.div
          key={i}
          animate={{ y: hovered ? y - 4 : y, x, rotate, opacity: hovered ? 1 : 0.55 }}
          transition={{ duration: 0.5, delay, ease: "easeOut" }}
          className={cn("absolute z-10 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-md p-2 flex flex-col gap-1", w)}
        >
          <div className="h-1.5 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          {content === "button" && <div className="h-4 w-full rounded-md bg-neutral-800 dark:bg-neutral-600" />}
          {content === "input"  && <div className="h-4 w-full rounded-md bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />}
          {content === "badge"  && <div className="flex gap-1"><div className="h-3 w-6 rounded-full bg-neutral-200 dark:bg-neutral-700"/><div className="h-3 w-8 rounded-full bg-neutral-800 dark:bg-neutral-500"/></div>}
          {content === "toast"  && <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800 border-l-2 border-emerald-400" />}
        </motion.div>
      ))}

      {/* connecting dot lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="50%" y1="50%" x2="80%" y2="28%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="50%" y1="50%" x2="18%" y2="72%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="50%" y1="50%" x2="82%" y2="70%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
      </svg>
    </div>
  );
}

// 2 ── Web Templates — browser window with animated page layout blocks
function ShaderTemplates({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      <div className={cn("absolute inset-0 transition-opacity duration-700", hovered ? "opacity-80" : "opacity-30")}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-56 bg-neutral-300 dark:bg-neutral-700 blur-[70px] rounded-full" />
      </div>

      {/* dot grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle,rgba(0,0,0,1) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* browser window */}
      <motion.div
        animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.03 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-52 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-[0_12px_40px_rgba(0,0,0,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)] overflow-hidden"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          {["bg-red-400/70","bg-yellow-400/70","bg-green-400/70"].map((c,i) => <span key={i} className={cn("w-2 h-2 rounded-full",c)} />)}
          <div className="flex-1 mx-2 h-3 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center px-2">
            <div className="h-1 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          </div>
        </div>
        {/* page content */}
        <div className="p-2.5 flex flex-col gap-2">
          {/* nav */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-2 rounded bg-neutral-800 dark:bg-neutral-400" />
            <div className="flex gap-1.5">
              {[...Array(3)].map((_,i) => <div key={i} className="h-1.5 w-5 rounded-full bg-neutral-200 dark:bg-neutral-700" />)}
              <div className="h-4 w-8 rounded bg-neutral-900 dark:bg-neutral-600" />
            </div>
          </div>
          {/* hero */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-1.5 py-2"
          >
            <div className="h-3 w-4/5 rounded-lg bg-neutral-800 dark:bg-neutral-300" />
            <div className="h-2 w-3/5 rounded-lg bg-neutral-500 dark:bg-neutral-500" />
            <div className="h-1 w-4/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex gap-1.5 mt-0.5">
              <div className="h-5 w-14 rounded-lg bg-neutral-900 dark:bg-neutral-600" />
              <div className="h-5 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
            </div>
          </motion.div>
          {/* feature cols */}
          <div className="grid grid-cols-3 gap-1.5">
            {[...Array(3)].map((_,i) => (
              <motion.div
                key={i}
                animate={{ y: hovered ? -2 : 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-1.5 flex flex-col gap-1"
              >
                <div className="w-3 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-1 w-full rounded-full bg-neutral-100 dark:bg-neutral-700" />
                <div className="h-1 w-3/4 rounded-full bg-neutral-100 dark:bg-neutral-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* shadow reflection */}
      <div className={cn("absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-3 rounded-full bg-neutral-400 dark:bg-neutral-600 blur-md transition-opacity duration-500", hovered ? "opacity-20" : "opacity-10")} />
    </div>
  );
}

// 3 ── Mobile UI Elements — 3 phones in a fan with animated UI inside
function ShaderMobile({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      <div className={cn("absolute inset-0 transition-opacity duration-700", hovered ? "opacity-70" : "opacity-30")}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-neutral-300 dark:bg-neutral-600 blur-[60px] rounded-full" />
      </div>

      {/* Concentric rings */}
      {[200, 280].map((size, i) => (
        <div key={i} className="absolute rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 opacity-30" style={{ width: size, height: size }} />
      ))}

      {/* LEFT phone */}
      <motion.div
        animate={{ x: hovered ? -68 : -60, rotate: hovered ? -10 : -8, y: hovered ? 10 : 14, opacity: hovered ? 0.85 : 0.6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute z-10 w-[68px] h-[120px] rounded-[16px] border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-md flex flex-col overflow-hidden"
      >
        <div className="mx-auto mt-1 w-6 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex-1 p-1.5 flex flex-col gap-1.5">
          <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="flex-1 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-4 rounded-lg bg-neutral-900 dark:bg-neutral-600" />
        </div>
        <div className="mx-auto mb-1.5 w-7 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </motion.div>

      {/* CENTER phone */}
      <motion.div
        animate={{ y: hovered ? -12 : -6, scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-20 w-[84px] h-[148px] rounded-[20px] border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-[0_16px_48px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden"
      >
        <div className="mx-auto mt-1.5 w-7 h-2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          {/* status bar */}
          <div className="flex items-center justify-between">
            <div className="h-1.5 w-8 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <div className="flex gap-0.5">
              {[...Array(3)].map((_,i) => <div key={i} className="w-1 h-2.5 rounded-sm bg-neutral-300 dark:bg-neutral-700" style={{ opacity: 1 - i * 0.25 }} />)}
            </div>
          </div>
          {/* profile row */}
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <div className="flex flex-col gap-0.5">
              <div className="h-1.5 w-12 rounded-full bg-neutral-300 dark:bg-neutral-700" />
              <div className="h-1 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
          {/* card */}
          <div className="flex-1 rounded-xl bg-neutral-900 dark:bg-neutral-800 p-2 flex flex-col gap-1.5">
            <div className="h-1.5 w-1/2 rounded-full bg-white/40" />
            <div className="h-3 w-3/4 rounded bg-white/70" />
            <div className="flex items-end gap-0.5 flex-1">
              {[40,70,50,85,55].map((h,i) => (
                <div key={i} className={cn("flex-1 rounded-sm", i===3 ? "bg-white/60" : "bg-white/20")} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
          {/* bottom nav */}
          <div className="flex justify-around">
            {[...Array(4)].map((_,i) => (
              <div key={i} className={cn("w-4 h-4 rounded-md", i===0 ? "bg-neutral-800 dark:bg-neutral-400" : "bg-neutral-100 dark:bg-neutral-800")} />
            ))}
          </div>
        </div>
        <div className="mx-auto mb-1.5 w-8 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </motion.div>

      {/* RIGHT phone */}
      <motion.div
        animate={{ x: hovered ? 68 : 60, rotate: hovered ? 10 : 8, y: hovered ? 10 : 14, opacity: hovered ? 0.85 : 0.6 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute z-10 w-[68px] h-[120px] rounded-[16px] border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-md flex flex-col overflow-hidden"
      >
        <div className="mx-auto mt-1 w-6 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex-1 p-1.5 flex flex-col gap-1.5">
          <div className="flex gap-1">
            {[...Array(2)].map((_,i) => <div key={i} className="flex-1 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800" />)}
          </div>
          <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-1.5 w-3/4 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
        </div>
        <div className="mx-auto mb-1.5 w-7 h-1 rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </motion.div>
    </div>
  );
}

// 4 ── Designs & Figma — design canvas with frames, nodes, colour swatches
function ShaderFigma({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none">
      <div className={cn("absolute inset-0 transition-opacity duration-700", hovered ? "opacity-80" : "opacity-30")}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-56 bg-neutral-300 dark:bg-neutral-700 blur-[65px] rounded-full" />
      </div>

      {/* figma-style canvas grid */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.6) 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* main design frame */}
      <motion.div
        animate={{ y: hovered ? -8 : 0, scale: hovered ? 1.03 : 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-20 w-48 rounded-lg bg-white dark:bg-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* frame label */}
        <div className="absolute -top-4 left-0 text-[9px] font-mono text-neutral-400 dark:text-neutral-600">Frame 1</div>
        <div className="p-3 flex flex-col gap-2.5">
          {/* color swatches */}
          <div className="flex gap-1.5">
            {["bg-neutral-900 dark:bg-neutral-200","bg-neutral-500","bg-neutral-300 dark:bg-neutral-600","bg-neutral-100 dark:bg-neutral-800","bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700"].map((c,i) => (
              <motion.div
                key={i}
                animate={{ scale: hovered ? 1.15 : 1 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className={cn("w-6 h-6 rounded-full shadow-sm", c)}
              />
            ))}
          </div>
          {/* typography row */}
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-4/5 rounded bg-neutral-800 dark:bg-neutral-200" />
            <div className="h-2.5 w-3/5 rounded bg-neutral-400 dark:bg-neutral-500" />
            <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-1.5 w-4/5 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
          </div>
          {/* component variants */}
          <div className="flex gap-2">
            <div className="flex-1 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-700 flex items-center justify-center">
              <div className="h-1.5 w-8 rounded-full bg-white/50" />
            </div>
            <div className="flex-1 h-7 rounded-lg border border-neutral-300 dark:border-neutral-600 flex items-center justify-center">
              <div className="h-1.5 w-8 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            </div>
          </div>
          {/* spacing / layout guide */}
          <div className="relative h-8 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-1.5 px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-full w-1.5 border-r border-dashed border-blue-300 dark:border-blue-700 opacity-60" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-full w-1.5 border-l border-dashed border-blue-300 dark:border-blue-700 opacity-60" />
            <div className="h-1 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </motion.div>

      {/* floating node handles */}
      {[
        { x: -80, y: -55, delay: 0   },
        { x:  82, y: -50, delay: 0.08},
        { x: -78, y:  62, delay: 0.16},
        { x:  80, y:  58, delay: 0.24},
      ].map(({ x, y, delay }, i) => (
        <motion.div
          key={i}
          animate={{ x, y, scale: hovered ? 1.2 : 1, opacity: hovered ? 0.9 : 0.5 }}
          transition={{ duration: 0.45, delay }}
          className="absolute z-10 w-3 h-3 rounded-full bg-white dark:bg-neutral-950 border-2 border-blue-400 dark:border-blue-500 shadow-md"
        />
      ))}

      {/* floating layer panel */}
      <motion.div
        animate={{ x: hovered ? 100 : 92, y: hovered ? -30 : -24, opacity: hovered ? 1 : 0.55 }}
        transition={{ duration: 0.45 }}
        className="absolute z-10 w-24 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-lg p-2 flex flex-col gap-1.5"
      >
        <div className="h-1.5 w-1/2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        {["Component","Button","Text","Frame"].map((_, i) => (
          <div key={i} className={cn("flex items-center gap-1 px-1 py-0.5 rounded", i===1 ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" : "")}>
            <div className={cn("w-2 h-2 rounded-sm shrink-0", i===1 ? "bg-blue-400" : "bg-neutral-200 dark:bg-neutral-700")} />
            <div className={cn("h-1 flex-1 rounded-full", i===1 ? "bg-blue-300 dark:bg-blue-700" : "bg-neutral-100 dark:bg-neutral-800")} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE DATA
// ─────────────────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "components",
    name: "Web Components",
    disc: "Production-ready React & Next.js components. Drop in, customize, ship.",
    link: "/docs/components",
    primaryBtn: "Start Building",
    secondaryBtn: "Components",
    Shader: ShaderComponents,
  },
  {
    id: "templates",
    name: "Web Templates",
    disc: "Full-page, pixel-perfect templates for every product and audience.",
    link: "/templates",
    primaryBtn: "Explore Templates",
    secondaryBtn: "Free Templates",
    Shader: ShaderTemplates,
  },
  {
    id: "mobile",
    name: "Mobile UI Elements",
    disc: "React Native & Flutter components and full app screens, ready to ship.",
    link: "/mobile",
    primaryBtn: "Building Apps",
    secondaryBtn: "Mobile Elements",
    Shader: ShaderMobile,
  },
  {
    id: "figma",
    name: "Designs & Figma Kits",
    disc: "Complete design systems and Figma kits to design faster with your team.",
    link: "/designs",
    primaryBtn: "Open Figma",
    secondaryBtn: "Design Kits",
    Shader: ShaderFigma,
  },
];


function ShaderWrapper({ Shader }: { Shader: React.FC<{ hovered: boolean }> }) {
  // We use CSS group-hover to drive hovered prop — simplest approach without ref
  // For true Framer-driven state, wrap in a separate component with useAnimate
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="w-full h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Shader hovered={hovered} />
    </div>
  );
}
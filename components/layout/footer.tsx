"use client"
import React, { useEffect, useState } from 'react'
import { PiTerminalFill } from "react-icons/pi";
import Link from 'next/link';
import { motion } from "motion/react"
import { StripedPattern } from '../magicui/striped-pattern';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NProgress from 'nprogress';
import {SoonV1} from '../landing/MicroComponents/ComingSoon';


import {
  SiGithub,
  SiLinkedin,
  SiInstagram,
} from "react-icons/si";
import { MdEmail, MdContactPage } from "react-icons/md";
import { HiArrowRight, HiCheckCircle } from "react-icons/hi";

interface Service {
  service: string;
  navigateTo: string;
}

interface FooterServicesItem {
  id: string;
  service_title: string;
  services: Service[];
}

interface FooterConfig {
  footer_heading: string;
  creator_name: string;
  link: string;
  footerServicesItems: FooterServicesItem[];
}


const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/yourusername",
    icon: SiGithub,
    title: "Follow on GitHub",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    icon: SiLinkedin,
    title: "Connect on LinkedIn",
  },
  {
    label: "Instagram",
    href: "https://instagram.com/yourusername",
    icon: SiInstagram,
    title: "Follow on Instagram",
  },
  {
    label: "Email",
    href: "mailto:hello@lokalhost.io",
    icon: MdEmail,
    title: "Send an email",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: MdContactPage,
    title: "Get in touch",
  },
];

function Footer({footerConfig}: {footerConfig: FooterConfig}) {

    const handleLinkClick = () => {
      NProgress.start()
    }

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    // Replace with your actual subscription logic
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3500);
  };

  return (
    <div className='relative h-auto w-[100%] bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-400 dark:border-neutral-600 mt-20'>

    <StripedPattern
      direction="right"
      className="absolute inset-0 z-10 mask-l-from-70% mask-l-to-100% mask-r-from-70% mask-r-to-100%"
    />
      


      <div className='relative w-full container max-w-[1580px] !important border-dashed z-30 !important bg-neutral-100 dark:bg-neutral-950
       h-auto border-l border-r border-neutral-400 dark:border-neutral-700 py-20 px-10'>
      <div className="w-full pt-5 pb-6">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 justify-between">

        {/* ── LEFT COLUMN: Brand + About ─────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:w-[60%]">

          {/* Wordmark */}
          <div className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-md bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 transition-transform duration-200 group-hover:rotate-6">
              <PiTerminalFill className="w-5 h-5" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-neutral-900 dark:text-neutral-100">
              Lokalhost<span className="text-neutral-400">.io</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-sm font-sans font-medium">
            {footerConfig?.footer_heading ??
              "A minimal developer toolkit. Built for people who prefer the terminal over everything else."}
          </p>

          {/* Built by badge */}
          <div className="inline-flex items-center gap-2 w-fit">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-sans">
              Crafted by
            </span>
            <Link
              href="https://hila-11.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300 border border-dashed border-neutral-300 dark:border-neutral-700 px-2.5 py-1 rounded hover:border-neutral-500 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-all duration-150"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {footerConfig?.creator_name ?? "hila-11"}
            </Link>
          </div>
        </div>

        {/* ── DIVIDER (mobile only) ───────────────────────────────────────── */}
        <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 lg:hidden" />

        {/* ── RIGHT COLUMN: Newsletter + Socials ─────────────────────────── */}
        <div className="flex flex-col gap-6 lg:w-[40%]">

          {/* Newsletter */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-sans font-semibold text-neutral-800 dark:text-neutral-200">
                Stay in the loop
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 font-sans">
                No spam. Only meaningful updates, releases & dev notes.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex items-stretch gap-2 max-w-sm"
            >
              <div className="relative flex-1">
                {/* terminal prompt decoration */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 font-mono text-xs pointer-events-none">
                  $
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={status === "loading" || status === "success"}
                  className="w-full pl-7 pr-3 py-2.5 text-sm font-sans rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all disabled:opacity-60"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 text-xs font-mono font-semibold transition-all duration-150 hover:bg-neutral-700 dark:hover:bg-neutral-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === "loading" ? (
                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent" />
                ) : status === "success" ? (
                  <>
                    <HiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Done
                  </>
                ) : (
                  <>
                    Subscribe
                    <HiArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            {status === "success" && (
              <p className="text-xs text-emerald-500 font-sans animate-in fade-in duration-300">
                ✓ You&apos;re on the list. Talk soon.
              </p>
            )}
          </div>

          {/* Vertical separator + Social row */}
          <div className="flex flex-col gap-2.5">
            <p className="text-xs text-neutral-400 dark:text-neutral-600 font-sans uppercase tracking-widest">
              Find me here
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ href, icon: Icon, title }) => (
      <Link
        key={title}
        href={href}
        title={title}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="
          group relative flex items-center justify-center
          w-8 h-8 rounded-full
          border border-neutral-200 dark:border-neutral-800
          bg-white dark:bg-neutral-950
          shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]
          hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.6)]
          hover:border-neutral-300 dark:hover:border-neutral-600
          hover:-translate-y-0.5
          active:translate-y-0 active:shadow-[0_1px_3px_rgba(0,0,0,0.06)]
          active:scale-95
          transition-all duration-200 ease-out
        "
      >
        {/* ripple ring on hover */}
        <span className="
          absolute inset-0 rounded-full
          ring-0 ring-neutral-200 dark:ring-neutral-700
          group-hover:ring-4 group-hover:ring-neutral-100 dark:group-hover:ring-neutral-800/80
          transition-all duration-300
        " />

        <Icon className="
          relative z-10
          w-3.5 h-3.5
          text-neutral-400 dark:text-neutral-600
          group-hover:text-neutral-900 dark:group-hover:text-neutral-100
          group-hover:scale-110
          transition-all duration-200
        " />
      </Link>
              ))}
            <ThemeToggle />
            </div>
          </div>

        </div>
      </div>
    </div>

        
        {/*  start footer boxes */}

        <div className='pt-4 lg:pt-10 grid lg:grid-cols-5 md:grid-cols-5 gap-4 justify-between grid-cols-2'>
          <div className='w-full'>
            <div>
              {footerConfig.footerServicesItems?.length > 0 && (
                  <h1 className="font-mono text-neutral-700 dark:text-neutral-300 text-[18px] font-medium">
                    {footerConfig.footerServicesItems[0].service_title}
                  </h1>
                )}

            </div>
            <div className='pl-1 py-3'>
              {
                footerConfig.footerServicesItems[0]?.services?.map((service , index) => (
                  <div className="" key={index}>
                    <motion.p
                      initial={{ scale: 1 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                      whileHover={{ scale: 1.03, }}
                      whileTap={{ scale: 1.03 }}
                    className='py-1 text-neutral-500 dark:text-neutral-500 text-sm lg:text-[15px] font-sans font-medium' ><Link href={service.navigateTo} onClick={handleLinkClick}
                    className='space-y-4'>{service.service}</Link></motion.p>
                    
                  </div>
                ))
              }
            </div>
          </div>
          <div className='w-full'>
            <div>
              {footerConfig.footerServicesItems?.length > 0 && (
                <h1 className="font-mono text-neutral-700 dark:text-neutral-300 text-[18px] font-medium">
                  {footerConfig.footerServicesItems[1].service_title}
                </h1>
              )}

            </div>
            <div className='pl-1 py-3'>
              {
                footerConfig?.footerServicesItems[1]?.services?.map((service , index) => (
                  <div className="" key={index}>
                    <motion.p 
                    initial={{ scale: 1 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                      whileHover={{ scale: 1.03, }}
                      whileTap={{ scale: 1.03 }}
                      className='py-1 text-neutral-500 dark:text-neutral-500 text-sm lg:text-[15px] font-sans font-medium hover:text-neutral-800 dark:hover:text-neutral-300' ><Link href={service.navigateTo} onClick={handleLinkClick}>{service.service}</Link></motion.p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='w-full'>
            <div>
              {footerConfig.footerServicesItems?.length > 0 && (
  <h1 className="font-mono text-neutral-700 dark:text-neutral-300 text-[18px] font-medium">
    {footerConfig.footerServicesItems[2].service_title}
    
  </h1>
)}

            </div>
            <div className='pl-1 py-3'>
              {
                footerConfig.footerServicesItems[2]?.services?.map((service , index) => (
                  <div className="" key={index}>
                    <motion.p 
                    initial={{ scale: 1 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                      whileHover={{ scale: 1.03, }}
                      whileTap={{ scale: 1.03 }}
                      className='py-1 text-neutral-500 dark:text-neutral-500 text-sm lg:text-[15px] font-sans font-medium hover:text-neutral-800 dark:hover:text-neutral-300' ><Link href={service.navigateTo} onClick={handleLinkClick}>{service.service}</Link></motion.p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='w-full'>
            <div>
             {footerConfig.footerServicesItems?.length > 0 && (
  <h1 className="font-mono text-neutral-700 dark:text-neutral-300 text-[18px] font-medium">
    {footerConfig.footerServicesItems[3].service_title}
  </h1>
)}

            </div>
            <div className='pl-1 py-3'>
              {
                footerConfig.footerServicesItems[3]?.services?.map((service , index) => (
                  <div className="" key={index}>
                    <motion.p 
                    initial={{ scale: 1 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                      whileHover={{ scale: 1.03, }}
                      whileTap={{ scale: 1.03 }}
                      className='py-1 text-neutral-500 dark:text-neutral-500 text-sm lg:text-[15px] font-sans font-medium hover:text-neutral-800 dark:hover:text-neutral-300'><Link href={service.navigateTo} onClick={handleLinkClick}>{service.service}</Link></motion.p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='w-full'>
            <div>
              {footerConfig.footerServicesItems?.length > 0 && (
  <h1 className="font-mono text-neutral-700 dark:text-neutral-300 text-[18px] font-medium">
    {footerConfig.footerServicesItems[4].service_title}
      <SoonV1 />
  </h1>
)}

            </div>
            <div className='pl-1 py-3'>
              {
                footerConfig.footerServicesItems[4]?.services?.map((service , index) => (
                  <div key={index}>
                    <motion.p 
                    initial={{ scale: 1 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                      whileHover={{ scale: 1.03, }}
                      whileTap={{ scale: 1.03 }}
                      className='py-1 text-neutral-500 dark:text-neutral-500 text-sm lg:text-[15px] font-sans font-medium hover:text-neutral-800 dark:hover:text-neutral-300' ><Link href={service.navigateTo} onClick={handleLinkClick}>{service.service}</Link></motion.p>
                  </div>
                ))
              }
            </div>
          </div>
          <div className='w-full'>
            <div>
             {footerConfig.footerServicesItems?.length > 0 && (
  <h1 className="font-mono text-neutral-700 dark:text-neutral-300 text-[18px] font-medium">
    {footerConfig.footerServicesItems[5].service_title}
      <SoonV1 />
  </h1>
)}

            </div>
            <div className='pl-1 py-3'>
              {
                footerConfig.footerServicesItems[5]?.services?.map((service , index) => (
                  <div key={index} className='relative'>
                    <motion.p 
                    initial={{ scale: 1 }}
                      transition={{ duration: 0.26, ease: "easeInOut" }}
                      whileHover={{ scale: 1.03, }}
                      whileTap={{ scale: 1.03 }}
                      className='py-1 text-neutral-500 dark:text-neutral-500 text-sm lg:text-[15px] font-sans font-medium hover:text-neutral-800 dark:hover:text-neutral-300' ><Link href={service.navigateTo} onClick={handleLinkClick}>{service.service}</Link></motion.p>
                      
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
          © {new Date().getFullYear()} Lokalhost.io — All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Privacy Policy", "Terms of Use", "Sitemap"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-xs font-mono text-neutral-400 dark:text-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
        </div>

      </div>
    </div>
  )
}

export default Footer





import { useRef } from "react";
import { HiSun, HiMoon, HiDesktopComputer } from "react-icons/hi";
import { useTheme } from "next-themes"; // or your theme provider

// ─── Theme options ────────────────────────────────────────────────────────────
const THEMES = [
  { key: "light",  label: "Light",  icon: HiSun           },
  { key: "dark",   label: "Dark",   icon: HiMoon          },
  { key: "system", label: "System", icon: HiDesktopComputer },
] as const;

type ThemeKey = (typeof THEMES)[number]["key"];

// ─── Component ────────────────────────────────────────────────────────────────
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!mounted) {
    // SSR placeholder — same size, no layout shift
    return <div className="w-[90px] h-8 rounded-full bg-neutral-100 dark:bg-neutral-900 animate-pulse" />;
  }

  const active = THEMES.find((t) => t.key === theme) ?? THEMES[2];
  const ActiveIcon = active.icon;

  return (
    <div ref={ref} className="relative">

      {/* ── Trigger pill ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Toggle theme"
        className="
          group flex items-center gap-2 px-3 py-1.5 rounded-full
          border border-neutral-200 dark:border-neutral-800
          bg-white dark:bg-neutral-950
          shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)]
          hover:shadow-[0_3px_10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_3px_10px_rgba(0,0,0,0.5)]
          hover:border-neutral-300 dark:hover:border-neutral-600
          hover:-translate-y-px
          active:scale-[0.97] active:translate-y-0
          transition-all duration-200 ease-out
        "
      >
        <span className="
          flex items-center justify-center w-4 h-4
          text-neutral-600 dark:text-neutral-400
          group-hover:text-neutral-900 dark:group-hover:text-neutral-100
          transition-colors duration-200
        ">
          <ActiveIcon className="w-3.5 h-3.5" />
        </span>
        <span className="text-[11px] font-mono font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors duration-200 tracking-wide">
          {active.label}
        </span>
        {/* caret */}
        <svg
          className={`w-2.5 h-2.5 text-neutral-400 dark:text-neutral-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 10 6"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Dropdown ─────────────────────────────────────────────────────── */}
      <div className={`
        absolute bottom-full right-0 mb-2 z-50
        flex flex-col overflow-hidden
        min-w-[130px] rounded-xl
        border border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-neutral-950
        shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]
        transition-all duration-200 origin-bottom-right
        ${open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-1 pointer-events-none"}
      `}>
        {/* header label */}
        <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-900">
          <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
            Appearance
          </p>
        </div>

        {/* options */}
        <div className="p-1.5 flex flex-col gap-0.5">
          {THEMES.map(({ key, label, icon: Icon }) => {
            const isActive = theme === key;
            return (
              <button
                key={key}
                onClick={() => { setTheme(key); setOpen(false); }}
                className={`
                  group/item flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left
                  transition-all duration-150
                  ${isActive
                    ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-500 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }
                `}
              >
                {/* icon container */}
                <span className={`
                  flex items-center justify-center w-6 h-6 rounded-full shrink-0
                  transition-all duration-150
                  ${isActive
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 group-hover/item:bg-neutral-200 dark:group-hover/item:bg-neutral-700"
                  }
                `}>
                  <Icon className="w-3 h-3" />
                </span>

                <span className="text-xs font-mono font-semibold tracking-wide">{label}</span>

                {/* active checkmark */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

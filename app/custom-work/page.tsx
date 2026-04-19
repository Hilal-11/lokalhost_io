"use client"
import { useEffect, useState } from 'react'
import AnnoncementBadge from '@/components/landing/AnnoncementBadge'
import { IoChatbubblesOutline, IoClose } from "react-icons/io5";
import { SiFoodpanda } from "react-icons/si";
import { cn } from  "@/lib/utils"
import Link from 'next/link';
import { motion , AnimatePresence} from "motion/react"
import { ScheduleCallModal } from '@/components/schedule-call/Schedulecallmodal';
import ScrollBasedVelocityImagesDemo from '@/components/landing/ScrollBasedOnVelocity';

interface AuthState {
  isLoggedIn: boolean;
  user: { name?: string; email?: string } | null;
  loading: boolean;
}
  const HEADLINES = [
    { pre: 'We Build ',   hi: 'UI Blocks & Components',    post: '\nfor web apps that impress.'         },
    { pre: 'We Craft ',   hi: 'Custom Mobile Apps',         post: '\nthat users actually love.'          },
    { pre: 'We Ship ',    hi: 'End-to-End SaaS Products',   post: '\nfrom zero to launch.'               },
    { pre: 'We Design ',  hi: 'Landing Pages & Templates',  post: '\nthat convert & captivate.'          },
    { pre: 'We Deliver ', hi: 'Custom-Built Solutions',     post: '\nfor businesses that mean it.'       },
  ]
  const CUSTOM_WORK_FAQ: IFaq = {
  id: 'custom-work',
  title: 'Custom Work FAQ',
  questions: [
    {
      question: 'What services do you offer under custom work?',
      answer: 'We offer a range of custom development services including UI/UX design, web application development, mobile app development, and end-to-end SaaS product development. We work closely with our clients to understand their unique needs and deliver tailored solutions that drive results.',
      links: [
        { label: 'Learn more about our services', url: '/services' },
        { label: 'Contact us for a consultation', url: '/contact' },
      ],
    },
    { 
      question: 'How do I get started with a custom project?',
      answer: 'Getting started is easy! Simply reach out to us through our contact form or book a call with our team. We will discuss your project requirements, goals, and timeline to determine the best approach for your custom solution.',
      links: [
        { label: 'Book a call', url: '/contact' },
      ],
    },
    {
      question: 'What is the typical timeline for a custom project?',
      answer: 'The timeline for a custom project can vary greatly depending on the scope and complexity of the work. After our initial consultation, we will provide you with a detailed project plan and timeline. We strive to deliver high-quality results in a timely manner while ensuring clear communication throughout the process.',
      links: [
        { label: 'Learn more about our timeline', url: '/timeline' },
      ],
    },
    {
      question: 'What is the pricing structure for custom work?',
      answer: 'Our pricing for custom work is based on the specific requirements of each project. We offer competitive rates and will provide you with a detailed quote after our initial consultation. We believe in transparency and will work with you to find a solution that fits your budget.',
      links: [
        { label: 'Learn more about our pricing', url: '/pricing' },
      ],
    },
    
    {
      question: 'Do you offer ongoing support and maintenance for custom projects?',
      answer: 'Yes, we offer ongoing support and maintenance services for all custom projects. We understand that your needs may evolve over time, and we are here to ensure that your solution continues to perform optimally. Our support packages can be tailored to meet your specific requirements.',
      links: [
        { label: 'Learn more about our support services', url: '/support' },
      ],
    },
  ],
  }
  const CUSTOM_WORK_FAQ2: IFaq = {
    id: 'custom-work',
    title: 'Custom Work FAQ',
    questions: [
      {
        question: 'What services do you offer under custom work?',
        answer: 'We offer a range of custom development services including UI/UX design, web application development, mobile app development, and end-to-end SaaS product development. We work closely with our clients to understand their unique needs and deliver tailored solutions that drive results.',
        links: [
          { label: 'Learn more about our services', url: '/services' },
          { label: 'Contact us for a consultation', url: '/contact' },
        ],
      },
      { 
        question: 'How do I get started with a custom project?',
        answer: 'Getting started is easy! Simply reach out to us through our contact form or book a call with our team. We will discuss your project requirements, goals, and timeline to determine the best approach for your custom solution.',
        links: [
          { label: 'Book a call', url: '/contact' },
        ],
      },
      {
        question: 'What is the typical timeline for a custom project?',
        answer: 'The timeline for a custom project can vary greatly depending on the scope and complexity of the work. After our initial consultation, we will provide you with a detailed project plan and timeline. We strive to deliver high-quality results in a timely manner while ensuring clear communication throughout the process.',
        links: [
          { label: 'Learn more about our timeline', url: '/timeline' },
        ],
      },
    ],
  }



function Page() {


  const [scheduleCallOpen, setScheduleCallOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [state, setState] = useState<AuthState>({
  isLoggedIn: false,
  user: null,
  loading: true,
});


  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % HEADLINES.length)
        setVisible(true)
      }, 350)
    }, 3200)
    return () => clearInterval(timer)
  }, [])


  useEffect(() => {
    try {
      // Read from cookie instead of localStorage
      const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="));
      const token = match ? match.split("=")[1] : null;

      if (!token) {
        setState({ isLoggedIn: false, user: null, loading: false });
        return;
      }

      // Decode JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Check expiry
      const isExpired = payload.exp && payload.exp * 1000 < Date.now();
      if (isExpired) {
        setState({ isLoggedIn: false, user: null, loading: false });
        return;
      }

      setState({
        isLoggedIn: true,
        user: { name: payload.name, email: payload.email },
        loading: false,
      });
    } catch {
      setState({ isLoggedIn: false, user: null, loading: false });
    }
  }, []);


  const { pre, hi, post } = HEADLINES[idx]
  const [firstLine, ...rest] = (pre + '⁀' + post).split('\n')
  const [beforeHi, afterHi] = firstLine.split('⁀')


  return (
    <div>
      {/* Heading */}
      <div className='relative w-full container max-w-[1580px] h-auto pt-14 mx-auto'>


      <AnimatePresence>
        {scheduleCallOpen && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed inset-0 z-40 bg-white/30 dark:bg-black/50 backdrop-blur-xs"
              onClick={() => setScheduleCallOpen(false)}
            />
            <ScheduleCallModal
              scheduleCallOpen={scheduleCallOpen}
              setScheduleCallOpen={setScheduleCallOpen}
              state={state}
            />
          </>
        )}
      </AnimatePresence>


        <div>
            <AnnoncementBadge aboutBadge='Custom Work Build someting lets talk!' />
        </div>
        <div className="w-full mx-auto text-center pt-10 px-4 lg:px-10">
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
      >
        <h1 className="font-sans font-bold text-4xl lg:text-5xl text-neutral-800 dark:text-neutral-200 leading-[1.2] tracking-tight">
          {beforeHi}
          <span className="relative inline">
            <span className="relative z-10">{hi}</span>
            <span className="absolute bottom-0.5 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-blue-400/60 to-cyan-400/60" />
          </span>
          {afterHi}
          {rest.length > 0 && (
            <><br /><span className="text-neutral-500 dark:text-neutral-400">{rest.join(' ')}</span></>
          )}
        </h1>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        {HEADLINES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? 'w-4 bg-neutral-500' : 'w-1.5 bg-neutral-300 dark:bg-neutral-600'
            }`}
          />
        ))}
      </div>

      <p className="lg:px-0 mx-auto py-4 font-sans font-medium text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm lg:max-w-none">
        A curated library of production-ready templates, UI blocks, SaaS starters &amp; landing pages — built for teams that ship.
      </p>
        </div>
        <div className="w-full mx-auto flex flex-wrap justify-center items-center pb-5 gap-3 pt-4">
            <button
              onClick={() => setScheduleCallOpen(true)}
              className={cn(
                "group relative flex justify-between items-center gap-2 px-3 w-[180px] h-[46px] rounded-lg text-sm font-sans font-semibold overflow-hidden",
                "border border-orange-300/60",
                "bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7]",
                "text-neutral-700",
                "shadow-sm hover:shadow-md hover:brightness-105",
                "hover:-translate-y-0.5 active:scale-[0.98]",
                "transition-all duration-200"
              )}
            >
              <span className={cn(
                "border shadow-sm rounded-sm h-8 w-8 flex justify-center items-center flex-shrink-0",
                "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
                "border-t border-l border-r border-neutral-800 dark:border-neutral-700 text-neutral-100",
                "transition-all duration-300 ease-in-out",
                "group-hover:translate-x-[128px] group-hover:rotate-[360deg]"
              )}>
                <IoChatbubblesOutline className="w-4 h-4" />
              </span>
              <span className={cn(
                "transition-all duration-300 ease-in-out",
                "group-hover:-translate-x-20"
              )}>
                Book a call
              </span>
                        </button>

            {/* Button 2 — text slides right, icon rolls left */}
            <Link href="https://www.instagram.com/hilal_11_n" target='_blank'
              className={cn(
                "group relative flex justify-between items-center gap-2 px-3 w-[180px] h-[46px] rounded-lg text-sm font-sans font-semibold overflow-hidden",
                "border-t border-l border-r border-neutral-800 dark:border-neutral-700",
                "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
                "text-neutral-100",
                "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]",
                "hover:-translate-y-0.5 active:scale-[0.98]",
                "transition-all duration-200"
              )}
            >
              <span className={cn(
                "transition-all duration-300 ease-in-out",
                "group-hover:translate-x-14"
              )}>
                Chat with hilal
              </span>
              <span className={cn(
                "border shadow-sm rounded-sm h-8 w-8 flex justify-center items-center flex-shrink-0",
                "bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7] text-neutral-900",
                "transition-all duration-300 ease-in-out",
                "group-hover:-translate-x-[128px] group-hover:rotate-[-360deg]"
              )}>
                <SiFoodpanda className="w-3.5 h-3.5" />
              </span>
            </Link>
        </div>
        </div>
        <div className='pt-5 container'>
          <ScrollBasedVelocityImagesDemo />
        </div>
        <div>
        </div>
        <div className='w-full container max-w-[1580px] h-full pt-8 pb-8 lg:pt-6 mx-auto'>
            <div className='w-full mx-auto py-20 pb-5 flex flex-col items-center justify-center px-5 lg:px-20 '>
                <h1 className='text-center font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-2'>
                  Frequently Asked Questions about Lokalhost.io custom work!
                </h1>
                <p className='text-center font-sans font-medium text-sm text-neutral-700 dark:text-neutral-300'>
                  Find answers to common questions about our services, features, and how Lokalhost.io can benefit you.
                </p>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 pt-16 px-6 gap-6 lg:gap-16'>
              <FaqBlock faq={CUSTOM_WORK_FAQ} sectionTitle="Custom Work" />
              <FaqBlock faq={CUSTOM_WORK_FAQ2}/>
            </div>
        </div>
        <div>
          <CustomWorkCTA />
        </div>
    </div>
  )
}

export default Page




import { PlusIcon } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { PiTerminalFill } from "react-icons/pi"
import { LuExternalLink } from "react-icons/lu"
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'

interface Link {
  label: string
  url: string
}

interface Question {
  question: string
  answer: string
  links?: Link[]
}

interface IFaq {
  id: string
  title: string
  questions: Question[]
}

/* ─────────────────────────────────────────────
   Shared trigger classname
───────────────────────────────────────────── */
const triggerClass =
  'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'

/* ─────────────────────────────────────────────
   Link chips rendered below each answer
───────────────────────────────────────────── */
function AnswerLinks({ links }: { links?: Link[] }) {
  if (!links || links.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800">
      {links.map(({ label, url }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors duration-150"
        >
          {label}
          <LuExternalLink className="text-[10px] opacity-60" />
        </a>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Shared FAQ accordion block
───────────────────────────────────────────── */
function FaqBlock({
  faq,
  sectionTitle,
  defaultOpen = false,
}: {
  faq?: IFaq
  sectionTitle?: string
  defaultOpen?: boolean
}) {
  if (!faq) return null
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultOpen ? 'item-1' : undefined}
    >
      <div className="pb-3 flex items-center gap-2">
        <h2 className="font-sans font-bold text-[18px] lg:text-lg text-neutral-800 dark:text-neutral-200">
          {sectionTitle}
        </h2>
      </div>

      {faq.questions?.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionPrimitive.Header className="flex items-center gap-2">
            <span className="text-neutral-600 dark:text-neutral-600 text-xs flex-shrink-0">
              <PiTerminalFill />
            </span>
            <AccordionPrimitive.Trigger
              data-slot="accordion-trigger"
              className={triggerClass}
            >
              {item.question}
              <PlusIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionContent className="text-muted-foreground pl-5">
            <p className="text-sm leading-relaxed">{item.answer}</p>
            <AnswerLinks links={item.links} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}









import React from "react";
import { HiArrowRight, HiLightningBolt } from "react-icons/hi";
import { StripedPattern } from "@/components/magicui/striped-pattern";
// ─── Corner bracket decoration ────────────────────────────────────────────────
function CornerBracket({ className = "" }: { className?: string }) {
  return (
    <span className={`absolute w-3 h-3 ${className}`}>
      <span className="absolute top-0 left-0 w-full h-px bg-neutral-400 dark:bg-neutral-600" />
      <span className="absolute top-0 left-0 w-px h-full bg-neutral-400 dark:bg-neutral-600" />
    </span>
  );
}
function CornerBracketInvert({ className = "" }: { className?: string }) {
  return (
    <span className={`absolute w-3 h-3 ${className}`}>
      <span className="absolute bottom-0 right-0 w-full h-px bg-neutral-400 dark:bg-neutral-600" />
      <span className="absolute bottom-0 right-0 w-px h-full bg-neutral-400 dark:bg-neutral-600" />
    </span>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-sm">
      <span className="w-1 h-1 rounded-full bg-emerald-400" />
      <span className="text-[10px] font-mono font-semibold text-neutral-500 dark:text-neutral-500 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-[11px] font-mono font-bold text-neutral-800 dark:text-neutral-200">
        {value}
      </span>
    </div>
  );
}

// ─── Main CTA ─────────────────────────────────────────────────────────────────
function CustomWorkCTA() {
  return (
    <div className="w-full container max-w-[1580px] mx-auto py-20 px-4">
      <div
        className={cn(
            "relative overflow-hidden rounded-2xl",
            "bg-neutral-50 dark:bg-neutral-900",
            "border border-neutral-200/60 dark:border-neutral-800/60",
            "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.04),0px_8px_16px_-4px_rgba(0,0,0,0.06),0px_24px_40px_-8px_rgba(0,0,0,0.08)]",
            "dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.04),0px_8px_32px_-4px_rgba(0,0,0,0.4)]",
            "lg:min-h-[380px]"
        )}
        >
        {/* ── Background grid pattern ── */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* ── Subtle radial glow center-left ── */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-neutral-200 dark:bg-neutral-700/30 blur-[80px] opacity-40 dark:opacity-20 pointer-events-none" />

        {/* ── Corner brackets ── */}
        <CornerBracket className="top-4 left-4" />
        <CornerBracket className="top-4 right-4 rotate-90" />
        <CornerBracketInvert className="bottom-4 left-4 rotate-[270deg]" />
        <CornerBracketInvert className="bottom-4 right-4" />

        {/* ── Inner grid ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:min-h-[380px]">

          {/* ════ LEFT: Copy + CTAs ════════════════════════════════════════ */}
          <div className="flex flex-col justify-center gap-7 px-8 py-12 lg:px-12 lg:py-14">

            {/* Badge */}
            <div className="flex items-center gap-2 w-fit">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 shadow-sm">
                <HiLightningBolt className="w-3 h-3 text-amber-500" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Available for work
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl lg:text-[2.6rem] font-sans font-bold leading-[1.15] tracking-tight text-neutral-900 dark:text-neutral-100">
                Need something{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">custom built?</span>
                  {/* underline accent */}
                  <span className="absolute bottom-0.5 left-0 w-full h-[3px] rounded-full bg-gradient-to-r from-neutral-400 to-neutral-300 dark:from-neutral-500 dark:to-neutral-700" />
                </span>
              </h2>
              <p className="text-sm font-sans font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[400px]">
                I'm available for client work — UI systems, full-stack apps, backend
                services, and scalable production solutions. Let's build something great.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center flex-wrap gap-3">

              {/* Primary — dark */}
              <button
                className={cn(
                  "group relative flex justify-between items-center gap-2 px-3 w-[180px] h-[46px] rounded-lg text-sm font-sans font-semibold overflow-hidden",
                  "border border-orange-300/60",
                  "bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7]",
                  "text-neutral-700",
                  "shadow-sm hover:shadow-md hover:brightness-105",
                  "hover:-translate-y-0.5 active:scale-[0.98]",
                  "transition-all duration-200"
                )}
              >
                <span className={cn(
                  "border shadow-sm rounded-sm h-8 w-8 flex justify-center items-center flex-shrink-0",
                  "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
                  "border-t border-l border-r border-neutral-800 dark:border-neutral-700 text-neutral-100",
                  "transition-all duration-300 ease-in-out",
                  "group-hover:translate-x-[128px] group-hover:rotate-[360deg]"
                )}>
                  <IoChatbubblesOutline className="w-4 h-4" />
                </span>
                <span className={cn(
                  "transition-all duration-300 ease-in-out",
                  "group-hover:-translate-x-20"
                )}>
                  Book a call
                </span>
                          </button>

              {/* Button 2 — text slides right, icon rolls left */}
              <Link href="https://www.instagram.com/hilal_11_n" target='_blank'
                className={cn(
                  "group relative flex justify-between items-center gap-2 px-3 w-[180px] h-[46px] rounded-lg text-sm font-sans font-semibold overflow-hidden",
                  "border-t border-l border-r border-neutral-800 dark:border-neutral-700",
                  "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
                  "text-neutral-100",
                  "shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                  "hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)]",
                  "hover:-translate-y-0.5 active:scale-[0.98]",
                  "transition-all duration-200"
                )}
              >
                <span className={cn(
                  "transition-all duration-300 ease-in-out",
                  "group-hover:translate-x-14"
                )}>
                  Chat with hilal
                </span>
                <span className={cn(
                  "border shadow-sm rounded-sm h-8 w-8 flex justify-center items-center flex-shrink-0",
                  "bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7] text-neutral-900",
                  "transition-all duration-300 ease-in-out",
                  "group-hover:-translate-x-[128px] group-hover:rotate-[-360deg]"
                )}>
                  <SiFoodpanda className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>

          </div>

          {/* ════ RIGHT: Terminal icon visual ════════════════════════════ */}
          <div className="relative flex items-center justify-center overflow-hidden lg:border-l border-t lg:border-t-0 border-neutral-200/60 dark:border-neutral-800/60 min-h-[240px] lg:min-h-0">

            {/* Radial bg glow behind icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full bg-neutral-200 dark:bg-neutral-700/20 blur-[60px] opacity-60 dark:opacity-30" />
            </div>

            {/* Striped pattern (your existing component) */}
            <StripedPattern
              direction="left"
              className="absolute inset-0 mask-l-from-50% mask-l-to-80% mask-t-from-20% to-90% opacity-30"
            />

            {/* Concentric rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[180, 240, 300].map((size, i) => (
                <span
                  key={size}
                  className="absolute rounded-full border border-dashed border-neutral-300 dark:border-neutral-700/60"
                  style={{
                    width: size,
                    height: size,
                    opacity: 1 - i * 0.25,
                    animation: `spin ${20 + i * 8}s linear infinite ${i % 2 === 0 ? "" : "reverse"}`,
                  }}
                />
              ))}
            </div>

            {/* Terminal icon */}
            <div className="relative z-10 flex items-center justify-center">
              {/* outer glow box */}
              <div className={cn(
                "relative flex items-center justify-center",
                "w-36 h-36 lg:w-44 lg:h-44 rounded-3xl",
                "bg-white dark:bg-neutral-950",
                "border border-neutral-200 dark:border-neutral-800",
                "shadow-[0_8px_32px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
                "dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]"
                )}>
                {/* inner shine */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/80 to-transparent dark:from-white/[0.03] dark:to-transparent pointer-events-none" />

                <PiTerminalFill className="w-20 h-20 lg:w-24 lg:h-24 text-neutral-800 dark:text-neutral-200 relative z-10" />

                {/* blinking cursor dot bottom-right */}
                <span className="absolute bottom-4 right-4 flex items-center gap-1">
                  <span className="w-1 h-4 rounded-sm bg-neutral-800 dark:bg-neutral-300 animate-pulse" />
                </span>
              </div>

              {/* floating label chips */}
              <div
                className={cn(
                  "absolute -top-3 -right-6",
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                  "bg-neutral-900 dark:bg-neutral-100",
                  "shadow-md"
                )}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-neutral-100 dark:text-neutral-900 uppercase tracking-widest">
                  Open for work
                </span>
              </div>

              <div
                className={cn(
                  "absolute -bottom-3 -left-6",
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                  "border border-neutral-200 dark:border-neutral-800",
                  "bg-white dark:bg-neutral-950",
                  "shadow-md"
                )}
              >
                <span className="text-[9px] font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">
                  lokalhost.io
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom status bar ─────────────────────────────────────────────── */}
        <div className="relative z-10 border-t border-neutral-200/60 dark:border-neutral-800/60 px-8 lg:px-12 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {["UI Systems", "Full-Stack", "Backend", "Open Source"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-600 uppercase tracking-widest"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-600">
              Currently available
            </span>
          </div>
        </div>

      </div>

      {/* ── spin keyframe (add to global CSS or tailwind config instead) ── */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


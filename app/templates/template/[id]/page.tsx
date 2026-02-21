
import React from 'react'
import Link from 'next/link';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';
import { LuFigma } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import { GoFileZip } from "react-icons/go";
import { MdDone } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import { HiArrowUpRight } from "react-icons/hi2";

import react from "@/public/tech/react.jpeg"
import next from "@/public/tech/next.jpeg"
import tailwindX from "@/public/tech/tailwindX.webp"
import shadcn from "@/public/tech/shadcn.jpeg"
import vite from "@/public/tech/vite.jpeg"
import ts from "@/public/tech/ts.jpeg"
import js from "@/public/tech/js.jpeg"

const techStackImages = [react, next, tailwindX, shadcn, vite, ts, js];

interface PageProps {
  params: Promise<{
    id?: string;
  }>;
}

async function templateView({ params }: PageProps) {

    const id = (await params).id as Id<'templates'>;
    const template:any = await fetchQuery(api.getTemplates.getTemplateById , { id : id })

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">

      

      {/* ── inline motion styles ───────────────────────────── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .anim-0 { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) .00s both; }
        .anim-1 { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) .08s both; }
        .anim-2 { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) .16s both; }
        .anim-3 { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) .26s both; }
        .anim-4 { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) .34s both; }

        /* shine sweep */
        .shine { position:relative; overflow:hidden; }
        .shine::after {
          content:'';
          position:absolute; inset:0;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.2) 50%,transparent 60%);
          transform:translateX(-100%);
          transition:transform .45s ease;
        }
        .shine:hover::after { transform:translateX(100%); }

        /* image card */
        .preview-card {
          transition: transform .42s cubic-bezier(.22,1,.36,1),
                      box-shadow .42s cubic-bezier(.22,1,.36,1),
                      border-color .3s ease;
        }
        .preview-card:hover {
          transform: translateY(-7px) scale(1.013);
          box-shadow: 0 28px 56px -14px rgba(0,0,0,.2);
          border-color: rgba(0,0,0,.15);
        }
        .preview-card .img-inner {
          transition: transform .6s cubic-bezier(.22,1,.36,1), filter .4s ease;
        }
        .preview-card:hover .img-inner {
          transform: scale(1.05);
          filter: brightness(1.03) contrast(1.02);
        }

        /* download / tag pill */
        .pill {
          transition: transform .22s cubic-bezier(.22,1,.36,1),
                      box-shadow .22s ease,
                      background-color .18s ease,
                      border-color .18s ease;
        }
        .pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px -5px rgba(0,0,0,.13);
        }

        /* tech icon spring-pop */
        .tech-icon {
          transition: transform .28s cubic-bezier(.34,1.6,.64,1);
        }
        .tech-icon:hover { transform: translateY(-5px) scale(1.18); }

        /* feature row slide */
        .feat-row {
          transition: transform .22s cubic-bezier(.22,1,.36,1),
                      box-shadow .22s ease,
                      background-color .18s ease,
                      border-color .18s ease;
        }
        .feat-row:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 18px -6px rgba(0,0,0,.1);
        }

        /* step number hover */
        .step-num {
          transition: background-color .18s, border-color .18s, color .18s;
        }
        .step-num:hover {
          background-color: rgb(23,23,23);
          border-color: rgb(23,23,23);
          color: white;
        }
        .dark .step-num:hover {
          background-color: rgb(229,229,229);
          border-color: rgb(229,229,229);
          color: rgb(23,23,23);
        }
      `}</style>

      <div className="pt-0 lg:pt-20 w-full container px-6 pb-28 relative">

        <Link
          href="/templates"
          className="relative top-4 group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 hover:-translate-x-0.5 hover:shadow-sm"
        >
          <HiArrowLeft className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-all duration-200 group-hover:-translate-x-0.5" />
          <span className="text-sm font-sans font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors duration-200">
            Back to Templates
          </span>
        </Link>

        {/* ════════════════════════ HERO ════════════════════════ */}
        <div className="py-12 lg:py-16 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

            {/* ── Left col ── */}
            <div className="max-w-[560px] space-y-6">

              {/* badge */}
              <div className="anim-0 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-sans tracking-wide text-neutral-500 dark:text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Template
              </div>

              {/* title */}
              <h1 className="anim-1 font-sans font-extrabold text-[2rem] lg:text-[2.85rem] leading-[1.12] tracking-[-0.025em] text-neutral-900 dark:text-neutral-50">
                {template?.projectName}
              </h1>

              {/* description */}
              <p className="anim-2 font-sans text-sm leading-[1.8] text-neutral-500 dark:text-neutral-400">
                {template?.projectDescription}
              </p>

              {/* ── Tech Stack — original markup kept exactly ── */}
              <div className="anim-3">
                <p className="mb-3 text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  Built with
                </p>
                <div className='flex flex-wrap gap-2 py-0 poppins-medium text-neutral-600 '>
                                        {techStackImages.map((image, index) => (
                                            <div key={index} className='rounded-full p-[3px] cursor-pointer bg-neutral-50 dark:bg-neutral-800 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex items-center justify-center'>
                                                <Image
                                                    key={index}
                                                    src={image}
                                                    width={30}
                                                    height={30}
                                                    alt='Tech Image'
                                                    className='rounded-full '
                                                />
                                            </div>
                                        ))}
                </div>
              </div>
            </div>

            {/* ── Right col: CTAs + Downloads ── */}
            <div className="anim-4 shrink-0 flex flex-col gap-5 lg:items-end lg:min-w-[300px]">

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-3 w-full lg:justify-end">
                <Link
                  href={template?.projectLiveURL}
                  target="_blank"
                  className="shine group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-sans font-semibold text-sm shadow-[0_2px_8px_rgba(0,0,0,.18)] hover:shadow-[0_8px_24px_rgba(0,0,0,.22)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Live Demo
                  <HiArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <button className="shine group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-sans font-semibold text-sm text-neutral-800 dark:text-neutral-200 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-500 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                  Buy Now
                  <span className="px-2 py-0.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono text-xs">
                    {template?.projectPrize}
                  </span>
                </button>
              </div>

              {/* thin rule */}
              <div className="w-full lg:w-[300px] h-px bg-neutral-100 dark:bg-neutral-800" />

              {/* Download group */}
              <div className="w-full lg:w-auto space-y-2.5">
                <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 lg:text-right">
                  Resources
                </p>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={template?.zip_code_file || '#'}
                    className="pill group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    <GoFileZip className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-200" />
                    Download ZIP
                  </Link>
                  <button className="pill group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300">
                    <FaGithub className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200" />
                    Clone Repo
                  </button>
                  <button className="pill group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300">
                    <LuFigma className="w-4 h-4 text-neutral-400 group-hover:text-violet-500 transition-colors duration-200" />
                    Figma Kit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════ PREVIEW IMAGES ════════════════════════ */}
        <div className="py-16">
          <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Preview
          </p>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            {template?.projectImages.map((image: any, index: number) => (
              <div
                key={index}
                className="preview-card overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
              >
                <Image
                  className="img-inner w-full h-full object-cover"
                  src={image}
                  alt={`Preview ${index + 1}`}
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════ INSTALL + FEATURES ════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 mb-16">

          {/* Installation */}
          <div className="space-y-7">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Setup</p>
              <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100">
                Installation Guide
              </h2>
            </div>

            <ol className="space-y-5">
              {([
                { s: "01", t: "Download the template as a ZIP file and extract it to your preferred location." },
                { s: "02", t: <>Open the folder in <strong className="font-semibold text-neutral-800 dark:text-neutral-200">Visual Studio Code</strong> or any editor of your choice.</> },
                { s: "03", t: "Open the integrated terminal and navigate to the extracted project root." },
              ] as const).map(({ s, t }) => (
                <li key={s} className="group flex gap-4 items-start">
                  <span className="step-num shrink-0 w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center font-mono text-xs text-neutral-400 dark:text-neutral-500 cursor-default">
                    {s}
                  </span>
                  <p className="pt-1.5 text-sm font-sans leading-relaxed text-neutral-600 dark:text-neutral-400">{t}</p>
                </li>
              ))}

              <li className="flex gap-4 items-start">
                <span className="step-num shrink-0 w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center font-mono text-xs text-neutral-400 dark:text-neutral-500 cursor-default">
                  04
                </span>
                <div className="space-y-2.5 flex-1">
                  <p className="text-sm font-sans text-neutral-600 dark:text-neutral-400">
                    Install dependencies and start the dev server:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['npm install', 'npm run dev'].map(cmd => (
                      <code
                        key={cmd}
                        className="pill inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-xs text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 cursor-pointer transition-colors duration-200"
                      >
                        {cmd}
                      </code>
                    ))}
                  </div>
                </div>
              </li>

              <li className="flex gap-4 items-start">
                <span className="step-num shrink-0 w-8 h-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center font-mono text-xs text-neutral-400 dark:text-neutral-500 cursor-default">
                  05
                </span>
                <p className="pt-1.5 text-sm font-sans leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Customize by editing{' '}
                  <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono text-xs text-neutral-700 dark:text-neutral-300">
                    src/config
                  </code>
                  {' '}— update static data to match your project requirements.
                </p>
              </li>
            </ol>
          </div>

          {/* Features */}
          <div className="space-y-7">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">What's included</p>
              <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100">
                Features
              </h2>
            </div>

            <div className="flex flex-col gap-2.5">
              {template?.projectFeatures.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`feat-row px-4 py-3.5 rounded-xl border cursor-default
                    ${index === 0
                      ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 w-[18px] h-[18px] rounded-full bg-neutral-800 dark:bg-neutral-200 flex items-center justify-center">
                      <MdDone className="w-2.5 h-2.5 text-white dark:text-neutral-900" />
                    </span>
                    <div>
                      <p className="text-sm font-sans font-semibold text-neutral-800 dark:text-neutral-200 leading-snug">
                        {item.feature}
                      </p>
                      <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                        {item.aboutFeature}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════ PREFERRED FOR ════════════════════════ */}
        <div className="mb-16 pt-2">
          <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Use cases</p>
          <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">
            Preferred For
          </h2>
          <div className="flex flex-wrap gap-2">
            {template?.templatePurposes.map((item: any, index: number) => (
              <span
                key={index}
                className="pill inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300 cursor-default hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
              >
                <IoIosStarOutline className="w-3.5 h-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ════════════════════════ CTA ════════════════════════ */}
        <div className='flex justify-center items-center w-full h-auto pt-20'>
            <div className='relative w-full grid grid-cols-1 lg:grid-cols-3 border border-dashed border-neutral-300 dark:border-neutral-800 h-auto bg-neutral-50 dark:bg-neutral-900 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>

                <span className='w-[30px] lg:w-[50px] h-[30px] lg:h-[50px] absolute -left-7.5 -top-7.5 lg:-left-12.5 lg:-top-12.5 border-1 border-dashed border-neutral-300 dark:border-neutral-800'></span>
                <span className='w-[30px] lg:w-[50px] h-[30px] lg:h-[50px] absolute -left-7.5 -bottom-7.5 lg:-left-12.5 lg:-bottom-12.5 border-1 border-dashed border-neutral-300 dark:border-neutral-800'></span>
                <span className='w-[30px] lg:w-[50px] h-[30px] lg:h-[50px] absolute -right-7.5 -top-7.5 lg:-right-12.5 lg:-top-12.5 border-1 border-dashed border-neutral-300 dark:border-neutral-800'></span>
                <span className='w-[30px] lg:w-[50px] h-[30px] lg:h-[50px] absolute -right-7.5 -bottom-7.5 lg:-right-12.5 lg:-bottom-12.5 border-1 border-dashed border-neutral-300 dark:border-neutral-800'></span>

                <div className='lg:col-span-2 px-3 lg:px-8 py-5 lg:py-14 '>
                    <div className='absolute inset-0 z-10'>
                        <StripedPattern2/>
                    </div>
                    <div>
                        <h1 className='text-3xl font-mono font-bold bg-gradient-to-r from-[#E62314] to-[#F19E18] text-transparent bg-clip-text'>Need something custom built?</h1>
                        <p className='px-14 pt-3 text-[15px] font-mono font-medium text-neutral-600 dark:text-neutral-400 pl-3'>I’m available for client work and can help you customize this template or build something entirely new — from UI and design systems to full-stack applications, backend services, and scalable production solutions.</p>
                    </div>
                    <div className='pt-4 lg:py-20 lg:px-10 flex items-center flex-wrap gap-2'>
                        <button className='z-40 relative overflow-hidden cursor-pointer font-sans font-medium text-sm px-10 py-2 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>Ask a Question</button>
                        <button className='z-40 cursor-pointer font-sans text-sm font-medium px-10 py-2 rounded-md bg-gradient-to-r from-[#E62314] to-[#F19E18] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>Hire for Custom Work</button>
                    </div>
                </div>
                <div className='px-3 lg:px-8 lg:py-14'>
                    <h1 className='text-sm text-neutral-600 dark:text-neutral-400 g:text-xl font-bold font-mono'>Hi there, I’m Hilal — welcome to Lokalhost.io.</h1>
                    <p className='lg:pt-6 pt-2 pl-2 text-[14px] font-mono font-medium text-neutral-600 dark:text-neutral-400'>
                        I build clean, scalable, production-ready products — from UI and design systems to web & mobile apps, backend services, and full-stack solutions. If you want this template customized or have an idea to build, let’s talk.
                    </p>
                    <div className='flex items-center py-4 px-3'>
                        <span>Know more.</span>
                    <div className="border-t border-dashed border-b py-1 w-30 text-center relative border-neutral-300 dark:border-neutral-700">
                        
                    <span className="h-12 absolute left-4 -top-2.5 border border-dashed border-neutral-300 dark:border-neutral-700"></span>
                        <p className="text-sm font-mono font-bold text-neutral-700 dark:text-neutral-300 underline">@HILAL</p>
                        <span className="h-12 absolute right-4 -top-2.5 border border-dashed  border-neutral-300 dark:border-neutral-700"></span>          
                    </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default templateView;





import { useId } from "react"
import { cn } from "@/lib/utils"
import { HiArrowLeft } from 'react-icons/hi';
interface StripedPatternProps extends React.SVGProps<SVGSVGElement> {
  direction?: "left" | "right"
}
export function StripedPattern2({
  direction = "left",
  className,
  width = 10,
  height = 10,
  ...props
}: StripedPatternProps) {
  const id = useId()
  const w = Number(width)
  const h = Number(height)

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10 h-[100%] w-[100%] stroke-[0.1]",
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          {direction === "left" ? (
            <>
              <line x1="0" y1={h} x2={w} y2="0" stroke="currentColor" />
              <line x1={-w} y1={h} x2="0" y2="0" stroke="currentColor" />
              <line x1={w} y1={h} x2={w * 2} y2="0" stroke="currentColor" />
            </>
          ) : (
            <>
              <line x1="0" y1="0" x2={w} y2={h} stroke="currentColor" />
              <line x1={-w} y1="0" x2="0" y2={h} stroke="currentColor" />
              <line x1={w} y1="0" x2={w * 2} y2={h} stroke="currentColor" />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

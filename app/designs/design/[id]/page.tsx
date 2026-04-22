import React from 'react'
import Link from 'next/link';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';
import { MdDone } from "react-icons/md";
import { IoIosStarOutline } from "react-icons/io";
import { LuFigma } from "react-icons/lu";
import { HiArrowLeft, HiArrowUpRight } from "react-icons/hi2";
import CTA from '@/components/landing/CTA';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function designKitView({ params }: PageProps) {
  const id = (await params).id as Id<'designKits'>;
  const designKits: any = await fetchQuery(api.getTemplates.getDesignKitById, { id });

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">

      {/* ── motion styles ─────────────────────────────────── */}
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

        .shine { position: relative; overflow: hidden; }
        .shine::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.2) 50%, transparent 60%);
          transform: translateX(-100%);
          transition: transform .45s ease;
        }
        .shine:hover::after { transform: translateX(100%); }

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
      `}</style>

      <div className="pt-0 lg:pt-20 w-full container px-6 pb-28">

        {/* ── Back button ── */}
        <div className="pt-8 lg:pt-6 pb-2">
          <Link
            href="/designs"
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 hover:-translate-x-0.5 hover:shadow-sm"
          >
            <HiArrowLeft className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-all duration-200 group-hover:-translate-x-0.5" />
            <span className="text-sm font-sans font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors duration-200">
              Back to Design Kits
            </span>
          </Link>
        </div>

        {/* ════════════════════════ HERO ════════════════════════ */}
        <div className="py-10 lg:py-14 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">

            {/* ── Left ── */}
            <div className="max-w-[560px] space-y-5">

              {/* badge */}
              <div className="anim-0 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-xs font-sans tracking-wide text-neutral-500 dark:text-neutral-400">
                <LuFigma className="w-3 h-3 text-violet-500" />
                Design Kit
              </div>

              {/* title */}
              <h1 className="anim-1 font-sans font-extrabold text-[2rem] lg:text-[2.85rem] leading-[1.12] tracking-[-0.025em] text-neutral-900 dark:text-neutral-50">
                {designKits?.name}
              </h1>

              {/* description */}
              <p className="anim-2 font-sans text-sm leading-[1.8] text-neutral-500 dark:text-neutral-400">
                {designKits?.discription}
              </p>
            </div>

            {/* ── Right: CTAs ── */}
            <div className="anim-3 shrink-0 flex flex-col gap-4 lg:items-end lg:min-w-[280px]">
              <div className="flex flex-wrap gap-3 w-full lg:justify-end">

                {/* Get Figma Kit */}
                <button className="shine group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-200 dark:to-neutral-300 text-neutral-900 font-sans font-semibold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                  <LuFigma className="w-4 h-4 text-violet-600 group-hover:scale-110 transition-transform duration-200" />
                  Get Figma Kit
                </button>

                {/* Buy Now */}
                <button className="shine group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-700 dark:to-neutral-900 text-neutral-100 font-sans font-semibold text-sm shadow-[0_2px_8px_rgba(0,0,0,.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,.22)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                  Buy Now
                  <span className="px-2 py-0.5 rounded-md bg-white/15 font-mono text-xs tracking-tight">
                    {designKits?.price}
                  </span>
                  <HiArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
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
            {designKits?.images.map((image: string, index: number) => (
              <div
                key={index}
                className="preview-card overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900"
              >
                <img
                  className="img-inner w-full h-full object-cover"
                  src={image}
                  alt={`Preview ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════ OVERVIEW + HIGHLIGHTS ════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 mb-16">

          {/* Overview */}
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">About</p>
              <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100">
                Overview
              </h2>
            </div>
            <p className="font-sans text-sm leading-[1.9] text-neutral-600 dark:text-neutral-400">
              {designKits?.overview}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">At a glance</p>
              <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100">
                Highlights
              </h2>
            </div>
            <div className="flex flex-col gap-2.5">
              {designKits?.highlight.map((item: string, index: number) => (
                <div
                  key={index}
                  className={`feat-row px-4 py-3.5 rounded-xl border cursor-default
                    ${index === 0
                      ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-neutral-800 dark:bg-neutral-200 flex items-center justify-center">
                      <MdDone className="w-2.5 h-2.5 text-white dark:text-neutral-900" />
                    </span>
                    <p className="text-sm font-sans font-medium text-neutral-800 dark:text-neutral-200 leading-snug">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════ CORE FEATURES + PREFER FOR + PAGES ════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-14 lg:gap-10 mb-16">

          {/* Core Features */}
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">What's inside</p>
              <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100">
                Core Features
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              {designKits?.features.map((item: string, index: number) => (
                <div
                  key={index}
                  className={`feat-row px-4 py-3 rounded-xl border cursor-default
                    ${index === 0
                      ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-neutral-800 dark:bg-neutral-200 flex items-center justify-center">
                      <MdDone className="w-2.5 h-2.5 text-white dark:text-neutral-900" />
                    </span>
                    <p className="text-sm font-sans font-medium text-neutral-800 dark:text-neutral-200">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prefer For */}
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Use cases</p>
              <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100">
                Prefer For
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {designKits?.designPreferFor.map((item: any, index: number) => (
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

          {/* Design Pages */}
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-sans uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2">Included</p>
              <h2 className="font-sans font-bold text-xl lg:text-[1.6rem] tracking-tight text-neutral-900 dark:text-neutral-100">
                UI Kit Pages
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              {designKits?.designPages.map((item: string, index: number) => (
                <div
                  key={index}
                  className={`feat-row px-4 py-3 rounded-xl border cursor-default
                    ${index === 0
                      ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700'
                      : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-neutral-800 dark:bg-neutral-200 flex items-center justify-center">
                      <MdDone className="w-2.5 h-2.5 text-white dark:text-neutral-900" />
                    </span>
                    <p className="text-sm font-sans font-medium text-neutral-800 dark:text-neutral-200">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <CTA />
    </div>
  );
}

export default designKitView;
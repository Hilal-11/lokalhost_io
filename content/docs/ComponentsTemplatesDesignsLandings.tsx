"use client"

import React, { useState } from 'react'
import ComponentsList from './componentsAll'
import TemplatesBlockList from './templatesAll'

// ── Types ──────────────────────────────────────────────────────────────────
type Filter = 'Components' | 'Templates' | 'Landings' | 'Blocks' | 'Designs' | 'Mobile UI Elements' | 'Mobile Apps' | 'Custom-work'

const FILTERS: Filter[] = ['Components', 'Templates', 'Landings', 'Blocks', 'Designs', 'Mobile UI Elements', 'Mobile Apps', 'Custom-work']

// ── Coming soon placeholder ────────────────────────────────────────────────
const ComingSoon = ({ label }: { label: string }) => (
  <div className="w-full py-32 flex flex-col items-center justify-center gap-3">
    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Coming Soon
      </span>
    </div>
    <p className="text-sm font-mono text-neutral-400 dark:text-neutral-600">{label}</p>
  </div>
)

// ── Main component ─────────────────────────────────────────────────────────
export default function ComponentsTemplatesDesignsLandings() {
  const [active, setActive] = useState<Filter>('Components')

  return (
    <div className="w-full min-h-screen relative -top-28 lg:-top-38">

      {/* ── Top filter bar ── */}
      <div className="border sticky top-0 z-30 rounded-lg w-full lg:w-[80%] mx-auto border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950">
        <div className="container max-w-[1580px] mx-auto">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActive(filter)}
                className={`
                  shrink-0 px-4 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-widest
                  transition-all duration-200
                  ${active === filter
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex w-full">


        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 pt-4 relative">
          {active === 'Components' && <ComponentsList />}
          {active === 'Templates'  && <TemplatesBlockList />}
          {active === 'Landings' && <LandingsPlaceholder />}
          {active === 'Blocks'   && <BlocksPlaceholder />}
          {active === 'Designs'  && <DesignsPlaceholder />}
          {active === 'Mobile UI Elements'  && <DesignsPlaceholder />}
          {active === 'Mobile Apps'  && <DesignsPlaceholder />}
          {active === 'Custom-work'  && <DesignsPlaceholder />}
        </main>

      </div>
    </div>
  )
}


// ── Dummy placeholder components ──────────────────────────────────────────

const LANDING_ITEMS = [
  { name: "SaaS Landing",       tag: "Marketing" },
  { name: "Startup Page",       tag: "Marketing" },
  { name: "App Landing",        tag: "Mobile"    },
  { name: "Agency Landing",     tag: "Creative"  },
  { name: "Portfolio Landing",  tag: "Personal"  },
  { name: "Product Launch",     tag: "Marketing" },
]

const BLOCK_ITEMS = [
  { name: "Hero Section",       tag: "Layout"    },
  { name: "Pricing Table",      tag: "Commerce"  },
  { name: "Feature Grid",       tag: "Layout"    },
  { name: "Testimonials",       tag: "Social"    },
  { name: "FAQ Accordion",      tag: "Content"   },
  { name: "CTA Banner",         tag: "Marketing" },
]

const DESIGN_ITEMS = [
  { name: "Brand Kit",          tag: "Identity"  },
  { name: "Icon Set",           tag: "Assets"    },
  { name: "Color Palette",      tag: "Style"     },
  { name: "Typography Scale",   tag: "Style"     },
  { name: "UI Kit",             tag: "Assets"    },
  { name: "Figma System",       tag: "Figma"     },
]

const DummyGrid = ({ items }: { items: { name: string; tag: string }[] }) => (
  <div className="w-full container max-w-[1580px] pb-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">
      {items.map((item, i) => (
        <div
          key={i}
          className="group flex flex-col rounded-2xl p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800"
        >
          {/* inner box — shimmer pattern */}
          <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">

            {/* dot grid */}
            <div
              className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(0,0,0,1) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />

            {/* coming soon badge */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between pt-3 px-1">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-300 dark:bg-red-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 dark:bg-yellow-800" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 dark:bg-green-800" />
              </div>
              <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400">
                {item.name}
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
              {item.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const LandingsPlaceholder = () => <DummyGrid items={LANDING_ITEMS} />
export const BlocksPlaceholder   = () => <DummyGrid items={BLOCK_ITEMS} />
export const DesignsPlaceholder  = () => <DummyGrid items={DESIGN_ITEMS} />
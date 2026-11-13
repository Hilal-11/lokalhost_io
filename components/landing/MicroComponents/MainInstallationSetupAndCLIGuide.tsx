"use client"

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import { toast } from 'sonner'
import { PiTerminalFill, PiCatBold } from 'react-icons/pi'
import {
  FiCopy,
  FiCheck,
  FiDownload,
  FiPackage,
  FiSmartphone,
  FiBox,
  FiExternalLink,
  FiArrowRight,
  FiMenu,
} from 'react-icons/fi'
import { IoIosDoneAll } from 'react-icons/io'
import { SiNpm, SiPnpm, SiYarn, SiReact, SiFlutter } from 'react-icons/si'
import { IoClose } from "react-icons/io5";
/* ----------------------------------------------------------------------- */
/*  Types                                                                   */
/* ----------------------------------------------------------------------- */

type TabType = 'components' | 'templates' | 'mobile' | 'boilerplates'
type PM = 'npm' | 'pnpm' | 'yarn' | 'bun'

interface TabConfig {
  id: TabType
  label: string
  icon: React.ElementType
}

interface LeftPanelContent {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  primaryCTA: { label: string; href: string }
  secondaryCTA: { label: string; href: string }
}

interface TemplateItem {
  name: string
  category: string
  price: string
  tags: string[]
  href: string
  accent: string
}

interface MobileKitItem {
  name: string
  framework: 'React Native' | 'Flutter'
  components: number
  href: string
  cliPackage: string
  accent: string
}

interface BoilerplateItem {
  name: string
  stack: string[]
  price: string
  href: string
  demoHref: string
  accent: string
}

/* ----------------------------------------------------------------------- */
/*  Static config & sample data                                            */
/*  (swap the *_DATA arrays for live data from Supabase when ready)        */
/* ----------------------------------------------------------------------- */

const TABS: TabConfig[] = [
  { id: 'components', label: 'Components', icon: FiPackage },
  { id: 'templates', label: 'Web Templates', icon: FiDownload },
  { id: 'mobile', label: 'Mobile Apps', icon: FiSmartphone },
  { id: 'boilerplates', label: 'SaaS Boilerplates', icon: FiBox },
]

const LEFT_CONTENT: Record<TabType, LeftPanelContent> = {
  components: {
    eyebrow: 'CLI · v1',
    title: 'Install components straight into your project',
    description:
      'Pull production-ready, TypeScript-first components into your codebase with a single command. No copy-pasting, no manual dependency hunting — just code you own.',
    bullets: [
      'Works with Next.js, Vite, and React projects',
      'Auto-installs required dependencies & Tailwind config',
      'Fully editable — components live in your repo, not a node_module',
      'Updated registry, new components shipped weekly',
    ],
    primaryCTA: { label: 'Browse components', href: '/components' },
    secondaryCTA: { label: 'Read the docs', href: '/docs/cli' },
  },
  templates: {
    eyebrow: 'Templates',
    title: 'Production-ready web templates, built to ship',
    description:
      'Download complete Next.js + Tailwind templates — landing pages, dashboards, and marketing sites — and have a working project running in under five minutes.',
    bullets: [
      'One-time payment, lifetime updates included',
      'Clean, documented code — no bloated UI kits',
      'Figma source files included with every template',
      'Stripe, auth, and CMS integrations pre-wired where relevant',
    ],
    primaryCTA: { label: 'Browse all templates', href: '/templates' },
    secondaryCTA: { label: 'See pricing', href: '/pricing' },
  },
  mobile: {
    eyebrow: 'Mobile',
    title: 'Mobile UI kits for React Native & Flutter',
    description:
      'Ship native-feeling screens faster with component packs built for React Native (Expo) and Flutter — buttons, sheets, onboarding flows, and full screen templates.',
    bullets: [
      'Native look & feel on iOS and Android',
      'Dark mode and theming supported out of the box',
      'Figma design files included for every kit',
      'Drop-in components — no design system lock-in',
    ],
    primaryCTA: { label: 'Browse mobile kits', href: '/mobile' },
    secondaryCTA: { label: 'Open Figma library', href: '/mobile/figma' },
  },
  boilerplates: {
    eyebrow: 'Boilerplates',
    title: 'Ship your SaaS in days, not months',
    description:
      'Full-stack starter kits with auth, billing, database, and emails already wired together. Clone the repo, set your env vars, and start building your actual product.',
    bullets: [
      'Next.js, Supabase/Postgres, Stripe, and Resend pre-configured',
      'GitHub & Google OAuth set up out of the box',
      'Type-safe end to end with TanStack Query + Zod',
      'Deploy-ready for Vercel in one push',
    ],
    primaryCTA: { label: 'Browse boilerplates', href: '/boilerplates' },
    secondaryCTA: { label: 'View live demo', href: '/boilerplates/demo' },
  },
}

const TEMPLATES_DATA: TemplateItem[] = [
  {
    name: 'Keep — Notes App Landing',
    category: 'Landing Page',
    price: '$19',
    tags: ['Next.js', 'Framer Motion'],
    href: '/templates/keep-notes',
    accent: 'from-amber-400 to-amber-600',
  },
  {
    name: 'Pulse — SaaS Dashboard',
    category: 'Dashboard',
    price: '$39',
    tags: ['Next.js', 'Supabase'],
    href: '/templates/pulse-dashboard',
    accent: 'from-sky-400 to-sky-600',
  },
  {
    name: 'Northbound — Startup Site',
    category: 'Marketing',
    price: '$29',
    tags: ['Next.js', 'Tailwind'],
    href: '/templates/northbound',
    accent: 'from-violet-400 to-violet-600',
  },
  {
    name: 'Ledger — Finance Landing',
    category: 'Landing Page',
    price: '$19',
    tags: ['Next.js', 'Recharts'],
    href: '/templates/ledger',
    accent: 'from-emerald-400 to-emerald-600',
  },
]

const MOBILE_DATA: MobileKitItem[] = [
  {
    name: 'Core UI — React Native Kit',
    framework: 'React Native',
    components: 42,
    href: '/mobile/core-ui-rn',
    cliPackage: '@lokalhost/rn-cli',
    accent: 'from-cyan-400 to-cyan-600',
  },
  {
    name: 'Onboarding Flows Pack',
    framework: 'React Native',
    components: 12,
    href: '/mobile/onboarding-rn',
    cliPackage: '@lokalhost/rn-cli',
    accent: 'from-pink-400 to-pink-600',
  },
  {
    name: 'Flutter Essentials Kit',
    framework: 'Flutter',
    components: 38,
    href: '/mobile/flutter-essentials',
    cliPackage: 'lokalhost_ui',
    accent: 'from-blue-400 to-blue-600',
  },
]

const BOILERPLATES_DATA: BoilerplateItem[] = [
  {
    name: 'Launchpad — SaaS Starter',
    stack: ['Next.js', 'Supabase', 'Stripe', 'Clerk'],
    price: '$149',
    href: '/boilerplates/launchpad',
    demoHref: 'https://demo.lokalhost.io/launchpad',
    accent: 'from-fuchsia-400 to-fuchsia-600',
  },
  {
    name: 'Marketplace Kit',
    stack: ['Next.js', 'Postgres', 'Stripe Connect'],
    price: '$199',
    href: '/boilerplates/marketplace',
    demoHref: 'https://demo.lokalhost.io/marketplace',
    accent: 'from-orange-400 to-orange-600',
  },
]

const PACKAGE_MANAGERS: {
  id: PM
  label: string
  icon: React.ReactNode
  prefix: string
  color: string
}[] = [
  { id: 'npm', label: 'npm', icon: <SiNpm />, prefix: 'npx shadcn@latest add', color: 'text-red-500' },
  { id: 'pnpm', label: 'pnpm', icon: <SiPnpm />, prefix: 'pnpm dlx shadcn@latest add', color: 'text-yellow-500' },
  { id: 'yarn', label: 'yarn', icon: <SiYarn />, prefix: 'npx shadcn@latest add', color: 'text-blue-400' },
  { id: 'bun', label: 'bun', icon: <PiCatBold />, prefix: 'bunx --bun shadcn@latest add', color: 'text-orange-400' },
]

/* ----------------------------------------------------------------------- */
/*  Main component                                                         */
/* ----------------------------------------------------------------------- */

function MainInstallationSetupAndCLIGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('components')
  const left = LEFT_CONTENT[activeTab]
  const [tabMenuOpen, setTabMenuOpen] = useState(false)
  const tabMenuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tabMenuRef.current && !tabMenuRef.current.contains(e.target as Node)) {
        setTabMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div className="w-full container max-w-[1580px] h-auto min-h-[460px] border border-dashed border-neutral-300 dark:border-neutral-700 mt-10 bg-neutral-50 dark:bg-neutral-950 relative flex flex-col pb-5 px-3 sm:px-0">

      {/* Tabs row — shared across the whole block so left + right panels stay in sync */}
      <div className="w-full border-b border-dashed border-neutral-300 dark:border-neutral-700 px-4 pt-4">
        <div className="flex items-center justify-between pb-3">
          {/* Desktop/tablet tab row — hidden on mobile */}
          <div className="hidden sm:flex gap-1 overflow-x-auto scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'relative flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex-shrink-0',
                    isActive
                      ? 'text-neutral-900 dark:text-neutral-100'
                      : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="install-guide-active-tab"
                      className="absolute inset-0 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <Icon className="relative w-3.5 h-3.5" />
                  <span className="relative">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Mobile — current tab label + menu trigger on the right */}
          <div className="flex sm:hidden items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {(() => {
              const ActiveIcon = TABS.find((t) => t.id === activeTab)?.icon
              return ActiveIcon ? <ActiveIcon className="w-3.5 h-3.5" /> : null
            })()}
            <span>{TABS.find((t) => t.id === activeTab)?.label}</span>
          </div>

          <div className="relative sm:hidden" ref={tabMenuRef}>
            <button
              onClick={() => setTabMenuOpen((prev) => !prev)}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-md border transition-colors cursor-pointer',
                'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400',
                'hover:bg-neutral-100 dark:hover:bg-neutral-900'
              )}
            >
              {tabMenuOpen ? <IoClose className="w-4 h-4" /> : <FiMenu className="w-4 h-4" />}
            </button>

            <AnimatePresence>
              {tabMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: 'top right' }}
                  className={cn(
                    'absolute top-[calc(100%+8px)] right-0 z-50 w-[190px] overflow-hidden',
                    'bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800',
                    'shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.6)]'
                  )}
                >
                  <div className="flex flex-col gap-0.5 py-2 px-2">
                    {TABS.map((tab) => {
                      const Icon = tab.icon
                      const isActive = activeTab === tab.id
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id)
                            setTabMenuOpen(false)
                          }}
                          className={cn(
                            'flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-left text-xs font-semibold transition-colors cursor-pointer',
                            isActive
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                              : 'text-neutral-500 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{tab.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Top Grid - Info and Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:p-4 pb-0">
        {/* Left Column - dynamic per tab */}
        <div className="py-5 px-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <span className="text-[10px] font-semibold tracking-wide uppercase text-neutral-400 dark:text-neutral-600">
                {left.eyebrow}
              </span>
              <div className="flex flex-col text-left space-y-2 mt-1.5">
                <h1 className="text-xl sm:text-2xl font-sans font-medium text-neutral-700 dark:text-neutral-300">
                  {left.title}
                </h1>
                <p className="text-sm font-sans font-medium text-neutral-600 dark:text-neutral-400">
                  {left.description}
                </p>
              </div>

              <ul className="text-left px-4 sm:px-6 pt-4 text-[12px] space-y-1.5 list-disc marker:text-neutral-400 dark:marker:text-neutral-600">
                {left.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="font-sans font-medium text-neutral-500 dark:text-neutral-500"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row justify-start pt-6 px-2 gap-3 sm:gap-4">
                <Link href={left.primaryCTA.href}>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: -4, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={cn(
                      'flex justify-center items-center gap-2 cursor-pointer border-t border-l border-r border-neutral-800 dark:border-neutral-700',
                      'rounded-md py-2 px-4 whitespace-nowrap',
                      'font-sans font-medium text-xs text-neutral-100',
                      'bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950',
                      'shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]',
                      'hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]',
                      'transition-shadow duration-200'
                    )}
                  >
                    <span className="text-sm">
                      <PiTerminalFill />
                    </span>
                    <span>{left.primaryCTA.label}</span>
                  </motion.button>
                </Link>
                <Link href={left.secondaryCTA.href}>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ y: -4, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={cn(
                      'flex justify-center items-center cursor-pointer border-t border-l border-r border-neutral-100 dark:border-neutral-100',
                      'rounded-md py-2 px-5 whitespace-nowrap',
                      'font-sans font-medium text-xs text-neutral-900',
                      'bg-gradient-to-b from-neutral-200 to-neutral-300 dark:from-neutral-100 dark:to-neutral-200',
                      'shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]',
                      'hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]',
                      'transition-shadow duration-200'
                    )}
                  >
                    <span>{left.secondaryCTA.label}</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column - dynamic preview per tab */}
        <div className="lg:col-span-2 col-span-1 rounded-lg bg-white dark:bg-black w-full border h-auto sm:h-[380px] min-h-[200px] overflow-hidden flex flex-col">
          <RightPanel activeTab={activeTab} />
        </div>
      </div>

      {/* Bottom Section - dynamic action bar */}
      <div className="w-full mx-auto mt-4 px-4 lg:px-0">
        <BottomActionBar activeTab={activeTab} />
      </div>
    </div>
  )
}

export default MainInstallationSetupAndCLIGuide

/* ----------------------------------------------------------------------- */
/*  Right panel — switches content per tab                                 */
/* ----------------------------------------------------------------------- */

function RightPanel({ activeTab }: { activeTab: TabType }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex-1 min-h-0 flex flex-col"
      >
        {activeTab === 'components' && <ComponentsPreview />}
        {activeTab === 'templates' && <TemplatesPreview />}
        {activeTab === 'mobile' && <MobilePreview />}
        {activeTab === 'boilerplates' && <BoilerplatesPreview />}
      </motion.div>
    </AnimatePresence>
  )
}

/* ---- Components tab: CLI usage code block ---- */

const CLI_CODE = `# List all available components
npx lokalhost list

# Install a single component
npx lokalhost add button

# Install multiple components at once
npx lokalhost add button card dialog

# Install a full category
npx lokalhost add --category backgrounds`

function ComponentsPreview() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(CLI_CODE).then(() => {
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <div className="relative w-full h-[44px] shrink-0 bg-neutral-100 dark:bg-neutral-900 border-b flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="w-2 h-2 rounded-full bg-green-400" />
          <span className="ml-2 text-[11px] font-mono text-neutral-400 dark:text-neutral-600">
            terminal
          </span>
        </div>
        <button
          onClick={copy}
          className="w-7 h-7 rounded-sm border shadow-inner bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          {copied ? <IoIosDoneAll className="text-emerald-500" /> : <FiCopy />}
        </button>
      </div>
      <pre className="flex-1 overflow-auto p-4 text-[12.5px] leading-6 font-mono text-neutral-600 dark:text-neutral-400 whitespace-pre text-left">
{CLI_CODE}
      </pre>
    </>
  )
}

/* ---- Templates tab: scrollable list of purchasable templates ---- */

function TemplatesPreview() {
  return (
    <div className="flex-1 overflow-auto p-3 space-y-2">
      {TEMPLATES_DATA.map((t) => (
        <div
          key={t.name}
          className="flex items-center gap-3 p-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <div className={cn('w-12 h-9 rounded-sm bg-gradient-to-br shrink-0', t.accent)} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
              {t.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-[10px] text-neutral-400 dark:text-neutral-600">{t.category}</span>
              {t.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
            {t.price}
          </span>
          <Link
            href={t.href}
            className="shrink-0 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            <FiDownload className="text-xs" />
            Get
          </Link>
        </div>
      ))}
      <Link
        href="/templates"
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 py-2 transition-colors"
      >
        View all templates <FiArrowRight className="text-xs" />
      </Link>
    </div>
  )
}

/* ---- Mobile tab: React Native + Flutter kits ---- */

function MobilePreview() {
  return (
    <div className="flex-1 overflow-auto p-3 space-y-2">
      {MOBILE_DATA.map((kit) => (
        <div
          key={kit.name}
          className="flex items-center gap-3 p-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <div
            className={cn(
              'w-9 h-9 rounded-md bg-gradient-to-br shrink-0 flex items-center justify-center text-white text-base',
              kit.accent
            )}
          >
            {kit.framework === 'React Native' ? <SiReact /> : <SiFlutter />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
              {kit.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-[10px] text-neutral-400 dark:text-neutral-600">
                {kit.framework}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500">
                {kit.components} components
              </span>
            </div>
          </div>
          <Link
            href={kit.href}
            className="shrink-0 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            View
          </Link>
        </div>
      ))}
      <Link
        href="/mobile"
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 py-2 transition-colors"
      >
        View all mobile kits <FiArrowRight className="text-xs" />
      </Link>
    </div>
  )
}

/* ---- Boilerplates tab: full-stack starter kits ---- */

function BoilerplatesPreview() {
  return (
    <div className="flex-1 overflow-auto p-3 space-y-2">
      {BOILERPLATES_DATA.map((b) => (
        <div
          key={b.name}
          className="flex items-center gap-3 p-2.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
        >
          <div className={cn('w-9 h-9 rounded-md bg-gradient-to-br shrink-0', b.accent)} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
              {b.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {b.stack.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
            {b.price}
          </span>
          <a
            href={b.demoHref}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 w-7 h-7 rounded-md border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            title="Live demo"
          >
            <FiExternalLink className="text-xs" />
          </a>
          <Link
            href={b.href}
            className="shrink-0 flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            <FiDownload className="text-xs" />
            Get
          </Link>
        </div>
      ))}
      <Link
        href="/boilerplates"
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 py-2 transition-colors"
      >
        View all boilerplates <FiArrowRight className="text-xs" />
      </Link>
    </div>
  )
}

/* ----------------------------------------------------------------------- */
/*  Bottom action bar — CLI command for components/mobile,                 */
/*  download/browse CTA for templates/boilerplates                        */
/* ----------------------------------------------------------------------- */

function BottomActionBar({ activeTab }: { activeTab: TabType }) {
  const isCLITab = activeTab === 'components' || activeTab === 'mobile'

  const meta: Record<TabType, { title: string; subtitle: string; badge: string }> = {
    components: { title: 'CLI Installation', subtitle: 'Add via command line', badge: 'Beta' },
    templates: { title: 'Instant Download', subtitle: 'ZIP, ready to run', badge: 'No CLI' },
    mobile: { title: 'CLI Installation', subtitle: 'Add to React Native or Flutter', badge: 'Beta' },
    boilerplates: { title: 'Clone & Deploy', subtitle: 'GitHub repo access', badge: 'Git' },
  }
  const m = meta[activeTab]

  return (
    <div className="relative rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[62px]">
        {/* Left meta */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-800">
          <div className="w-7 h-7 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
            <PiTerminalFill className="text-neutral-600 dark:text-neutral-400 text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-tight truncate">
              {m.title}
            </p>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-600 mt-0.5 leading-tight">
              {m.subtitle}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {m.badge}
          </span>
        </div>

        {/* Right action */}
        <div className="lg:col-span-2 w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-950 min-w-0">
          {isCLITab ? (
            <CLICommandRow activeTab={activeTab} />
          ) : (
            <DownloadActionRow activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  )
}

function CLICommandRow({ activeTab }: { activeTab: 'components' | 'mobile' }) {
  const command =
    activeTab === 'components'
      ? 'https://lokalhost.io/registry/[component].json'
      : '[react-native|flutter] [component]'

  return (
    <>
      <span className="text-neutral-300 dark:text-neutral-700 font-mono text-xs select-none shrink-0">$</span>
      <div className="flex-1 overflow-x-auto min-w-0 scrollbar-none justify-end text-end">
        <code className="font-mono text-[11px] sm:text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap block">
          {activeTab === 'components'
            ? `npx shadcn@latest add ${command}`
            : `npx lokalhost-rn add ${command}`}
        </code>
      </div>
      <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0" />
      <CopyCommandButton
        registryUrl={
          activeTab === 'components'
            ? 'https://lokalhost.io/registry/bento-grid.json'
            : 'button'
        }
        isMobile={activeTab === 'mobile'}
      />
    </>
  )
}

function DownloadActionRow({ activeTab }: { activeTab: 'templates' | 'boilerplates' }) {
  const href = activeTab === 'templates' ? '/templates' : '/boilerplates'
  const label = activeTab === 'templates' ? 'Browse all templates' : 'Browse all boilerplates'

  return (
    <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
      <p className="text-xs text-neutral-400 dark:text-neutral-600 truncate hidden sm:block">
        {activeTab === 'templates'
          ? 'Pick a template, download the ZIP, npm install, and you’re running locally.'
          : 'Clone the repo, drop in your env vars, and deploy to Vercel.'}
      </p>
      <Link
        href={href}
        className={cn(
          'shrink-0 flex items-center gap-2 cursor-pointer',
          'border-t border-l border-r border-neutral-800 dark:border-neutral-700',
          'rounded-md py-2 px-3.5 whitespace-nowrap',
          'font-sans font-medium text-xs text-neutral-100',
          'bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950',
          'shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]',
          'hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]',
          'transition-shadow duration-200 active:scale-95'
        )}
      >
        <FiArrowRight className="text-sm" />
        <span>{label}</span>
      </Link>
    </div>
  )
}

/* ----------------------------------------------------------------------- */
/*  Copy command dropdown — package manager picker                         */
/* ----------------------------------------------------------------------- */

interface CopyCommandButtonProps {
  registryUrl: string
  isMobile?: boolean
}

export function CopyCommandButton({ registryUrl, isMobile = false }: CopyCommandButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<PM | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCopy = (pm: (typeof PACKAGE_MANAGERS)[number]) => {
    const command = isMobile
      ? `npx lokalhost-rn add ${registryUrl}`
      : `${pm.prefix} ${registryUrl}`
    navigator.clipboard.writeText(command).then(() => {
      setCopied(pm.id)
      toast.success(`Copied ${pm.label} command`)
      setTimeout(() => {
        setCopied(null)
        setOpen(false)
      }, 2000)
    })
  }

  // Mobile CLI has a single fixed command — no package manager choice needed
  if (isMobile) {
    return (
      <button
        onClick={() => handleCopy(PACKAGE_MANAGERS[0])}
        className={cn(
          'shrink-0 flex items-center gap-1.5 cursor-pointer',
          'border-t border-l border-r border-neutral-800 dark:border-neutral-700',
          'rounded-md py-2 px-2.5 whitespace-nowrap',
          'font-sans font-medium text-xs text-neutral-100',
          'bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950',
          'shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]',
          'hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]',
          'transition-all duration-200 active:scale-95'
        )}
      >
        {copied ? <FiCheck className="text-sm text-emerald-400" /> : <FiCopy className="text-sm" />}
        <span className="hidden sm:inline text-xs">Copy</span>
      </button>
    )
  }

  return (
    <div className="relative shrink-0 z-50" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'shrink-0 flex items-center gap-1.5 cursor-pointer z-50',
          'border-t border-l border-r border-neutral-800 dark:border-neutral-700',
          'rounded-md py-2 px-2.5 whitespace-nowrap',
          'font-sans font-medium text-xs text-neutral-100',
          'bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950',
          'shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]',
          'hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]',
          'transition-all duration-200 active:scale-95',
          open && 'shadow-[0px_3px_10px_rgba(0,0,0,0.25)]'
        )}
      >
        {copied ? <FiCheck className="text-sm text-emerald-400" /> : <FiCopy className="text-sm" />}
        <span className="hidden sm:inline text-xs">Copy</span>
        <svg
          className={cn(
            'w-2.5 h-2.5 text-neutral-500 transition-transform duration-200',
            open && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'bottom right' }}
            className={cn(
              'absolute bottom-[calc(100%+8px)] right-0 z-50',
              'w-[160px] overflow-hidden',
              'bg-white dark:bg-neutral-900',
              'shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]',
              'dark:shadow-[0_4px_32px_rgba(0,0,0,0.6)] rounded-lg border border-dashed'
            )}
          >
            <div className="flex flex-col gap-0.5 py-2 px-2">
              {PACKAGE_MANAGERS.map((pm, i) => (
                <motion.button
                  key={pm.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.15 }}
                  onClick={() => handleCopy(pm)}
                  className={cn(
                    'z-50 w-full flex items-center gap-2.5 px-2.5 py-1 rounded-sm hover:border',
                    'text-left transition-all duration-100 group cursor-pointer',
                    'hover:bg-neutral-100/20 hover:shadow-sm dark:hover:bg-neutral-800',
                    copied === pm.id && 'bg-emerald-50 dark:bg-emerald-950/40'
                  )}
                >
                  <span
                    className={cn(
                      'text-base shrink-0 transition-colors',
                      copied === pm.id ? 'text-emerald-500' : pm.color
                    )}
                  >
                    {pm.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {pm.label}
                    </p>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono truncate">
                      {pm.prefix}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs">
                    {copied === pm.id ? (
                      <FiCheck className="text-emerald-500" />
                    ) : (
                      <FiCopy className="text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors" />
                    )}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
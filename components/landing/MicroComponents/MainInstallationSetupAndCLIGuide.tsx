"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { PiTerminalFill } from 'react-icons/pi'
import { motion, AnimatePresence } from 'motion/react'
import { FiCopy, FiDownload, FiPackage, FiSmartphone } from "react-icons/fi"
import { toast } from 'sonner'
import { IoIosDoneAll } from "react-icons/io"
import { SiReact, SiFlutter } from "react-icons/si"
import {  useRef, useEffect } from 'react'
import {  FiCheck } from 'react-icons/fi'
import { SiNpm, SiPnpm, SiYarn } from 'react-icons/si'
import { PiCatBold } from "react-icons/pi";
type TabType = 'components' | 'templates' | 'mobile-react' | 'mobile-flutter'

interface CodeExample {
  title: string
  description: string
  code: string
  language: string
}

const codeExamples: Record<TabType, CodeExample> = {
  'components': {
    title: 'Add Components via CLI',
    description: 'Install pre-built components directly into your project',
    code: `# Install a specific component
npx lokalhost add button

# Install multiple components
npx lokalhost add button card dialog

# Install all components from a category
npx lokalhost add --category backgrounds

# List all available components
npx lokalhost list`,
    language: 'bash'
  },
  'templates': {
    title: 'Download Web Templates',
    description: 'Get production-ready templates as downloadable ZIP files',
    code: `# Step 1: Download template from dashboard
# Templates are provided as .zip files

# Step 2: Extract the template
unzip saas-template.zip
cd saas-template

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env.local

# Step 5: Run development server
npm run dev`,
    language: 'bash'
  },
  'mobile-react': {
    title: 'React Native Components',
    description: 'Beautiful mobile UI elements for React Native apps',
    code: `# Install React Native CLI tool
npm install -g @lokalhost/rn-cli

# Add mobile components to your React Native project
npx lokalhost-rn add button
npx lokalhost-rn add card
npx lokalhost-rn add bottom-sheet

# Usage in your component
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <Button variant="primary" onPress={() => {}}>
      Click Me
    </Button>
  )
}`,
    language: 'typescript'
  },
  'mobile-flutter': {
    title: 'Flutter UI Components',
    description: 'Cross-platform Flutter widgets ready to use',
    code: `# Add Flutter CLI tool
dart pub global activate lokalhost_cli

# Add Flutter components
lokalhost_flutter add button
lokalhost_flutter add card
lokalhost_flutter add bottom_sheet

# Usage in your Flutter app
import 'package:lokalhost_ui/lokalhost_ui.dart';

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LokalhostButton(
      text: 'Click Me',
      variant: ButtonVariant.primary,
      onPressed: () {},
    );
  }
}`,
    language: 'dart'
  }
}

function MainInstallationSetupAndCLIGuide() {
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('components')
  const [copiedCommand, setCopiedCommand] = useState(false)

  const copyCode = (code: string, isCLICommand = false) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          toast.success('Copied to clipboard')
          if (isCLICommand) {
            setCopiedCommand(true)
            setTimeout(() => setCopiedCommand(false), 3000)
          } else {
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 3000)
          }
        })
    } else {
      toast.error('Failed to copy to clipboard')
    }
  }

  const tabs = [
    { id: 'components' as TabType, label: 'Components', icon: FiPackage },
    { id: 'templates' as TabType, label: 'Templates', icon: FiDownload },
    { id: 'mobile-react' as TabType, label: 'React Native', icon: SiReact },
    { id: 'mobile-flutter' as TabType, label: 'Flutter', icon: SiFlutter },
  ]


  return (
    <div className='w-full container max-w-[1580px] h-auto min-h-[460px] border border-dashed border-neutral-300 dark:border-neutral-700 mt-10 bg-neutral-50 dark:bg-neutral-950 relative flex flex-col pb-5'>
      
      {/* Top Grid - Info and Preview */}
      <div className='grid grid-cols-1 lg:grid-cols-3 lg:p-4 pb-0'>
        {/* Left Column - Info */}
        <div className='py-5 px-5'>
          <div className='flex flex-col text-left space-y-2'>
            <h1 className='text-2xl font-sans font-medium text-neutral-700 dark:text-neutral-300'>
              Get started with Lokalhost.io CLI
            </h1>
            <p className='text-sm font-sans font-medium text-neutral-600 dark:text-neutral-400'>
              Install components, download templates, and integrate mobile UI elements directly into your projects with our powerful CLI tool. Built for modern development workflows.
            </p>
          </div>
          <div className='text-left px-6 pt-4 text-[12px] space-y-1'>
            <li className='font-sans font-medium text-neutral-500 dark:text-neutral-500'>
              Smooth CLI for Web and Mobile Environment
            </li>
            <li className='font-sans font-medium text-neutral-500 dark:text-neutral-500'>
              Compatible with React, Next.js, React Native, and Flutter
            </li>
            <li className='font-sans font-medium text-neutral-500 dark:text-neutral-500'>
              No idle or waiting periods — instant installation
            </li>
            <li className='font-sans font-medium text-neutral-500 dark:text-neutral-500'>
              Production-ready components with TypeScript support
            </li>
          </div>
          <div className='flex justify-start pt-6 px-2 gap-4'>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: -4, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={cn(
                "flex justify-between items-center cursor-pointer border-t border-l border-r border-neutral-800 dark:border-neutral-700",
                "rounded-md py-2 w-[140px] px-2 whitespace-nowrap",
                "font-sans font-medium text-xs text-neutral-100",
                "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
                "shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]",
                "transition-shadow duration-200"
              )}
            >
              <span className='text-sm block'><PiTerminalFill /></span>
              <span className='block'>Documentation</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ y: -4, scale: 0.97 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={cn(
                "flex justify-between items-center cursor-pointer border-t border-l border-r border-neutral-100 dark:border-neutral-100",
                "rounded-md py-2 px-6 whitespace-nowrap",
                "font-sans font-medium text-xs text-neutral-900",
                "bg-gradient-to-b from-neutral-200 to-neutral-300 dark:from-neutral-100 dark:to-neutral-200",
                "shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]",
                "transition-shadow duration-200"
              )}
            >
              <span className='block'>Try CLI</span>
            </motion.button>
          </div>
        </div>

        {/* Right Column - Tabs Preview */}
        <div className='lg:col-span-2 col-span-1 rounded-lg bg-white dark:bg-black w-full border h-[380px]'>
          {/* Header */}
          <div className='w-full rounded-t-lg h-[60px] bg-neutral-100 dark:bg-neutral-900 border-b flex justify-between items-center px-4'>
            {/* Tabs */}
            <div className='flex gap-2 overflow-x-auto scrollbar-none'>
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                      activeTab === tab.id
                        ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-sm"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Copy Button */}
            <div className='flex justify-center items-center cursor-pointer'>
              <button className='w-8 h-8 p-1 rounded-sm border shadow-inner bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xl text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors'>
                {isCopied ? <IoIosDoneAll className="text-emerald-500" /> : <FiCopy />}
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div>
            Hello world
          </div>


        </div>
      </div>

      {/* Bottom Section - CLI Command */}
        {/* Command Container */}
        <div className='w-full mx-auto mt-4'>
          <div className='relative rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'>

            {/* Top accent line */}
            <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent' />

            <div className='grid grid-cols-1 lg:grid-cols-3 min-h-[62px]'>

              {/* Left — full width on mobile, 30% on sm+ */}
              <div className='flex items-center gap-2.5 px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-800'>
                <div className='w-7 h-7 rounded-md bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0'>
                  <PiTerminalFill className='text-neutral-600 dark:text-neutral-400 text-sm' />
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-tight truncate'>
                    CLI Installation
                  </p>
                  <p className='text-[10px] text-neutral-400 dark:text-neutral-600 mt-0.5 leading-tight'>
                    Add via command line
                  </p>
                </div>
                <span className='shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500'>
                  <span className='w-1.5 h-1.5 rounded-full bg-red-500' />
                  Beta
                </span>
              </div>

              {/* Right — full width on mobile, 70% on sm+ */}
              <div className='lg:col-span-2 w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-neutral-950 min-w-0'>

                {/* $ prompt */}
                <span className='text-neutral-300 dark:text-neutral-700 font-mono text-xs select-none shrink-0'>$</span>

                {/* Horizontally scrollable command */}
                <div className='flex-1 overflow-x-auto min-w-0 scrollbar-none justify-end text-end'>
                  <code className='font-mono text-[13px] sm:text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap block'>
                    npx shadcn@latest add https://lokalhost.io/registry/[component].json
                  </code>
                </div>

                {/* Divider */}
                <div className='h-4 w-px bg-neutral-200 dark:bg-neutral-800 shrink-0' />

                {/* Copy button */}
                {/* <button
                  onClick={() => copyCode('npx shadcn@latest add https://lokalhost.io/registry/bento-grid.json', true)}
                  className={cn(
                    "shrink-0 flex gap-2 justify-between items-center cursor-pointer",
                    "border-t border-l border-r border-neutral-800 dark:border-neutral-700",
                    "rounded-md py-2 px-2 whitespace-nowrap",
                    "font-sans font-medium text-xs text-neutral-100",
                    "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
                    "shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
                    "hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]",
                    "transition-shadow duration-200 active:scale-95",
                  )}
                >
                  {copiedCommand ? (
                    <>
                      <IoIosDoneAll className='text-sm text-emerald-400' />
                      <span></span>
                    </>
                  ) : (
                    <>
                      <FiCopy className='text-sm' />
                      <span></span>
                    </>
                  )}
                </button> */}
                <CopyCommandButton registryUrl='https://lokalhost.io/registry/bento-grid.json' />

              </div>


            </div>
          </div>
        </div>

    </div>
  )
}

export default MainInstallationSetupAndCLIGuide








type PM = 'npm' | 'pnpm' | 'yarn' | 'bun'

interface PackageManager {
  id: PM
  label: string
  icon: React.ReactNode
  prefix: string
  color: string
}

const PACKAGE_MANAGERS: PackageManager[] = [
  {
    id: 'npm',
    label: 'npm',
    icon: <SiNpm />,
    prefix: 'npx shadcn@latest add',
    color: 'text-red-500',
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    icon: <SiPnpm />,
    prefix: 'pnpm dlx shadcn@latest add',
    color: 'text-yellow-500',
  },
  {
    id: 'yarn',
    label: 'yarn',
    icon: <SiYarn />,
    prefix: 'npx shadcn@latest add',
    color: 'text-blue-400',
  },
  {
    id: 'bun',
    label: 'bun',
    icon: <PiCatBold />,
    prefix: 'bunx --bun shadcn@latest add',
    color: 'text-orange-400',
  },
]

interface CopyCommandButtonProps {
  registryUrl: string // e.g. https://lokalhost.io/registry/bento-grid.json
}

export function CopyCommandButton({ registryUrl }: CopyCommandButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<PM | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleCopy = (pm: PackageManager) => {
    const command = `${pm.prefix} ${registryUrl}`
    navigator.clipboard.writeText(command).then(() => {
      setCopied(pm.id)
      toast.success(`Copied ${pm.label} command`)
      setTimeout(() => {
        setCopied(null)
        setOpen(false)
      }, 2000)
    })
  }

  return (
    <div className='relative shrink-0 z-50' ref={ref}>

      {/* Trigger */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={cn(
          "shrink-0 flex items-center gap-1.5 cursor-pointer z-50",
          "border-t border-l border-r border-neutral-800 dark:border-neutral-700",
          "rounded-md py-2 px-2.5 whitespace-nowrap",
          "font-sans font-medium text-xs text-neutral-100",
          "bg-gradient-to-b from-neutral-700 to-neutral-900 dark:from-neutral-800 dark:to-neutral-950",
          "shadow-[0px_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
          "hover:shadow-[0px_3px_10px_rgba(0,0,0,0.25)]",
          "transition-all duration-200 active:scale-95",
          open && "shadow-[0px_3px_10px_rgba(0,0,0,0.25)]"
        )}
      >
        {copied ? (
          <FiCheck className='text-sm text-emerald-400' />
        ) : (
          <FiCopy className='text-sm' />
        )}
        <span className='hidden sm:inline text-xs'>Copy</span>
        {/* Tiny chevron */}
        <svg
          className={cn(
            'w-2.5 h-2.5 text-neutral-500 transition-transform duration-200',
            open && 'rotate-180'
          )}
          fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {/* Floating Dropdown */}
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
              'w-[200px]',
              'rounded-xl overflow-hidden',
              'border border-neutral-200 dark:border-neutral-800',
              'bg-white dark:bg-neutral-900',
              'shadow-[0_4px_24px_rgba(0,0,0,0.10),0_1px_4px_rgba(0,0,0,0.06)]',
              'dark:shadow-[0_4px_32px_rgba(0,0,0,0.6)]',
            )}
          >
            {/* Header */}
            <div className='flex items-center justify-between px-3 pt-2.5 pb-2 border-b border-neutral-100 dark:border-neutral-800'>
              <span className='text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-600'>
                Copy as
              </span>
              <FiCopy className='text-[10px] text-neutral-300 dark:text-neutral-700' />
            </div>

            {/* Options */}
            <div className='p-1.5 flex flex-col gap-0.5'>
              {PACKAGE_MANAGERS.map((pm, i) => (
                <motion.button
                  key={pm.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.15 }}
                  onClick={() => handleCopy(pm)}
                  className={cn(
                    'z-50 w-full flex items-center gap-2.5 px-2.5 py-1 rounded-sm',
                    'text-left transition-all duration-100 group cursor-pointer',
                    'hover:bg-neutral-100 hover:shadow-sm dark:hover:bg-neutral-800',
                    copied === pm.id && 'bg-emerald-50 dark:bg-emerald-950/40'
                  )}
                >
                  {/* Icon */}
                  <span className={cn(
                    'text-base shrink-0 transition-colors',
                    copied === pm.id ? 'text-emerald-500' : pm.color
                  )}>
                    {pm.icon}
                  </span>

                  {/* Label */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-xs font-semibold text-neutral-800 dark:text-neutral-200'>
                      {pm.label}
                    </p>
                    <p className='text-[10px] text-neutral-400 dark:text-neutral-600 font-mono truncate'>
                      {pm.prefix}
                    </p>
                  </div>

                  {/* State icon */}
                  <span className='shrink-0 text-xs'>
                    {copied === pm.id ? (
                      <FiCheck className='text-emerald-500' />
                    ) : (
                      <FiCopy className='text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors' />
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
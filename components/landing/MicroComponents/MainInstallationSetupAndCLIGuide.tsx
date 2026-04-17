"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { PiTerminalFill } from 'react-icons/pi'
import { motion, AnimatePresence } from 'motion/react'
import { FiCopy, FiDownload, FiPackage, FiSmartphone } from "react-icons/fi"
import { toast } from 'sonner'
import { IoIosDoneAll } from "react-icons/io"
import { SiReact, SiFlutter } from "react-icons/si"

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
            <div className='flex justify-center items-center cursor-pointer' onClick={() => copyCode(currentExample.code)}>
              <button className='w-10 h-10 rounded-sm border shadow-inner bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xl text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors'>
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
        <div className='w-full lg:w-[95%] mx-auto border grid lg:grid-cols-5 md:flex-row items-start md:items-center justify-between gap-4 lg:p-2 lg:px-5 rounded-sm'>
          
          {/* Left - Context */}
          <div className='col-span-2 hidden lg:flex'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center shadow-inner'>
                <PiTerminalFill className='text-neutral-700 dark:text-neutral-300 text-xl' />
              </div>
              <div>
                <h3 className='text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-tight text-left'>
                  CLI Installation
                </h3>
                <p className='text-xs text-neutral-500 dark:text-neutral-500 mt-0.5'>
                  Add components via command line
                </p>
              </div>
            </div>
          </div>

          {/* Right - Command & Copy */}
          <div className='lg:col-span-3 flex items-left gap-3 w-full md:w-auto overflow-auto'>
            
            {/* Command Box */}
            <div className='flex-1 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3 shadow-inner text-left  overflow-auto'>
              <code className='font-mono text-xs md:text-sm text-neutral-700 dark:text-neutral-300 break-all text-left whitespace-nowrap overflow-x-auto'>
                npx shadcn@latest add https://lokallhost.io.com/registry/[component].json
              </code>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => copyCode('npx shadcn@latest add https://lokallhost.io.com/registry/bento-grid.json', true)}
              className={cn(
                'flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm transition-all',
                'border border-neutral-200 dark:border-neutral-700',
                'bg-white dark:bg-neutral-900',
                'hover:border-neutral-300 dark:hover:border-neutral-600',
                'shadow-sm hover:shadow-md',
                'active:scale-95',
                'hidden lg:flex'
              )}
            >
              {copiedCommand ? (
                <>
                  <IoIosDoneAll className="text-emerald-500 text-lg" />
                </>
              ) : (
                <>
                  <FiCopy className='text-neutral-600 dark:text-neutral-400 text-lg' />
                </>
              )}
            </button>

          </div>
        </div>

    </div>
  )
}

export default MainInstallationSetupAndCLIGuide
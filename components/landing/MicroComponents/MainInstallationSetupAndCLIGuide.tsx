"use client"
import React from 'react'
import { cn } from '@/lib/utils';
import { PiTerminalFill } from 'react-icons/pi';
import { motion } from 'motion/react';
import { FiCopy } from "react-icons/fi";
import { useState } from "react"
import { toast } from 'sonner';

function MainInstallationSetupAndCLIGuide() {

  
const [isCopied , setIsCopied] = useState(false)

const copyCode = () => {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText("console.log(`hello world`)")
      .then(() => toast.success('Copied to clipboard'))
  } else {
    toast.error('Failed to Copy on clipboard')
  }
      setIsCopied(true)
    // after 3 secounds i should reset this, make it to false
    setTimeout(() => {
        setIsCopied(false)
    },3000)
};

  return (
    <div className=' w-full container max-w-[1580px] h-auto lg:h-[460px] border border-dashed border-neutral-300 dark:border-neutral-700 mt-10 bg-neutral-50 dark:bg-neutral-950 relative grid grid-cols-1 lg:grid-cols-3 lg:p-4 pb-4'>
      <div className='py-5 px-5'>
          <div className='flex flex-col text-left space-y-2'>
              <h1 className='text-2xl font-sans font-medium text-neutral-700 dark:text-neutral-300'>Get started with Lokalhost.io CLI</h1>
              <p className='text-sm font-sans font-medium text-neutral-600 dark:text-neutral-400'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt commodi odit adipisci labore, tenetur tempore nobis vero voluptatibus facere magni? A nostrum qui non! Voluptate magni impedit unde.</p>
          </div>
          <div className='text-left px-6 pt-4 text-[12px] space-y-1'>
              <li className='font-sans font-medium text-neutral-500 dark:text-neutral-500'>Smooth CLI for Web and Mobile Environment</li>
              <li className='font-sans font-medium text-neutral-500 dark:text-neutral-500'>CLI compatable with React Ecosystem and Cross-platform Ecosystem</li>
              <li className='font-sans font-medium text-neutral-500 dark:text-neutral-500'>No idle or waiting periods</li>
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
      <div className='lg:col-span-2 col-span-1 rounded-lg bg-white dark:bg-black lg:h-full w-full border h-[360px]'>
          {/* Header */}
          <div className='w-full rounded-t-lg h-[60px] bg-neutral-100 dark:bg-neutral-900 border-b flex justify-between items-center px-4'>
             <div></div>
             <div className='flex justify-center items-center cursor-pointer' onClick={copyCode}>
                <button className='w-10 h-10 rounded-sm border shadow-inner bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xl text-neutral-700 dark:text-neutral-300 cursor-pointer'>{isCopied ? "" : <FiCopy />}</button>
             </div>
          </div>
      </div>
    
    </div>
  )
}

export default MainInstallationSetupAndCLIGuide

import React from 'react'
import { StripedPattern } from '../../magicui/striped-pattern';
import Image from 'next/image';
import { motion } from "motion/react"
import Link from 'next/dist/client/link';
import { LuFigma } from 'react-icons/lu';
export default function FeaturesBento() {
  return (
    <div className='w-full h-full'>
    <div className='w-full mx-auto pt-8 lg:pt-16 relative pb-10'>
            <motion.h1
            initial={{ opacity: 0, y: 110 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, }}
            className='z-20 text-center font-sans font-bold text-3xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 lg:w-2/3 mx-auto tracking-tight'>
              The Ultimate Figma UI Design kits for Websites and Mobile Apps by{" "}
              <span className="font-mono text-neutral-500 dark:text-neutral-500">lokalhost.io</span>
            </motion.h1>
            <motion.p
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, }}
            className='pt-6 pb-6 px-8 lg:px-2 z-20 text-center text-sm lg:text-[17px] font-sans font-medium text-neutral-500 dark:text-neutral-400 lg:w-1/2 mx-auto leading-relaxed'>
              Lokalhost.io Figma offers 100+ component variants, 70+ blocks, 20+ templates, 9+ dashboard and 4 themes and more with an intuitive drag-and-drop page builder.
            </motion.p>
            <div className="flex flex-wrap justify-center items-center pt-3 pb-5 gap-3 lg:gap-6">
              <button className="border-1 border-orange-400 cursor-pointer px-8 py-[9px] rounded-lg text-sm font-sans font-medium text-neutral-800 bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7] shadow-sm flex items-center justify-center gap-2"><span><LuFigma /></span> Get Full Design Access</button>
              <button className="px-8 py-[10px] cursor-pointer border-t border-l border-r border-neutral-800 rounded-lg whitespace-nowrap font-sans font-medium text-sm text-neutral-200 dark:text-neutral-200 bg-gradient-to-t from-[#262626] to-[#525252] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">Get All Premium Templates</button>
          </div>
        </div>
        <div className="pt-10 relative h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-0 lg:gap-0 border-b border-dashed px-px">
            <div className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t mask-x-from-80% to-100%">
              <div className='space-y-4 pt-4 px-5 lg:px-6'>
                                <h1 className='text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200'>Designs for Templates, Mobile Apps & Components</h1>
                                <p className='text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2'>All-in-one design kits including website templates, mobile app screens, and reusable components. Built for real products, fully customizable, and optimized for production-ready implementation.</p>

                                
                              </div>
                              <div className="flex w-full h-full items-start justify-center px-10 pt-5 relative">
                                  <Image width={200} height={200} className="z-10 rounded-sm object-cover w-[200px] absolute left-1 top-18 border " alt="templates" src="http://localhost:3000/templates/hero-block-1-light.webp" />
                                  <Image width={200} height={200} className="border z-20 rounded-sm object-cover w-[380px] " alt="templates" src="https://res.cloudinary.com/dou5rypdf/image/upload/v1760629285/Screenshot_2025-10-05_232843_pjfcdu.png" />
                                  <Image width={200} height={200} className="z-10 rounded-sm object-cover w-[200px] absolute right-1 top-18 border" alt="templates" src="http://localhost:3000/templates/hero-block-9-light.webp" />
                                  
                              </div>
            </div>

            <div className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t px-3 py-3 flex justify-center items-center">
                <motion.div
                      className="flex w-full h-full items-start justify-center">
                      <img className="hidden lg:flex z-20 rounded-sm object-cover lg:w-[380px] lg:absolute lg:-left-4 lg:-top-4 border-3" alt="templates" src="https://cdn.dribbble.com/userupload/16994810/file/original-c6a72b1649c9ba7b49f8b363761c669f.jpg?resize=1200x900&vertical=center" />
                      <img className="border-2 z-20 rounded-sm object-cover lg:w-[380px] lg:absolute lg:-bottom-0 lg:-right-3" alt="templates" src="https://cdn.shadcnstudio.com/ss-assets/landing-page/figma-column-2-light.png?width=390&format=auto" />
                </motion.div>
            </div>
            
            <div className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t mask-r-from-80% to-100% px-3 py-3 flex justify-center items-center">
                    <motion.div
                      className="flex w-full h-full items-start justify-center">
                      <img className="hidden lg:flex z-20 rounded-sm object-cover lg:w-[380px] lg:absolute lg:-left-4 lg:-top-4 border-3" alt="templates" src="https://cdn.dribbble.com/userupload/44078184/file/original-c54c15a616d979fec3ca81e6adf22c07.jpg?resize=1200x899&vertical=center" />
                      <img className="border-2 z-20 rounded-sm object-cover w-[380px] lg:absolute lg:-bottom-3 lg:-right-3" alt="templates" src="https://cdn.dribbble.com/userupload/46050340/file/b6c35f7a9f9154c5f1dc9fddd490997d.jpg?resize=1200x900&vertical=center" />
                    </motion.div>
            </div>
        </div> 
        <div className='w-full flex items-center justify-center py-10 lg:py-16 border-b border-dashed relative lg:mask-x-from-60% mask-x-from-70% to-100%'>
          <StripedPattern />
          <Link href="/designs" className='z-20 border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium px-10 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>Get Designs UI kits</Link>
        </div>
    </div>
  )
}

// 

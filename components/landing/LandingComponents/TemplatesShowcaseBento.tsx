"use client"
import React from 'react'
import { motion } from "motion/react"
import Image from 'next/image'
import { DotPattern } from '@/components/ui/dot-pattern';
import { StripedPattern } from '@/components/magicui/striped-pattern';
import { GoFileZip } from "react-icons/go";
import { LuCodeXml } from "react-icons/lu";
import { RxFigmaLogo } from "react-icons/rx";
import { LuMessageCircleHeart } from "react-icons/lu";
interface TemplatesCategories{
  id: number,
  name: string
}
export default function TemplatesShowcaseBento() {
  return (
    <div className='w-full h-full'>
        <div className='w-full mx-auto pt-8 lg:pt-16 relative pb-10'>
            <motion.h1
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, }}
            className='z-20  text-center font-sans font-bold text-3xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3'>Explore 10+ Premium Lokalhost.io Templates</motion.h1>
            <motion.p
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, }}
            className='px-8 lg:px-2 z-20 text-center text-sm lg:text-[17px] font-sans font-medium text-neutral-700 dark:text-neutral-300 lg:w-1/2 mx-auto'>From landing and front pages to powerful dashboards, everything you need to create modern, responsive, and visually stunning web applications - ready to go in no time!</motion.p>
        </div>
        <div className="relative h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-0 lg:gap-0 border-b border-dashed px-px">
          
            <div className="relative h-[340px] w-full border border-dashed overflow-hidden mask-x-from-80% to-100%">
              <div className='space-y-1 pt-5 px-5 lg:px-7'>
                <h1 className='text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200'>Clean, Modern Templates Designed for Real Products</h1>
                <p className='text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2'>Designed around real products and startups, these templates focus on clarity, usability, and layouts that actually ship.</p>
              </div>
              <div className='lg:px-10 px-5 [perspective:800px] [transform-style:preserve-3d]'>
                <motion.div
                  initial={{
                      rotateX: 0,
                      translateZ: "0px",
                      y: 60,
                      opacity: 0
                  }}
                   style={{
                        rotateX: 0,
                        translateZ: "0px",
                        y: 6
                        
                    }}
                    whileInView={{
                        rotateX: 24,
                        translateZ: "0px",
                        y: 6,
                        opacity: 1 ,
                    }}
                   whileHover={{
                      rotateX: 0,
                      translateZ: "0px",
                      y: 0,
                      scale: 1.05,
                      opacity: 1 ,
                   }}

                    transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                    }}
                 className="flex w-full h-full items-start justify-center px-4 pt-5 relative ">
                  <Image width={200} height={200} className="z-10 rounded-sm object-cover w-[200px] absolute left-0 top-18 border " alt="templates" src="http://localhost:3000/templates/hero-block-1-light.webp" />
                  <img  className="border-2 z-20 rounded-sm object-cover w-[380px]" alt="templates" src="/templates/hero-block-4-light.webp" />
                  <Image width={200} height={200} className="z-10 rounded-sm object-cover w-[200px] absolute right-0 top-18 border" alt="templates" src="http://localhost:3000/templates/hero-block-9-light.webp" />
                </motion.div>
              </div>
            </div>


            <div className="lg:row-span-2 relative h-auto w-full border border-dashed grid grid-cols-1 p-2 overflow-hidden gap-5 lg:gap-1">
              <div className='flex justify-end items-start overflow-hidden px-2'>
                  <HeroVideoDialog
                    className="block"
                    animationStyle="top-in-bottom-out"
                    videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                    thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
                    thumbnailAlt="Hero Video"
                  />
              </div>
              <div className='flex justify-end items-center relative overflow-hidden lg:bottom-20'>
                <TemplatesList />
              </div>
              <div className='hidden lg:flex justify-center items-center relative top-8'>
                  <TechEcosystemOrbit />
              </div>
            </div>


            <div className="relative h-[340px] w-full border border-dashed  overflow-hidden">
              <div className='space-y-1 pt-5 px-5 lg:px-7'>
                <h1 className='text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200'>Multiple Delivery FormatsCode Zip, Design + Repository</h1>
                <p className='text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2'>Each template includes a downloadable code ZIP, a full repository, and design assets, making it easy to adapt the project to your workflow.</p>
              </div>
              <div className="flex justify-center items-start w-full h-auto px-3 gap-4 pt-5 px-8">
                    <div className="w-[120px] h-[100px] bg-neutral-100 dark:bg-neutral-800 shadow-sm rounded-sm flex items-center justify-center">
                      <span><GoFileZip className="text-6xl"/></span>
                    </div>
                    <div className="w-[120px] h-[100px] bg-neutral-100 dark:bg-neutral-800 shadow-sm rounded-sm flex items-center justify-center">
                      <span><RxFigmaLogo className="text-6xl"/></span>
                    </div>
                    <div className="w-[120px] h-[100px] bg-neutral-100 dark:bg-neutral-800 shadow-sm rounded-sm flex items-center justify-center">
                      <span><LuCodeXml className="text-6xl"/></span>
                    </div>
              </div>
            </div>

            <div className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t">
              <div className='space-y-1 pt-5 px-5 lg:px-4'>
                <h1 className='text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200'>Customization Support Included. Free customization</h1>
                <p className='text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2'>Customization support is included to help with basic layout, styling, and content adjustments, ensuring the template aligns better with your product requirements and branding, while keeping the structure clean and production-ready.</p>
              </div>
              <div className='flex flex-col gap-2 px-6 pl-10'>
                  <ul className='space-y-2 text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2 list-none mt-3'>
                    <li className='flex gap-1 items-center '><span><LuMessageCircleHeart className='text-lg text-red-300'/></span> Spacing and layout refinements</li>
                    <li className='flex gap-1 items-center '><span><LuMessageCircleHeart className='text-lg text-red-300'/></span> Color and typography adjustments</li>
                    <li className='flex gap-1 items-center '><span><LuMessageCircleHeart className='text-lg text-red-300'/></span> Component-level UI tweaks</li>
                    <li className='flex gap-1 items-center '><span><LuMessageCircleHeart className='text-lg text-red-300'/></span> Content structure and hierarchy updates</li>
                    <li className='flex gap-1 items-center '><span><LuMessageCircleHeart className='text-lg text-red-300'/></span> Minor UX and interaction improvements</li>
                    <li className='flex gap-1 items-center '><span><LuMessageCircleHeart className='text-lg text-red-300'/></span> Responsive layout adjustments</li>
                    <li className='flex gap-1 items-center '><span><LuMessageCircleHeart className='text-lg text-red-300'/></span> Accessibility and usability fixes</li>
                  </ul>
              </div>
            </div>

             <div className="relative h-[340px] w-full border border-dashed">
              <div className='space-y-1 pt-5 px-5 lg:px-4'>
                <h1 className='text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200'>Production Support with Refinements & Deployment Help</h1>
                <p className='text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2'>We provide hands-on support for final UI refinements, production readiness, and deployment-level adjustments, helping ensure your product ships smoothly, performs reliably, and feels polished for real users.</p>
              </div>
              <div>
                <ComponentsMarquee/>
              </div>
            </div>

        </div> 
        <div className='w-full flex items-center justify-center py-10 lg:py-16 border-b border-dashed relative lg:mask-x-from-60% mask-x-from-70% to-100%'>
          <StripedPattern />
          <Link href="/templates" className='z-20 border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium px-10 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>Browse Templates</Link>
        </div>
    </div>
  )
}







import { TbBrandFramerMotion } from "react-icons/tb";
import { PiTerminalFill } from "react-icons/pi";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { SiShadcnui } from 'react-icons/si';
import { TemplatesList, ComponentsMarquee } from '../MicroComponents/templatesScrolling';
import { HeroVideoDialog } from '../../ui/hero-video-dialog';
import Link from 'next/dist/client/link';
function TechEcosystemOrbit() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={30} radius={160}>
          <span className='p-2 rounded-full border shadow-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'><FaReact className='text-3xl'/></span>
          <span className='p-2 rounded-full border shadow-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'><RiNextjsFill className='text-3xl'/></span>
          <span className='p-2 rounded-full border shadow-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'><RiTailwindCssFill className='text-3xl'/></span>
          <span className='p-2 rounded-full border shadow-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'><TbBrandFramerMotion className='text-3xl'/></span>
          <span className='p-2 rounded-full border shadow-sm bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center'><SiShadcnui className='text-3xl'/></span>
      </OrbitingCircles>
        <div className="flex justify-center items-center"><PiTerminalFill className='text-6xl'/></div>
    </div>
  )
}

import React from 'react'
import { motion } from "motion/react"
import { Globe } from "@/components/ui/globe"
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';


function ComponentsBento() {

  
  const featureItems = [
      {
        id: "components",
        title: "Components",
        icon: PiCubeDuotone,
        link_to: "/docs",
        animation: { x: -100, duration: 1 },
      },
      {
        id: "templates",
        title: "Templates",
        icon: RiPagesLine,
        link_to: "templates",
        animation: { x: 100, duration: 0.66 },
      },
      {
        id: "ui-kits",
        title: "UI Kits",
        icon: LuFigma,
        link_to: "designs",
        animation: null, // static (no motion)
      },
      {
        id: "mobile",
        title: "Mobile",
        icon: IoPhonePortraitOutline,
        link_to: "",
        animation: { x: 100, duration: 0.66 },
      },
      {
        id: "auth-kits",
        title: "Auth Kits",
        icon: TbBrandAuth0,
        link_to: "authdocs",
        animation: { x: 100, duration: 1 },
      },
  ];

  return (
    <div className='w-full h-full pt-20'>
      <div className='w-full'>
        <div className='w-full mx-auto pb-8'>
            <motion.h1
            initial={{ opacity: 0, y: 110 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, }}
            style={{ translateZ: 100 }}
             className='text-center font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-3 tracking-tight'>
              Explore 10+ Premium{" "}
              <span className="font-mono text-neutral-500 dark:text-neutral-500">Lokalhost.io</span>{" "}
              Components
             </motion.h1>
            <motion.p
             initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, }}
            style={{ translateZ: 100 }}
             className='text-center text-sm lg:text-[17px] font-sans font-medium text-neutral-500 dark:text-neutral-400 mx-auto lg:w-1/2 px-5 leading-relaxed'>
              Quickly build stunning web interfaces - from landing pages and marketing sites to e-commerce and dashboards with unlimited theme options.
             </motion.p>
        </div>
        <div className="mt-10 border-l relative h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 lg:gap-0 border-b border-r   border-dashed px-px">
          
            <div className="w-full lg:col-span-2 relative h-[340px] border-r border-dashed border-t flex flex-wrap justify-start mask-l-from-80%">
                <div className='pt-7 px-4 lg:pl-14 w-[800px] h-auto'>
                    <h1 className='text-left text-2xl lg:text-3xl font-sans font-bold text-neutral-800 dark:text-neutral-300'>What Lokalhost.io is?</h1>
                    <p className='text-left pt-3 text-xs lg:text-[15px] lg:pl-2 font-sans font-medium text-neutral-700 dark:text-neutral-400'>A unified ecosystem built for modern product development, covering web and mobile UI, design systems, authentication, motion, and creative assets — all optimized for production use</p>

                    <div className='pt-6 pl-2'>
                      <p className='flex gap-1 text-sm font-sans font-bold text-neutral-800 dark:text-neutral-300'><span className='text-xl'><PiTerminalFill /></span>What lokalhost provide?</p>
                      <div className='pt-8 w-full grid grid-cols-2 lg:grid-cols-5 lg:justify-center justify-between items-center gap-2 lg:gap-3 px-3 py-3'>
                        {featureItems.map((item) => {
                          const Icon = item.icon;

                          const Wrapper = item.animation ? motion.div : "div";

                          return (
                            <Wrapper
                              key={item.id}
                              initial={
                                item.animation
                                  ? { opacity: 0, x: item.animation.x }
                                  : undefined
                              }
                              whileInView={
                                item.animation ? { opacity: 1, x: 0 } : undefined
                              }
                              transition={
                                item.animation
                                  ? { duration: item.animation.duration, ease: "easeInOut" }
                                  : undefined
                              }
                              style={{ translateZ: 100 }}
                              className="h-24 bg-white dark:bg-black border border-dashed rounded-sm shadow-sm flex items-center justify-center"
                            >
                              <Link href={item.link_to} className='cursor-pointer'>
                                <div className="w-full space-y-2">
                                  <p className="text-center text-5xl flex justify-center items-center">
                                    <Icon />
                                  </p>
                                  <h1 className="text-center font-sans font-medium text-xs text-neutral-800 dark:text-neutral-300">
                                    {item.title}
                                  </h1>
                                </div>
                              </Link>
                            </Wrapper>
                          );
                        })}
                      </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 relative w-full h-[340px] border border-dashed mask-x-from-80% mask-x-to-100% px-5">
              <div className='w-full'>
                <div className='px-4 pt-5'>
                  <h1 className='text-left text-2xl lg:text-3xl font-sans font-bold text-neutral-800 dark:text-neutral-300'>Foundational and Functional Components</h1>
                  <p className='text-left pt-2 pl-2 text-[15px] lg:pl-2 font-sans font-medium text-neutral-700 dark:text-neutral-400'>Foundational components built to support real functionality, covering common UI patterns used in everyday application development.</p>
                </div>
                <div className='pt-6'>
                  <ComponentsMarquee/>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t">
              <div className='flex flex-col w-full h-full overflow-hidden gap-3 mask-x-from-80% mask-x-to-100%'>
                <div className='px-4 pt-4 z-30 w-full'>
                  <h1 className='text-left text-xl lg:text-2xl font-sans font-bold text-neutral-800 dark:text-neutral-300'>Built for Production, Ready to ship</h1>
                  <p className='text-left text-xs lg:text-sm lg:pl-2 font-sans font-medium text-neutral-700 dark:text-neutral-400'>Built with real-world standards, ready to ship without extra work.</p>
                  <div className=' w-full flex justify-end gap-2 lg:px-5 pt-10 pb-5 '>
                    <button className='text-xs flex gap-1 items-center justify-center border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative bottom-2 cursor-pointer font-sans font-medium px-5 py-1 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>Explore components</button>
                    <button className='text-xs flex gap-1 items-center justify-center border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative bottom-2 cursor-pointer font-sans font-medium px-5 py-1 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>Read Docs</button>
                  </div>
                </div>
                <div className='relative bottom-14 flex justify-center items-center'>
                  <Globe/>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden h-[340px] w-full border-r border-dashed border-t px-4 spacey-4 pt-4">
              <div className='space-y-2'>
                <h1 className='text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200'>CLI Install Support</h1>
                <p className='text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2'>Easily install compotemplates, and blocks via CLI — powered by Shadcn registry for seamless integration.</p>
              </div>
              <div className='pt-3'>
                <TerminalDemo />  
              </div>
            </div>

            <div className="col-span-2 relative overflow-hidden h-[340px] w-full border-dashed border-t px-4 spacey-4 pt-4">
              <div className='space-y-2'>
                <h1 className='text-left font-sans text-xl lg:text-2xl font-bold text-neutral-800 dark:text-neutral-200'>Explore Bento Grids, Dashboards, Headers, Landings...</h1>
                <p className='text-left font-sans font-medium text-sm text-neutral-600 dark:text-neutral-400 lg:px-2'>Build faster with production-ready layouts and components designed for real-world applications. From flexible bento grids to scalable dashboards, responsive headers, and high-converting landing pages—everything is crafted to ship without rework.</p>
              </div>
              <div className='flex justify-center items-end relative px-4 mask-x-from-60% to-100%'>
                <Image width={200} height={200} className="border z-20 rounded-sm object-cover w-[380px] " alt="templates" src="/templates/components1.png" />
                <Image width={200} height={200} className="border z-20 rounded-sm object-cover w-[380px] " alt="templates" src="/templates/components5.png" />
                <Image width={200} height={200} className="border z-20 rounded-sm object-cover w-[380px] " alt="templates" src="/templates/components2.png" />
                <Image width={200} height={200} className="border z-20 rounded-sm object-cover w-[380px] " alt="templates" src="/templates/components4.png" />
                <Image width={200} height={200} className="border z-20 rounded-sm object-cover w-[380px] " alt="templates" src="/templates/components3.png" />

              </div>
            </div>
        </div> 
      </div>
      <div className='w-full flex items-center justify-center py-10 lg:py-16 border-b border-dashed relative lg:mask-x-from-60% mask-x-from-70% to-100%'>
        <StripedPattern />
        <Link href="/docs" className='z-20 border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium px-10 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]'>Explore Components</Link>
      </div>
    </div>
  )
}

export default ComponentsBento
import { IoPhonePortraitOutline } from "react-icons/io5";
import { TbBrandAuth0 } from "react-icons/tb";
import { LuFigma } from "react-icons/lu";
import { TbBackground } from "react-icons/tb";
import { PiCubeDuotone } from "react-icons/pi";
import { RiPagesLine } from "react-icons/ri";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";

import { OrbitingCircles } from '@/components/ui/orbiting-circles';
export function OrbitingCirclesDemo() {
  return (
    <div className="absolute top-16 left-28 flex h-full  w-full flex-col items-center justify-center">
      <OrbitingCircles iconSize={30} radius={140}>
        <IoPhonePortraitOutline className='text-3xl'/>
        <TbBrandAuth0 className='text-3xl'/>
        <LuFigma className='text-3xl'/>
        <PiCubeDuotone className='text-3xl'/>
        <TbBackground className='text-3xl'/>

          

      </OrbitingCircles>
        <OrbitingCircles iconSize={30} radius={70} className="">
                <FaReact className='text-xl'/>
                <RiNextjsFill className='text-xl'/>
                <RiTailwindCssFill className='text-xl'/>
                <TbBrandFramerMotion className='text-xl'/>
                <SiShadcnui className='text-xl'/>
            </OrbitingCircles>
        <div className="flex justify-center items-center"><PiTerminalFill className='text-3xl'/></div>
    </div>
  )
}



import { forwardRef, useRef } from "react"
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { SiReact } from "react-icons/si";
import { SiNextdotjs } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { TbBrandFramerMotion } from "react-icons/tb";
import { SiTypescript } from "react-icons/si";
import { SiShadcnui } from "react-icons/si";
import { PiTerminalFill } from "react-icons/pi";
import { ComponentsMarquee } from '../MicroComponents/templatesScrolling';
import { TerminalDemo } from './FeaturesBento';
import { StripedPattern } from '../../magicui/striped-pattern';
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  )
})
Circle.displayName = "Circle"
export function AnimatedBeamDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex h-[100px] w-full items-center justify-center px-3 pb-5"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <SiReact className='text-2xl'/>
          </Circle>
          <Circle ref={div5Ref}>
          <TbBrandFramerMotion className='text-2xl'/>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <SiNextdotjs className='text-2xl'/>
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <PiTerminalFill className='text-3xl'/>
          </Circle>
          <Circle ref={div6Ref}>
            
            <RiTailwindCssFill className='text-2xl'/>
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <SiTypescript className='text-2xl'/>
          </Circle>
          <Circle ref={div7Ref}>
            <SiShadcnui className='text-2xl'/>
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  )
}




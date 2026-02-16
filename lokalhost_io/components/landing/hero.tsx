"use client";

import type React from "react";
import { motion } from "motion/react"
import AnnoncementBadge from "./AnnoncementBadge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {  useTheme } from "next-themes"
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { ContainerTextFlip } from "./animate_hero_tags"
import TemplatesShowcaseBento from "./LandingComponents/TemplatesShowcaseBento";
import { IoMdSend } from "react-icons/io";
import TailoredSignal from "./MicroComponents/TailoredSignal";
import { MarqueeTemplates } from "./MicroComponents/templatesScrolling";
import FeaturesBento from "./LandingComponents/FeaturesBento";
import ComponentsBento from "./LandingComponents/ComponentsBento"
import DesignsBento from "./LandingComponents/DesignsBento"
import nProgress from "nprogress";
import ComponentsShowcase, { TemplatesBlockList } from "./LandingComponents/ComponentsShowcase";
import LandingPagesShowcase from "./LandingComponents/LandingPagesShowcase";
import MobileAppsAndUIBlocks from "./LandingComponents/MobileAppaAndUIBlocks"; 
interface IServiceType {
    button_name: string,
    button_link: string
}
interface IHeroSectionSevice {
    id: string | number
    sercice_name: string,
    service_disc: string,
    service_link: string,
    service_light_image: string,
    service_dark_image: string,
    service_buttons: IServiceType[]
}
export interface ITemplate {
  image: string;
  to?: string;
}



export function HeroSection(
   { heroServiceContent }: { heroServiceContent: IHeroSectionSevice[] },
) {

  const { theme } = useTheme();


   const handleLinkClick = () => {
      nProgress.start()
    }

  return (
    <div className="w-full container max-w-[1580px] h-auto mx-auto  py-8 lg:py-16 flex flex-col items-center justify-center text-center gap-6">
      <motion.span
       initial={{opacity: 0 , y: -100}}
       animate={{opacity: 1 , y: 0}}
       transition={{ delay: 0.2, duration: 0.98 , ease: 'easeInOut'}}
       className="absolute top-0 left-0 lg:-top-28 lg:left-40 w-[60px] lg:w-[170px] h-[300px] lg:h-[600px] bg-neutral-300 dark:bg-neutral-800 blur-2xl rounded-b-full -rotate-45 "></motion.span>
       
      <div className="w-full h-auto px-0 lg:px-4 py-6">
        <AnnoncementBadge aboutBadge={"Templates & Marketing UI Blocks, Mobile apps, UI design kits & more"}/>
        <div className="mt-8 text-center flex-col gap-4">
          <h1 className="font-sans font-bold text-2xl lg:text-5xl text-neutral-800 dark:text-neutral-200 pb-2">A Complete Ecosystem for Designing, Building, and Scaling Modern Web & Mobile Applications.</h1>
          <ContainerTextFlip/>
          <p className="px-0 lg:w-2/3 mx-auto py-4 font-sans font-medium text-[16px] text-neutral-600 dark:text-neutral-400 ">A unified ecosystem built for modern product development, covering web and mobile UI, design systems, authentication, motion, and creative assets — all optimized for production use</p>
        </div>

        <div className="flex mx-auto mt-2 mb-2">
          <TailoredSignal />
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-8">
          <motion.button
            transition={{ duration: 0.28 , ease: "easeInOut"}}
            whileHover={{ y: -3 }}
            whileTap={{ y: -4 }}
            onClick={handleLinkClick}
          className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 dark:border-neutral-400 relative overflow-hidden cursor-pointer font-sans font-medium px-10 py-2 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center gap-2"><span><IoMdSend className="text-lg text-neutral-700"/></span>Explore Templets</motion.button>
          <motion.button
              transition={{ duration: 0.28 , ease: "easeInOut"}}
              whileHover={{ y: -3}}
              whileTap={{ y: -4 }}
              onClick={handleLinkClick}
          className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium px-10 py-2 rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">Components Documentation
          </motion.button>
          
        </div>
      </div>
{/*  */}
        <div className="relative h-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t gap-4 md:gap-0 lg:gap-0 border-b border-dashed px-px">

          {/* corners design */}
          <span className="absolute h-[160px] w-[160px] rounded-full border border-dashed -top-20 -left-20"></span>
          <span className="absolute h-[160px] w-[160px] rounded-full border border-dashed -top-20 -right-20"></span>
          {
            heroServiceContent.map((service) => (
              <Link key={service.id} href={service.service_link} prefetch={true}  onClick={handleLinkClick}>
              <div  className="cursor-pointer group relative h-[400px] bg-neutral-100 dark:bg-neutral-950 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex items-center justify-center overflow-hidden w-full border border-dashed">
                <div className="relative group-hover:scale-110 transition duration-400">
                  <Image 
                    width={400}
                    height={650}
                    className="relative scale-105"
                    src={theme === 'dark' ? `${service.service_dark_image}` : `${service.service_light_image}`}
                    alt=""
                  />
                </div>
                <div 
                className={cn(
                  "absolute bottom-0 px-5 flex flex-col gap-2 py-3 bg-neutral-50 dark:bg-neutral-950 border-t border-dashed",
                  
                )}
                >
                  <div className="">
                    <h1 className="font-sans font-medium text-[17px] text-left text-neutral-700 dark:text-neutral-200">{service.sercice_name}</h1>
                    <p className="text-[13px] font-sans font-medium text-neutral-500 dark:text-neutral-300 text-left">{service.service_disc}</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    <motion.button
                     transition={{ duration: 0.38 , ease: "easeInOut"}}
                     whileHover={{ y: -2 }}
                     whileTap={{ y: -4 }}
                     className="cursor-pointer border-t border-l border-r border-neutral-800 rounded-sm py-px whitespace-nowrap px-4 font-sans font-medium text-sm text-neutral-200 dark:text-neutral-200 bg-gradient-to-t from-[#262626] to-[#525252] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">{service.service_buttons[0].button_name}</motion.button>
                    <motion.button 
                      transition={{ duration: 0.38 , ease: "easeInOut"}}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: -4 }}
                      className="cursor-pointer flex gap-1 items-center justify-center py-px w-full font-sans font-medium text-sm text-neutral-700 dark:text-neutral-200">{service.service_buttons[1].button_name} <span className="text-xs text-neutral-700 dark:text-neutral-200"><HiOutlineExternalLink /></span></motion.button>
                  </div>
                </div>
              </div>
              </Link>
            ))
          }
        </div> 
        
        <div className="w-full h-auto mt-10 mb-10">
          <MarqueeTemplates/>
        </div>
        <div className="w-full container max-w-[1580px]">
          <ComponentsShowcase/>
        </div>
        <div className="w-full container max-w-[1580px]">
          <TemplatesBlockList/>
        </div>
        <div>
          <LandingPagesShowcase />
        </div>
        <div>
          <MobileAppsAndUIBlocks />
        </div>
        <div className="mt-16 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <FeaturesBento />
        </div>
        <div className="mt-16 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <ComponentsBento/>
        </div>
        <div className="mt-16 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <TemplatesShowcaseBento/>
        </div>
        <div className="mt-16 relative overflow-hidden w-full h-auto border-t border-l border-r border-dashed">
          <DesignsBento />
        </div>
    </div>
  );
}
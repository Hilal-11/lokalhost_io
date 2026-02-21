import React from 'react'
import { PricingFAQ } from './FAQ';
import { StripedPattern } from "@/components/magicui/striped-pattern"
import CTA from '@/components/landing/CTA';
import WebComponents from './PricingModels/WebComponents';
export const dynamic = 'force-static';


function Pricing() {
  return (
    <div className='bg-[#f4f4f5] dark:bg-neutral-950 h-full'>
      <div className='pt-10 h-auto pricing_breakpoint container mx-auto px-5 lg:pt-28 pb-20'>
        <div className="flex flex-col items-center gap-6 pb-10 py-10">
          <div className="mx-auto border-t border-dashed border-b py-1 w-38 text-center relative border-neutral-300 dark:border-neutral-800">
            <span className="h-14 absolute left-4 -top-4 border border-dashed border-neutral-300 dark:border-neutral-800"></span>
            <p className="text-sm font-sans font-bold text-neutral-700 dark:text-neutral-300">PRICING PLAN</p>  
            <span className="h-14 absolute right-4 -top-4 border border-dashed  border-neutral-300 dark:border-neutral-800"></span>          
          </div>
          <div className="flex flex-col items-center px-6 lg:px-28">
            <h1 className="lg:text-6xl md:text-5xl text-2xl font-sans font-bold text-center space-y-4">Simple Pricing</h1>
            <p className='font-sans font-medium text-[16px] text-center'>From custom components to complete website tailored to your needs. Simple pricing, no hidden fees.</p>
          </div>
        </div>

        <div id="web-components">
          <WebComponents />
        </div>
        <div>
          
        </div>

      </div>
        <div className="relative w-[100%] h-auto border-t border-b border-dashed border-neutral-300 dark:border-neutral-800 z-10">
          <StripedPattern direction="left" className="mask-l-from-70% mask-l-to-100% mask-r-from-70% mask-r-to-100%" />
        <div className='relative container h-[100%] !important border-l border-r border-dashed z-50 !important bg-neutral-100 dark:bg-neutral-950 pb-20'>
          <PricingFAQ />
        </div>
    </div>
    <div className='pt-20'>
      <CTA />
    </div>
    <div className='pt-20'>
    </div>
    </div>
  )
}


export default Pricing


import React from 'react'
import { servicesShowCaseConfig } from '@/config/servicesConfig'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { StripedPattern } from '@/components/magicui/striped-pattern'
function TemplatesShowcase() {
  return (
    <div className='flex flex-col '>
    <div className='py-0 w-full flex flex-nowrap gap-4 overflow-x-hidden scrollbar-hide snap-x snap-mandatory scroll-smooth animate-scroll-left'>

    {
    servicesShowCaseConfig[1].templates_list_1?.map((template) => (
      <div key={template?.id} className='snap-center shimmer shrink-0 w-[180px] lg:w-[250px] bg-neutral-50 dark:bg-neutral-900 h-[120px] lg:h-[250px] rounded-sm shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-hidden'>
        <div  className={`group cursor-pointer flex justify-center items-center text-xl font-medium font-sans w-full h-auto lg:h-auto shadow-sm border rounded-sm bg-neutral-100 dark:bg-neutral-800 relative`}>
            <Link href={template.template_url} target="_blank">
            <div className='w-full h-full gap-1 grid grid-cols-2'>
                <Image className="col-span-2 rounded-sm group-hover:scale-105 transition duration-300 group-hover:blur-[4px] w-full h-full object-center" src={template.template_image} alt="Template Image" width={400} height={300} />
                <Image className="col-span-2 rounded-sm group-hover:scale-105 transition duration-300 group-hover:blur-[4px] w-full h-full object-center" src={template.template_image} alt="Template Image" width={400} height={300} />
                <Image className="rounded-sm group-hover:scale-105 transition duration-300 group-hover:blur-[4px] w-full h-full object-center" src={template.template_image} alt="Template Image" width={400} height={300} />
            </div>
            <Link href={template.template_url} target="_blank" className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 overflow-hidden cursor-pointer px-5 py-2 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] hidden group-hover:flex z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-neutral-800 font-medium font-sans gap-2 items-center justify-center text-xs whitespace-wrap">{template.template_name}<span className="text-sm fonr-sans font-medium"><HiOutlineExternalLink/></span></Link>
            </Link>
        </div>
        
      </div>
      ))
    }
    </div>
    <div className='py-4 w-full flex flex-nowrap gap-4 overflow-x-hidden scrollbar-hide snap-x snap-mandatory scroll-smooth relative animate-scroll-right'>
    {
    servicesShowCaseConfig[1].templates_list_2?.map((template) => (
      <div key={template?.id} className='snap-center shrink-0 w-[180px] lg:w-[250px] bg-neutral-50 dark:bg-neutral-900 h-[120px] lg:h-[250px] rounded-sm shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] overflow-hidden'>
        <div className={`group cursor-pointer flex justify-center items-center text-xl font-medium font-sans w-full h-auto lg:h-auto shadow-sm border rounded-sm bg-neutral-100 dark:bg-neutral-800 relative`}>
            <Link href={template.template_url} target="_blank">
            <div className='w-full h-full gap-1 grid grid-cols-2 overflow-hidden'>
                <Image className="col-span-2 rounded-sm group-hover:scale-105 transition duration-300 group-hover:blur-[4px] w-full h-full object-center" src={template.template_image} alt="Template Image" width={400} height={300} />
                <Image className="col-span-2 rounded-sm group-hover:scale-105 transition duration-300 group-hover:blur-[4px] w-full h-full object-center" src={template.template_image} alt="Template Image" width={400} height={300} />
                <Image className="rounded-sm group-hover:scale-105 transition duration-300 group-hover:blur-[4px] w-full h-full object-center" src={template.template_image} alt="Template Image" width={400} height={300} />
            </div>

            <Link href={template.template_url} target="_blank" className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 overflow-hidden cursor-pointer px-5 py-2 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] hidden group-hover:flex z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-neutral-800 font-medium font-sans gap-2 items-center justify-center text-xs whitespace-wrap">{template.template_name}<span className="text-sm fonr-sans font-medium"><HiOutlineExternalLink/></span></Link>
            </Link>
        </div>
        
      </div>
      ))
    }
      <div className='relative snap-center shrink-0 w-[180px] lg:w-[250px] bg-neutral-50 dark:bg-neutral-900 h-[120px] lg:h-[250px] rounded-sm shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        <StripedPattern/>
        <Link href={"/templates"} className="border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 overflow-hidden cursor-pointer px-4 py-2 rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  text-neutral-800 font-medium font-sans gap-2 items-center justify-center text-xs whitespace-nowrap">Explore Templates<span className="text-sm fonr-sans font-medium"><HiOutlineExternalLink/></span></Link>
      </div>
    </div>
    
  </div>
  )
}

export default TemplatesShowcase

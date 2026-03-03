"use client"
import { useRef } from "react"
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoMdSearch } from "react-icons/io";
import TemplateShimmerLoadingUI from '@/components/templateShimmerLoadingUI';
import { LuFigma } from "react-icons/lu";
import AnnoncementBadge from "@/components/landing/AnnoncementBadge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import react from "@/public/tech/react.jpeg"
import next from "@/public/tech/next.jpeg"
import tailwindX from "@/public/tech/tailwindX.webp"
import shadcn from "@/public/tech/shadcn.jpeg"
import ts from "@/public/tech/ts.jpeg"
import js from "@/public/tech/js.jpeg"
import { HiArrowNarrowRight } from "react-icons/hi";
import HoverExternalIcon from "@/components/landing/MicroComponents/HoverExternalIcon";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { motion, AnimatePresence } from "motion/react"
import { useQuery } from '@tanstack/react-query'; // ← Keep this as useQuery
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { IoSearchSharp } from 'react-icons/io5';
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RxCross2 } from 'react-icons/rx'
import { LuLayoutTemplate } from 'react-icons/lu'

import { SortTemplates } from "./sortTemplates";
import CTA from "@/components/landing/CTA";
const techStackImages = [
    react,
    next,
    tailwindX,
    shadcn,
    ts,
    js,
]
function Templates(){
    const convex = useConvex();
    
    const { data: templates, isLoading, isFetching, dataUpdatedAt } = useQuery({
        queryKey: ['templates'] as const,
        queryFn: async () => {
            const result = await convex.query(api.getTemplates.getTemplates);
            return result;
        },
    });
    const [searchQuery, setSearchQuery]     = useState('')
    const [filteredItems, setFilteredItems] = useState(templates ?? [])
    const [open, setOpen]                   = useState(false)
    const [focused, setFocused]             = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [activeFilter, setActiveFilter] = useState<'All' | 'Free' | 'Premium'>('All');


    const filteredTemplates = templates?.filter((template) => {
        if (activeFilter === 'All') return true
        if (activeFilter === 'Free') return template?.projectPrize === 'Free'
        if (activeFilter === 'Premium') return template?.projectPrize !== 'Free'
        return true
    })  
     
    useEffect(() => {
        if (!templates) return
        const q = searchQuery.toLowerCase().trim()
        setFilteredItems(q ? templates.filter(({ projectName }) => projectName.toLowerCase().includes(q)) : templates)
    }, [searchQuery, templates])

    useEffect(() => {
        if (!open) return
        setTimeout(() => inputRef.current?.focus(), 80)
        setSearchQuery('')
        if (templates) setFilteredItems(templates)
    }, [open, templates])

    const isFiltering  = searchQuery.length > 0
    const noResults    = isFiltering && filteredItems.length === 0
    const displayItems = filteredItems



    const ref = useRef<HTMLDivElement>(null);
    const onMouseDown = (e: React.MouseEvent) => {
        const slider = ref.current;
        if (!slider) return;

        const startX = e.pageX - slider.offsetLeft;
        const scrollLeft = slider.scrollLeft;

        const onMouseMove = (moveEvent: MouseEvent) => {
        const x = moveEvent.pageX - slider.offsetLeft;
        const walk = x - startX;
        slider.scrollLeft = scrollLeft - walk;
        };

        const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    

    const router = useRouter();
    return (
        <div className="relative w-full container max-w-[1580px]">
            <div className="container pt-14 w-full h-auto">
                <AnnoncementBadge aboutBadge={"20 + Premium Templates and Designs by lokalhost.io"}/>
                <div className="lg:pt-16 pt-8  w-full h-auto mx-auto">
                    <div className="w-full mx-auto text-center lg:px-14">
                        <h1 className="font-sans font-bold text-3xl lg:text-5xl text-neutral-800 dark:text-neutral-200">A high-quality collection of templates for React, Next.js, and modern web stacks, designed to ship faster.</h1>
                        <p className="px-0 lg:w-2/3 mx-auto py-4 font-sans font-medium text-md text-neutral-600 dark:text-neutral-400">Discover a curated library of responsive templates and reusable components built for React, Next.js, and modern web technologies. Whether you're a freelancer, startup, or enterprise team.</p>
                    </div>
                </div>
                 <div className="flex flex-wrap justify-center items-center pt-3 pb-5 gap-3 lg:gap-6">
                    <button className="border-1 border-orange-400 cursor-pointer px-8 py-[9px] rounded-lg text-sm font-sans font-medium text-neutral-800 bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7] shadow-sm flex items-center justify-center gap-2"><span><LuFigma /></span> Get Full Design Access</button>
                    <button className="px-8 py-[10px] cursor-pointer border-t border-l border-r border-neutral-800 rounded-lg whitespace-nowrap font-sans font-medium text-sm text-neutral-200 dark:text-neutral-200 bg-gradient-to-t from-[#262626] to-[#525252] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">Get All Premium Templates</button>
                </div>
            </div>  
            <section className="h-auto pt-4 mx-auto border border-dashed border-neutral-300 dark:border-neutral-700 mt-10 mb-10">
                <div className="flex flex-wrap justify-between gap-2 items-center w-full pt-0 pb-4 border-b border-dashed border-neutral-300 dark:border-neutral-700 px-5">
                    <SortTemplates />
                    <div className="flex lg:flex-nowrap flex-wrap items-center gap-1">
                    <Dialog>
                        <DialogTrigger asChild className='flex items-center justify-center'>
                            <InputGroup className="flex items-center justify-center w-[34px] lg:w-full overflow-hidden">
                                <InputGroupInput placeholder="Search Template:- " className="flex lg:flex md:flex"/>
                                <InputGroupButton variant="secondary" className="relative right-3 lg:right-0 bg-transparent flex items-center justify-center"><IoMdSearch className="lg:text-lg text-xl mx-auto mr-px"/></InputGroupButton>
                            </InputGroup>
                        </DialogTrigger>

                    <DialogContent className="p-0 gap-0 lg:w-[520px] max-h-[480px] overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl bg-white dark:bg-neutral-950">

                        {/* ── Sticky search bar ── */}
                        <div className={`sticky top-0 z-20 w-full bg-white dark:bg-neutral-950 border-b border-neutral-100 dark:border-neutral-800 transition-shadow duration-200 ${focused ? 'shadow-sm' : ''}`}>
                        <div className="flex items-center gap-2 px-3 h-12">
                            <motion.span
                            animate={focused ? { scale: 1.1, color: "#525252" } : { scale: 1, color: "#a3a3a3" }}
                            transition={{ duration: 0.2 }}
                            >
                            <IoSearchSharp className="text-lg flex-shrink-0" />
                            </motion.span>

                            <input
                            ref={inputRef}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            type="text"
                            placeholder="Search templates by name…"
                            className="flex-1 h-full outline-none text-sm font-sans font-medium bg-transparent text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                            />

                            <AnimatePresence>
                            {searchQuery.length > 0 && (
                                <motion.button
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.7 }}
                                transition={{ duration: 0.15 }}
                                onClick={() => setSearchQuery('')}
                                className="flex items-center justify-center w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors duration-150 flex-shrink-0"
                                >
                                <RxCross2 className="text-[10px] text-neutral-600 dark:text-neutral-300" />
                                </motion.button>
                            )}
                            </AnimatePresence>

                            <kbd className="hidden sm:flex items-center justify-center h-5 px-1.5 rounded border border-neutral-200 dark:border-neutral-700 text-[10px] font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900 flex-shrink-0">
                            ESC
                            </kbd>
                        </div>

                        {/* animated focus underline */}
                        <motion.div
                            className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-neutral-400 dark:via-neutral-500 to-transparent"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={focused ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ originX: 0.5 }}
                        />
                        </div>

                        {/* ── Results ── */}
                        <div className="overflow-y-auto max-h-[380px] px-2 py-2 scroll-smooth">

                        {/* label */}
                        <p className="text-[11px] font-mono font-semibold text-neutral-400 dark:text-neutral-600 px-2 pt-1 pb-2 uppercase tracking-wider">
                            {isFiltering
                            ? `${filteredItems.length} template${filteredItems.length !== 1 ? 's' : ''} for "${searchQuery}"`
                            : `All Templates — ${templates?.length ?? 0}`}
                        </p>

                        <AnimatePresence mode="wait">
                            {/* no results */}
                            {noResults ? (
                            <motion.div
                                key="no-results"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center justify-center py-12 gap-3"
                            >
                                <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl text-neutral-300 dark:text-neutral-700"
                                >
                                <LuLayoutTemplate />
                                </motion.div>
                                <p className="text-sm font-sans font-medium text-neutral-400 dark:text-neutral-600">
                                No templates matching{" "}
                                <span className="text-neutral-600 dark:text-neutral-400">"{searchQuery}"</span>
                                </p>
                            </motion.div>
                            ) : (
                            <motion.div key="results" className="flex flex-col gap-0.5">
                                {displayItems.map(({ id, projectName }, i) => (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.18, delay: i * 0.025 }}
                                >
                                    <Link
                                    prefetch={true}
                                    href={`#${id}`}
                                    onClick={() => setOpen(false)}
                                    className="group/item flex items-center gap-3 w-full px-2 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/80 transition-colors duration-150 relative overflow-hidden"
                                    >
                                    {/* hover sweep */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-neutral-100/80 dark:from-neutral-800/80 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 rounded-lg" />

                                    {/* icon box */}
                                    <span className="relative z-10 flex items-center justify-center w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 group-hover/item:border-neutral-300 dark:group-hover/item:border-neutral-600 transition-colors duration-150 flex-shrink-0">
                                        <RiCheckboxBlankCircleLine className="text-xs" />
                                    </span>

                                    {/* name + highlight */}
                                    <span className="relative z-10 text-sm font-sans font-medium text-neutral-700 dark:text-neutral-300 group-hover/item:text-neutral-900 dark:group-hover/item:text-neutral-100 transition-colors duration-150 flex-1 truncate">
                                        {isFiltering ? highlightMatch(projectName, searchQuery) : projectName}
                                    </span>

                                    {/* anchor badge */}
                                    <span className="relative z-10 text-[10px] font-mono text-neutral-300 dark:text-neutral-700 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 flex-shrink-0">
                                        #{id}
                                    </span>

                                    {/* arrow */}
                                    <span className="relative z-10 text-xs text-neutral-400 dark:text-neutral-600 opacity-0 group-hover/item:opacity-100 -translate-x-1 group-hover/item:translate-x-0 transition-all duration-150 flex-shrink-0">
                                        →
                                    </span>
                                    </Link>
                                </motion.div>
                                ))}
                            </motion.div>
                            )}
                        </AnimatePresence>
                        </div>

                        {/* ── Footer ── */}
                        <div className="sticky bottom-0 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2 flex items-center gap-3">
                        {[
                            { key: '↑↓', label: 'navigate' },
                            { key: '↵',  label: 'jump to' },
                            { key: 'ESC', label: 'close' },
                        ].map(({ key, label }) => (
                            <span key={key} className="flex items-center gap-1 text-[10px] font-sans text-neutral-400 dark:text-neutral-600">
                            <kbd className="px-1 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 font-mono text-[10px]">
                                {key}
                            </kbd>
                            {label}
                            </span>
                        ))}
                        <span className="ml-auto text-[10px] font-mono text-neutral-300 dark:text-neutral-700">
                            {templates?.length ?? 0} templates
                        </span>
                        </div>
                    </DialogContent>
                    </Dialog>
                    <ButtonGroup>
                        <Button 
                            variant={activeFilter === 'All' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('All')}
                            className={activeFilter === 'All' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            All
                        </Button>
                        <Button 
                            variant={activeFilter === 'Free' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Free')}
                            className={activeFilter === 'Free' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Free
                        </Button>
                        <Button 
                            variant={activeFilter === 'Premium' ? 'default' : 'outline'}
                            onClick={() => setActiveFilter('Premium')}
                            className={activeFilter === 'Premium' ? 'bg-gradient-to-t from-[#262626] to-[#525252] text-primary-foreground' : ''}
                        >
                            Premium
                        </Button>
                    </ButtonGroup>
                    </div>
                </div>     
                { !templates ? (<TemplateShimmerLoadingUI/>) : (
                    filteredTemplates?.map((templete) => (
                        <div id={`${templete.id}`} key={templete.id} className="flex flex-col gap-4 w-full">
                        <div className="w-full h-auto flex flex-wrap border-t border-dashed border-neutral-300 dark:border-neutral-700 r">
                            <div className="xl:w-[30%] lg:w-[40%] md:w-[50%] px-6 border-r border-dashed border-neutral-300 dark:border-neutral-700 py-5 pb-5">
                                <div className="flex flex-col gap-3">
                                    <h1 className="font-sans font-bold text-3xl text-neutral-800 dark:text-neutral-200">{templete.projectName}</h1>
                                    <p className="pt-2 text-sm font-sans font-medium text-neutral-600 dark:text-neutral-400">{templete.projectDescription}</p>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button className="px-3 border border-dashed rounded-sm font-sans font-medium text-sm text-neutral-800 dark:text-neutral-200">
                                        {new Date(templete?._creationTime).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </button>
                                    <button className="px-4 py-2 cursor-pointer border-t border-l border-r border-neutral-800 rounded-lg whitespace-nowrap font-sans font-medium text-xs text-neutral-200 dark:text-neutral-200 bg-gradient-to-t from-[#262626] to-[#525252] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">{templete.projectPrize === "free" ? `Free` : `${templete.projectPrize !== "Free"? `$${templete.projectPrize}` : "Free"} `}</button>
                                </div>
                                <div className='pt-3 flex flex-wrap py-0 poppins-medium text-neutral-600 gap-1'>
                                                        {techStackImages.map((image, index) => (
                                                            <div key={index} className='rounded-sm p-[3px] cursor-pointer bg-neutral-50 dark:bg-neutral-800 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex items-center justify-center'>
                                                                <Image
                                                                    key={index}
                                                                    src={image}
                                                                    width={24}
                                                                    height={24}
                                                                    alt='Tech Image'
                                                                    className='rounded-sm '
                                                                />
                                                            </div>
                                                        ))}
                                </div>
                                <div className="flex w-full justify-start items-center pt-4">
                                    <button onClick={(e) => {
  e.stopPropagation();
  router.push(`/templates/template/${templete._id}`);
}} className="px-8 py-[6px] cursor-pointer border-t border-l border-r border-neutral-800 rounded-lg whitespace-nowrap font-sans font-medium text-sm text-neutral-200 dark:text-neutral-200 bg-gradient-to-t from-[#262626] to-[#525252] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex gap-2 items-center">View Template <span className="text-lg"><HiArrowNarrowRight /></span> </button>
                                </div>
                                
                            </div>
                            <div onClick={(e) => {
  e.stopPropagation();
  router.push(`/templates/template/${templete._id}`);
}} className="cursor-pointer xl:w-[70%] lg:w-[60%] md:w-[50%] px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 mask-l-from-80% to-100% p-14 relative group transition duration-300">
                                <div className="z-40 hidden absolute top-1 right-1 group-hover:block transition duration-300">
                                    <HoverExternalIcon />
                                </div>                        
                                                        
                                <div className="border rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center">
                                  {templete.projectImages?.[0] && (
                                     <Image 
                                         src={templete.projectImages[0]}
                                         alt="not load yet"
                                         width={400}
                                         height={500}
                                         className="object-cover h-full rounded-t-md w-full"
                                     />
                                     
                                 )}
                                </div>
                                <div className="border rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center">
                                    {templete.projectImages?.[1] && (
                                     
                                     <Image 
                                         src={templete.projectImages[1]}
                                         alt="not load yet"
                                         width={400}
                                         height={500}
                                         className="object-cover h-full rounded-t-md w-fulld"
                                     />
                                     
                                 )}
                                </div>
                                <div className="border rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center">
                                    {templete.projectImages?.[2] && (
                                     
                                     <Image 
                                         src={templete.projectImages[2]}
                                         alt="not load yet"
                                         width={400}
                                         height={500}
                                         className="object-cover h-full rounded-t-md w-fulld"
                                     />
                                     
                                 )}
                                </div>

                            </div>
                        </div>
                    </div>
                    ))
                    
                )}
            </section>
            <CTA />
        </div>
    )
}

export default Templates;





function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-neutral-900 dark:text-white font-bold underline decoration-neutral-400 dark:decoration-neutral-500 underline-offset-2">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}


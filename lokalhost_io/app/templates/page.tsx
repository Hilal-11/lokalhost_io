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

import { useQuery as useConvexQuery } from 'convex/react'; // ← Rename this
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
    const [activeFilter, setActiveFilter] = useState<'All' | 'Free' | 'Premium'>('All');
    const filteredTemplates = templates?.filter((template) => {
        if (activeFilter === 'All') return true
        if (activeFilter === 'Free') return template?.projectPrize === 'Free'
        if (activeFilter === 'Premium') return template?.projectPrize !== 'Free'
        return true
    })  
     
    const [searchQuery , setSearchQuery] = useState('');
    const [filteredItem , setFilteredItem] = useState(templates);
    const handleSearching = (event:any) => {
        setSearchQuery(event.target.value)
    }
  
      useEffect(() => {
          const filtering = templates?.filter((item:any) => item.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
          setFilteredItem(filtering);
      }, [])




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
            <section className="h-auto pt-4 mx-auto border border-dashed border-neutral-300 dark:border-neutral-700 mt-10">
                <div className="flex justify-between gap-2 items-center w-full pt-0 pb-4 border-b border-dashed border-neutral-300 dark:border-neutral-700 px-5">
                    <div>
                        <SortTemplates />
                    </div>
                    <div className="flex items-center gap-1">
                    <Dialog>
                        <DialogTrigger asChild className='flex items-center justify-center'>
                            <InputGroup className="flex items-center justify-center">
                                <InputGroupInput placeholder="Search Template:- " className="flex lg:flex md:flex"/>
                                <InputGroupButton variant="secondary" className="bg-transparent flex items-center justify-center"><IoMdSearch className="text-lg mx-auto mr-px"/></InputGroupButton>
                            </InputGroup>
                        </DialogTrigger>
                        <DialogContent className="lg:w-[500px] h-[400px] overflow-y-scroll pb-4">
                            {/* Header search box */}
                            <div className="w-full h-[48px] fixed top-0 border-b rounded-5-lg p-1 flex justify-center items-center pl-2  ">
                                <span><IoSearchSharp className="text-lg text-neutral-400 dark:text-neutral-700"/></span>
                                <input className="w-full h-full outline-0 text-sm font-sans font-medium pl-1" onChange={handleSearching} type="text" placeholder="Searching..." />
                                    </div>
                                        <div className="flex flex-col gap-1 w-full h-auto mt-10">
                                            <p className="text-xs fonr-sans text-neutral-600">Templates</p>
                                            {
                                            filteredItem && filteredItem?.length > 0 ? (
                                                <div>
                                                    {
                                                    filteredItem?.map(({id , projectName}) => (
                                                    <div key={id} className="w-full h-[42px] rounded-sm hover:bg-neutral-200 hover:dark:bg-neutral-800 transition duration-300 flex items-center">
                                                        <Link prefetch={true} className="flex gap-3 pl-2 items-center text-sm font-medium" href={`#${id}`}><span className="text-xs"><RiCheckboxBlankCircleLine/></span>{projectName}</Link>
                                                    </div>
                                                    ))
                                                }
                                                </div>
                                            ) : (
                                                <div>
                                                {
                                                    templates?.map(({id , projectName}) => (
                                                    <div key={id} className="w-full h-[42px] rounded-sm hover:bg-neutral-200 hover:dark:bg-neutral-800 transition duration-300 flex items-center">
                                                        <Link prefetch={true} className="flex gap-3 pl-2 items-center text-sm font-medium" href={`#${id}`}><span className="text-xs"><RiCheckboxBlankCircleLine/></span>{projectName}</Link>
                                                    </div>
                                                    ))
                                                }
                                                </div>
                                            )
                                            }
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

        </div>
    )
}

export default Templates;



import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BsListUl } from "react-icons/bs";
import { TbBrandReact } from "react-icons/tb";
import { TbBlocks } from "react-icons/tb";
import { TbBrandNextjs } from "react-icons/tb";
import { TbBrandTailwind } from "react-icons/tb";
import { SiShadcnui } from "react-icons/si";
import { TbBrandJavascript } from "react-icons/tb";
import { TbBrandAstro } from "react-icons/tb";
import { TbBrandDjango } from "react-icons/tb";
export function SortTemplates() {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-56 bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-100">
        <SelectValue className="font-sans font-medium" placeholder="Sort" />
      </SelectTrigger>
      <SelectContent className="">
        <SelectGroup className="">
          <SelectLabel className="font-sans font-medium">Sort</SelectLabel>
          <SelectItem value="All"><span className="text-white dark:text-neutral-200"><BsListUl /></span>All</SelectItem>
          <SelectItem value="ReactJs"><span className="text-white dark:text-neutral-200"><TbBrandReact /></span>ReactJs</SelectItem>
          <SelectItem value="ReactJs + NextJs"><span className="text-white dark:text-neutral-200"><TbBrandNextjs /></span>ReactJs & NextJs</SelectItem>
          <SelectItem value="Astro"><span className="text-white dark:text-neutral-200"><TbBrandAstro /></span>Astro</SelectItem>
          <SelectItem value="NextJs & ShadcnUI"><span className="text-white dark:text-neutral-200"><SiShadcnui /></span>NextJs & ShadcnUI</SelectItem>
          <SelectItem value="Django & TailwindCss"><span className="text-white dark:text-neutral-200"><TbBrandDjango /></span>Django & Tailwind Css</SelectItem>
          <SelectItem value="Html Css & JS"><span className="text-white dark:text-neutral-200"><TbBrandJavascript /></span>Html Css & Javascript</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}





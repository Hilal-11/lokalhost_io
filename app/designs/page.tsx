"use client"
import { useRef, useState , useEffect } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from '@tanstack/react-query'; // ← Keep this as useQuery
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { IoMdSearch } from "react-icons/io";
import Image from "next/image";
import TemplateShimmerLoadingUI from '@/components/templateShimmerLoadingUI';
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { HiArrowNarrowRight } from "react-icons/hi";
import HoverExternalIcon from "@/components/landing/MicroComponents/HoverExternalIcon";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { SortDesigns } from "./SortDesigns";
import { AnimatedGridPatternDemo } from "./AnimatedGridPattern";
import AnnoncementBadge from "@/components/landing/AnnoncementBadge";
import { IoSearchSharp } from "react-icons/io5";
import { LuFigma } from "react-icons/lu";

function DegignKits(){
    const convex = useConvex();
    
    const { data: designsKits } = useQuery({
        queryKey: ['designKits'] as const,
        queryFn: () => convex.query(api.getTemplates.getDesignKits),
        staleTime: 24 * 60 * 60 * 1000, 
        gcTime: 24 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const [activeFilter, setActiveFilter] = useState<'All' | 'Free' | 'Premium'>('All');
     const filteredDesigns = designsKits?.filter((design) => {
        if (activeFilter === 'All') return true
        if (activeFilter === 'Free') return design?.isPremium === false
        if (activeFilter === 'Premium') return design?.isPremium === true
        return true
    }) 

    const [searchQuery , setSearchQuery] = useState('');
    const [filteredItem , setFilteredItem] = useState(designsKits);
    
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    

    const handleSearching = (event:any) => {
            setSearchQuery(event.target.value)
        }
      
          useEffect(() => {
              const filtering = designsKits?.filter((item:any) => item?.projectName?.toLowerCase().includes(searchQuery.toLowerCase()))
              setFilteredItem(filtering);
          },[])
    

    return (
        <div className="relative">

            <AnimatedGridPatternDemo />
            <div className="relative w-full container max-w-[1580px] pt-14 h-auto z-40">
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
            
                           
            <section className="h-auto pt-4 mx-auto border border-dashed border-neutral-300 dark:border-neutral-700 mt-24 bg-neutral-50 dark:bg-neutral-950">
                <div className="flex justify-between flex-wrap gap-2 items-center w-full pt-0 pb-4 border-b border-dashed border-neutral-300 dark:border-neutral-700 px-5">
                        <div>
                            <SortDesigns />
                        </div>
                        <div className="flex items-center gap-1">
                            <Dialog>
                                <DialogTrigger asChild className='flex items-center justify-center'>
                                    <InputGroup className="flex items-center justify-center">
                                        <InputGroupInput placeholder="Search Template:- " className="hidden lg:flex md:flex"/>
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
                                                                        filteredItem?.map(({id , name}) => (
                                                                          <div key={id} className="w-full h-[42px] rounded-sm hover:bg-neutral-200 hover:dark:bg-neutral-800 transition duration-300 flex items-center">
                                                                            <Link prefetch={true} className="flex gap-3 pl-2 items-center text-sm font-medium" href={`#${id}`}><span className="text-sm"><RiCheckboxBlankCircleLine/></span>{name}</Link>
                                                                          </div>
                                                                        ))
                                                                      }
                                                                    </div>
                                                                  ) : (
                                                                    <div>
                                                                      {
                                                                        designsKits?.map(({id , name}) => (
                                                                          <div key={id} className="w-full h-[42px] rounded-sm hover:bg-neutral-200 hover:dark:bg-neutral-800 transition duration-300 flex items-center">
                                                                            <Link prefetch={true} className="flex gap-3 pl-2 items-center text-sm font-medium" href={`#${id}`}><span className="text-sm"><RiCheckboxBlankCircleLine/></span>{name}</Link>
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
                { !designsKits ? (<TemplateShimmerLoadingUI/>) : (
                    filteredDesigns?.map((design) => (
                        <div key={design.id} className="flex flex-col gap-4 w-full">
                        <div id={`${design.id}`} className="w-full h-auto flex flex-wrap border-t border-dashed border-neutral-300 dark:border-neutral-700 r">
                            <div className="xl:w-[30%] lg:w-[40%] md:w-[50%] px-6 border-r border-dashed border-neutral-300 dark:border-neutral-700 py-5 pb-5">
                                <div className="flex flex-col gap-3">
                                    <h1 className="font-sans font-bold text-3xl text-neutral-800 dark:text-neutral-200">{design.name}</h1>
                                    <p className="pt-2 text-sm font-sans font-medium text-neutral-600 dark:text-neutral-400">{design.discription}</p>
                                </div>
                                <div className="flex justify-between pt-4">
                                    <button className="px-3 border border-dashed rounded-sm font-sans font-medium text-sm text-neutral-800 dark:text-neutral-200">{new Date(design?._creationTime).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}</button>
                                    <button className="px-4 py-2 cursor-pointer border-t border-l border-r border-neutral-800 rounded-lg whitespace-nowrap font-sans font-medium text-xs text-neutral-200 dark:text-neutral-200 bg-gradient-to-t from-[#262626] to-[#525252] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">{design.price === "free" ? `Free` : `${design.price !== "Free"? `${design.price}` : "Free"} `}</button>
                                </div>
                                <div className="flex w-full justify-start items-center pt-4">
                                    <button onClick={() => router.push(`/designs/design/${design._id}`)} className="px-8 py-[6px] cursor-pointer border-t border-l border-r border-neutral-800 rounded-lg whitespace-nowrap font-sans font-medium text-sm text-neutral-200 dark:text-neutral-200 bg-gradient-to-t from-[#262626] to-[#525252] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex gap-2 items-center">View Template <span className="text-lg"><HiArrowNarrowRight /></span> </button>
                                </div>
                                
                            </div>
                            <div onClick={() => router.push(`/designs/design/${design._id}`)} className="cursor-pointer xl:w-[70%] lg:w-[60%] md:w-[50%] px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 mask-l-from-80% to-100% p-14 relative group transition duration-300">
                                <div className="z-40 hidden absolute top-1 right-1 group-hover:block transition duration-300">
                                    <HoverExternalIcon />
                                </div>                        
                                                        
                                <div className="border rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center">
                                  {design.images?.[0] && (
                                     <Image 
                                         src={design.images[0]}
                                         alt="not load yet"
                                         width={400}
                                         height={500}
                                         className="object-cover h-full rounded-t-md w-full"
                                     />
                                     
                                 )}
                                </div>
                                <div className="border rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center">
                                    {design.images?.[1] && (
                                     
                                     <Image 
                                         src={design.images[1]}
                                         alt="not load yet"
                                         width={400}
                                         height={500}
                                         className="object-cover h-full rounded-t-md w-fulld"
                                     />
                                     
                                 )}
                                </div>
                                <div className="border rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] flex items-center justify-center">
                                    {design.images?.[2] && (
                                     
                                     <Image 
                                         src={design.images[2]}
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
        </div>
    )
}

export default DegignKits;







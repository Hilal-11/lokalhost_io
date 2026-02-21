
"use client"
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from 'next/link';
import { IoSearchSharp } from 'react-icons/io5';
import { MAIN_PAGE_SEARCHING_CONFIG } from '../../../config/searchingConfig';
import NProgress from 'nprogress';


type SearchProps = {
  searchData: any; // replace 'any' with your type
};

export function SearchingMain() {

  const [searchQuery , setSearchQuery] = useState('');
      const [filteredItem , setFilteredItem] = useState([...MAIN_PAGE_SEARCHING_CONFIG]);
      const handleSearching = (event:any) => {
          setSearchQuery(event.target.value)
      }
  
      useEffect(() => {
          const filtering = MAIN_PAGE_SEARCHING_CONFIG.filter((item:any) => item.suggesstion.toLowerCase().includes(searchQuery.toLowerCase()))
          setFilteredItem(filtering);
      }, [searchQuery])

    const handleLinkClick = () => {
        NProgress.start()
      }
  
  return (
    <Dialog>
                <DialogTrigger asChild className='flex items-center justify-center'>
                    <button className="bg-neutral-50 dark:bg-neutral-900 px-[7px] h-8 rounded-sm shadow-sm border hover:bg-neutral-100"><IoSearchSharp className="text-[15px]"/></button>
                </DialogTrigger>
                <DialogContent className="lg:w-[500px] h-[400px] overflow-y-scroll pb-4">
                    {/* Header search box */}
                    <div className="w-full h-[48px] fixed top-0 border-b rounded-5-lg p-1 flex justify-center items-center pl-2  ">
                        <span><IoSearchSharp className="text-lg text-neutral-400 dark:text-neutral-700"/></span>
                        <input className="w-full h-full outline-0 text-sm font-sans font-medium pl-1" onChange={handleSearching} type="text" placeholder="Searching..." />
                            </div>
                                <div className="flex flex-col gap-1 w-full h-auto mt-10">
                                    <p className="text-xs fonr-sans text-neutral-600">Suggestions</p>
                                    {
                                      filteredItem.length > 0 ? (
                                        <div>
                                            {
                                            filteredItem.map(({suggesstion , suggesstion_to , Icon}) => (
                                              <div key={suggesstion_to} className="w-full h-[42px] rounded-sm hover:bg-neutral-200 hover:dark:bg-neutral-800 transition duration-300 flex items-center">
                                                <Link onClick={handleLinkClick} prefetch={true} className="flex gap-3 pl-2 items-center text-sm font-medium" href={suggesstion_to}><span className="text-lg"><Icon /></span>{suggesstion}</Link>
                                              </div>
                                            ))
                                          }
                                        </div>
                                      ) : (
                                        <div>
                                          {
                                            MAIN_PAGE_SEARCHING_CONFIG.map(({suggesstion , suggesstion_to , Icon}) => (
                                              <div key={suggesstion_to} className="w-full h-[42px] rounded-sm hover:bg-neutral-200 hover:dark:bg-neutral-800 transition duration-300 flex items-center">
                                                <Link onClick={handleLinkClick} prefetch={true} className="flex gap-3 pl-2 items-center text-sm font-medium" href={suggesstion_to}><span className="text-lg"><Icon /></span>{suggesstion}</Link>
                                              </div>
                                            ))
                                          }
                                        </div>
                                      )
                                    }
                    </div>
                </DialogContent>
            </Dialog>
  )
}



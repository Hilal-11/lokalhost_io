"use client"
import React, { useState , useRef, useEffect } from 'react'
import { IoMdArrowUp } from "react-icons/io";
import Link from 'next/link';
import { MdOutlineFeedback } from 'react-icons/md';
import Feedback from './landing/MicroComponents/Feedback';
function GoToTop() {
  

  return (
    <div className='fixed right-3 bottom-3 z-50'>
        <div className='flex justify-center items-center'>
            <Link href={"#top"} className='w-[40px] h-[40px] rounded-[10px] flex justify-center items-center border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] hover:bg-neutral-950'>
                <IoMdArrowUp className='text-xl text-neutral-400' />
            </Link>
        </div>
    </div>
  )
}

export default GoToTop


export const FeedbackMobile = () => {

  const [showFeedback, setShowFeedback] = useState(false)
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        feedbackRef.current &&
        !feedbackRef.current.contains(event.target as Node)
      ) {
        setShowFeedback(false);
      }
    }
  
    if (showFeedback) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFeedback]);

    return(
        <div className='w-full h-full fixed z-50'>
          <div className='flex justify-center items-center absolute right-[58px] bottom-3 z-50'>
              <button onClick={() => setShowFeedback(prev => !prev)} className='w-[40px] h-[40px] rounded-[10px] flex justify-center items-center border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer font-sans font-medium bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] hover:bg-neutral-950'>
                  <MdOutlineFeedback className='text-xl text-neutral-400' />
              </button>
          </div>
          { showFeedback && <div ref={feedbackRef} onMouseDown={(e) => e.stopPropagation()} className='absolute right-2 bottom-16'><Feedback /></div> }
      </div>

    )
}
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
            <Link href={"#top"} className='w-[40px] h-[40px] rounded-[10px] flex justify-center items-center relative cursor-pointer font-sans font-medium hover:bg-neutral-950 lk-btn-secondary transition-[filter,box-shadow,transform]'>
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
        <div className='fixed right-0 bottom-0 z-50'>
          <div className='flex justify-center items-center absolute right-[58px] bottom-3 z-50'>
              <button onClick={() => setShowFeedback(prev => !prev)} className='w-[40px] h-[40px] rounded-[10px] flex justify-center items-center relative cursor-pointer font-sans font-medium hover:bg-neutral-950 lk-btn-secondary transition-[filter,box-shadow,transform]'>
                  <MdOutlineFeedback className='text-xl text-neutral-400' />
              </button>
          </div>
          { showFeedback && <div ref={feedbackRef} onMouseDown={(e) => e.stopPropagation()} className='absolute right-2 bottom-16'><Feedback /></div> }
      </div>

    )
}
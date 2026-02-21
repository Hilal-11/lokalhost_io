"use client";
import React, { useState, useEffect, useId } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { RiTailwindCssFill } from "react-icons/ri";
import { TbBrandFramerMotion } from "react-icons/tb";
import { SiShadcnui } from "react-icons/si";
import { BiLogoTypescript } from "react-icons/bi";
import { FaFigma } from "react-icons/fa6";
import { MdAnimation } from "react-icons/md";
function TailoredSignal() {
  return (
    <div className='w-full h-auto flex justify-center items-center gap-3 flex-wrap'>
        <div className='font-sans font-medium text-[18px] text-neutral-700 dark:text-neutral-300'>Tailored For<ContainerTextFlip /></div>
        <div className='flex justify-center items-center gap-2 pl-4'>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><RiNextjsFill /></h1>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><FaReact/></h1>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><TbBrandFramerMotion /></h1>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><RiTailwindCssFill /></h1>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><SiShadcnui /></h1>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><BiLogoTypescript /></h1>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><MdAnimation /></h1>
            <h1 className='font-sans font-medium text-2xl text-neutral-800 dark:text-neutral-300'><FaFigma /></h1>
        </div>
    </div>
  )
}

export default TailoredSignal

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
}
 
function ContainerTextFlip({
  words = ["Developers", "Designers", "Startups", "Agencies", "Teams"],
  interval = 2000,
  className,
  textClassName,
  animationDuration = 600,
}: ContainerTextFlipProps) {
  const id = useId();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [width, setWidth] = useState(100);
  const textRef = React.useRef(null);
 
  const updateWidthForWord = () => {
    if (textRef.current) {
      const textWidth = textRef.current.scrollWidth + 30;
      setWidth(textWidth);
    }
  };
 
  useEffect(() => {
    // Update width whenever the word changes
    updateWidthForWord();
  }, [currentWordIndex]);
 
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      // Width will be updated in the effect that depends on currentWordIndex
    }, interval);
 
    return () => clearInterval(intervalId);
  }, [words, interval]);
 
  return (
    <motion.div
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn(
        "relative inline-block text-center text-[18px] font-lg font-medium text-neutral-800dark:text-neutral-300 whitespace-nowrap",
        className,
      )}
      key={words[currentWordIndex]}
    >
      <motion.div
        transition={{
          duration: animationDuration / 1000,
          ease: "easeInOut",
        }}
        className={cn("inline-block", textClassName)}
        ref={textRef}
        layoutId={`word-div-${words[currentWordIndex]}-${id}`}
      >
        <motion.div className="inline-block">
          {words[currentWordIndex].split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                delay: index * 0.02,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}









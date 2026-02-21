"use client"
import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import { BiSolidTerminal } from "react-icons/bi";
import { IoMdSend, IoMdRocket } from 'react-icons/io'
import { FaHeart, FaStar } from 'react-icons/fa'
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        // Light gradient button (your first button style)
        light: "border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 dark:border-neutral-400 bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] text-neutral-900 dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]",
        
        // Dark gradient button (your second button style)
        dark: "border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]",
        
        // Primary - Blue gradient
        primary: "border-t-[2px] border-l-[2px] border-r-[2px] border-blue-600 bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow-[0px_0px_0px_1px_rgba(37,99,235,0.2),0px_1px_1px_-0.5px_rgba(37,99,235,0.2),0px_3px_3px_-1.5px_rgba(37,99,235,0.2),_0px_6px_6px_-3px_rgba(37,99,235,0.2),0px_12px_12px_-6px_rgba(37,99,235,0.2),0px_24px_24px_-12px_rgba(37,99,235,0.2)] hover:from-blue-700 hover:to-blue-600",
        
        // Success - Green gradient
        success: "border-t-[2px] border-l-[2px] border-r-[2px] border-green-600 bg-gradient-to-t from-green-600 to-green-500 text-white shadow-[0px_0px_0px_1px_rgba(22,163,74,0.2),0px_1px_1px_-0.5px_rgba(22,163,74,0.2),0px_3px_3px_-1.5px_rgba(22,163,74,0.2),_0px_6px_6px_-3px_rgba(22,163,74,0.2),0px_12px_12px_-6px_rgba(22,163,74,0.2),0px_24px_24px_-12px_rgba(22,163,74,0.2)] hover:from-green-700 hover:to-green-600",
        
        // Danger - Red gradient
        danger: "border-t-[2px] border-l-[2px] border-r-[2px] border-red-600 bg-gradient-to-t from-red-600 to-red-500 text-white shadow-[0px_0px_0px_1px_rgba(220,38,38,0.2),0px_1px_1px_-0.5px_rgba(220,38,38,0.2),0px_3px_3px_-1.5px_rgba(220,38,38,0.2),_0px_6px_6px_-3px_rgba(220,38,38,0.2),0px_12px_12px_-6px_rgba(220,38,38,0.2),0px_24px_24px_-12px_rgba(220,38,38,0.2)] hover:from-red-700 hover:to-red-600",
        
        // Warning - Orange gradient
        warning: "border-t-[2px] border-l-[2px] border-r-[2px] border-orange-600 bg-gradient-to-t from-orange-600 to-orange-500 text-white shadow-[0px_0px_0px_1px_rgba(234,88,12,0.2),0px_1px_1px_-0.5px_rgba(234,88,12,0.2),0px_3px_3px_-1.5px_rgba(234,88,12,0.2),_0px_6px_6px_-3px_rgba(234,88,12,0.2),0px_12px_12px_-6px_rgba(234,88,12,0.2),0px_24px_24px_-12px_rgba(234,88,12,0.2)] hover:from-orange-700 hover:to-orange-600",
        
        // Outline
        outline: "border-2 border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
        
        // Ghost
        ghost: "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
        
        // Link
        link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline",
        
        // Gradient rainbow
        rainbow: "border-t-[2px] border-l-[2px] border-r-[2px] border-purple-600 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-[0px_0px_0px_1px_rgba(147,51,234,0.2),0px_1px_1px_-0.5px_rgba(147,51,234,0.2),0px_3px_3px_-1.5px_rgba(147,51,234,0.2),_0px_6px_6px_-3px_rgba(147,51,234,0.2),0px_12px_12px_-6px_rgba(147,51,234,0.2),0px_24px_24px_-12px_rgba(147,51,234,0.2)] hover:opacity-90",
        
        // Shimmer effect
        shimmer: "border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
        "3xl": "rounded-3xl",
        full: "rounded-full",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-10 text-base",
        xl: "h-14 px-12 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "dark",
      size: "md",
    },
  }
)

const motionVariants = {
  hover: {
    lift: { y: -3 },
    scale: { scale: 1.05 },
    none: {},
  },
  tap: {
    lift: { y: -4 },
    scale: { scale: 0.95 },
    press: { scale: 0.98 },
    none: {},
  },
}

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  motionHover?: 'lift' | 'scale' | 'none'
  motionTap?: 'lift' | 'scale' | 'press' | 'none'
  motionDuration?: number
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      motionHover = 'lift',
      motionTap = 'lift',
      motionDuration = 0.28,
      ...props
    },
    ref
  ) => {
    const MotionButton= motion.button

    return (
      <MotionButton
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        whileHover={motionVariants.hover[motionHover]}
        whileTap={motionVariants.tap[motionTap]}
        transition={{ duration: motionDuration, ease: "easeInOut" }}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span>{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span>{rightIcon}</span>}
      </MotionButton>
    )
  }
)

Button.displayName = 'Button'

const ButtonsList = () => {
  return (
    <div className='flex gap-3 flex-wrap w-full mx-auto'>
        <div className="flex flex-wrap gap-4">
          <Button variant="light">Light Button</Button>
          <Button variant="dark">Dark Button</Button>
          <Button variant="primary">Primary Button</Button>
          <Button variant="success">Success Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="warning">Warning Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
          <Button variant="rainbow">Rainbow Button</Button>
          <Button variant="shimmer">Shimmer Button</Button>
        </div>

      {/* Sizes */}
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium (Default)</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
          <Button size="icon"><MdOutlineFileDownload /></Button>
        </div>

      {/* Icons */}

        <div className="flex flex-wrap gap-4">
          <Button leftIcon={<MdOutlineFileDownload />}>Text</Button>
          <Button rightIcon={<BiSolidTerminal />}>Text</Button>
        </div>

      {/* States */}

        <div className="flex flex-wrap gap-4">
          <Button loading>Loading...</Button>
          <Button disabled>Disabled</Button>
        </div>

      {/* Motion */}

        <div className="flex flex-wrap gap-4">
          <Button motionHover="lift">Lift on hover</Button>
          <Button motionHover="scale">Scale on hover</Button>
          <Button motionHover="none">No hover</Button>
          <Button motionTap="lift">Lift on tap</Button>
          <Button motionTap="scale">Scale on tap</Button>
          <Button motionTap="press">Press on tap</Button>
          <Button motionDuration={0.5}>Slow animation</Button>
        </div>

      {/* Rounded Variants */}

        <div className="flex flex-wrap gap-4">
          <Button rounded="none">No Rounded</Button>
          <Button rounded="sm">Rounded SM</Button>
          <Button rounded="md">Rounded MD (Default)</Button>
          <Button rounded="lg">Rounded LG</Button>
          <Button rounded="xl">Rounded XL</Button>
          <Button rounded="2xl">Rounded 2XL</Button>
          <Button rounded="3xl">Rounded 3XL</Button>
          <Button rounded="full">Rounded Full</Button>
        </div>

      {/* Rounded with Icons */}

        <div className="flex flex-wrap gap-4">
          <Button rounded="full" leftIcon={<IoMdSend />}>Send Message</Button>
          <Button rounded="full" rightIcon={<IoMdRocket />}>Launch Now</Button>
          <Button rounded="full" leftIcon={<MdOutlineFileDownload />} rightIcon={<BiSolidTerminal />}>Both Icons</Button>
        </div>

      {/* Rounded Full - All Variants */}

        <div className="flex flex-wrap gap-4">
          <Button variant="light" rounded="full">Light</Button>
          <Button variant="dark" rounded="full">Dark</Button>
          <Button variant="primary" rounded="full">Primary</Button>
          <Button variant="success" rounded="full">Success</Button>
          <Button variant="danger" rounded="full">Danger</Button>
          <Button variant="warning" rounded="full">Warning</Button>
          <Button variant="outline" rounded="full">Outline</Button>
          <Button variant="ghost" rounded="full">Ghost</Button>
          <Button variant="rainbow" rounded="full">Rainbow</Button>
          <Button variant="shimmer" rounded="full">Shimmer</Button>
        </div>

      {/* Rounded Full with Icons - Different Variants */}

        <div className="flex flex-wrap gap-4">
          <Button variant="primary" rounded="full" leftIcon={<IoMdSend />}>Primary</Button>
          <Button variant="success" rounded="full" leftIcon={<FaHeart />}>Success</Button>
          <Button variant="danger" rounded="full" rightIcon={<IoMdRocket />}>Danger</Button>
          <Button variant="warning" rounded="full" leftIcon={<FaStar />}>Warning</Button>
          <Button variant="rainbow" rounded="full" leftIcon={<IoMdSend />} rightIcon={<IoMdRocket />}>Rainbow</Button>
        </div>

      {/* Circular Icon Buttons (Icon + Rounded Full) */}

        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="icon" rounded="full"><IoMdSend /></Button>
          <Button variant="success" size="icon" rounded="full"><FaHeart /></Button>
          <Button variant="danger" size="icon" rounded="full"><FaStar /></Button>
          <Button variant="warning" size="icon" rounded="full"><IoMdRocket /></Button>
          <Button variant="outline" size="icon" rounded="full"><MdOutlineFileDownload /></Button>
          <Button variant="ghost" size="icon" rounded="full"><BiSolidTerminal /></Button>
        </div>

      {/* Rounded Full - Different Sizes */}

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" rounded="full" size="sm">Small</Button>
          <Button variant="primary" rounded="full" size="md">Medium</Button>
          <Button variant="primary" rounded="full" size="lg">Large</Button>
          <Button variant="primary" rounded="full" size="xl">Extra Large</Button>
        </div>

      {/* Rounded Full with Icons - Different Sizes */}

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" rounded="full" size="sm" leftIcon={<IoMdSend />}>Small</Button>
          <Button variant="primary" rounded="full" size="md" leftIcon={<IoMdSend />}>Medium</Button>
        </div>

      {/* Combinations */}

        <div className="flex flex-wrap gap-4">
          <Button 
            variant="shimmer" 
            rounded="full" 
            rightIcon={<MdOutlineFileDownload />}
            motionHover="lift"
          >
            Download Now
          </Button>
          <Button 
            variant="shimmer" 
            rounded="full" 
            rightIcon={<MdOutlineFileDownload />}
            motionHover="lift"
          >
            Download Now
          </Button>
          <Button 
            variant="light" 
            rounded="full"
            rightIcon={<MdOutlineFileDownload />}
            motionHover="lift"
          >
            Download Now
          </Button>
        </div>

    </div>
  )
}

export { Button, buttonVariants , ButtonsList}
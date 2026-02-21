"use client";

import { cn } from "@/lib/utils";
import { Check, Copy, Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";

const copyButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
        
        primary:
          "bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
        
        secondary:
          "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
        
        success:
          "bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 text-green-600 dark:text-green-300 border border-green-200 dark:border-green-800",
        
        outline:
          "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600",
        
        ghost:
          "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
        
        gradient:
          "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0",
        
        solid:
          "border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-12 px-6 text-base rounded-lg",
        xl: "h-14 px-8 text-lg rounded-xl",
        icon: "h-10 w-10 rounded-lg",
      },
      animation: {
        scale: "",
        bounce: "",
        slide: "",
        fade: "",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      animation: "scale",
    },
  }
);

export interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof copyButtonVariants> {
  textToCopy: string;
  successDuration?: number;
  showText?: boolean;
  copyText?: string;
  copiedText?: string;
  iconOnly?: boolean;
  onCopySuccess?: () => void;
  onCopyError?: (error: Error) => void;
}

export default function CopyButton({
  className,
  variant,
  size,
  animation = "scale",
  textToCopy = "https://ui.codesnipet.dev/",
  successDuration = 2000,
  showText = true,
  copyText = "Copy code",
  copiedText = "Copied!",
  iconOnly = false,
  onCopySuccess,
  onCopyError,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      onCopySuccess?.();
      setTimeout(() => setIsCopied(false), successDuration);
    } catch (err) {
      console.error("Failed to copy text:", err);
      onCopyError?.(err as Error);
    }
  }

  const getAnimationProps = () => {
    switch (animation) {
      case "scale":
        return {
          initial: { scale: 1 },
          animate: isCopied ? { scale: 1.05 } : { scale: 1 },
          transition: { duration: 0.2 },
        };
      case "bounce":
        return {
          initial: { y: 0 },
          animate: isCopied ? { y: [-5, 0] } : { y: 0 },
          transition: { duration: 0.3, type: "spring" },
        };
      case "slide":
        return {
          initial: { x: 0 },
          animate: isCopied ? { x: [0, 5, 0] } : { x: 0 },
          transition: { duration: 0.3 },
        };
      case "fade":
        return {
          initial: { opacity: 1 },
          animate: isCopied ? { opacity: [1, 0.7, 1] } : { opacity: 1 },
          transition: { duration: 0.3 },
        };
      default:
        return {};
    }
  };

  return (
    <motion.button
      className={cn(
        copyButtonVariants({ variant, size, animation, className }),
        isCopied && "ring-2 ring-offset-2",
        variant === "default" && isCopied && "ring-emerald-500",
        variant === "primary" && isCopied && "ring-blue-500",
        variant === "success" && isCopied && "ring-green-500"
      )}
      onClick={handleCopy}
      {...getAnimationProps()}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isCopied ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {!iconOnly && showText && <span>{copiedText}</span>}
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 group"
          >
            <Copy className="w-4 h-4 transition-transform group-hover:scale-110" />
            {!iconOnly && showText && <span>{copyText}</span>}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}




export function CopyButtonShowcase() {
  return (
    <div className="p-8 space-y-8">
      
      {/* All Variants */}
        <div className="flex flex-wrap gap-4">
          <CopyButton variant="default" textToCopy="Default variant" />
          <CopyButton variant="primary" textToCopy="Primary variant" />
          <CopyButton variant="secondary" textToCopy="Secondary variant" />
          <CopyButton variant="success" textToCopy="Success variant" />
          <CopyButton variant="outline" textToCopy="Outline variant" />
          <CopyButton variant="ghost" textToCopy="Ghost variant" />
          <CopyButton variant="gradient" textToCopy="Gradient variant" />
          <CopyButton variant="solid" textToCopy="Solid variant" />
        </div>

      {/* All Sizes */}

        <div className="flex flex-wrap items-center gap-4">
          <CopyButton size="sm" textToCopy="Small button" />
          <CopyButton size="md" textToCopy="Medium button" />
          <CopyButton size="lg" textToCopy="Large button" />
          <CopyButton size="xl" textToCopy="Extra large button" />
        </div>

      {/* All Animations */}

        <div className="flex flex-wrap gap-4">
          <CopyButton animation="scale" textToCopy="Scale animation" copyText="Scale" />
          <CopyButton animation="bounce" textToCopy="Bounce animation" copyText="Bounce" />
          <CopyButton animation="slide" textToCopy="Slide animation" copyText="Slide" />
          <CopyButton animation="fade" textToCopy="Fade animation" copyText="Fade" />
          <CopyButton animation="none" textToCopy="No animation" copyText="None" />
        </div>

      {/* Icon Only */}

        <div className="flex flex-wrap gap-4">
          <CopyButton 
            variant="default" 
            size="icon" 
            iconOnly 
            textToCopy="Icon only default"
          />
          <CopyButton 
            variant="primary" 
            size="icon" 
            iconOnly 
            textToCopy="Icon only primary"
          />
          <CopyButton 
            variant="outline" 
            size="icon" 
            iconOnly 
            textToCopy="Icon only outline"
          />
          <CopyButton 
            variant="gradient" 
            size="icon" 
            iconOnly 
            textToCopy="Icon only gradient"
          />
        </div>

      {/* Custom Text */}

        <div className="flex flex-wrap gap-4">
          <CopyButton 
            textToCopy="npm install my-package"
            copyText="Copy command"
            copiedText="Command copied!"
          />
          <CopyButton 
            textToCopy="git clone repo.git"
            copyText="Copy git command"
            copiedText="Git command copied!"
            variant="primary"
          />
          <CopyButton 
            textToCopy="https://example.com/api/endpoint"
            copyText="Copy URL"
            copiedText="URL copied!"
            variant="success"
          />
        </div>

      {/* Without Text */}

        <div className="flex flex-wrap items-center gap-4">
          <CopyButton 
            variant="primary" 
            size="sm"
            showText={false}
            textToCopy="Small icon button"
          />
          <CopyButton 
            variant="success" 
            size="md"
            showText={false}
            textToCopy="Medium icon button"
          />
          <CopyButton 
            variant="gradient" 
            size="lg"
            showText={false}
            textToCopy="Large icon button"
          />
        </div>


        <div className="flex flex-wrap gap-4">
          <CopyButton 
            textToCopy="Quick feedback"
            copyText="500ms"
            successDuration={500}
            variant="primary"
          />
          <CopyButton 
            textToCopy="Normal feedback"
            copyText="2000ms (default)"
            successDuration={2000}
          />
          <CopyButton 
            textToCopy="Long feedback"
            copyText="5000ms"
            successDuration={5000}
            variant="success"
          />
        </div>

      {/* With Callbacks */}

        <div className="flex flex-wrap gap-4">
          <CopyButton 
            textToCopy="Copy with success callback"
            onCopySuccess={() => console.log('Copied successfully!')}
            variant="gradient"
          />
          <CopyButton 
            textToCopy="Copy with error callback"
            onCopyError={(error) => console.error('Copy failed:', error)}
            variant="outline"
          />
        </div>

      {/* Real World Examples */}

        <div className="space-y-4">
          
          {/* Code block example */}
          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>npm install @my-org/package</code>
            </pre>
            <div className="absolute top-2 right-2">
              <CopyButton 
                textToCopy="npm install @my-org/package"
                size="sm"
                variant="ghost"
                copyText="Copy"
                className="bg-gray-800/50 hover:bg-gray-700/50"
              />
            </div>

          {/* API endpoint example */}
          <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <code className="flex-1 text-sm font-mono">
              https://api.example.com/v1/users
            </code>
            <CopyButton 
              textToCopy="https://api.example.com/v1/users"
              size="sm"
              variant="primary"
              showText={false}
            />
          </div>

          {/* Installation command */}
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <code className="flex-1 text-sm font-mono">
              git clone https://github.com/user/repo.git
            </code>
            <CopyButton 
              textToCopy="git clone https://github.com/user/repo.git"
              size="sm"
              variant="success"
              animation="bounce"
              iconOnly
            />
          </div>

        </div>
      </div>

      {/* Combinations */}
        <div className="flex flex-wrap gap-4">
          <CopyButton 
            variant="gradient"
            size="md"
            animation="bounce"
            textToCopy="Gradient + Large + Bounce"
            copyText="Copy Code"
            successDuration={3000}
          />
          
          <CopyButton 
            variant="solid"
            size="md"
            animation="scale"
            textToCopy="Solid + Extra Large + Scale"
            copyText="Copy Command"
          />

          <CopyButton 
            variant="outline"
            size="md"
            animation="slide"
            textToCopy="Outline + Medium + Slide"
            copyText="Copy Link"
            className="rounded-full"
          />
        </div>
    </div>

  )
}
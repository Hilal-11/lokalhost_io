import { cn } from "@/lib/utils"
import AnnoncementBadge from "@/components/landing/AnnoncementBadge";
import { LuFigma } from "react-icons/lu";
import { IoSearchSharp } from "react-icons/io5";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";

export function AnimatedGridPatternDemo() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 mask-x-from-80% mask-y-from-98% dark:mask-from-50% dark:mask-from-98% to-100%">
    <AnimatedGridPattern
      numSquares={50}
      maxOpacity={0.1}
      duration={3}
      repeatDelay={1}
      className={cn(
        "absolute inset-0",
        "inset-y-[-30%] h-[1224px]"
      )}
    />
  </div>
  )
}
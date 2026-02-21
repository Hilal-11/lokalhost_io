import React from 'react'
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function TemplateShimmerLoadingUI() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 justify-evenly p-6">
        <div className="h-[350px] w-full rounded-xl bg-neutral-50 dark:bg-neutral-900  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex justify-center items-center"
        >
            <Spinner/>
        </div>
        <div className="h-[350px] w-full rounded-xl bg-neutral-50 dark:bg-neutral-900  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex justify-center items-center"
        >
            <Spinner/>
        </div>
        <div className="h-[350px] w-full rounded-xl bg-neutral-50 dark:bg-neutral-900  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex justify-center items-center"
        >
            <Spinner/>
        </div>
        <div className="h-[350px] w-full rounded-xl bg-neutral-50 dark:bg-neutral-900  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] flex justify-center items-center"
        >
            <Spinner/>
        </div>
    </div>
  )
}
export default TemplateShimmerLoadingUI

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-8 animate-spin", className)}
      {...props}
    />
  )
}










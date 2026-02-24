
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
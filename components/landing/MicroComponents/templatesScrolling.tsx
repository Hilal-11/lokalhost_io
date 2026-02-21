import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"


export interface ITemplate {
  image: string;
  to?: string;
}



import rawTemplatesImages from "@/public/config/templatesScrollingConfig.json";

export const templatesImages: ITemplate[] =
  rawTemplatesImages.templates;




const ReviewCard = ({
  image,
  to,
}: {
  image: string
    to?: string
}) => {
  return (
    <img alt="Error" src={image} className="w-auto h-[178px] object-cover object-center rounded-sm border" />
  )
}

export function MarqueeTemplates() {

  const firstRow = templatesImages.slice(0, templatesImages.length / 2)
  const secondRow = templatesImages.slice(templatesImages.length / 2)

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover  className="[--duration:40s]">
        {firstRow.map((template, index) => (
          <ReviewCard key={index} {...template} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((template, index) => (
          <ReviewCard key={index} {...template} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}


const ComponentImage = ({
  image,
  to,
}: {
  image: string
    to?: string
}) => {
  return (
    <img alt="Error" src={image} className="w-auto h-[140px] object-cover object-center rounded-sm border" />
  )
}


export function ComponentsMarquee() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover repeat={1}  className="[--duration:200s]">
        {templatesImages.map((template, index) => (
          <ComponentImage key={index} {...template} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}



const TemplatesCatagory = ({
  id,
  name,
}: {
    id: number | string
    name: string
}) => {
  return (
    <div className="flex justify-center items-center px-3 text-sm font-sans font-medium py-1 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
      <p>{name}</p>
    </div>
  )
}
import templatesCatagoeryData from "@/public/config/templatesCatagoriedConfig.json";
export function TemplatesList() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover  className="[--duration:200s]">
        {templatesCatagoeryData.map((template, index) => (
          <TemplatesCatagory key={index} {...template} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:180s]">
        {templatesCatagoeryData.map((template, index) => (
          <TemplatesCatagory key={index} {...template} />
        ))}
      </Marquee>
      <Marquee pauseOnHover className="[--duration:180s]">
        {templatesCatagoeryData.map((template, index) => (
          <TemplatesCatagory key={index} {...template} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}
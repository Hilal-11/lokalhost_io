"use client"
import { PlusIcon } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { PiTerminalFill } from "react-icons/pi";
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'

interface Question {
  question: string;
  answer: string;
}

interface IFaq {
  id: string;
  title: string;
  questions: Question[];
}

export const FAQ_A = ({ faq }: { faq?: IFaq }) => {
  if (!faq) return null;
  return (
    <Accordion type='single' collapsible className='w-full' defaultValue='item-1'>
        <div className='pb-3'>
            <h1 className='font-mono font-bold text-[16px] lg:text-xl relative -left-2'>General Questions Localhost.io</h1>
        </div>
      {faq.questions?.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionPrimitive.Header className='flex items-center gap-2'>
            <span className='text-neutral-700 dark:text-neutral-300'><PiTerminalFill /></span>
            <AccordionPrimitive.Trigger
              data-slot='accordion-trigger'
              className='focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none  focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'
            >
              {item.question}
              <PlusIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200' />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}


export const FAQ_B = ({ faq }: { faq?: IFaq }) => {
    if (!faq) return null;
    return (
      <Accordion type='single' collapsible className='w-full'>
        <div className='pb-3'>
            <h1 className='font-mono font-bold text-[16px] lg:text-xl relative -left-2'>About Client Work</h1>
        </div>
        {faq.questions?.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionPrimitive.Header className='flex items-center gap-2'>
            <span className='text-neutral-700 dark:text-neutral-300'><PiTerminalFill /></span>
              <AccordionPrimitive.Trigger
                data-slot='accordion-trigger'
                className='focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none  focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'
              >
                {item.question}
                <PlusIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200' />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  
export const FAQ_C = ({ faq }: { faq?: IFaq }) => {
    if (!faq) return null;
    return (
      <Accordion type='single' collapsible className='w-full'>
        <div className='pb-3'>
            <h1 className='font-mono font-bold text-[16px] lg:text-xl relative -left-2'>Services Related</h1>
        </div>
        {faq.questions?.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionPrimitive.Header className='flex items-center gap-2'>
            <span className='text-neutral-700 dark:text-neutral-300'><PiTerminalFill /></span>
              <AccordionPrimitive.Trigger
                data-slot='accordion-trigger'
                className='focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none  focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'
              >
                {item.question}
                <PlusIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200' />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  
export const FAQ_D = ({ faq }: { faq?: IFaq }) => {
    if (!faq) return null;
    return (
      <Accordion type='single' collapsible className='w-full'>
        <div className='pb-3'>
            <h1 className='font-mono font-bold text-[16px] lg:text-xl relative -left-2'>Support</h1>
        </div>
        {faq.questions?.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionPrimitive.Header className='flex items-center gap-2'>
            <span className='text-neutral-700 dark:text-neutral-300'><PiTerminalFill /></span>
              <AccordionPrimitive.Trigger
                data-slot='accordion-trigger'
                className='focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none  focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'
              >
                {item.question}
                <PlusIcon className='text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200' />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className='text-muted-foreground'>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }




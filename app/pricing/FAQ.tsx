"use client"
import { PlusIcon } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { PiTerminalFill } from "react-icons/pi";
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import { useEffect, useState } from 'react';

interface Question {
  question: string;
  answer: string;
}

interface IFaq {
  id: string;
  title: string;
  questions: Question[];
}


export const PricingFAQ = () => {

  const [FAQItems, setFAQItems] = useState<IFaq[]>([])
  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/config/faqConfig.json`, {
        cache: 'force-cache'
      })
      const response = await data.json();
      setFAQItems(response.faqs)
      }catch(error:any){
        console.log("Failed to fetch the FAQ'S", error);
      }
    }
    fetchFAQ();
  }, [])

    return (
        <div className='w-full h-full pt-8 lg:pt-20'>
            <div className='w-full mx-auto py-20 pb-5 flex flex-col items-center justify-center'>
                <h1 className='text-center font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-2'>Frequently Asked Questions about Lokalhost.io</h1>
                <p className='text-center font-sans font-medium text-sm text-neutral-700 dark:text-neutral-300'>Find answers to common questions about our services, features, and how Lokalhost.io can benefit you.</p>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 pt-16 px-6 gap-6 lg:gap-16'>
                <div>
                    {FAQItems[0] && <FAQ_A faq={FAQItems[0]}/>}
                </div>
                <div>
                    {FAQItems[1] && <FAQ_B faq={FAQItems[1]}/>}
                </div>
            </div>
        </div>
    )
} 


export const FAQ_A = ({faq}: {faq?: IFaq}) => {
  return (
    <Accordion type='single' collapsible className='w-full' defaultValue='item-1'>
        <div className='pb-3'>
            <h1 className='font-mono font-bold text-[16px] lg:text-xl relative -left-2'>General Questions Localhost.io</h1>
        </div>
      {faq?.questions.map((item, index) => (
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

export const FAQ_B = ({faq}: {faq?: IFaq}) => {
    return (
      <Accordion type='single' collapsible className='w-full'>
        <div className='pb-3'>
            <h1 className='font-mono font-bold text-[16px] lg:text-xl relative -left-2'>Support</h1>
        </div>
        {faq?.questions.map((item, index) => (
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




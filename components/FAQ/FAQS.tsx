"use client"
import { PlusIcon } from 'lucide-react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { PiTerminalFill } from "react-icons/pi"
import { LuExternalLink } from "react-icons/lu"
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'

interface Link {
  label: string
  url: string
}

interface Question {
  question: string
  answer: string
  links?: Link[]
}

interface IFaq {
  id: string
  title: string
  questions: Question[]
}

/* ─────────────────────────────────────────────
   Shared trigger classname
───────────────────────────────────────────── */
const triggerClass =
  'focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&>svg>path:last-child]:origin-center [&>svg>path:last-child]:transition-all [&>svg>path:last-child]:duration-200 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg>path:last-child]:rotate-90 [&[data-state=open]>svg>path:last-child]:opacity-0'

/* ─────────────────────────────────────────────
   Link chips rendered below each answer
───────────────────────────────────────────── */
function AnswerLinks({ links }: { links?: Link[] }) {
  if (!links || links.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-dashed border-neutral-200 dark:border-neutral-800">
      {links.map(({ label, url }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors duration-150"
        >
          {label}
          <LuExternalLink className="text-[10px] opacity-60" />
        </a>
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Shared FAQ accordion block
───────────────────────────────────────────── */
function FaqBlock({
  faq,
  sectionTitle,
  defaultOpen = false,
}: {
  faq?: IFaq
  sectionTitle: string
  defaultOpen?: boolean
}) {
  if (!faq) return null
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue={defaultOpen ? 'item-1' : undefined}
    >
      <div className="pb-3 flex items-center gap-2">
        <h2 className="font-sans font-bold text-[18px] lg:text-lg text-neutral-800 dark:text-neutral-200">
          {sectionTitle}
        </h2>
      </div>

      {faq.questions?.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionPrimitive.Header className="flex items-center gap-2">
            <span className="text-neutral-600 dark:text-neutral-600 text-xs flex-shrink-0">
              <PiTerminalFill />
            </span>
            <AccordionPrimitive.Trigger
              data-slot="accordion-trigger"
              className={triggerClass}
            >
              {item.question}
              <PlusIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>

          <AccordionContent className="text-muted-foreground pl-5">
            <p className="text-sm leading-relaxed">{item.answer}</p>
            <AnswerLinks links={item.links} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/* ─────────────────────────────────────────────
   Exports — one per FAQ category
   Pass the matching faq object from faqs.json
───────────────────────────────────────────── */

// faqs[0] — About Lokalhost.io
export const FAQ_A = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="About Lokalhost.io" defaultOpen />
)

// faqs[1] — Components & UI Kits
export const FAQ_B = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="Components & UI Kits" />
)

// faqs[2] — Templates & Boilerplates
export const FAQ_C = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="Templates & Boilerplates" />
)

// faqs[3] — Mobile UI — Flutter & React Native
export const FAQ_D = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="Mobile UI — Flutter & React Native" />
)

// faqs[4] — Custom Development Services
export const FAQ_E = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="Custom Development Services" />
)

// faqs[5] — Pricing & Plans
export const FAQ_F = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="Pricing & Plans" />
)

// faqs[6] — Auth Kits & Security
export const FAQ_G = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="Auth Kits & Security" />
)

// faqs[7] — Support & Community
export const FAQ_H = ({ faq }: { faq?: IFaq }) => (
  <FaqBlock faq={faq} sectionTitle="Support & Community" />
)
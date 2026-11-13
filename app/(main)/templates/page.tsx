"use client"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LuFigma } from "react-icons/lu"
import AnnoncementBadge from "@/components/landing/AnnoncementBadge"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useQuery } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import TemplateShimmerLoadingUI from '@/components/templateShimmerLoadingUI'
import { SortTemplates } from "./sortTemplates"
import CTA from "@/components/landing/CTA"
import { Highlighter } from "@/components/ui/highlighter"
import { createClient } from "@/lib/supabase/client"

// ── Types ──────────────────────────────────────────────────────────────────
interface Template {
  id: string
  template_name: string
  template_description: string
  template_live_url: string
  template_prize: string
  is_premium: boolean
  template_images: string[]
  template_prefer_for: string[]
  template_purposes: string[]
  template_pages: string[]
  template_total_pages: number
  zip_code_file: string
  template_features: { feature: string; aboutFeature: string }[]
  template_tech_stack: { name: string; favIcon: string }[]
  template_formats: { format: string; icon: string }[]
  created_at: string
  updated_at: string
}

// ── Supabase fetcher ───────────────────────────────────────────────────────
async function fetchTemplates(): Promise<Template[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at")

  if (error) throw new Error(error.message)
  return data ?? []
}

// ── Component ──────────────────────────────────────────────────────────────
function Templates() {
  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  })

  const [searchQuery, setSearchQuery]   = useState("")
  const [activeFilter, setActiveFilter] = useState<"All" | "Free" | "Premium">("All")

  // ── Filter + search (derived — no useState/useEffect needed) ───────────
  const filteredTemplates = useMemo(() => {
    if (!templates) return []
    const q = searchQuery.toLowerCase().trim()

    return templates
      .filter(({ template_name }) =>
        q ? template_name.toLowerCase().includes(q) : true
      )
      .filter((template) => {
        if (activeFilter === "All")     return true
        if (activeFilter === "Free")    return template.template_prize === "Free"
        if (activeFilter === "Premium") return template.template_prize !== "Free"
        return true
      })
  }, [templates, searchQuery, activeFilter])

  // ── Navigation ─────────────────────────────────────────────────────────
  const router = useRouter()

  const handleOpen = (e: React.MouseEvent<HTMLElement>, templateId: string) => {
    e.stopPropagation()
    router.push(`/templates/template/${templateId}`)
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full container max-w-[1580px]">
      <div className="container pt-14 w-full h-auto">
        <AnnoncementBadge aboutBadge={"20 + Premium Templates and Designs by lokalhost.io"} />
        <div className="lg:pt-8 pt-8 w-full lg:w-6xl h-auto mx-auto">
          <div className="w-full lg:w-5xl mx-auto text-center lg:px-8">
            <h1 className="font-sans font-bold text-2xl lg:text-5xl text-neutral-800 dark:text-neutral-200">
              A high quality collection of templates, websites and Blocks for everyone.
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center pt-3 pb-5 gap-3 lg:gap-6">
          <button className="border-1 border-orange-400 cursor-pointer px-8 py-[9px] rounded-lg text-sm font-sans font-medium text-neutral-800 bg-gradient-to-r from-[#F6D5F7] to-[#FBE9D7] shadow-sm flex items-center justify-center gap-2">
            <span><LuFigma /></span> Get Full Access
          </button>
        </div>
      </div>

      <section className="h-auto pt-4 mx-auto mt-10 mb-10">
        <div className="flex flex-wrap justify-between gap-2 items-center w-full pt-0 pb-4">
          <SortTemplates />
          <div className="flex lg:flex-nowrap flex-wrap items-center gap-1">
            <ButtonGroup>
              {(["All", "Free", "Premium"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter)}
                  className={
                    activeFilter === filter
                      ? "lk-btn-primary transition-[filter,box-shadow,transform]"
                      : ""
                  }
                >
                  {filter}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </div>

        {isLoading ? (
          <TemplateShimmerLoadingUI />
        ) : (
          <div className="w-full bg-[#F9F9F9] dark:bg-black border rounded-[18px] p-4 lg:p-5">
            <div className="[columns:1] lg:[columns:2] md:[columns:2] lg:gap-16 md:gap-8 gap-8">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="[break-inside:avoid] mb-3 relative group cursor-pointer"
                  onClick={(e) => handleOpen(e, template.id)}
                >
                  <div className="mb-10 overflow-hidden relative p-4 lg:p-15 rounded-xl bg-white border dark:bg-neutral-950 transition-transform duration-200 hover:-translate-y-0.5 shadow-sm hover:mask-b-from-blue-500 hover:[mask-image:linear-gradient(to_bottom,blue_60%,transparent_95%)]">
                    <div className="min-w-0 relative lg:bottom-8 bottom-2">
                      <Highlighter action="underline" color="#FF9800">
                        <h2 className="font-sans text-sm font-medium leading-tight tracking-normal text-neutral-800 dark:text-neutral-200 lg:text-xl">
                          <span className="bg-gradient-to-r from-neutral-950 via-neutral-700 to-neutral-500 bg-clip-text text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-500">
                            {highlightMatch(template.template_name, searchQuery)}
                          </span>
                        </h2>
                      </Highlighter>
                    </div>

                    <div className="relative z-20 w-full border rounded-xl overflow-hidden transition-transform duration-500 ease-out">
                      {template.template_images?.[0] && (
                        <Image
                          src={template.template_images[0]}
                          alt="Template preview"
                          width={400}
                          height={800}
                          className="rounded-xl w-full h-auto object-cover block"
                        />
                      )}
                    </div>

                    {template.template_images?.[1] && (
                      <Image
                        src={template.template_images[1]}
                        alt="Template preview"
                        width={400}
                        height={800}
                        className="border absolute z-20 top-30 -right-30 lg:top-50 lg:-right-60 rounded-xl w-full h-auto object-cover block transition-transform duration-500 ease-out"
                      />
                    )}

                    <div className="absolute top-2 right-2 w-[26px] h-[26px] bg-black text-white backdrop-blur-sm rounded-[7px] border border-black/[0.08] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-200">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      <CTA />
    </div>
  )
}

export default Templates

// ── Highlight helper ───────────────────────────────────────────────────────
function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-neutral-900 dark:text-white font-bold underline decoration-neutral-400 dark:decoration-neutral-500 underline-offset-2">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}
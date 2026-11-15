// app/sitemap.ts — Next.js serves this at /sitemap.xml
// (the file name must be lowercase `sitemap.ts` for Next.js to pick it up).
// Submit https://localhostui.com/sitemap.xml to Google Search Console.

import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { source } from "@/lib/source"

type Entry = MetadataRoute.Sitemap[number]

const STATIC_ROUTES: { path: string; changeFrequency: Entry["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/docs", changeFrequency: "weekly", priority: 0.9 },
  { path: "/templates", changeFrequency: "weekly", priority: 0.9 },
  { path: "/designs", changeFrequency: "monthly", priority: 0.8 },
  { path: "/mobile", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
  { path: "/custom-work", changeFrequency: "monthly", priority: 0.7 },
  { path: "/softwares", changeFrequency: "monthly", priority: 0.5 },
  { path: "/team", changeFrequency: "monthly", priority: 0.4 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/shipping-policy", changeFrequency: "yearly", priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries: Entry[] = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  // Every docs page (installation + each component), skipping the /docs index listed above.
  const docsEntries: Entry[] = source
    .getPages()
    .filter((page) => page.url !== "/docs")
    .map((page) => ({
      url: `${SITE_URL}${page.url}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    }))

  return [...staticEntries, ...docsEntries]
}

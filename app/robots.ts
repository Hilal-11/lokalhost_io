// app/robots.ts — Next.js serves this at /robots.txt

import type { MetadataRoute } from "next"
import { SITE_DOMAIN, SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/account/", "/checkout/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_DOMAIN,
  }
}

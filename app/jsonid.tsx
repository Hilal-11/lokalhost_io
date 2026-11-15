// Structured data (JSON-LD) rendered once in app/(main)/layout.tsx.
// Tells Google what the site is; every URL derives from SITE_URL.

import { SITE_URL } from "@/lib/site";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // ── 1. Organization ──────────────────────────────────────────────
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Lokalhost.io",
        "url": SITE_URL,
        "logo": {
          "@type": "ImageObject",
          "url": `${SITE_URL}/icon.svg`,
        },
        "sameAs": [
          "https://twitter.com/lokalhostio",
          "https://github.com/Hilal-11",
          // add your socials
        ],
        "description":
          "Premium UI component library, template marketplace and design system for React, Next.js, Flutter and React Native.",
      },

      // ── 2. WebSite (enables Google Sitelinks Search Box) ─────────────
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": "Lokalhost.io",
        "description":
          "UI Components, Templates & Design System for React & Next.js",
        "publisher": { "@id": `${SITE_URL}/#organization` },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${SITE_URL}/docs?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },

      // ── 3. SoftwareApplication ───────────────────────────────────────
      {
        "@type": "SoftwareApplication",
        "name": "Lokalhost.io",
        "operatingSystem": "Web",
        "applicationCategory": "DeveloperApplication",
        "url": SITE_URL,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free UI components with premium templates available",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "120",   // update with real numbers
        },
      },

      // ── 4. ItemList — your main product categories ───────────────────
      {
        "@type": "ItemList",
        "name": "Lokalhost.io Products",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "React UI Components",
            "url": `${SITE_URL}/docs`,
            "description":
              "80+ production-ready React and Next.js UI components with Tailwind CSS",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Website Templates",
            "url": `${SITE_URL}/templates`,
            "description":
              "Premium landing page, SaaS dashboard, and business website templates",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "UI Kits & Design Systems",
            "url": `${SITE_URL}/designs`,
            "description":
              "Figma UI kits and design systems for web and mobile",
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Mobile UI — Flutter & React Native",
            "url": `${SITE_URL}/mobile`,
            "description":
              "Cross-platform mobile UI components for Flutter and React Native",
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Auth UI Kits",
            "url": `${SITE_URL}/authdocs`,
            "description":
              "Authentication UI components and complete auth flow templates",
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
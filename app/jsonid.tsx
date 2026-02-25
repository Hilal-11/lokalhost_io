// components/JsonLd.tsx
// Drop <JsonLd /> inside your page.tsx or layout.tsx <body>
// This tells Google exactly what your site IS — enables rich results

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      // ── 1. Organization ──────────────────────────────────────────────
      {
        "@type": "Organization",
        "@id": "https://lokalhost.io/#organization",
        "name": "Lokalhost.io",
        "url": "https://lokalhost.io",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lokalhost.io/icon.svg",
        },
        "sameAs": [
          "https://twitter.com/lokalhostio",
          "https://github.com/lokalhostio",
          // add your socials
        ],
        "description":
          "Premium UI component library, template marketplace and design system for React, Next.js, Flutter and React Native.",
      },

      // ── 2. WebSite (enables Google Sitelinks Search Box) ─────────────
      {
        "@type": "WebSite",
        "@id": "https://lokalhost.io/#website",
        "url": "https://lokalhost.io",
        "name": "Lokalhost.io",
        "description":
          "UI Components, Templates & Design System for React & Next.js",
        "publisher": { "@id": "https://lokalhost.io/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://lokalhost.io/docs?q={search_term_string}",
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
        "url": "https://lokalhost.io",
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
            "url": "https://lokalhost.io/docs",
            "description":
              "80+ production-ready React and Next.js UI components with Tailwind CSS",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Website Templates",
            "url": "https://lokalhost.io/templates",
            "description":
              "Premium landing page, SaaS dashboard, and business website templates",
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "UI Kits & Design Systems",
            "url": "https://lokalhost.io/designs",
            "description":
              "Figma UI kits and design systems for web and mobile",
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Mobile UI — Flutter & React Native",
            "url": "https://lokalhost.io/mobile",
            "description":
              "Cross-platform mobile UI components for Flutter and React Native",
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Auth UI Kits",
            "url": "https://lokalhost.io/authdocs",
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
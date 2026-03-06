import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoToTop from '@/components/GoToTop';
import Providers from "./provider";
import { FeedbackMobile } from "@/components/GoToTop";
import Footer from "@/components/layout/footer";
import TopLoader from '@/components/TopLoader'
import Header from "./header";
import { JsonLd } from "./jsonid";
import { Analytics } from '@vercel/analytics/next';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {

  // ── Title ─────────────────────────────────────────────────────────────
  // Google shows ~60 chars max in search results
  // default = homepage tab title
  // template = all other pages → "Components — Lokalhost.io"
  title: {
    default: "Lokalhost.io — React Components, Templates & UI Kits",
    template: "%s — Lokalhost.io",
  },

  // ── Description ───────────────────────────────────────────────────────
  // ~155 chars max shown by Google
  // Front-load value: WHO it's for + WHAT it does + HOW (CLI/copy-paste)
  description:
    "Ship faster with Lokalhost.io — 80+ React & Next.js UI components, SaaS templates, landing pages, auth kits, Flutter & React Native mobile UI kits, and business design systems. Copy-paste or install via CLI.",

  // ── Keywords ──────────────────────────────────────────────────────────
  keywords: [
    // brand
    "lokalhost.io",
    "lokalhost components",
    "lokalhost templates",
    // head terms
    "react component library",
    "nextjs component library",
    "ui component library 2025",
    "tailwind component library",
    "animated react components",
    // competitor adjacency
    "shadcn ui alternative",
    "aceternity ui alternative",
    "heroui alternative",
    "magic ui alternative",
    "shadcn studio alternative",
    "motion ui components react",
    "framer motion components library",
    // templates
    "nextjs saas template",
    "react saas dashboard template",
    "landing page template nextjs",
    "business website template react",
    "startup template nextjs",
    "admin dashboard template react",
    "nextjs marketing template",
    "react pricing page template",
    "nextjs blog template",
    // design systems
    "react design system",
    "tailwind design system",
    "ui kit react nextjs",
    "figma react design system",
    "dark mode react components",
    // mobile
    "flutter ui kit",
    "flutter templates 2025",
    "react native ui components",
    "react native templates",
    "cross platform ui kit",
    "flutter design system",
    "mobile app ui kit",
    // auth
    "auth ui kit react",
    "authentication page templates",
    "login page template nextjs",
    // marketplace
    "react template marketplace",
    "ui component marketplace",
    "buy nextjs templates",
    "premium react components",
    "free react components",
    // specific components people google
    "bento grid react component",
    "animated hero section react",
    "react navbar component",
    "react footer component",
    "react pricing table component",
    "react testimonials component",
    "waitlist page template",
    // services
    "custom saas development",
    "hire react nextjs developer",
    "build saas application",
    "web app development service",
    "custom website development",
  ],

  // ── Canonical & Base ──────────────────────────────────────────────────
  metadataBase: new URL("https://lokalhost.io"),
  alternates: {
    canonical: "/",
  },

  // ── Open Graph ────────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    url: "https://lokalhost.io",
    siteName: "Lokalhost.io",
    locale: "en_US",
    title: "Lokalhost.io — React Components, Templates & UI Kits",
    description:
      "80+ production-ready React & Next.js UI components, SaaS templates, mobile UI kits for Flutter & React Native, auth kits, and business design systems. Ship your product faster.",
    images: [
      {
        url: "/og-image.png",          // create: 1200×630px
        width: 1200,
        height: 630,
        alt: "Lokalhost.io — React UI Components, Templates & Design Systems",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@lokalhostio",              // replace with your real handle
    creator: "@lokalhostio",
    title: "Lokalhost.io — React Components, Templates & UI Kits",
    description:
      "80+ production-ready React & Next.js components, SaaS templates, mobile UI kits. Ship faster with copy-paste or CLI install.",
    images: ["/og-image.png"],
  },

  // ── Robots ────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Icons ─────────────────────────────────────────────────────────────
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.png",    // create: 180×180px
  },

  // ── Google Search Console verification ───────────────────────────────
  // Get token from: https://search.google.com/search-console
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  },

  // ── App info ──────────────────────────────────────────────────────────
  applicationName: "Lokalhost.io",
  authors: [{ name: "Lokalhost.io", url: "https://lokalhost.io" }],
  creator: "Lokalhost.io",
  publisher: "Lokalhost.io",
  category: "Technology",
  classification: "Developer Tools, UI Components, Templates",

  // ── Theme ─────────────────────────────────────────────────────────────
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#09090b" },
  ],

  // ── Apple / PWA ───────────────────────────────────────────────────────
  appleWebApp: {
    capable: true,
    title: "Lokalhost.io",
    statusBarStyle: "black-translucent",
  },

  // ── Misc ──────────────────────────────────────────────────────────────
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        id="top"
        className={`relative font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <JsonLd />
          <GoToTop />
          <div className="lg:hidden md:hidden flex"><FeedbackMobile /></div>
          <TopLoader />
          <Header />
          <Analytics />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
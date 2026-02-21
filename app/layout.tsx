import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoToTop from '@/components/GoToTop';
import Providers from "./provider";
import { FeedbackMobile } from "@/components/GoToTop";
import Wrapper from "./Wrapper";
import Footer from "@/components/layout/footer";
import TopLoader from '@/components/TopLoader'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lokalhost.io",
  description: "component library, web templates, mobile apps, designs and patterns",
};

interface Service {
  service: string;
  navigateTo: string;
}

interface FooterServicesItem {
  id: string;
  service_title: string;
  services: Service[];
}

interface FooterConfig {
  footer_heading: string;
  creator_name: string;
  link: string;
  footerServicesItems: FooterServicesItem[];
}


async function getFooterConfigData(): Promise<FooterConfig> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/config/footerConfig.json`,
    {
      cache: 'force-cache', // ✅ cached forever (until rebuild)
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch Footer config');
  }
  return res.json();
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerConfigData = await getFooterConfigData();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        id="top"
        className={`relative font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <GoToTop />
          <div className="lg:hidden md:hidden flex"><FeedbackMobile/></div>
          <Wrapper/>
          <TopLoader />
          {children}
          <Footer footerConfig={footerConfigData}/>
        </Providers>
      </body>
    </html>
  );
}

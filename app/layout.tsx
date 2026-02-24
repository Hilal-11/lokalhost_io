import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoToTop from '@/components/GoToTop';
import Providers from "./provider";
import { FeedbackMobile } from "@/components/GoToTop";
import Footer from "@/components/layout/footer";
import TopLoader from '@/components/TopLoader'
import Header from "./header";
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
          <GoToTop />
          <div className="lg:hidden md:hidden flex"><FeedbackMobile/></div>
          <TopLoader />
          <Header />
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}

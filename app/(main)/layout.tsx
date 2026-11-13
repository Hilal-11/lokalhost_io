import { ReactNode } from 'react'
import GoToTop, { FeedbackMobile } from "@/components/GoToTop"
import { JsonLd } from "../jsonid"
import Header from "../header"
import ConditionalFooter from '@/components/layout/ConditionalFooter'


export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd />
      <GoToTop />
      <div className="lg:hidden md:hidden flex"><FeedbackMobile /></div>
      <Header />
      {children}
      <ConditionalFooter />
    </>
  )
}
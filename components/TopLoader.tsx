'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NProgress from 'nprogress'

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  speed: 400,
  minimum: 0.25,
  easing: 'ease',
  trickleSpeed: 200
})

export default function TopLoader() {
  const pathname = usePathname()

  useEffect(() => {
    // Complete the loading bar when pathname changes (page loaded)
    NProgress.done()
  }, [pathname])

  return null
}
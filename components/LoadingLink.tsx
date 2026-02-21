'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import { ReactNode, MouseEvent } from 'react'

interface LoadingLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function LoadingLink({ href, children, className, onClick }: LoadingLinkProps) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Start the loading bar immediately on click
    NProgress.start()
    
    // Call custom onClick if provided
    if (onClick) {
      onClick()
    }
    
    // Navigate to the new page
    router.push(href)
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
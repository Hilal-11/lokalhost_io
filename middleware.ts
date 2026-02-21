// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const res = NextResponse.next()

  // pass pathname to server components
  res.headers.set('x-pathname', pathname)

  return res
}
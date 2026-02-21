import { headers } from 'next/headers'
// import Header from './header'
import Header from './header'

export default function Wrapper() {
  const pathname = headers().get('x-pathname') || ''

  if (
    pathname.startsWith('/docs') ||
    pathname.startsWith('/authdocs') ||
    pathname.startsWith('/backgrounds')
  ) {
    return null
  }

  return <Header />
}
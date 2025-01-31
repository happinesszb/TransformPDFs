import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LANGUAGE_PATHS = {
  zh: '/cn',
  ar: '/ar',
  fr: '/fr',
  es: '/es',
  pt: '/pt',
  en: '/en'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  //  
  if (pathname.startsWith('/js/') || 
      pathname.startsWith('/images/') || 
      pathname.startsWith('/fonts/')) {
    return NextResponse.next()
  }
  
  //  
  if (Object.values(LANGUAGE_PATHS).some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  //  
  const acceptLanguage = request.headers.get('accept-language') || ''
  const primaryLanguage = acceptLanguage.split(',')[0].trim().split('-')[0].toLowerCase()
  const redirectPath = LANGUAGE_PATHS[primaryLanguage as keyof typeof LANGUAGE_PATHS] || LANGUAGE_PATHS.en

  //  
  return NextResponse.redirect(new URL(redirectPath + pathname, request.url))
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|js|images|fonts|favicon.ico).*)'
  ]
} 
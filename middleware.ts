import acceptLanguage from 'accept-language'
import { NextRequest, NextResponse } from 'next/server'
import {
  cookieName,
  fallbackLng,
  languages,
  searchParamName,
} from './app/i18n/settings'
import { logger } from './lib/logger'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|.*.(?:png|jpg|jpeg)).*)',
  ],
}

export function middleware(req: NextRequest) {
  // Skip requests for title bar icons, chrome view webpage icons, website icons, website listings, etc
  if (
    req.nextUrl.pathname.indexOf('icon') > -1 ||
    req.nextUrl.pathname.indexOf('chrome') > -1
  )
    return NextResponse.next()
  let lng: string | undefined | null
  let searchLng: string | undefined | null = undefined
  let pathLng: string | undefined | null = undefined
  let headerLng: string | undefined | null = undefined
  // 1 Retrieve language from query parameters
  if (req.nextUrl.searchParams.has(searchParamName))
    searchLng = acceptLanguage.get(
      req.nextUrl.searchParams.get(searchParamName)
    )
  // 2 Retrieve language from cookies
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  // 3 Retrieve language from request header
  if (!lng)
    lng = headerLng = acceptLanguage.get(req.headers.get('Accept-Language'))
  // 4 default language
  if (!lng) lng = fallbackLng

  // Delete if the query parameter exists
  searchLng && req.nextUrl.searchParams.delete(searchParamName)

  // Delete if the query parameter exists
  pathLng = languages.find((loc) => req.nextUrl.pathname.startsWith(`/${loc}`))

  // If there is a language in the query parameters, redirect to a path prefixed with language
  // If the query parameter does not exist and the path is not prefixed with language, redirect to the path prefixed with language
  if (
    // 1 There is no path prefixed with query parameters
    ((searchLng && !req.nextUrl.pathname.startsWith(`/${searchLng}`)) ||
      // 2 There is no path prefixed with language
      !pathLng) &&
    // Path not prefixed with '_next'
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    logger.debug({ searchLng, pathLng, lng })
    searchLng &&
      ((lng = searchLng),
      (req.nextUrl.pathname =
        req.nextUrl.pathname.replace(`/${pathLng}`, '') || '/'))
    const url = req.nextUrl.clone()
    url.pathname = `/${lng}${url.pathname}`
    return NextResponse.redirect(url, {
      headers: {
        'Set-Cookie': `${cookieName}=${lng}; path=/; Max-Age=2147483647`,
      },
    })
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    )
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
}
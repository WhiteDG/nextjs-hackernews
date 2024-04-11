import { NextResponse, type NextRequest } from "next/server"

import { getProfile } from "@/lib/hn-web-fetcher"
import { COOKIE_NAME_SESSION, parseSession } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  let sessionValue = request.cookies.get(COOKIE_NAME_SESSION)?.value
  const liveSession = await validateSession(sessionValue)
  if (isAuthPath(pathname)) {
    if (liveSession) {
      return NextResponse.redirect(new URL(`/`, request.url))
    }
  } else {
    if (!liveSession) {
      const response = NextResponse.redirect(
        new URL(
          `/login?goto=${pathname}?${searchParams.toString()}`,
          request.url
        )
      )
      let allCookies = request.cookies.getAll()
      if (allCookies && allCookies.length > 0) {
        allCookies.forEach((c) => {
          response.cookies.delete(c.name)
        })
      }
      return response
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/signup"],
}

function isAuthPath(pathname: string) {
  return ["/login", "/signup"].includes(pathname)
}
async function validateSession(sessionValue: string | undefined) {
  if (!sessionValue) {
    return false
  }
  const { userCookieVal, acct } = parseSession(sessionValue)
  const profile = await getProfile(acct, userCookieVal)
  return profile && profile.authCode
}

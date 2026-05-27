import { NextResponse, type NextRequest } from "next/server"

import { COOKIE_NAME_SESSION, parseSession } from "@/lib/session"

export function proxy(request: NextRequest) {
  const sessionValue = request.cookies.get(COOKIE_NAME_SESSION)?.value
  const hasValidSession = validateSession(sessionValue)

  if (hasValidSession) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/signup"],
}

function validateSession(sessionValue: string | undefined) {
  if (!sessionValue) {
    return false
  }
  try {
    const session = parseSession(sessionValue)
    return Boolean(session.userCookieVal && session.authCode && session.acct)
  } catch {
    return false
  }
}

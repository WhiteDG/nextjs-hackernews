import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies"
import { cookies } from "next/headers"

import { getProfile } from "@/lib/hn-web-fetcher"
import { decrypt, encrypt } from "@/lib/utils"

export const COOKIE_NAME_SESSION = "hn_session"

export const getCurrentUserId = () => {
  const session = getSession()
  if (!session) {
    return
  }
  const userCookieVal = session.userCookieVal
  if (userCookieVal) {
    return userCookieVal.split("&")[0]
  } else {
    return null
  }
}

const parseAcct = (acctCookieVal: string) => {
  const acctPw = acctCookieVal.split("||")
  const acct = decrypt(acctPw[0])
  const pw = decrypt(acctPw[1])
  return { acct, pw }
}

export const getAcct = () => {
  const session = getSession()
  if (!session) {
    return
  }
  return { acct: session.acct, pw: session.pw }
}

export const isLogin = () => {
  return getCurrentUserId() != null
}

export const destorySession = () => {
  cookies().delete(COOKIE_NAME_SESSION)
}

export const parseSession = (sessionValue: string) => {
  const cookieValueArray = sessionValue.split("|_|")
  const userCookieVal = cookieValueArray[0]
  const authCode = cookieValueArray[1]
  const acctPw = parseAcct(cookieValueArray[2])
  return { userCookieVal, authCode, ...acctPw }
}

export const getSession = () => {
  const sessionValue = cookies().get(COOKIE_NAME_SESSION)?.value
  if (!sessionValue) {
    return
  }
  return parseSession(sessionValue)
}

export const createSession = async (
  userCookie: ResponseCookie,
  acct: string,
  pw: string
) => {
  const profile = await getProfile(acct, userCookie.value)
  if (profile?.authCode) {
    const authCookieValue: string = profile.authCode
    const encryptdAcct = encrypt(acct)
    const encryptdPw = encrypt(pw)
    const acctCookieValue = `${encryptdAcct}||${encryptdPw}`
    const val = `${userCookie.value}|_|${authCookieValue}|_|${acctCookieValue}`
    userCookie.name = COOKIE_NAME_SESSION
    userCookie.value = val
    userCookie.secure = process.env.NODE_ENV === "production"
    cookies().set(userCookie)
  }
}

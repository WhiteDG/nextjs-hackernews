"use server"

import { parseSetCookie } from "next/dist/compiled/@edge-runtime/cookies"

import { getHnWebUrl } from "@/config/urls"

import {
  parseBody,
  parseProfile,
  parseStories,
  parseThreads,
} from "./hn-web-parser"
import { VoteStatus } from "./hn-web-types"
import { getCurrentUserId, getSession } from "./session"

const getHtml = async (url: string) => {
  const response = await fetch(url, {
    headers: getUserHeaders(),
    next: {
      revalidate: 120,
    },
  })
  return await response.text()
}

const postForm = async (url: string, data: string | URLSearchParams) => {
  return await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
    body: data,
    redirect: "manual",
  })
}

function getUserHeaders() {
  const headers: [string, string][] = []
  const session = getSession()
  if (session?.userCookieVal) {
    headers.push(["Cookie", `user=${session.userCookieVal}`])
  }
  return headers
}

export const login = async ({
  acct,
  pw,
  creating,
}: {
  acct: string
  pw: string
  creating?: string
}) => {
  const formData = new URLSearchParams()
  formData.append("acct", acct)
  formData.append("pw", pw)
  if (creating) {
    formData.append("creating", creating)
  }
  const loginResp = await postForm(getHnWebUrl("/login"), formData)
  const status = loginResp.status
  const setCookies = loginResp.headers.getSetCookie()
  if (status === 302 && setCookies && setCookies.length > 0) {
    const userCookie = parseSetCookie(setCookies[0])
    return {
      success: true,
      userCookie,
    }
  } else if (loginResp.status === 200) {
    const tips = parseBody(await loginResp.text())
    console.log("🚀 ~ tips:", tips)
    return {
      success: false,
      message: tips,
    }
  } else {
    return {
      success: false,
      message: "Error",
    }
  }
}

export const logout = async () => {
  const session = getSession()
  if (session?.authCode) {
    const logoutResp = await fetch(
      getHnWebUrl(`/logout?auth=${session.authCode}`),
      {
        headers: getUserHeaders(),
      }
    )
  }
}

export const getProfile = async (acct?: string, userCookieVal?: string) => {
  const userId = acct || getCurrentUserId()
  if (userId) {
    const headers = getUserHeaders()
    if (userCookieVal) {
      headers.push(["Cookie", `user=${userCookieVal}`])
    }
    try {
      const response = await fetch(getHnWebUrl(`/user?id=${userId}`), {
        headers: headers,
        next: {
          revalidate: 120,
        },
      })
      const html = await response.text()
      return parseProfile(html)
    } catch (error) {
      console.log(error)
      throw Error("get profile error")
    }
  } else {
    return null
  }
}

export const fave = async ({
  acct,
  pw,
  id,
  fave,
}: {
  acct: string
  pw: string
  id: number
  fave: boolean
}) => {
  const formData = new URLSearchParams()
  formData.append("acct", acct)
  formData.append("pw", pw)
  formData.append("id", id.toString())
  if (!fave) {
    formData.append("un", "t")
  }
  const faveResp = await postForm(getHnWebUrl("fave"), formData)
}

export const vote = ({
  acct,
  pw,
  id,
  how,
}: {
  acct: string
  pw: string
  id: number
  how: VoteStatus
}) => {
  const formData = new URLSearchParams()
  formData.append("acct", acct)
  formData.append("pw", pw)
  formData.append("id", id.toString())
  formData.append("how", how)
  const voteResp = postForm(getHnWebUrl("vote"), formData)
}

export const reply = async ({
  acct,
  pw,
  parent,
  text,
}: {
  acct: string
  pw: string
  parent: number
  text: string
}) => {
  const formData = new URLSearchParams()
  formData.append("acct", acct)
  formData.append("pw", pw)
  formData.append("parent", parent.toString())
  formData.append("text", text)
  const replyResp = await postForm("comment", formData)
}

export const getThreads = async (userId: string, next: number) => {
  const html = await getHtml(getHnWebUrl(`/threads?id=${userId}&next=${next}`))
  const { comments, moreLink } = parseThreads(html)
  return { comments, moreLink }
}

export const getSubmitted = async (userId: string, next: number, n: number) => {
  const moreParams = next ? `&next=${next}&n=${n}` : ""
  const html = await getHtml(
    getHnWebUrl(`/submitted?id=${userId}${moreParams}`)
  )
  const { storyList, moreLink } = parseStories(html)
  return { storyList, moreLink }
}

export const getFavoriteSubmissions = async (userId: string) => {
  const html = await getHtml(getHnWebUrl(`/favorites?id=${userId}`))
  const { storyList, moreLink } = parseStories(html)
  return { storyList, moreLink }
}

export const getFavoriteThreads = async (userId: string) => {
  const html = await getHtml(getHnWebUrl(`/favorites?id=${userId}&comments=t`))
  const { comments, moreLink } = parseThreads(html)
  return { comments, moreLink }
}

export const getUpvotedSubmissions = async (userId: string) => {
  const html = await getHtml(getHnWebUrl(`/upvoted?id=${userId}`))
  const { storyList, moreLink } = parseStories(html)
  storyList.forEach((item) => (item.upvoted = true))
  return { storyList, moreLink }
}

export const getUpvotedComments = async (userId: string) => {
  const html = await getHtml(getHnWebUrl(`/upvoted?id=${userId}&comments=t`))
  const { comments, moreLink } = parseThreads(html)
  return { comments, moreLink }
}

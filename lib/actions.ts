"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { fave, login, logout, reply, vote } from "./hn-web-fetcher"
import { VoteStatus } from "./hn-web-types"
import { createSession, destorySession, getAcct } from "./session"

const goto = (path: string | FormData) => {
  let target: string = "/"
  if (typeof path === "string") {
    target = path || "/"
  } else {
    target = path.get("goto")?.toString() || "/"
  }
  const targetPath = target.split("?")[0] || "/"
  revalidatePath(targetPath)
  redirect(target)
}

export async function loginAction({
  acct,
  pw,
  goto: path,
  creating,
}: {
  acct: string
  pw: string
  goto: string
  creating?: string
}) {
  try {
    const { success, message, userCookie } = await login({
      acct,
      pw,
      creating,
    })
    if (!success) {
      return {
        success: false,
        message: `Error: ${message}`,
      }
    }
    if (userCookie) {
      await createSession(userCookie, acct, pw)
    } else {
      return {
        success: false,
        message: `Error: Failed to Get Cookie.`,
      }
    }
  } catch (error) {
    console.error("🚀 ~ error:", error)
    return {
      success: false,
      message: "Error: Failed to Login.",
    }
  }
  goto(path)
}

export const logoutAction = async (formData: FormData) => {
  try {
    logout()
  } catch (error) {
    console.warn("🚀 ~ logoutAction ~ error:", error)
  }
  await destorySession()
  goto(formData)
}

export const faveAction = async (id: number, faved: boolean) => {
  const acctPw = await getAcct()
  if (acctPw && acctPw.acct && acctPw.pw) {
    try {
      await fave({
        ...acctPw,
        id,
        fave: faved,
      })
    } catch (error) {
      return {
        status: -1,
        message: "Error: Failed to fave.",
      }
    }
    revalidatePath("/user/favorites")
    return {
      success: true,
    }
  } else {
    return {
      success: false,
      message: "Not Login",
    }
  }
}

export const replyAction = async ({
  parent,
  text,
}: {
  parent: number
  text: string
}) => {
  const acctPw = await getAcct()
  if (acctPw && acctPw.acct && acctPw.pw) {
    try {
      await reply({
        ...acctPw,
        parent,
        text,
      })
    } catch (error) {
      return {
        success: false,
        message: "Error: Failed to reply.",
      }
    }
  } else {
    goto("/login")
  }
}

export const voteAction = async (id: number, how: VoteStatus) => {
  const acctPw = await getAcct()
  if (acctPw && acctPw.acct && acctPw.pw) {
    try {
      await vote({
        ...acctPw,
        id,
        how,
      })
    } catch (error) {
      return {
        status: -1,
        message: "Error: Failed to upvote.",
      }
    }
    revalidatePath("/user/upvoted")
    return {
      success: true,
    }
  } else {
    return {
      success: false,
      message: "Not Login",
    }
  }
}

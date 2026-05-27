"use client"

import { createContext, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import useSWR, { mutate as globalMutate } from "swr"

import { HnUser } from "@/lib/hn-types"

export const CurrentUserContext = createContext<HnUser | undefined | null>(
  undefined
)

export interface CurrentUserProviderProps {
  children: React.ReactNode
}

const LOGIN_MARKER_COOKIE = "hn_logged_in"
const LOGIN_MARKER_CHANGE_EVENT = "hn-login-marker-change"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`)
  return res.json()
}

const subscribe = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === LOGIN_MARKER_CHANGE_EVENT) {
      onStoreChange()
    }
  }
  const handleVisibilityChange = () => {
    if (document.visibilityState !== "hidden") {
      onStoreChange()
    }
  }

  window.addEventListener(LOGIN_MARKER_CHANGE_EVENT, onStoreChange)
  window.addEventListener("focus", onStoreChange)
  window.addEventListener("storage", handleStorage)
  document.addEventListener("visibilitychange", handleVisibilityChange)

  return () => {
    window.removeEventListener(LOGIN_MARKER_CHANGE_EVENT, onStoreChange)
    window.removeEventListener("focus", onStoreChange)
    window.removeEventListener("storage", handleStorage)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}

const getLoginMarkerSnapshot = () => {
  if (typeof document === "undefined") {
    return false
  }

  return document.cookie
    .split("; ")
    .some((cookie) => cookie.startsWith(`${LOGIN_MARKER_COOKIE}=`))
}

const getServerLoginMarkerSnapshot = () => false

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  usePathname()
  const hasLoginMarker = useSyncExternalStore(
    subscribe,
    getLoginMarkerSnapshot,
    getServerLoginMarkerSnapshot
  )

  const { data } = useSWR<HnUser | null>(
    hasLoginMarker ? "/api/user" : null,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60_000,
    }
  )
  const value =
    hasLoginMarker === false
      ? null
      : data === undefined
        ? undefined
        : (data ?? null)

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function revalidateCurrentUser() {
  notifyLoginMarkerChanged()
  return globalMutate("/api/user")
}

export function clearCurrentUser() {
  expireLoginMarkerCookie()
  notifyLoginMarkerChanged()
  return globalMutate("/api/user", null, { revalidate: false })
}

function notifyLoginMarkerChanged() {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new Event(LOGIN_MARKER_CHANGE_EVENT))
  try {
    window.localStorage.setItem(LOGIN_MARKER_CHANGE_EVENT, Date.now().toString())
  } catch {
    // Ignore storage failures; the same-tab custom event still updates state.
  }
}

function expireLoginMarkerCookie() {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${LOGIN_MARKER_COOKIE}=; Max-Age=0; path=/`
}

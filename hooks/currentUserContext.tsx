"use client"

import { createContext, useEffect } from "react"
import { usePathname } from "next/navigation"
import useSWR, { mutate as globalMutate } from "swr"

import { HnUser } from "@/lib/hn-types"

export const CurrentUserContext = createContext<HnUser | undefined | null>(
  undefined
)

export interface CurrentUserProviderProps {
  children: React.ReactNode
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`)
  return res.json()
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const pathname = usePathname()
  const { data } = useSWR<HnUser | null>("/api/user", fetcher, {
    shouldRetryOnError: false,
  })

  useEffect(() => {
    globalMutate("/api/user")
  }, [pathname])

  return (
    <CurrentUserContext.Provider
      value={data === undefined ? undefined : data ?? null}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}

export function revalidateCurrentUser() {
  return globalMutate("/api/user")
}

export function clearCurrentUser() {
  return globalMutate("/api/user", null, { revalidate: false })
}

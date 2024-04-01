"use client"

import { createContext } from "react"

import { HnUser } from "@/lib/hn-types"

export const CurrentUserContext = createContext?.<HnUser | undefined | null>(
  undefined
)

export interface CurrentUserProviderProps {
  children: React.ReactNode
  currentUser?: HnUser | null
}

export function CurrentUserProvider({
  currentUser,
  children,
}: CurrentUserProviderProps) {
  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  )
}

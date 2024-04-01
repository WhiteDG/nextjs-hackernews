import { useContext } from "react"

import { CurrentUserContext } from "./currentUserContext"

export default function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext)
  return currentUser
}

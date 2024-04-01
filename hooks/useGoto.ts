import { usePathname, useSearchParams } from "next/navigation"

import { createUrl } from "@/lib/utils"

export default function useGoto() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const goto = createUrl(pathname, searchParams)

  return goto
}

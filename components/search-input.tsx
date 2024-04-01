"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"

export default function SearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, push } = useRouter()
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // @ts-expect-error
      const val = event.target.value
      if (val) {
        const target = `/search?query=${val}`
        if (pathname === "/search") {
          replace(target)
        } else {
          push(target)
        }
      }
    }
  }
  return (
    <div className="relative mx-1 flex-1 md:flex-initial">
      <SearchIcon className="absolute left-2 top-1/2 size-3 -translate-y-1/2" />
      <Input
        placeholder="Search..."
        className="h-9 pl-8"
        defaultValue={searchParams.get("query")?.toString()}
        onKeyUp={handleKeyUp}
      />
    </div>
  )
}

"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon } from "lucide-react"

import { searchPath } from "@/lib/routes"
import { Input } from "@/components/ui/input"

export default function SearchInput() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, push } = useRouter()
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const val = (event.target as HTMLInputElement).value
      if (val) {
        const target = searchPath(val)
        if (pathname.startsWith("/search")) {
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
        defaultValue={
          searchParams.get("query")?.toString() ?? queryFromPath(pathname)
        }
        onKeyUp={handleKeyUp}
      />
    </div>
  )
}

function queryFromPath(pathname: string) {
  const match = pathname.match(/^\/search\/([^/]+)/)
  if (!match?.[1]) {
    return ""
  }
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

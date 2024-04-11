"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

const tabs = [
  {
    label: "Submissions",
  },
  {
    label: "Comments",
  },
]
export default function FavoritesTab({ userId }: { userId?: string | null }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const type = searchParams.get("type")

  return (
    <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
      {tabs.map((example, index) => (
        <button
          key={example.label}
          data-state={
            type === example.label.toLowerCase() || (index === 0 && !type)
              ? "active"
              : "inactive"
          }
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3",
            "py-1.5 text-sm font-medium ring-offset-background transition-all ",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          )}
        >
          <Link
            rel="noreferrer nofollow"
            href={{
              pathname: pathname,
              query: { id: userId, type: example.label.toLowerCase() },
            }}
          >
            {example.label}
          </Link>
        </button>
      ))}
    </div>
  )
}

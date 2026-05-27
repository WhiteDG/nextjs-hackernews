import Link from "next/link"
import { LinkIcon } from "lucide-react"

import { site } from "@/lib/hn-item-utils"
import { searchPath } from "@/lib/routes"

export default function StoryUrl({ url }: { url?: string }) {
  const siteName = site(url)

  if (!siteName) {
    return null
  }

  return (
    <div className="flex items-center justify-center truncate">
      <LinkIcon size={12} className="mr-0.5" />
      <Link
        rel="noreferrer nofollow"
        href={searchPath(siteName, { sort: "byDate" })}
        prefetch={false}
      >
        {siteName}
      </Link>
    </div>
  )
}

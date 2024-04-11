import Link from "next/link"
import { LinkIcon } from "lucide-react"

import { site } from "@/lib/hn-item-utils"

export default function StoryUrl({ url }: { url?: string }) {
  return (
    <div className="flex items-center justify-center truncate">
      <LinkIcon size={12} className="mr-0.5" />
      <Link rel="noreferrer nofollow" href={`/search?query=${site(url)}&sort=byDate`}>{site(url)}</Link>
    </div>
  )
}

import Link from "next/link"
import { MessageCircleIcon } from "lucide-react"

import { commentCount } from "@/lib/hn-item-utils"

export default function StoryCommentCount({
  storyId,
  count,
}: {
  storyId: number
  count?: number | string
}) {
  return (
    <div className="flex items-center justify-center truncate hover:text-primary">
      <MessageCircleIcon size={12} className="mr-0.5" />
      <Link rel="noreferrer nofollow" href={`/item?id=${storyId}`}>
        {typeof count === "string"
          ? count
          : count == 0
            ? "discuss"
            : commentCount(count)}
      </Link>
    </div>
  )
}

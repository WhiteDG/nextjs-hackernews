import { Flame } from "lucide-react"

import { points } from "@/lib/hn-item-utils"

export default function StoryPoint({ score }: { score?: number | string }) {
  if (!score) {
    return null
  }
  return (
    <div className="flex items-center justify-center truncate">
      <Flame size={12} className="mr-0.5" />
      <span>{typeof score === "string" ? score : points(score)}</span>
    </div>
  )
}

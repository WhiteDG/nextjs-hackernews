import { Clock } from "lucide-react"

import { ago } from "@/lib/hn-item-utils"

export default function StoryTime({ time }: { time?: number | string }) {
  return (
    <div className="flex items-center justify-center truncate">
      <Clock size={12} className="mr-0.5" />
      <span>{typeof time === "string" ? time : ago(time)}</span>
    </div>
  )
}

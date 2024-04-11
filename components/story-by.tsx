import Link from "next/link"
import { UserRound } from "lucide-react"

export default function StoryBy({ by }: { by?: string }) {
  return (
    <div className="flex items-center justify-center truncate hover:text-primary">
      <UserRound size={12} className="mr-0.5" />
      <Link rel="noreferrer nofollow" href={`/user?id=${by}`}>{by}</Link>
    </div>
  )
}

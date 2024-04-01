"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useGoto } from "@/hooks"
import { toast } from "sonner"

import { voteAction } from "@/lib/actions"
import { VoteStatus } from "@/lib/hn-web-types"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Vote({
  storyId,
  state,
  upvoted,
}: {
  storyId: number
  upvoted?: boolean
  state: "visiable" | "invisible" | "hidden"
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [voted, setVoted] = useState(upvoted)
  const [disabled, setDisabled] = useState(false)
  const goto = useGoto()

  const handleVote = async () => {
    setDisabled(true)
    const result = await voteAction(
      storyId,
      voted ? VoteStatus.un : VoteStatus.up
    )
    setDisabled(false)
    if (result?.success) {
      setVoted(!voted)
      toast.success(voted ? "Unvoted" : "Upvoted")
      if (pathname.endsWith("upvoted")) {
        router.refresh()
      }
    } else {
      if (result.message === "Not Login") {
        toast("You have to be logged in to vote.", {
          action: {
            label: "Login",
            onClick: () => router.push(`/login?goto=${goto}`),
          },
        })
      } else {
        toast.error(result?.message)
      }
    }
  }

  return (
    <form action={handleVote} className={state}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled={disabled}
              type="submit"
              className={cn(
                "hover:cursor-pointer",
                voted
                  ? "text-primary hover:text-muted-foreground/80"
                  : "text-muted-foreground/80  hover:text-primary"
              )}
            >
              &#9650;
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-48 border-0 bg-primary font-semibold text-primary-foreground">
            Click to {voted ? "unvote" : "vote"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  )
}

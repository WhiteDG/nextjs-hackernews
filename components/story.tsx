"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { getVoteState } from "@/lib/hn-item-utils"
import { HnWebStory } from "@/lib/hn-web-types"
import { cn } from "@/lib/utils"
import StoryBy from "@/components/story-by"
import StoryCommentCount from "@/components/story-comment-count"
import StoryPoint from "@/components/story-point"
import StoryTime from "@/components/story-time"
import Vote from "@/components/vote"

import Fave from "./fave"

type Props = {
  data: HnWebStory
  hideVote: boolean
  hidePoints?: boolean
  hideUsername?: boolean
  hideAge?: boolean
  hideCommentCount?: boolean
  hideFave?: boolean
}

export default function Story({
  data,
  hideVote = false,
  hidePoints = false,
  hideUsername = false,
  hideAge = false,
  hideCommentCount = false,
  hideFave = true,
}: Props) {
  const pathname = usePathname()
  const voteState = getVoteState(pathname, hideVote)
  return (
    <div className="flex flex-row border-b py-2 md:w-full">
      {voteState === "visiable" && (
        <Vote storyId={data.id} upvoted={data.upvoted} state="visiable" />
      )}
      {voteState === "invisible" && <div className="invisible">&#9650;</div>}
      <div>
        <div className="pl-1">
          <Link
            className={cn(data.dead ? "text-muted-foreground" : "")}
            href={data.dead ? "" : data.url || `item?id=${data.id}`}
            rel="noopener noreferrer nofollow"
            target={data.url ? "_blank" : "_self"}
          >
            {(data.dead ? "[dead] " : "") + data.title}{" "}
          </Link>
          {data.sitestr && (
            <Link
              className="text-sm text-muted-foreground"
              href={`/search?query=${data.sitestr}&sort=byDate`}
              rel="noopener noreferrer nofollow"
            >
              ({data.sitestr})
            </Link>
          )}
        </div>

        <div
          className={
            "flex flex-wrap gap-x-3 pl-1 text-sm text-muted-foreground md:space-x-4"
          }
        >
          {!hidePoints && <StoryPoint score={data.score} />}
          {!hideUsername && <StoryBy by={data.by} />}
          {!hideAge && <StoryTime time={data.age} />}
          {!hideCommentCount && data.comments && (
            <StoryCommentCount storyId={data.id} count={data.comments} />
          )}
          {!hideFave && <Fave storyId={data.id} faved={true} />}
        </div>
      </div>
    </div>
  )
}

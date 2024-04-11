"use client"

import { useState } from "react"
import Link from "next/link"
import { MinusCircleIcon, PlusCircleIcon } from "lucide-react"

import { HnComment, HnItem } from "@/lib/hn-types"
import { timeAgo } from "@/lib/time-utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import HtmlText from "@/components/html-text"
import Vote from "@/components/vote"

import ReplyDialog from "./reply-dialog"

export default function Comment({
  comment,
  story,
}: {
  comment: HnComment
  story?: HnItem
}) {
  const isOp = story?.by === comment.by
  const [collapse, setCollapse] = useState(true)
  if (comment.deleted || comment.dead) {
    return <></>
  }

  const replies = comment.comments
  return (
    <div className="flex flex-col justify-start">
      <div className="flex flex-row justify-start space-x-1 text-sm text-muted-foreground">
        <Vote storyId={comment.id} state={"visiable"} />{" "}
        <Link
          rel="nofollow noreferrer"
          className="hover:underline"
          href={{
            pathname: "/user",
            query: { id: comment.by },
          }}
        >
          {comment.by}
        </Link>
        {isOp && (
          <Badge
            variant={"outline"}
            className="px-1.5 py-0 text-accent-foreground"
          >
            OP
          </Badge>
        )}
        •
        <Link rel="nofollow noreferrer" href={{ pathname: "/item", query: { id: comment.id } }}>
          {timeAgo(comment.time)} ago
        </Link>
      </div>
      {comment.text && (
        <div className="pl-5">
          <HtmlText innerHtml={comment.text} />
          <div className="flex flex-row items-center space-x-2">
            {replies && replies.length > 0 && (
              <div>
                {collapse ? (
                  <MinusCircleIcon
                    className="cursor-pointer"
                    size={14}
                    onClick={() => setCollapse(!collapse)}
                  />
                ) : (
                  <PlusCircleIcon
                    className="cursor-pointer"
                    size={14}
                    onClick={() => setCollapse(!collapse)}
                  />
                )}
              </div>
            )}
            {!story?.dead && <ReplyDialog comment={comment} />}
          </div>
        </div>
      )}
      {replies && replies.length > 0 && (
        <div
          className={cn(
            `grid overflow-hidden transition-all duration-300 ease-in-out`,
            `${collapse ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`
          )}
        >
          <div className="overflow-hidden pl-10">
            {replies.map((comment) => {
              return (
                <Comment key={comment?.id} comment={comment} story={story} />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

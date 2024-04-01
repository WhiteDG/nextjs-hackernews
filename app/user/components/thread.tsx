"use client"

import { useState } from "react"
import Link from "next/link"
import { MinusCircle, PlusCircle } from "lucide-react"

import { HnWebThread } from "@/lib/hn-web-types"
import { cn } from "@/lib/utils"
import HtmlText from "@/components/html-text"

export default function Thread({ comment }: { comment: HnWebThread }) {
  const [collapse, setCollapse] = useState(true)

  const replies = comment.kids
  return (
    <div className="flex flex-row space-x-1">
      <div className="pt-1 text-sm">
        {collapse ? (
          <MinusCircle
            className="cursor-pointer"
            size={12}
            onClick={() => setCollapse(!collapse)}
          />
        ) : (
          <PlusCircle
            className="cursor-pointer"
            size={12}
            onClick={() => setCollapse(!collapse)}
          />
        )}
      </div>

      <div>
        <div className="flex flex-row flex-wrap items-center justify-start gap-x-1 text-sm text-muted-foreground">
          <Link className="hover:underline" href={`/user?id=${comment.userId}`}>
            {comment.userId}
          </Link>
          <span>•</span>
          <div>{comment.age}</div>
          {comment.onStory && (
            <>
              <span>•</span>
              <Link href={comment.storyLink || ""} className="hover:underline">
                on: {comment.onStory}
              </Link>
            </>
          )}
        </div>
        <div
          className={cn(
            `grid transition-all duration-300 ease-in-out`,
            `${collapse ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`
          )}
        >
          <div className="overflow-hidden">
            <div className="mb-1">
              <HtmlText innerHtml={comment.commentHtml} />
            </div>
            {replies && replies.length > 0 && (
              <div className="pl-5">
                {replies.map((comment) => {
                  return <Thread key={comment?.id} comment={comment} />
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

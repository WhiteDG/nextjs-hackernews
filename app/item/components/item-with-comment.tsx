import Link from "next/link"
import { notFound } from "next/navigation"

import { fetchItem } from "@/lib/hn-api-fetcher"
import { commentCount, replyableStroy } from "@/lib/hn-item-utils"
import { isLogin } from "@/lib/session"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import Fave from "@/components/fave"
import HtmlText from "@/components/html-text"
import StoryBy from "@/components/story-by"
import StoryPoint from "@/components/story-point"
import StoryTime from "@/components/story-time"
import StoryUrl from "@/components/story-url"

import Comments from "./comments"
import ReplyForm from "./reply-form"

export default async function ItemWithComment({
  id,
  faved = false,
}: {
  id: number
  faved?: boolean
}) {
  if (!id) {
    notFound()
  }
  const story = await fetchItem(id)
  if (!story) {
    notFound()
  }
  return (
    <div className="flex flex-col justify-start space-y-3">
      <div>
        <Link
          className={cn("text-3xl", story.dead && "text-muted-foreground")}
          rel="noopener noreferrer nofollow"
          href={story.url || ""}
          target={story.url ? "_blank" : "_self"}
        >
          {story.dead ? "[flagged]" : story.title}
        </Link>
        <div className="flex items-center py-2 text-sm text-muted-foreground">
          <div className="flex flex-1 flex-wrap items-center gap-x-3">
            {story.url && <StoryUrl url={story.url} />}
            <StoryPoint score={story.score} />
            <StoryBy by={story.by} />
            <StoryTime time={story.time} />
          </div>
          <Fave storyId={story.id} faved={faved} />
        </div>
        <HtmlText innerHtml={story.text} />
      </div>
      {replyableStroy(story) && (
        <ReplyForm parentId={story?.id} logined={isLogin()} />
      )}
      <Separator orientation="horizontal" className="my-2" />
      {story.descendants > 0 && (
        <span className="font-semibold">{commentCount(story.descendants)}</span>
      )}
      {story?.kids && <Comments ids={story.kids} story={story} />}
    </div>
  )
}

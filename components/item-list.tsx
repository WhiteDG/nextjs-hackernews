import Link from "next/link"

import {
  hideCommentCount,
  hideScore,
  hideUsername,
  hideVote,
  hnItem2HnWebStory,
} from "@/lib/hn-item-utils"
import { HnItem } from "@/lib/hn-types"
import Story from "@/components/story"

export interface Props {
  stories: HnItem[]
  offset?: number
  moreLink?: string
}

export default async function ItemList({
  stories,
  offset = 1,
  moreLink,
}: Props) {
  return (
    <>
      {stories.map((story, i) => (
        <div key={story.id} className="flex space-x-2">
          {null != offset ? (
            <span className="min-w-7 pt-2 text-center text-muted-foreground">
              {i + offset + 1}.
            </span>
          ) : null}
          <Story
            key={story.id}
            data={hnItem2HnWebStory(story)}
            hideVote={hideVote(story.type)}
            hidePoints={hideScore(story.type)}
            hideCommentCount={hideCommentCount(story.type)}
            hideUsername={hideUsername(story.type)}
          />
          {/* <Story key={story.id} data={story} /> */}
        </div>
      ))}
      <div className="pt-3">
        {moreLink && (
          <Link
            className="text-sm underline"
            href={moreLink}
            prefetch={false}
            scroll={true}
          >
            More
          </Link>
        )}
      </div>
    </>
  )
}

import { Suspense } from "react"
import Link from "next/link"

import {
  getFavoriteSubmissions,
  getFavoriteThreads,
} from "@/lib/hn-web-fetcher"
import { getCurrentUserId } from "@/lib/session"
import Loading from "@/components/loading"
import Story from "@/components/story"

import FavoritesTab from "./favorites-tab"
import Thread from "./thread"

export default function TabFavorites({
  userId,
  type,
}: {
  userId: string
  type: string
}) {
  type = type || "submissions"
  return (
    <div className="space-y-2">
      <FavoritesTab userId={userId} />
      {type === "submissions" && (
        <Suspense key={userId + "-" + type} fallback={<Loading />}>
          <FavoriteSubmissions userId={userId} />
        </Suspense>
      )}
      {type === "comments" && (
        <Suspense key={userId + "-" + type} fallback={<Loading />}>
          <FavoriteComments userId={userId} />
        </Suspense>
      )}
    </div>
  )
}

async function FavoriteComments({ userId }: { userId: string }) {
  const { comments, moreLink } = await getFavoriteThreads(userId)
  return (
    <div className="pt-2">
      {comments.map((comment, i) => (
        <div key={comment.id} className="mb-1">
          <Thread key={comment.id} comment={comment} />
        </div>
      ))}
      <div className="py-3">
        {moreLink && (
          <Link
            className="text-sm underline"
            href={`/user/comments?id=${userId}&${moreLink}`}
          >
            More
          </Link>
        )}
      </div>
    </div>
  )
}

async function FavoriteSubmissions({ userId }: { userId: string }) {
  const { storyList, moreLink } = await getFavoriteSubmissions(userId)
  const loginUserId = getCurrentUserId()
  return (
    <div>
      {storyList.map((story, i) => (
        <div key={story.id} className="flex">
          <span className="my-2 w-5 text-muted-foreground">{story.rank}</span>
          <Story
            key={story.id}
            data={story}
            hideVote={true}
            hideFave={userId !== loginUserId}
          />
        </div>
      ))}
      <div className="py-3">
        {moreLink && (
          <Link
            className="text-sm underline"
            href={`/user/favorites?id=${userId}&${moreLink}`}
          >
            More
          </Link>
        )}
      </div>
    </div>
  )
}

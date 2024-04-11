import { Suspense } from "react"
import Link from "next/link"

import { getSubmitted } from "@/lib/hn-web-fetcher"
import ItemSkeleton from "@/components/item-skeleton"
import Story from "@/components/story"

export default function TabSubmitted(searchParams: {
  userId: string
  next: number
  n: number
}) {
  return (
    <Suspense
      key={searchParams.userId + "-" + searchParams.next + "-" + searchParams.n}
      fallback={<ItemSkeleton length={3} />}
    >
      <Submitted
        userId={searchParams.userId}
        next={searchParams.next}
        n={searchParams.n}
      />
    </Suspense>
  )
}

async function Submitted({
  userId,
  next,
  n,
}: {
  userId: string
  next: number
  n: number
}) {
  const { storyList, moreLink } = await getSubmitted(userId, next, n)
  return (
    <div>
      {storyList.map((story, i) => (
        <div key={story.id} className="flex space-x-3">
          <span className="my-2 w-5 text-muted-foreground">{story.rank}</span>
          <Story key={story.id} data={story} hideVote={true} />
        </div>
      ))}
      <div className="py-3">
        {moreLink && (
          <Link
            rel="noreferrer nofollow"
            className="text-sm underline"
            href={`/user/submitted?id=${userId}&${moreLink}`}
          >
            More
          </Link>
        )}
      </div>
    </div>
  )
}

import { fetchStories, fetchStoryIds } from "@/lib/hn-api-fetcher"
import { HnStoryType } from "@/lib/hn-types"
import ItemList from "@/components/item-list"

export default async function TypeStories({
  pathname,
  storyType,
  page = 1,
  pageSize = 30,
}: {
  page?: number
  pageSize?: number
  storyType: HnStoryType
  pathname: string
}) {
  const storyIds = await fetchStoryIds(storyType)
  const limit = pageSize || 30
  const offset = (page - 1) * limit
  const showStoryIds = storyIds.slice(offset, offset + limit)
  const stories = await fetchStories(showStoryIds)

  const basePath = pathname ? `/${pathname}` : "/top"
  const hasMore = offset + limit < storyIds.length
  const moreLink = hasMore ? `${basePath}/page/${page + 1}` : ""
  return <ItemList stories={stories} offset={offset} moreLink={moreLink} />
}

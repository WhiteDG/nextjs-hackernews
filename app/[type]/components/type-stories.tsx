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

  const searchParams = new URLSearchParams()
  searchParams.set("page", (+page + 1).toString())

  const moreLink =
    stories.length < limit ? "" : `/${pathname}?${searchParams.toString()}`
  return <ItemList stories={stories} offset={offset} moreLink={moreLink} />
}

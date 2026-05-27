import { search } from "@/lib/hn-algolia-fetcher"
import type { SearchSort } from "@/lib/routes"
import { searchPath } from "@/lib/routes"
import ItemList from "@/components/item-list"

export default async function SearchResults({
  query,
  sort,
  page,
  pageSize,
}: {
  query: string
  sort?: SearchSort
  page: number
  pageSize: number
}) {
  const searchItemList = await search({
    query,
    page,
    pageSize,
    tags: "story",
    sort,
  })

  const moreLink =
    searchItemList.length < pageSize
      ? ""
      : searchPath(query, { sort, page: page + 1 })

  return (
    <ItemList
      stories={searchItemList}
      moreLink={moreLink}
      offset={(page - 1) * pageSize}
    />
  )
}

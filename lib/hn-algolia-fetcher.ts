import { getAlgoliaApiUrl } from "@/config/urls"

import { HnItem, HnItemType } from "./hn-types"

export const search = async ({
  query,
  page,
  pageSize,
  tags,
  sort,
}: {
  query: string
  page: number
  pageSize: number
  tags?: string
  sort?: string
}) => {
  const queryParams = new URLSearchParams()
  queryParams.append("query", query)
  queryParams.append("page", (page ? page - 1 : 0).toString())
  queryParams.append("hitsPerPage", pageSize.toString())
  if (tags) {
    queryParams.append("tags", tags)
  }
  const url = getAlgoliaApiUrl(
    `/${sort === "byDate" ? "search_by_date" : "search"}?${queryParams.toString()}`
  )
  const resp = await fetch(url, {
    next: {
      revalidate: 1800,
    },
  })
  const json = await resp.json()
  if (json && json.hits) {
    const searchItemList = json.hits.map((item: any) => {
      return {
        id: item.story_id,
        deleted: false,
        type: HnItemType.story,
        by: item.author,
        time: item.created_at_i,
        text: item.story_text,
        dead: false,
        parent: item.parent_id,
        url: item.url,
        score: item.points,
        title: item.title,
        descendants: item.num_comments,
      } as HnItem
    })
    return searchItemList
  } else {
    return []
  }
}

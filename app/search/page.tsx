import { Suspense } from "react"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { search } from "@/lib/hn-algolia-fetcher"
import ItemList from "@/components/item-list"
import Loading from "@/components/loading"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { query } = await searchParams
  const queryParam = Array.isArray(query) ? query[0] : query
  return {
    title: `Search: ${queryParam || ""}`,
  }
}

export default async function Page({ searchParams }: Props) {
  const { query, sort, page: pageParam } = await searchParams
  const queryParam = Array.isArray(query) ? query[0] : query
  const sortParam = Array.isArray(sort) ? sort[0] : sort
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam
  if (!queryParam) {
    notFound()
  }
  const page = Number(pageValue) || 1
  const pageSize = 30
  return (
    <Suspense key={`${queryParam}_${page}_${pageSize}`} fallback={<Loading />}>
      <SearchResult
        query={queryParam}
        sort={sortParam}
        page={page}
        pageSize={pageSize}
      />
    </Suspense>
  )
}

async function SearchResult({
  query,
  sort,
  page,
  pageSize,
}: {
  query: string
  sort?: string
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

  const params = new URLSearchParams()
  params.set("query", query)
  if (sort) {
    params.set("sort", sort)
  }
  params.set("page", (page + 1).toString())
  const moreLink =
    searchItemList.length < pageSize ? "" : `/search?${params.toString()}`
  return (
    <ItemList
      stories={searchItemList}
      moreLink={moreLink}
      offset={(page - 1) * pageSize}
    />
  )
}

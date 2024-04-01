import { Suspense } from "react"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { search } from "@/lib/hn-algolia-fetcher"
import ItemList from "@/components/item-list"
import Loading from "@/components/loading"

type Props = {
  searchParams: { query?: string; sort?: string; page?: number }
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const query = searchParams.query
  return {
    title: `Search: ${query}`,
  }
}

export default async function Page({ searchParams }: Props) {
  const query = searchParams.query
  if (!query) {
    notFound()
  }
  const page = searchParams.page || 1
  const pageSize = 30
  return (
    <Suspense key={`${query}_${page}_${pageSize}`} fallback={<Loading />}>
      <SearchResult
        query={query}
        sort={searchParams.sort}
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

  const moreLink =
    searchItemList.length < pageSize
      ? ""
      : `search?query=${query}&page=${+page + 1}`
  return (
    <ItemList
      stories={searchItemList}
      moreLink={moreLink}
      offset={(page - 1) * pageSize}
    />
  )
}

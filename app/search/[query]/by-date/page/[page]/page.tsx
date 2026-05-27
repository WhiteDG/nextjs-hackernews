import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import {
  decodeSearchParam,
  parsePositiveIntegerParam,
  searchPath,
} from "@/lib/routes"
import Loading from "@/components/loading"

import SearchResults from "../../../../components/search-results"

export const revalidate = 1800
export const dynamic = "force-static"
export const dynamicParams = true

type Props = {
  params: Promise<{ query: string; page: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query, page } = await params
  const currentPage = parsePositiveIntegerParam(page)
  if (!currentPage) {
    notFound()
  }
  return {
    title: `Search: ${decodeSearchParam(query)} - By Date - Page ${currentPage}`,
  }
}

export function generateStaticParams() {
  return []
}

export default async function Page({ params }: Props) {
  const { query: queryParam, page: pageParam } = await params
  const query = decodeSearchParam(queryParam)
  const page = parsePositiveIntegerParam(pageParam)
  if (!query || !page) {
    notFound()
  }
  if (page === 1) {
    redirect(searchPath(query, { sort: "byDate" }))
  }
  const pageSize = 30

  return (
    <Suspense
      key={`${query}_byDate_${page}_${pageSize}`}
      fallback={<Loading />}
    >
      <SearchResults
        query={query}
        sort="byDate"
        page={page}
        pageSize={pageSize}
      />
    </Suspense>
  )
}

import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { decodeSearchParam } from "@/lib/routes"
import Loading from "@/components/loading"

import SearchResults from "../../components/search-results"

export const revalidate = 1800
export const dynamic = "force-static"
export const dynamicParams = true

type Props = {
  params: Promise<{ query: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query } = await params
  return {
    title: `Search: ${decodeSearchParam(query)} - By Date`,
  }
}

export function generateStaticParams() {
  return []
}

export default async function Page({ params }: Props) {
  const { query: queryParam } = await params
  const query = decodeSearchParam(queryParam)
  if (!query) {
    notFound()
  }
  const page = 1
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

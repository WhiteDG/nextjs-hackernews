import { notFound, redirect } from "next/navigation"

import {
  parsePositiveIntegerParam,
  parseSearchSort,
  searchPath,
} from "@/lib/routes"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: Props) {
  const { query, sort, page: pageParam } = await searchParams
  const queryParam = Array.isArray(query) ? query[0] : query
  const sortParam = Array.isArray(sort) ? sort[0] : sort
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam
  if (!queryParam) {
    notFound()
  }
  const page = pageValue ? parsePositiveIntegerParam(pageValue) : 1
  if (!page) {
    notFound()
  }
  redirect(searchPath(queryParam, { sort: parseSearchSort(sortParam), page }))
}

export type SearchSort = "byDate"

export function searchPath(
  query: string,
  options: { sort?: SearchSort; page?: number } = {}
) {
  const encodedQuery = encodeURIComponent(query.trim())
  const sortSegment = options.sort === "byDate" ? "/by-date" : ""
  const pageSegment =
    options.page && Number.isSafeInteger(options.page) && options.page > 1
      ? `/page/${options.page}`
      : ""

  return encodedQuery
    ? `/search/${encodedQuery}${sortSegment}${pageSegment}`
    : "/search"
}

export function parseSearchSort(value?: string | null): SearchSort | undefined {
  return value === "byDate" ? value : undefined
}

export function decodeSearchParam(value: string) {
  try {
    return decodeURIComponent(value).trim()
  } catch {
    return value.trim()
  }
}

export function parsePositiveIntegerParam(value?: string | null) {
  if (!value || !/^[1-9]\d*$/.test(value)) {
    return undefined
  }

  const parsedValue = Number(value)
  return Number.isSafeInteger(parsedValue) ? parsedValue : undefined
}

export const HN_WEB_BASE_URL =
  process.env.NEXT_PUBLIC_HN_WEB_BASE_URL || "https://news.ycombinator.com"
export const HN_API_BASE_URL =
  process.env.NEXT_PUBLIC_HN_API_BASE_URL ||
  "https://hacker-news.firebaseio.com/v0"
export const ALGOLIA_BASE_URL =
  process.env.NEXT_PUBLIC_ALGOLIA_BASE_URL || "https://hn.algolia.com/api/v1"

const removeEnd = (str: string, remove: string) => {
  if (!str) {
    return str
  }
  if (str.endsWith(remove)) {
    return str.slice(0, -remove.length)
  } else {
    return str
  }
}

const prependIfMissing = (str: string, prefix: string) => {
  if (!str) {
    return str
  }
  if (str.startsWith(prefix)) {
    return str
  }
  return prefix + str
}

const getUrl = (baseUrl: string, path: string) => {
  return `${removeEnd(baseUrl, "/")}${prependIfMissing(path, "/")}`
}

export const getHnWebUrl = (path: string) => {
  return getUrl(HN_WEB_BASE_URL, path)
}

export const getHnApiUrl = (path: string) => {
  const url = getUrl(HN_API_BASE_URL, path)
  return url
}

export const getAlgoliaApiUrl = (path: string) => {
  return getUrl(ALGOLIA_BASE_URL, path)
}

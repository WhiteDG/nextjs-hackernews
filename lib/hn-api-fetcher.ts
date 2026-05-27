import { getHnApiUrl } from "@/config/urls"

import { HnComment, HnItem, HnStoryType, HnUser } from "./hn-types"

const STORY_IDS_REVALIDATE_SECONDS = 120
const ITEM_REVALIDATE_SECONDS = 300
const USER_REVALIDATE_SECONDS = 1800
const FETCH_TIMEOUT_MS = 10_000
const RETRY_DELAYS_MS = [500, 1_500]

async function fetchData(type: string, revalidate: number) {
  let lastError: unknown
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(getHnApiUrl(`${type}.json`), {
        next: {
          revalidate,
        },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      })
      if (res.status !== 200) {
        throw new Error(`Status ${res.status}`)
      }
      return res.json()
    } catch (error) {
      lastError = error
      const retryDelay = RETRY_DELAYS_MS[attempt]
      if (retryDelay === undefined) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }
  throw lastError
}

export async function fetchStoryIds(type: HnStoryType) {
  const storyIds = await fetchDataSafely<number[]>(
    type,
    STORY_IDS_REVALIDATE_SECONDS,
    []
  )
  if (!storyIds) {
    return []
  } else {
    return storyIds as number[]
  }
}

export async function fetchUser(userId: string) {
  const user = await fetchData(`user/${userId}`, USER_REVALIDATE_SECONDS)
  return safeUser(user)
}

export async function fetchItem(id: number) {
  const hnItem = await fetchData(`item/${id}`, ITEM_REVALIDATE_SECONDS)
  return safeItem(hnItem)
}

export function safeItem(val: HnItem) {
  if (val) {
    val.url = val.url || ""
    val.kids = val.kids || []
    val.descendants = val.descendants || 0
    return val
  } else {
    return null
  }
}

export function safeUser(val: HnUser) {
  if (val) {
    val.about = val.about || ""
    val.karma = val.karma || 0
    val.submitted = val.submitted || []
    return val
  } else {
    return null
  }
}

export async function fetchStories(ids: number[]) {
  const stories = await Promise.all(
    ids.map(async (itemId) => {
      try {
        return await fetchItem(itemId)
      } catch (error) {
        console.warn(`Failed to fetch HN item ${itemId}`, error)
        return null
      }
    })
  )
  return stories.filter((item): item is HnItem => item !== null)
}

export async function fetchComments(ids: number[], depth = 0, maxDepth = 5) {
  const comments = await Promise.all(
    ids.map(async (id) => {
      const val = await fetchDataSafely<HnComment | null>(
        `item/${id}`,
        ITEM_REVALIDATE_SECONDS,
        null
      )
      if (!val) {
        return null
      }
      if (depth >= maxDepth && val.kids && val.kids.length > 0) {
        val.comments = []
        val.truncated = true
      } else {
        val.comments =
          val.kids && val.kids.length > 0
            ? await fetchComments(val.kids, depth + 1, maxDepth)
            : []
      }
      return safeItem(val)
    })
  )
  return comments.filter((comment): comment is HnComment => comment !== null)
}

async function fetchDataSafely<T>(
  type: string,
  revalidate: number,
  fallback: T
) {
  try {
    return (await fetchData(type, revalidate)) as T
  } catch (error) {
    console.warn(`Failed to fetch HN API resource ${type}`, error)
    return fallback
  }
}

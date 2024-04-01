"use client"

import { Loader2 } from "lucide-react"
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite"

import { fetchComments } from "@/lib/hn-api-fetcher"
import { HnComment, HnItem } from "@/lib/hn-types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import Comment from "./comment"

const PAGE_SIZE = 10
const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateFirstPage: false,
} as SWRInfiniteConfiguration

const fetcher = async (showIds: number[]) => {
  return await fetchComments(showIds)
}

const getKey = (ids: number[]) => {
  return (page: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) {
      return null
    }
    const offset = page * PAGE_SIZE
    const showIds = ids.slice(offset, offset + PAGE_SIZE)
    return showIds
  }
}

export default function Comments({
  story,
  ids,
}: {
  story: HnItem
  ids: number[]
}) {
  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite(getKey(ids), fetcher, options)

  const isNoComment = !ids || ids.length == 0
  const comments = data ? [].concat(...data) : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty ||
    (data && data[data.length - 1]?.length < PAGE_SIZE) ||
    comments.length === ids.length
  const text = isNoComment
    ? "No comment yet"
    : isLoadingMore
      ? "Loading..."
      : isReachingEnd
        ? "No More"
        : "More"

  return (
    <div>
      {comments.map((comment: HnComment) => {
        return <Comment key={comment?.id} comment={comment} story={story} />
      })}

      <Button
        variant={"link"}
        disabled={isNoComment || isLoadingMore || isReachingEnd}
        className={cn(
          "pl-0",
          !isNoComment && !isLoadingMore && !isReachingEnd && "underline"
        )}
        onClick={() => setSize(size + 1)}
      >
        {isLoadingMore && <Loader2 className="mr-1 animate-spin" size={14} />}
        {text}
      </Button>
    </div>
  )
}

import { Suspense } from "react"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { fetchItem } from "@/lib/hn-api-fetcher"
import Loading from "@/components/loading"

import ItemWithComment from "./components/item-with-comment"

type Props = {
  searchParams: Promise<{ id?: string | string[] }>
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await searchParams
  const idParam = Array.isArray(id) ? id[0] : id
  const storyId = Number(idParam)
  if (!storyId) {
    return { title: "Comment" }
  }
  const story = await fetchItem(storyId)
  return {
    title: `${story?.title || "Comment"}`,
  }
}

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams
  const idParam = Array.isArray(id) ? id[0] : id
  const storyId = Number(idParam)
  if (!storyId) {
    notFound()
  }
  return (
    <Suspense key={storyId} fallback={<Loading />}>
      <ItemWithComment id={storyId} />
    </Suspense>
  )
}

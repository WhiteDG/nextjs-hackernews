import { Suspense } from "react"
import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { fetchItem } from "@/lib/hn-api-fetcher"
import { parsePositiveIntegerParam } from "@/lib/routes"
import Loading from "@/components/loading"

import ItemWithComment from "../components/item-with-comment"

export const revalidate = 300
export const dynamic = "force-static"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params
  const storyId = parsePositiveIntegerParam(id)
  if (!storyId) {
    notFound()
  }
  const story = await fetchItem(storyId)
  return {
    title: `${story?.title || "Comment"}`,
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const storyId = parsePositiveIntegerParam(id)
  if (!storyId) {
    notFound()
  }
  return (
    <Suspense key={storyId} fallback={<Loading />}>
      <ItemWithComment id={storyId} />
    </Suspense>
  )
}

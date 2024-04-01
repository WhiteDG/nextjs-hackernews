import { Suspense } from "react"
import { Metadata, ResolvingMetadata } from "next"

import { fetchItem } from "@/lib/hn-api-fetcher"
import Loading from "@/components/loading"

import ItemWithComment from "./components/item-with-comment"

type Props = {
  searchParams: { id: number }
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const storyId = searchParams.id
  const story = await fetchItem(storyId)
  return {
    title: `${story?.title || "Comment"}`,
  }
}

export default async function Page({ searchParams }: Props) {
  return (
    <Suspense key={searchParams.id} fallback={<Loading />}>
      <ItemWithComment id={searchParams.id} />
    </Suspense>
  )
}

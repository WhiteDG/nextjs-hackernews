import { HnStoryType } from "@/lib/hn-types"
import TypePage from "@/app/[type]/components/type-page"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page: number }>
}) {
  const params = await searchParams
  return (
    <TypePage
      pathname={""}
      storyType={HnStoryType.topstories}
      currentPage={params.page || 1}
    />
  )
}

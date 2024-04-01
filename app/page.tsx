import { HnStoryType } from "@/lib/hn-types"
import TypePage from "@/app/[type]/components/type-page"

export default function Page({
  searchParams,
}: {
  searchParams: { page: number }
}) {
  return (
    <TypePage
      pathname={""}
      storyType={HnStoryType.topstories}
      currentPage={searchParams.page || 1}
    />
  )
}

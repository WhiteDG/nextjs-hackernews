import { HnStoryType } from "@/lib/hn-types"
import TypePage from "@/app/[type]/components/type-page"

export const revalidate = 120

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const params = await searchParams
  const pageParam = Array.isArray(params.page) ? params.page[0] : params.page
  const currentPage = Number(pageParam) || 1
  return (
    <TypePage
      pathname={""}
      storyType={HnStoryType.topstories}
      currentPage={currentPage}
    />
  )
}

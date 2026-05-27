import { HnStoryType } from "@/lib/hn-types"
import TypePage from "@/app/[type]/components/type-page"

export const revalidate = 120
export const dynamic = "force-static"

export default async function Page() {
  return (
    <TypePage
      pathname={"top"}
      storyType={HnStoryType.topstories}
      currentPage={1}
    />
  )
}

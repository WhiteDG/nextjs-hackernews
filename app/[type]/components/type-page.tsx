import { Suspense } from "react"

import { HnStoryType } from "@/lib/hn-types"
import ItemSkeleton from "@/components/item-skeleton"
import JobTips from "@/components/job-tips"
import ShowTips from "@/components/show-tips"
import TopTips from "@/components/top-tips"
import TypeStories from "@/app/[type]/components/type-stories"

export default function TypePage({
  pathname,
  storyType,
  currentPage,
}: {
  pathname: string
  storyType: HnStoryType
  currentPage: number
}) {
  return (
    <>
      {(pathname === "top" || pathname === "") && <TopTips />}
      {pathname === "show" && <ShowTips />}
      {pathname === "jobs" && <JobTips />}
      <Suspense
        key={storyType + currentPage}
        fallback={<ItemSkeleton length={6} />}
      >
        <TypeStories
          pathname={pathname}
          page={currentPage}
          storyType={storyType}
          pageSize={30}
        />
      </Suspense>
    </>
  )
}

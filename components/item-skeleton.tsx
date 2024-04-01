import { Skeleton } from "@/components/ui/skeleton"

export default function ItemSkeleton({ length }: { length: number }) {
  return (
    <div className="pt-2">
      {Array.from({ length }).map((_, index) => {
        return (
          <div key={index} className="w-full py-2">
            <Skeleton className="h-28 w-full rounded-xl md:h-16"></Skeleton>
          </div>
        )
      })}
    </div>
  )
}

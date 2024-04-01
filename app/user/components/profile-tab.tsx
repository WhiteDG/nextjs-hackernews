"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { profileTabs } from "@/config/conf"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function ProfileTab({
  userId,
  myself,
}: {
  userId: string
  myself: boolean
}) {
  const pathname = usePathname()

  return (
    <ScrollArea className="max-w-full lg:max-w-none">
      <div className="flex items-center">
        {profileTabs.map(
          (tab, index) =>
            (tab.public === true || myself) && (
              <Link
                href={`/user/${tab.label.toLowerCase()}?id=${userId}`}
                key={tab.label}
                className={cn(
                  "flex h-7 items-center justify-center rounded-full px-3 text-center text-sm transition-colors hover:text-primary md:px-4",
                  pathname?.endsWith(tab.label.toLowerCase()) ||
                    (index === 0 && pathname === `/user`)
                    ? "bg-muted font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {tab.label}
              </Link>
            )
        )}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { storyNavConfig } from "@/config/conf"
import { cn } from "@/lib/utils"

interface DesktopNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DesktopNav({ className, ...props }: DesktopNavProps) {
  const pathname = usePathname()

  return (
    <div className={className} {...props}>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {storyNavConfig.map((navItem, index) => {
          return (
            <Link
              key={navItem.name}
              href={navItem.link}
              prefetch={false}
              className={cn(
                "transition-colors hover:text-foreground/80 ",
                pathname === navItem.link ||
                  (pathname === "/" && navItem.name === "Top")
                  ? "text-foreground"
                  : "text-foreground/50"
              )}
            >
              {navItem.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

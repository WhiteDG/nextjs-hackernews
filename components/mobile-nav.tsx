"use client"

import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { storyNavConfig } from "@/config/conf"
import { cn } from "@/lib/utils"

export default function MobileNav({
  active,
  onActiveChange,
}: {
  active: boolean
  onActiveChange: (open: boolean) => void
}) {
  const pathname = usePathname()
  return (
    <div
      className={cn(
        "md:hidden",
        `grid overflow-hidden text-sm transition-all duration-300 ease-in-out`,
        `${active ? "my-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`
      )}
    >
      <div
        className={cn("flex flex-col space-y-3 overflow-hidden px-5 text-sm")}
      >
        {storyNavConfig?.map(
          (item) =>
            item.link && (
              <MobileLink
                key={item.link}
                href={item.link}
                onActiveChange={onActiveChange}
                className={cn(
                  "transition-colors hover:text-foreground/80 ",
                  pathname === item.link
                    ? "text-foreground"
                    : "text-foreground/50"
                )}
              >
                {item.name}
              </MobileLink>
            )
        )}
      </div>
    </div>
  )
}

interface MobileLinkProps extends LinkProps {
  onActiveChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onActiveChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={() => {
        router.push(href.toString())
        onActiveChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}

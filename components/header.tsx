"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useGoto } from "@/hooks"
import { Menu, Plus, X } from "lucide-react"

import { showStoryNav } from "@/config/conf"
import { HnUser } from "@/lib/hn-types"
import { Button } from "@/components/ui/button"
import { DesktopNav } from "@/components/desktop-nav"
import Logo from "@/components/logo"
import MobileNav from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import SearchInput from "@/components/search-input"
import { UserNav } from "@/components/user-nav"

export function Header({ user }: { user: HnUser | null }) {
  const pathname = usePathname()
  const goto = useGoto()
  const storyNavVisiable = showStoryNav(pathname)
  const [mobileNavActive, setMobileNavActive] = useState(false)

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center ">
        <Link href="/" className="hidden md:inline md:flex-1" prefetch={false}>
          <Logo />
        </Link>
        {storyNavVisiable && (
          <DesktopNav className="hidden md:flex md:flex-1 md:justify-center" />
        )}
        <div
          className="mr-1 block md:hidden"
          onClick={() => setMobileNavActive(!mobileNavActive)}
        >
          {mobileNavActive ? <X /> : <Menu />}
        </div>
        <div className="flex flex-1 items-center justify-end">
          <SearchInput />
          {storyNavVisiable && (
            <Button variant={"ghost"} className="hidden size-8">
              <Link href={"/submit"}>
                <Plus size={22}></Plus>
              </Link>
            </Button>
          )}
          <ModeToggle />
          {user && <UserNav user={user} />}
          {storyNavVisiable && !user && (
            <Button size={"sm"} variant={"outline"} className="ml-1">
              <Link rel="noreferrer nofollow" href={`/login?goto=${goto}`} className="text-sm">
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
      <MobileNav active={mobileNavActive} onActiveChange={setMobileNavActive} />
    </header>
  )
}

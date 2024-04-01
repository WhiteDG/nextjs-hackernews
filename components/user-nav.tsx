import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bookmark,
  LogOut,
  MessageCircle,
  Send,
  Triangle,
  UserRound,
} from "lucide-react"

import { logoutAction } from "@/lib/actions"
import { HnUser } from "@/lib/hn-types"
import { formatDate } from "@/lib/time-utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNav({ user }: { user: HnUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative ml-1 size-8 rounded-full">
          <Avatar className="size-8">
            <AvatarFallback>{capitalizeFirstTwoChars(user.id)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.id}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {formatDate(user.created)}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/user?id=${user.id}`}>
              <UserRound size={14} className="mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/user/submitted?id=${user.id}`}>
              <Send size={14} className="mr-2" /> Submissions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/user/comments?id=${user.id}`}>
              <MessageCircle size={14} className="mr-2" />
              Comments
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/user/favorites?id=${user.id}`}>
              <Bookmark size={14} className="mr-2" />
              Favorite
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/user/upvoted?id=${user.id}`}>
              <Triangle size={14} className="mr-2" />
              Upvoted
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={logoutAction}>
            <input name="goto" hidden defaultValue={usePathname()} />
            <button type="submit" className="hover:cursor-default">
              <LogOut size={14} className="mr-2 inline" />
              Log out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function capitalizeFirstTwoChars(id: string) {
  if (id.length >= 2) {
    var firstTwoChars = id.substring(0, 2)
    var capitalizedChars = firstTwoChars.toUpperCase()
    return capitalizedChars
  } else {
    return id
  }
}

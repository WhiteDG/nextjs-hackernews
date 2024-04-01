"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useGoto } from "@/hooks"
import { BookmarkMinus, BookmarkPlus } from "lucide-react"
import { toast } from "sonner"

import { faveAction } from "@/lib/actions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Fave({
  storyId,
  faved: initFaved,
}: {
  storyId: number
  faved?: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [faved, setFaved] = useState(initFaved)
  const [disabled, setDisabled] = useState(false)
  const goto = useGoto()

  const handleFave = async (formData: FormData) => {
    setDisabled(true)
    const result = await faveAction(storyId, faved ? false : true)
    setDisabled(false)
    if (result?.success) {
      setFaved(!faved)
      toast.success(faved ? "UnFavorited" : "Favorited")
      if (pathname.endsWith("favorites")) {
        router.refresh()
      }
    } else {
      if (result.message === "Not Login") {
        toast("You have to be logged in to favorite.", {
          action: {
            label: "Login",
            onClick: () => router.push(`/login?goto=${goto}`),
          },
        })
      } else {
        toast.error(result?.message)
      }
    }
  }

  return (
    <form action={handleFave} className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled={disabled}
              type="submit"
              className={
                "text-muted-foreground/80 hover:cursor-pointer  hover:text-primary"
              }
            >
              {faved ? <BookmarkMinus size={14} /> : <BookmarkPlus size={14} />}
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-48 border-0 bg-primary font-semibold text-primary-foreground">
            Click to {faved ? "unfavorite" : "favorite"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  )
}

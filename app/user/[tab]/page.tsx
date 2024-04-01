import { Metadata, ResolvingMetadata } from "next"
import { notFound, redirect } from "next/navigation"
import { CakeSlice } from "lucide-react"

import { profileTabs } from "@/config/conf"
import { fetchUser } from "@/lib/hn-api-fetcher"
import { HnUser } from "@/lib/hn-types"
import { getCurrentUserId } from "@/lib/session"
import { formatDate } from "@/lib/time-utils"
import { Separator } from "@/components/ui/separator"

import ProfileTab from "../components/profile-tab"
import TabAbout from "../components/tab-about"
import TabComments from "../components/tab-comments"
import TabFavorites from "../components/tab-favorites"
import TabSubmitted from "../components/tab-submitted"
import TabUpvoted from "../components/tab-upvoted"

type Props = {
  params: { tab: string }
  searchParams: {
    id: string
    next: number
    n: number
    type: string
  }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const userId = searchParams.id
  const tab = params.tab
  return {
    title: tab === "about" ? `Profile: ${userId}` : `${userId}'s ${tab}`,
  }
}

export default async function TabPage({ params, searchParams }: Props) {
  const user = await fetchUser(searchParams.id)
  if (!user) {
    notFound()
  }
  const myUserId = getCurrentUserId()
  const myself = myUserId === user.id
  const myselfTab = profileTabs
    .filter((item) => item.public === false)
    .map((item) => item.label.toLowerCase())
    .includes(params.tab)
  if (myselfTab && !myself) {
    redirect(`/user/about?id=${user.id}`)
  }
  return (
    <div className="flex flex-col space-y-3 pt-2">
      <UserInfo user={user} />
      <Separator orientation="horizontal" />
      <ProfileTab userId={user.id} myself={myUserId === user.id} />
      {params.tab === "about" && <TabAbout content={user?.about} />}
      {params.tab === "submitted" && (
        <TabSubmitted
          userId={searchParams.id}
          next={searchParams.next}
          n={searchParams.n}
        />
      )}
      {params.tab === "comments" && (
        <TabComments userId={searchParams.id} next={searchParams.next} />
      )}
      {params.tab === "favorites" && (
        <TabFavorites userId={searchParams.id} type={searchParams.type} />
      )}
      {params.tab === "upvoted" && (
        <TabUpvoted userId={searchParams.id} type={searchParams.type} />
      )}
    </div>
  )
}

function UserInfo({ user }: { user: HnUser }) {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-3xl font-semibold">{user?.id}</h1>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>
          <CakeSlice size={12} className="inline" /> Born on{" "}
          {formatDate(user.created)}
        </span>
        <span>•</span>
        <span>{user.karma} Karma</span>
      </div>
    </div>
  )
}

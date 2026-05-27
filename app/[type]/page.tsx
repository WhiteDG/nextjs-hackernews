import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { storyNavConfig } from "@/config/conf"
import TypePage from "@/app/[type]/components/type-page"

export const revalidate = 120
export const dynamic = "force-static"
export const dynamicParams = true

type Props = {
  params: Promise<{ type: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { type } = await params
  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
  }
}

export function generateStaticParams() {
  return []
}

export default async function Page({ params }: Props) {
  const { type } = await params
  const pathname = type || "top"
  const navItem = storyNavConfig.filter(
    (navItem) => navItem.name.toLowerCase() === pathname
  )
  const storyType = navItem && navItem.length === 1 ? navItem[0].type : null
  if (!storyType) {
    notFound()
  }
  return <TypePage pathname={pathname} storyType={storyType} currentPage={1} />
}

import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { storyNavConfig } from "@/config/conf"
import TypePage from "@/app/[type]/components/type-page"

export const revalidate = 120

type Props = {
  params: Promise<{ type: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
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

export default async function Page({ searchParams, params }: Props) {
  const { page } = await searchParams
  const { type } = await params
  const pageParam = Array.isArray(page) ? page[0] : page
  const currentPage = Number(pageParam) || 1
  const pathname = type || "top"
  const navItem = storyNavConfig.filter(
    (navItem) => navItem.name.toLowerCase() === pathname
  )
  const storyType = navItem && navItem.length === 1 ? navItem[0].type : null
  if (!storyType) {
    notFound()
  }
  return (
    <TypePage
      pathname={pathname}
      storyType={storyType}
      currentPage={currentPage}
    />
  )
}

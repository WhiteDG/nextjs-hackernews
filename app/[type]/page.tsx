import { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

import { storyNavConfig } from "@/config/conf"
import TypePage from "@/app/[type]/components/type-page"

type Props = {
  params: { type: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const type = params.type
  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
  }
}

export default async function Page({ searchParams, params }: Props) {
  const currentPage = Number(searchParams?.page) || 1
  const pathname = params.type || "top"
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

import { Metadata, ResolvingMetadata } from "next"
import { notFound, redirect } from "next/navigation"

import { storyNavConfig } from "@/config/conf"
import { parsePositiveIntegerParam } from "@/lib/routes"
import TypePage from "@/app/[type]/components/type-page"

export const revalidate = 120
export const dynamic = "force-static"
export const dynamicParams = true

type Props = {
  params: Promise<{ type: string; page: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { type, page } = await params
  const currentPage = parsePositiveIntegerParam(page)
  if (!currentPage) {
    notFound()
  }
  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} - Page ${currentPage}`,
  }
}

export function generateStaticParams() {
  return []
}

export default async function Page({ params }: Props) {
  const { type, page } = await params
  const currentPage = parsePositiveIntegerParam(page)
  if (!currentPage) {
    notFound()
  }
  if (currentPage === 1) {
    redirect(`/${type}`)
  }
  const navItem = storyNavConfig.find(
    (navItem) => navItem.name.toLowerCase() === type
  )
  if (!navItem) {
    notFound()
  }
  return (
    <TypePage
      pathname={type}
      storyType={navItem.type}
      currentPage={currentPage}
    />
  )
}

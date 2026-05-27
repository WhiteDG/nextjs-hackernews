import { notFound, redirect } from "next/navigation"

import { parsePositiveIntegerParam } from "@/lib/routes"

type Props = {
  searchParams: Promise<{ id?: string | string[] }>
}

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams
  const idParam = Array.isArray(id) ? id[0] : id
  const storyId = parsePositiveIntegerParam(idParam)
  if (!storyId) {
    notFound()
  }
  redirect(`/item/${storyId}`)
}

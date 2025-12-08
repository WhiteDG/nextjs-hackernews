import { Metadata } from "next"

import AuthPage from "../components/auth-page"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login",
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ goto?: string }>
}) {
  const { goto } = await searchParams
  return <AuthPage page={"login"} searchParams={{ goto }} />
}

import { Metadata } from "next"

import AuthPage from "../components/auth-page"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "SignUp",
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ goto?: string }>
}) {
  const { goto } = await searchParams
  return <AuthPage page="signup" searchParams={{ goto }} />
}

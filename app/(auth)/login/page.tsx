import { Metadata } from "next"

import AuthPage from "../components/auth-page"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login",
  }
}

export default function Page({
  searchParams,
}: {
  searchParams: { goto?: string }
}) {
  return <AuthPage page={"login"} searchParams={searchParams} />
}

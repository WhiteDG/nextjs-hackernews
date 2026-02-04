import { Metadata } from "next"

import AuthPage from "../components/auth-page"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Login",
  }
}

export default async function Page({ searchParams }: Props) {
  const { goto } = await searchParams
  const gotoParam = Array.isArray(goto) ? goto[0] : goto
  return <AuthPage page={"login"} searchParams={{ goto: gotoParam }} />
}

import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthForm } from "@/components/auth-form"

type PageInfo = {
  title: string
  buttonText: string
  switcherTips: string
  switcherText: string
  switcherHref: string
}
const pageMap = {
  login: {
    title: "Log in to HackerNews",
    buttonText: "Login",
    switcherTips: "New to HackerNews?",
    switcherText: "Create an account",
    switcherHref: "/signup",
  },
  signup: {
    title: "Create Account",
    buttonText: "Create Account",
    switcherTips: "Alreay have an account?",
    switcherText: "Login",
    switcherHref: "/login",
  },
} as Record<string, PageInfo>

export default function AuthPage({
  page,
  searchParams,
}: {
  page: string
  searchParams: { goto?: string }
}) {
  const pageInfo = pageMap[page]
  return (
    <Card className="m-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{pageInfo.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AuthForm goto={searchParams.goto} creating={page === "signup"} />
          <div className="bg-background text-center text-sm text-muted-foreground">
            {pageInfo.switcherTips}{" "}
            <Link rel="nofollow noreferrer" href={pageInfo.switcherHref} className="underline">
              {pageInfo.switcherText}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

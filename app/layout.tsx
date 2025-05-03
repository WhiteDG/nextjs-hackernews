import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { fetchUser } from "@/lib/hn-api-fetcher"
import { getCurrentUserId } from "@/lib/session"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

import { siteConf } from "@/config/conf"
import { CurrentUserProvider } from "@/hooks/currentUserContext"

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConf.title}`,
    default: siteConf.title,
  },
  description: siteConf.description,
  keywords: [
    "Next.js",
    "Shadcn",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Hacker News",
  ],
  authors: siteConf.authors,
  creator: siteConf.authors[0].name,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const userId = getCurrentUserId()
  const user = userId ? await fetchUser(userId) : null

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrentUserProvider currentUser={user}>
            <div className="relative flex min-h-screen flex-col items-center bg-background">
              <Header user={user} />
              <main className="container flex flex-1 flex-col py-3 md:w-1/2">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </CurrentUserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

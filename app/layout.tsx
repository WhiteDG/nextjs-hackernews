import { Suspense } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          <CurrentUserProvider>
            <div className="relative flex min-h-screen flex-col items-center bg-background">
              <Suspense fallback={<div className="h-14 w-full" />}>
                <Header />
              </Suspense>
              <main className="container flex flex-1 flex-col py-3 md:w-1/2">
                <Suspense fallback={<div className="flex-1" />}>{children}</Suspense>
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

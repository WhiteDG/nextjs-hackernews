import Link from "next/link"

import { siteConf } from "@/config/conf"
import { Icons } from "@/components/icons"

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 pl-2">
      <div className="flex items-center pr-8">
        <div className="flex-1 p-5 text-sm text-muted-foreground">
          Built by{" "}
          <Link
            href={siteConf.links.next}
            target="_blank"
            className="font-medium underline underline-offset-4"
            rel="noreferrer"
          >
            Next.js
          </Link>{" "}
          &{" "}
          <Link
            href={siteConf.links.shadcn}
            target="_blank"
            className="font-medium underline underline-offset-4"
            rel="noreferrer"
          >
            shadcn/ui
          </Link>
          . The source code is available on{" "}
          <Link
            href={siteConf.links.github}
            target="_blank"
            className="font-medium underline underline-offset-4"
            rel="noreferrer"
          >
            GitHub
          </Link>
          .
        </div>
        <Link href={siteConf.links.github} target="_blank" rel="noreferrer">
          <Icons.GitHub className="size-5" />
        </Link>
      </div>
    </footer>
  )
}

import Link from "next/link"

export default function JobTips() {
  return (
    <div className="px-9 py-2 text-sm text-muted-foreground md:py-3">
      These are jobs at YC startups. See more at{" "}
      <Link
        rel="noreferrer nofollow"
        className="text-primary underline"
        target="_blank"
        href={"https://ycombinator.com/jobs"}
      >
        ycombinator.com/jobs.
      </Link>
    </div>
  )
}

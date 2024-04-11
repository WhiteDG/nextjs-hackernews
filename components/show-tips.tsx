import Link from "next/link"

export default function ShowTips() {
  return (
    <div className="px-9 py-2 text-sm text-muted-foreground md:py-3">
      Please read the{" "}
      <Link
        rel="noreferrer nofollow"
        className="text-primary underline"
        target="_blank"
        href={"https://news.ycombinator.com/showhn.html"}
      >
        rules
      </Link>
      . You can also browse the{" "}
      <Link
        rel="noreferrer nofollow"
        className="text-primary underline"
        target="_blank"
        href={"https://news.ycombinator.com/shownew"}
      >
        newest
      </Link>{" "}
      Show HNs.
    </div>
  )
}

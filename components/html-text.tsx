import { cn } from "@/lib/utils"

interface HtmlTextProps
  extends Omit<
    React.HTMLAttributes<HTMLSpanElement>,
    "dangerouslySetInnerHTML"
  > {
  innerHtml?: string
}

export default function HtmlText({
  innerHtml,
  className,
  ...prop
}: HtmlTextProps) {
  if (!innerHtml) {
    return null
  }
  return (
    <span
      className={cn("item-text text-sm", className)}
      dangerouslySetInnerHTML={{ __html: innerHtml }}
      {...prop}
    />
  )
}

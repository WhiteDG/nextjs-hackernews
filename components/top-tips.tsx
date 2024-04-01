import dayjs from "dayjs"

export default function TopTips() {
  return (
    <div className="py-2 pl-9 text-2xl font-semibold text-muted-foreground md:py-3">
      {dayjs().locale("utc").format("MMMM DD, YYYY")}
    </div>
  )
}

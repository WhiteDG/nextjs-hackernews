import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.extend(isToday)

export function formatDate(time?: number) {
  if (!time) {
    return ""
  }
  return dayjs(time * 1000).format("MMMM DD, YYYY")
}

export function timeAgo(time: number) {
  return dayjs(time * 1000).toNow(true)
}

const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000

export function inTwoWeeks(time: number) {
  const now = new Date().getTime()
  return now - time * 1000 <= twoWeeks
}

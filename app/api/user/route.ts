import { fetchUser } from "@/lib/hn-api-fetcher"
import { getCurrentUserId } from "@/lib/session"

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) {
    return Response.json(null)
  }
  try {
    const user = await fetchUser(userId)
    return Response.json(user)
  } catch {
    return Response.json(null)
  }
}

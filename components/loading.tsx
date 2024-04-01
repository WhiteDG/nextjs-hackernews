import { Loader2 } from "lucide-react"

export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex h-screen w-full flex-row items-center justify-center gap-2 pb-64">
      <Loader2 className="animate-spin" size={18}></Loader2>
      <div>{text}</div>
    </div>
  )
}

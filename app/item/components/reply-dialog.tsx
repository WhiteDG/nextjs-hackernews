import Link from "next/link"
import { useCurrentUser } from "@/hooks"

import { HnComment } from "@/lib/hn-types"
import { inTwoWeeks } from "@/lib/time-utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import ReplyForm from "./reply-form"

export default function ReplyDialog({ comment }: { comment: HnComment }) {
  const currentUser = useCurrentUser()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          className="h-8 p-0 text-sm underline"
          variant={"link"}
          disabled={!inTwoWeeks(comment.time)}
        >
          Reply
        </Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            Reply to{" "}
            <Link
              rel="noreferrer nofollow"
              href={{
                pathname: "/user",
                query: { id: comment.by },
              }}
              className="text-muted-foreground underline"
              target="_blank"
            >
              {comment.by}
            </Link>
          </DialogTitle>
          {comment.text && (
            <DialogDescription
              className="item-text max-h-[260px] overflow-y-auto py-2"
              dangerouslySetInnerHTML={{ __html: comment.text }}
            ></DialogDescription>
          )}
        </DialogHeader>
        <ReplyForm
          parentId={comment.id}
          text="Reply"
          position="right"
          logined={currentUser != null}
        />
      </DialogContent>
    </Dialog>
  )
}

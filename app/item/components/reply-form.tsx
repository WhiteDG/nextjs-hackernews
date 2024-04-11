"use client"

import Link from "next/link"
import { useFormAction, useGoto } from "@/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { InfoIcon, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import { z } from "zod"

import { replyAction } from "@/lib/actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

const replyFormSchema = z.object({
  parent: z.number(),
  text: z
    .string({
      required_error: "Please enter your comment",
    })
    .min(1, { message: "Please enter your comment" }),
})
type ReplyFormValues = z.infer<typeof replyFormSchema>

type Props = {
  logined: boolean
  text?: string
  position?: "left" | "right"
  parentId: number
}

export default function ReplyForm({
  logined,
  text,
  position,
  parentId,
}: Props) {
  const form = useFormAction<ReplyFormValues>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: { parent: parentId, text: "" },
    schema: replyFormSchema,
    mode: "onSubmit",
  })
  const goto = useGoto()
  const action = () => {
    form.handleAction(replyAction)
  }
  return (
    <Form {...form}>
      <form className="space-y-4" action={action}>
        <input hidden name="parent" defaultValue={parentId} />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea className="h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div
          className={cn(
            "flex flex-row items-center space-x-2",
            position === "right" && "float-right"
          )}
        >
          <ReplyButton text={text ? text : "Add Comment"} logined={logined} />
          {!logined && (
            <Popover>
              <PopoverTrigger>
                <InfoIcon className="size-4 text-muted-foreground" />
              </PopoverTrigger>
              <PopoverContent className="max-w-48 border-0 bg-primary text-sm font-medium text-primary-foreground">
                You have to be{" "}
                <Link
                  rel="noreferrer nofollow"
                  href={{
                    pathname: "/login",
                    query: { goto: goto },
                  }}
                  className="underline"
                >
                  logged in
                </Link>{" "}
                to reply. If you are already logged in, please{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    window.location.reload()
                  }}
                >
                  refresh
                </button>{" "}
                the page to continue.
              </PopoverContent>
            </Popover>
          )}
        </div>
      </form>
    </Form>
  )
}

function ReplyButton({ text, logined }: { text: string; logined: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={!logined || pending}>
      {pending && <Loader2 className="mr-2 animate-spin" size={16} />}
      {text}
    </Button>
  )
}

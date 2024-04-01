"use client"

import { useFormAction } from "@/hooks"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import { z } from "zod"

import { loginAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const authFormSchema = z.object({
  creating: z.string().max(1).optional(),
  acct: z
    .string({
      required_error: "Please enter your username",
    })
    .min(1, { message: "Please enter your username" }),
  pw: z
    .string({
      required_error: "Please enter your password",
    })
    .min(1, { message: "Please enter your password" }),
  goto: z.string().default("/"),
})
type AuthFormValues = z.infer<typeof authFormSchema>

export function AuthForm({
  goto,
  creating,
}: {
  goto?: string
  creating?: boolean
}) {
  const form = useFormAction<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: { goto, acct: "", pw: "", creating: "" },
    schema: authFormSchema,
    mode: "onChange",
  })
  const signinAction = () => {
    const result = form.handleAction(loginAction)
    console.log("🚀 ~ signinAction ~ result:", result)
  }
  return (
    <Form {...form}>
      <form action={signinAction} className="space-y-4">
        {creating && <input hidden name="creating" defaultValue="t" />}
        <input hidden name="goto" defaultValue={goto} />
        <FormField
          control={form.control}
          name="acct"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton text={creating ? "Create Account" : "Login"} />
      </form>
    </Form>
  )
}
function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 animate-spin" size={16} />}
      {text}
    </Button>
  )
}

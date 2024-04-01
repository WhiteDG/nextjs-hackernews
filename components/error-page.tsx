import { Button } from "@/components/ui/button"

export default function ErrorPage() {
  return (
    <div className="m-auto w-full">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h2 className="text-lg">Oops! Something went wrong!</h2>
        <Button
          onClick={() => {
            window.location.reload()
          }}
        >
          Try again
        </Button>
      </div>
    </div>
  )
}

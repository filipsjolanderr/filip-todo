import { cn } from "~/lib/utils"
import { AuthCard } from "@daveyplate/better-auth-ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$pathname")({
  component: RouteComponent
})

function RouteComponent() {
  const { pathname } = Route.useParams()

  return (
    <div className="flex size-full grow flex-col items-center justify-center gap-3 p-4">
      <AuthCard pathname={pathname} classNames={{
        base: "max-w-xs",
        title: "text-xl font-semibold",
      }} />

      <p
        className={cn(
          ["callback", "settings", "sign-out"].includes(pathname) && "hidden",
          "text-muted-foreground text-xs"
        )}
      >
      </p>
    </div>
  )
}

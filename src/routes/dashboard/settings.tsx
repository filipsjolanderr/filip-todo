import { SettingsCards } from '@daveyplate/better-auth-ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-2xl py-12 px-4">
      <SettingsCards />
    </div>
  )
}

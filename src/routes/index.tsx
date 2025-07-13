import { createFileRoute } from '@tanstack/react-router'
import { UserButton } from '@daveyplate/better-auth-ui'
export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <UserButton />
    </div>
  )
}

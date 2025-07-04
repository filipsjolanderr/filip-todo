import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cv')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cv"!</div>
}

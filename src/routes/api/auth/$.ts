import { auth } from '~/lib/auth'
import { createServerFileRoute } from '@tanstack/react-start/server'

export const ServerRoute = createServerFileRoute('/api/auth/$')
  .methods({
    GET: ({ request }: { request: Request }) => {
      return auth.handler(request)
    },
    POST: ({ request }: { request: Request }) => {
      return auth.handler(request)
    },
  }) 

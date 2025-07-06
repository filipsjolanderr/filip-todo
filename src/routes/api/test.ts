import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'

export const ServerRoute = createServerFileRoute('/api/test')
  .methods({
    GET: async ({ request }) => {
      return json({ message: 'API is working!' })
    },
  }) 
import { createServerFileRoute } from '@tanstack/react-start/server'
import { json } from '@tanstack/react-start'
import { getCurrentUser } from '~/lib/auth-utils'

export const ServerRoute = createServerFileRoute('/api/me')
  .methods({
    GET: async ({ request }: { request: Request }) => {
      const user = await getCurrentUser(request);
      
      if (!user) {
        return new Response('Unauthorized', { status: 401 });
      }
      
      return json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      });
    },
  }) 
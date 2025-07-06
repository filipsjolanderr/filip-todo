import { createAPIFileRoute } from '@tanstack/start/api'
import { getCurrentUser } from '@/lib/auth-utils'

export const APIRoute = createAPIFileRoute('/api/me')({
  GET: async ({ request }) => {
    const user = await getCurrentUser(request);
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  },
}) 
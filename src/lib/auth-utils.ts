import { auth } from './auth';

export async function getSession(request: Request) {
  return await auth.api.getSession({ request });
}

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }
  return session;
}

export async function getCurrentUser(request: Request) {
  const session = await getSession(request);
  return session?.user;
} 
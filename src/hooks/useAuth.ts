import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const response = await fetch('/api/me');
      if (!response.ok) {
        throw new Error('Not authenticated');
      }
      return response.json();
    },
    retry: false,
  });
}

export function useUser() {
  const { data, isLoading, error } = useAuth();
  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user,
    error,
  };
} 
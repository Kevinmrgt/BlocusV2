import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  gyms: {
    all: ['gyms'] as const,
    withWalls: (gymId: string) => ['gyms', gymId, 'walls'] as const,
  },
  boulders: {
    byWall: (wallId: string) => ['boulders', 'wall', wallId] as const,
    detail: (boulderId: string) => ['boulders', boulderId] as const,
  },
  user: {
    profile: (userId: string) => ['user', userId, 'profile'] as const,
    validations: (userId: string) => ['user', userId, 'validations'] as const,
    favorites: (userId: string) => ['user', userId, 'favorites'] as const,
  },
  leaderboard: (gymId?: string) => ['leaderboard', gymId ?? 'global'] as const,
};

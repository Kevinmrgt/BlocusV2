/**
 * Favorites Hooks
 * [Source: architecture/frontend-architecture.md#custom-hooks]
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkIsFavorited,
} from '@/services/api/favorites';
import { useAuth } from '@/providers/AuthProvider';

/**
 * Hook to fetch user's favorite boulders
 */
export function useFavorites() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user', 'favorites', user?.id],
    queryFn: () => getFavorites(user!.id),
    enabled: !!user?.id,
  });
}

/**
 * Hook to check if a specific boulder is favorited
 */
export function useIsFavorited(boulderId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['favorite', boulderId, user?.id],
    queryFn: () => checkIsFavorited(user!.id, boulderId),
    enabled: !!user?.id && !!boulderId,
  });
}

/**
 * Hook to toggle favorite status
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ boulderId, isFavorited }: { boulderId: string; isFavorited: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');

      if (isFavorited) {
        await removeFavorite(user.id, boulderId);
      } else {
        await addFavorite(user.id, boulderId);
      }
    },
    onMutate: async ({ boulderId, isFavorited }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorite', boulderId] });

      // Snapshot previous value
      const previousValue = queryClient.getQueryData(['favorite', boulderId, user?.id]);

      // Optimistically update
      queryClient.setQueryData(['favorite', boulderId, user?.id], !isFavorited);

      return { previousValue };
    },
    onError: (_err, { boulderId }, context) => {
      // Rollback on error
      if (context?.previousValue !== undefined) {
        queryClient.setQueryData(['favorite', boulderId, user?.id], context.previousValue);
      }
    },
    onSettled: (_data, _error, { boulderId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['favorite', boulderId] });
      queryClient.invalidateQueries({ queryKey: ['user', 'favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['boulder', boulderId] });
    },
  });
}

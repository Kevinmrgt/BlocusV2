/**
 * User Profile Hook
 * [Source: architecture/components-logical-components.md#custom-hooks]
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, updateUserProfile } from '@/services/api/users';
import { useAuth } from '@/providers/AuthProvider';

/**
 * Hook to fetch user profile with computed statistics
 * @param userId - Optional user ID, defaults to current authenticated user
 */
export function useUserProfile(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId ?? user?.id;

  return useQuery({
    queryKey: ['user', 'profile', targetUserId],
    queryFn: () => getUserProfile(targetUserId!),
    enabled: !!targetUserId,
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (updates: { username?: string; bio?: string; avatar_url?: string }) =>
      updateUserProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', user!.id] });
    },
  });
}

/**
 * Validation Hooks
 * [Source: architecture/frontend-architecture.md#custom-hooks]
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createValidation,
  checkIsValidated,
  getValidationsByUser,
} from '@/services/api/validations';
import { useAuth } from '@/providers/AuthProvider';

/**
 * Hook to check if a specific boulder is validated by current user
 */
export function useIsValidated(boulderId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['validation', boulderId, user?.id],
    queryFn: () => checkIsValidated(user!.id, boulderId),
    enabled: !!user?.id && !!boulderId,
  });
}

/**
 * Hook to fetch user's validation history
 */
export function useUserValidations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user', 'validations', user?.id],
    queryFn: () => getValidationsByUser(user!.id),
    enabled: !!user?.id,
  });
}

/**
 * Hook to validate a boulder
 */
export function useValidateBoulder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ boulderId, difficulty }: { boulderId: string; difficulty: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return createValidation(user.id, boulderId, difficulty);
    },
    onMutate: async ({ boulderId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['validation', boulderId] });

      // Snapshot previous value
      const previousValue = queryClient.getQueryData(['validation', boulderId, user?.id]);

      // Optimistically update to validated
      queryClient.setQueryData(['validation', boulderId, user?.id], true);

      return { previousValue };
    },
    onError: (_err, { boulderId }, context) => {
      // Rollback on error
      if (context?.previousValue !== undefined) {
        queryClient.setQueryData(['validation', boulderId, user?.id], context.previousValue);
      }
    },
    onSettled: (_data, _error, { boulderId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['validation', boulderId] });
      queryClient.invalidateQueries({ queryKey: ['user', 'validations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['user', 'profile', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['boulder', boulderId] });
    },
  });
}

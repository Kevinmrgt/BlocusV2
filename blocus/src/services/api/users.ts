/**
 * User API Service
 * [Source: architecture/components-logical-components.md#service-layer]
 */

import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/models/user';

/**
 * Fetch user profile with computed statistics
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .select(
      `
      *,
      validations (count),
      favorites (count)
    `
    )
    .eq('id', userId)
    .single();

  if (error) throw error;

  return {
    ...data,
    validations_count: data.validations?.[0]?.count ?? 0,
    favorites_count: data.favorites?.[0]?.count ?? 0,
    rank: null, // Placeholder until Epic 5
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: { username?: string; bio?: string; avatar_url?: string }
): Promise<UserProfile> {
  const { error } = await supabase.from('users').update(updates).eq('id', userId).select().single();

  if (error) throw error;

  // Return updated profile with counts
  return getUserProfile(userId);
}

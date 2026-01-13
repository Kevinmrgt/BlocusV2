/**
 * Favorites API Service
 * [Source: architecture/data-models.md#favorites]
 */

import { supabase } from '@/lib/supabase';
import type { BoulderWithDetails } from '@/types/models/boulder';

/**
 * Get user's favorite boulders with details
 */
export async function getFavorites(userId: string): Promise<BoulderWithDetails[]> {
  const { data, error } = await supabase
    .from('favorites')
    .select(
      `
      id,
      created_at,
      boulder:boulders (
        id,
        title,
        description,
        difficulty,
        wall_id,
        created_at,
        updated_at,
        boulder_photos (id, boulder_id, url, order_index, created_at)
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform to BoulderWithDetails array
  return (data || []).map((f) => ({
    ...f.boulder,
    photos: f.boulder.boulder_photos || [],
    validations_count: 0,
    comments_count: 0,
    is_favorited: true,
  })) as BoulderWithDetails[];
}

/**
 * Add boulder to favorites
 */
export async function addFavorite(userId: string, boulderId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, boulder_id: boulderId });

  if (error) throw error;
}

/**
 * Remove boulder from favorites
 */
export async function removeFavorite(userId: string, boulderId: string): Promise<void> {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('boulder_id', boulderId);

  if (error) throw error;
}

/**
 * Check if a boulder is favorited by the user
 */
export async function checkIsFavorited(userId: string, boulderId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('boulder_id', boulderId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export type BoulderWithPhotos = Tables<'boulders'> & {
  boulder_photos: Tables<'boulder_photos'>[];
};

export async function getBouldersByWallId(wallId: string): Promise<BoulderWithPhotos[]> {
  const { data, error } = await supabase
    .from('boulders')
    .select(
      `
      *,
      boulder_photos (id, url, order_index)
    `
    )
    .eq('wall_id', wallId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as BoulderWithPhotos[]) ?? [];
}

export async function getBoulderById(boulderId: string): Promise<BoulderWithPhotos> {
  const { data, error } = await supabase
    .from('boulders')
    .select(
      `
      *,
      boulder_photos (id, url, order_index)
    `
    )
    .eq('id', boulderId)
    .single();

  if (error) throw error;

  // Sort boulder_photos by order_index client-side
  if (data.boulder_photos) {
    data.boulder_photos.sort((a, b) => a.order_index - b.order_index);
  }

  return data as BoulderWithPhotos;
}

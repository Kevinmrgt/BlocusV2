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

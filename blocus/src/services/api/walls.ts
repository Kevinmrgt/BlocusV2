import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export async function getWallsByGymId(gymId: string): Promise<Tables<'walls'>[]> {
  const { data, error } = await supabase
    .from('walls')
    .select('*')
    .eq('gym_id', gymId)
    .order('order_index');

  if (error) throw error;
  return data ?? [];
}

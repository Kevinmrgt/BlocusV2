import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export async function getGyms(): Promise<Tables<'gyms'>[]> {
  const { data, error } = await supabase.from('gyms').select('*').order('name');

  if (error) throw error;
  return data ?? [];
}

export async function getGymById(id: string): Promise<Tables<'gyms'> | null> {
  const { data, error } = await supabase.from('gyms').select('*').eq('id', id).single();

  if (error) throw error;
  return data;
}

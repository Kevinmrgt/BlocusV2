/**
 * Validations API Service
 * [Source: architecture/data-models.md#validation]
 */

import { supabase } from '@/lib/supabase';

export interface Validation {
  id: string;
  user_id: string;
  boulder_id: string;
  points_earned: number;
  validated_at: string;
}

/**
 * Create a validation for a boulder
 * Points are calculated as difficulty * 10
 */
export async function createValidation(
  userId: string,
  boulderId: string,
  difficulty: number
): Promise<Validation> {
  const points_earned = difficulty * 10;

  const { data, error } = await supabase
    .from('validations')
    .insert({
      user_id: userId,
      boulder_id: boulderId,
      points_earned,
    })
    .select()
    .single();

  if (error) {
    // Handle unique constraint violation (already validated)
    if (error.code === '23505') {
      throw new Error('Boulder already validated');
    }
    throw error;
  }

  return data;
}

/**
 * Check if a boulder is validated by the user
 */
export async function checkIsValidated(userId: string, boulderId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('validations')
    .select('id')
    .eq('user_id', userId)
    .eq('boulder_id', boulderId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/**
 * Get all validations for a user (for history)
 */
export async function getValidationsByUser(userId: string): Promise<Validation[]> {
  const { data, error } = await supabase
    .from('validations')
    .select('*')
    .eq('user_id', userId)
    .order('validated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

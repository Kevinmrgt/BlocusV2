/**
 * Boulder model types
 * [Source: architecture/data-models.md]
 */

export interface Boulder {
  id: string;
  wall_id: string;
  title: string;
  description: string | null;
  difficulty: number; // 1-10
  created_at: string;
  updated_at: string;
}

export interface BoulderInsert {
  id?: string;
  wall_id: string;
  title: string;
  description?: string | null;
  difficulty: number;
  created_at?: string;
  updated_at?: string;
}

export interface BoulderUpdate {
  id?: string;
  wall_id?: string;
  title?: string;
  description?: string | null;
  difficulty?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Validation {
  id: string;
  user_id: string;
  boulder_id: string;
  points_earned: number;
  validated_at: string;
}

export interface ValidationInsert {
  id?: string;
  user_id: string;
  boulder_id: string;
  points_earned: number;
  validated_at?: string;
}

export interface ValidationUpdate {
  id?: string;
  user_id?: string;
  boulder_id?: string;
  points_earned?: number;
  validated_at?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  boulder_id: string;
  created_at: string;
}

export interface FavoriteInsert {
  id?: string;
  user_id: string;
  boulder_id: string;
  created_at?: string;
}

export interface FavoriteUpdate {
  id?: string;
  user_id?: string;
  boulder_id?: string;
  created_at?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  boulder_id: string;
  content: string;
  created_at: string;
}

export interface CommentInsert {
  id?: string;
  user_id: string;
  boulder_id: string;
  content: string;
  created_at?: string;
}

export interface CommentUpdate {
  id?: string;
  user_id?: string;
  boulder_id?: string;
  content?: string;
  created_at?: string;
}

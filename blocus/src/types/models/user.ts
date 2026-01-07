/**
 * User model types
 * [Source: architecture/data-models.md]
 */

export interface User {
  id: string;
  email: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface UserInsert {
  id: string;
  email: string;
  username?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  total_points?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UserUpdate {
  id?: string;
  email?: string;
  username?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  total_points?: number;
  created_at?: string;
  updated_at?: string;
}

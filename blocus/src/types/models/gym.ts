/**
 * Gym model types
 * [Source: architecture/data-models.md]
 */

export interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface GymInsert {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GymUpdate {
  id?: string;
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GymAdmin {
  id: string;
  user_id: string;
  gym_id: string;
  created_at: string;
}

export interface GymAdminInsert {
  id?: string;
  user_id: string;
  gym_id: string;
  created_at?: string;
}

export interface GymAdminUpdate {
  id?: string;
  user_id?: string;
  gym_id?: string;
  created_at?: string;
}

/**
 * Wall model types
 * [Source: architecture/data-models.md]
 */

export interface Wall {
  id: string;
  gym_id: string;
  name: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface WallInsert {
  id?: string;
  gym_id: string;
  name: string;
  description?: string | null;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface WallUpdate {
  id?: string;
  gym_id?: string;
  name?: string;
  description?: string | null;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

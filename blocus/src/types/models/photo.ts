/**
 * Photo model types for gym, wall, and boulder photos
 * [Source: architecture/data-models.md]
 */

export interface GymPhoto {
  id: string;
  gym_id: string;
  url: string;
  order_index: number;
  created_at: string;
}

export interface GymPhotoInsert {
  id?: string;
  gym_id: string;
  url: string;
  order_index?: number;
  created_at?: string;
}

export interface GymPhotoUpdate {
  id?: string;
  gym_id?: string;
  url?: string;
  order_index?: number;
  created_at?: string;
}

export interface WallPhoto {
  id: string;
  wall_id: string;
  url: string;
  order_index: number;
  created_at: string;
}

export interface WallPhotoInsert {
  id?: string;
  wall_id: string;
  url: string;
  order_index?: number;
  created_at?: string;
}

export interface WallPhotoUpdate {
  id?: string;
  wall_id?: string;
  url?: string;
  order_index?: number;
  created_at?: string;
}

export interface BoulderPhoto {
  id: string;
  boulder_id: string;
  url: string;
  order_index: number;
  created_at: string;
}

export interface BoulderPhotoInsert {
  id?: string;
  boulder_id: string;
  url: string;
  order_index?: number;
  created_at?: string;
}

export interface BoulderPhotoUpdate {
  id?: string;
  boulder_id?: string;
  url?: string;
  order_index?: number;
  created_at?: string;
}

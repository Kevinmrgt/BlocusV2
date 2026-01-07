/**
 * Barrel export for all model types
 */

// User models
export type { User, UserInsert, UserUpdate } from './user';

// Gym models
export type { Gym, GymInsert, GymUpdate, GymAdmin, GymAdminInsert, GymAdminUpdate } from './gym';

// Wall models
export type { Wall, WallInsert, WallUpdate } from './wall';

// Boulder models
export type {
  Boulder,
  BoulderInsert,
  BoulderUpdate,
  Validation,
  ValidationInsert,
  ValidationUpdate,
  Favorite,
  FavoriteInsert,
  FavoriteUpdate,
  Comment,
  CommentInsert,
  CommentUpdate,
} from './boulder';

// Photo models
export type {
  GymPhoto,
  GymPhotoInsert,
  GymPhotoUpdate,
  WallPhoto,
  WallPhotoInsert,
  WallPhotoUpdate,
  BoulderPhoto,
  BoulderPhotoInsert,
  BoulderPhotoUpdate,
} from './photo';

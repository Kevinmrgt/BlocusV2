# API Specification

Avec Supabase, l'API REST est **auto-générée** par PostgREST depuis le schéma PostgreSQL. Cette section documente les patterns d'utilisation et les endpoints clés.

## API Design Approach

**Style:** REST (PostgREST auto-generated)

**Base URL:** `https://<project-ref>.supabase.co/rest/v1`

**Authentication:** Bearer token (JWT) dans le header `Authorization`

## Core API Endpoints

| Resource        | Method | Endpoint                                                        | Description          | Auth Required  |
| --------------- | ------ | --------------------------------------------------------------- | -------------------- | -------------- |
| **Gyms**        | GET    | `/gyms`                                                         | Liste des salles     | Non            |
|                 | GET    | `/gyms?id=eq.{id}&select=*,walls(*)`                            | Salle avec murs      | Non            |
| **Walls**       | GET    | `/walls?gym_id=eq.{id}&order=order_index`                       | Murs d'une salle     | Non            |
| **Boulders**    | GET    | `/boulders?wall_id=eq.{id}`                                     | Blocs d'un mur       | Non            |
|                 | GET    | `/boulders?id=eq.{id}&select=*,boulder_photos(*),validations(count)` | Détail boulder  | Non            |
| **Validations** | POST   | `/validations`                                                  | Valider un boulder   | Oui (User)     |
|                 | DELETE | `/validations?id=eq.{id}`                                       | Annuler validation   | Oui (Owner)    |
| **Favorites**   | POST   | `/favorites`                                                    | Ajouter favori       | Oui (User)     |
|                 | DELETE | `/favorites?user_id=eq.{id}&boulder_id=eq.{id}`                 | Retirer favori       | Oui (Owner)    |
| **Comments**    | GET    | `/comments?boulder_id=eq.{id}&order=created_at.desc`            | Commentaires         | Non            |
|                 | POST   | `/comments`                                                     | Ajouter commentaire  | Oui (User)     |
|                 | DELETE | `/comments?id=eq.{id}`                                          | Supprimer            | Oui (Owner/Admin) |
| **Users**       | GET    | `/users?id=eq.{id}`                                             | Profil public        | Non            |
|                 | PATCH  | `/users?id=eq.{id}`                                             | Modifier profil      | Oui (Owner)    |
| **Leaderboard** | GET    | `/users?order=total_points.desc&limit=50`                       | Classement           | Non            |

## Query Patterns with Supabase Client

```typescript
// src/services/api/boulders.ts

import { supabase } from '@/lib/supabase';
import type { BoulderWithDetails } from '@/types/models';

// Fetch boulder with related data
export async function getBoulderDetails(boulderId: string): Promise<BoulderWithDetails> {
  const { data, error } = await supabase
    .from('boulders')
    .select(`
      *,
      boulder_photos (id, url, order_index),
      validations (count),
      comments (count)
    `)
    .eq('id', boulderId)
    .single();

  if (error) throw error;
  return data;
}

// Fetch boulders for a wall with user-specific data
export async function getWallBoulders(
  wallId: string,
  userId?: string
): Promise<BoulderWithDetails[]> {
  let query = supabase
    .from('boulders')
    .select(`
      *,
      boulder_photos (id, url, order_index),
      validations (count)
    `)
    .eq('wall_id', wallId)
    .order('created_at', { ascending: false });

  const { data: boulders, error } = await query;
  if (error) throw error;

  // If user logged in, fetch their validations/favorites
  if (userId && boulders) {
    const boulderIds = boulders.map(b => b.id);

    const [validationsRes, favoritesRes] = await Promise.all([
      supabase
        .from('validations')
        .select('boulder_id')
        .eq('user_id', userId)
        .in('boulder_id', boulderIds),
      supabase
        .from('favorites')
        .select('boulder_id')
        .eq('user_id', userId)
        .in('boulder_id', boulderIds)
    ]);

    const validatedIds = new Set(validationsRes.data?.map(v => v.boulder_id));
    const favoritedIds = new Set(favoritesRes.data?.map(f => f.boulder_id));

    return boulders.map(boulder => ({
      ...boulder,
      is_validated: validatedIds.has(boulder.id),
      is_favorited: favoritedIds.has(boulder.id)
    }));
  }

  return boulders;
}
```

## Authentication Flow

```typescript
// src/services/api/auth.ts

import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

// Sign up with email/password
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Listen to auth changes
export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
```

## File Upload Pattern

```typescript
// src/services/api/storage.ts

import { supabase } from '@/lib/supabase';
import * as ImageManipulator from 'expo-image-manipulator';

const MAX_IMAGE_SIZE = 1024; // px
const COMPRESSION_QUALITY = 0.8;

export async function uploadImage(
  bucket: 'avatars' | 'gyms' | 'walls' | 'boulders',
  uri: string,
  fileName: string
): Promise<string> {
  // Compress image before upload (NFR2)
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: MAX_IMAGE_SIZE } }],
    { compress: COMPRESSION_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
  );

  const response = await fetch(compressed.uri);
  const blob = await response.blob();

  const filePath = `${Date.now()}_${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, blob, {
      contentType: 'image/jpeg',
      upsert: false
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
```

## Error Handling

```typescript
// src/types/api.ts

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

export class SupabaseError extends Error {
  code: string;

  constructor(error: ApiError) {
    super(error.message);
    this.code = error.code;
    this.name = 'SupabaseError';
  }
}

// Common error codes
export const ERROR_CODES = {
  PGRST116: 'Resource not found',
  '23505': 'Duplicate entry (already exists)',
  '42501': 'Permission denied',
  '23503': 'Foreign key violation',
} as const;
```

## Rate Limiting & Caching

**Rate Limiting:** Géré nativement par Supabase (aucune limite sur free tier pour les requêtes normales)

**Caching Strategy (React Query):**

```typescript
// src/lib/queryClient.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (ex-cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Query keys factory
export const queryKeys = {
  gyms: {
    all: ['gyms'] as const,
    detail: (id: string) => ['gyms', id] as const,
    withWalls: (id: string) => ['gyms', id, 'walls'] as const,
  },
  boulders: {
    byWall: (wallId: string) => ['boulders', 'wall', wallId] as const,
    detail: (id: string) => ['boulders', id] as const,
  },
  user: {
    profile: (id: string) => ['user', id] as const,
    validations: (id: string) => ['user', id, 'validations'] as const,
    favorites: (id: string) => ['user', id, 'favorites'] as const,
  },
  leaderboard: (gymId?: string) => ['leaderboard', gymId] as const,
} as const;
```

---

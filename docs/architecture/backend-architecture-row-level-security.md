# Backend Architecture (Row Level Security)

Avec l'architecture BaaS Supabase, le "backend" réside dans PostgreSQL via Row Level Security (RLS). Cette section définit les politiques d'accès pour chaque table.

## RLS Overview

**Concept:** Row Level Security permet de définir des règles d'accès au niveau des lignes de la base de données. Chaque requête est automatiquement filtrée selon l'identité de l'utilisateur (via `auth.uid()`).

**Avantages:**

- Sécurité "defense in depth" - impossible à contourner même avec accès direct à l'API
- Logique d'autorisation centralisée dans la DB
- Performance optimisée par PostgreSQL (filtrage au niveau query planner)

## Role Definitions

| Role            | Description                         | Access Level                           |
| --------------- | ----------------------------------- | -------------------------------------- |
| `anon`          | Utilisateur non authentifié         | Lecture publique uniquement            |
| `authenticated` | Utilisateur connecté                | CRUD sur ses propres données           |
| `gym_admin`     | Admin d'une salle (via gym_admins)  | CRUD sur le contenu de sa salle        |

## Helper Functions

```sql
-- supabase/migrations/003_rls_helpers.sql

-- Check if current user is admin of a specific gym
CREATE OR REPLACE FUNCTION is_gym_admin(gym_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM gym_admins
    WHERE gym_id = gym_uuid
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get gym_id from wall_id (for nested permission checks)
CREATE OR REPLACE FUNCTION get_gym_id_from_wall(wall_uuid UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT gym_id FROM walls WHERE id = wall_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get gym_id from boulder_id (for deeply nested checks)
CREATE OR REPLACE FUNCTION get_gym_id_from_boulder(boulder_uuid UUID)
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT w.gym_id FROM boulders b
    JOIN walls w ON b.wall_id = w.id
    WHERE b.id = boulder_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## RLS Policies by Table

### Users Table

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Anyone can read public profiles
CREATE POLICY "users_select_public"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No direct insert (handled by trigger on auth.users)
-- No delete allowed (cascade from auth.users)
```

### Gyms Table

```sql
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;

-- Anyone can read gyms
CREATE POLICY "gyms_select_public"
  ON gyms FOR SELECT
  USING (true);

-- Only gym admins can update their gym
CREATE POLICY "gyms_update_admin"
  ON gyms FOR UPDATE
  USING (is_gym_admin(id))
  WITH CHECK (is_gym_admin(id));

-- Insert/delete reserved for super admin (not in MVP scope)
```

### Gym Admins Table

```sql
ALTER TABLE gym_admins ENABLE ROW LEVEL SECURITY;

-- Admins can see who else is admin of their gym
CREATE POLICY "gym_admins_select_members"
  ON gym_admins FOR SELECT
  USING (is_gym_admin(gym_id));

-- Only existing admin can add new admin
CREATE POLICY "gym_admins_insert"
  ON gym_admins FOR INSERT
  WITH CHECK (is_gym_admin(gym_id));

-- Admin can remove other admins (or themselves)
CREATE POLICY "gym_admins_delete"
  ON gym_admins FOR DELETE
  USING (is_gym_admin(gym_id));
```

### Walls Table

```sql
ALTER TABLE walls ENABLE ROW LEVEL SECURITY;

-- Anyone can read walls
CREATE POLICY "walls_select_public"
  ON walls FOR SELECT
  USING (true);

-- Gym admin can create walls
CREATE POLICY "walls_insert_admin"
  ON walls FOR INSERT
  WITH CHECK (is_gym_admin(gym_id));

-- Gym admin can update walls
CREATE POLICY "walls_update_admin"
  ON walls FOR UPDATE
  USING (is_gym_admin(gym_id))
  WITH CHECK (is_gym_admin(gym_id));

-- Gym admin can delete walls
CREATE POLICY "walls_delete_admin"
  ON walls FOR DELETE
  USING (is_gym_admin(gym_id));
```

### Boulders Table

```sql
ALTER TABLE boulders ENABLE ROW LEVEL SECURITY;

-- Anyone can read boulders
CREATE POLICY "boulders_select_public"
  ON boulders FOR SELECT
  USING (true);

-- Gym admin can create boulders
CREATE POLICY "boulders_insert_admin"
  ON boulders FOR INSERT
  WITH CHECK (is_gym_admin(get_gym_id_from_wall(wall_id)));

-- Gym admin can update boulders
CREATE POLICY "boulders_update_admin"
  ON boulders FOR UPDATE
  USING (is_gym_admin(get_gym_id_from_wall(wall_id)))
  WITH CHECK (is_gym_admin(get_gym_id_from_wall(wall_id)));

-- Gym admin can delete boulders (points remain per NFR8)
CREATE POLICY "boulders_delete_admin"
  ON boulders FOR DELETE
  USING (is_gym_admin(get_gym_id_from_wall(wall_id)));
```

### Validations Table

```sql
ALTER TABLE validations ENABLE ROW LEVEL SECURITY;

-- Anyone can read validations (for leaderboard)
CREATE POLICY "validations_select_public"
  ON validations FOR SELECT
  USING (true);

-- Authenticated users can create their own validations
CREATE POLICY "validations_insert_own"
  ON validations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own validations (unvalidate)
CREATE POLICY "validations_delete_own"
  ON validations FOR DELETE
  USING (auth.uid() = user_id);

-- No update allowed (immutable once created)
```

### Favorites Table

```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can only see their own favorites
CREATE POLICY "favorites_select_own"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "favorites_insert_own"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "favorites_delete_own"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### Comments Table

```sql
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "comments_select_public"
  ON comments FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "comments_insert_auth"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "comments_delete_own"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Gym admin can delete comments on their gym's boulders
CREATE POLICY "comments_delete_admin"
  ON comments FOR DELETE
  USING (is_gym_admin(get_gym_id_from_boulder(boulder_id)));
```

### Photo Tables (gym_photos, wall_photos, boulder_photos)

```sql
-- gym_photos
ALTER TABLE gym_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gym_photos_select_public"
  ON gym_photos FOR SELECT
  USING (true);

CREATE POLICY "gym_photos_insert_admin"
  ON gym_photos FOR INSERT
  WITH CHECK (is_gym_admin(gym_id));

CREATE POLICY "gym_photos_delete_admin"
  ON gym_photos FOR DELETE
  USING (is_gym_admin(gym_id));

-- wall_photos
ALTER TABLE wall_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wall_photos_select_public"
  ON wall_photos FOR SELECT
  USING (true);

CREATE POLICY "wall_photos_insert_admin"
  ON wall_photos FOR INSERT
  WITH CHECK (is_gym_admin(get_gym_id_from_wall(wall_id)));

CREATE POLICY "wall_photos_delete_admin"
  ON wall_photos FOR DELETE
  USING (is_gym_admin(get_gym_id_from_wall(wall_id)));

-- boulder_photos
ALTER TABLE boulder_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "boulder_photos_select_public"
  ON boulder_photos FOR SELECT
  USING (true);

CREATE POLICY "boulder_photos_insert_admin"
  ON boulder_photos FOR INSERT
  WITH CHECK (is_gym_admin(get_gym_id_from_boulder(boulder_id)));

CREATE POLICY "boulder_photos_delete_admin"
  ON boulder_photos FOR DELETE
  USING (is_gym_admin(get_gym_id_from_boulder(boulder_id)));
```

## Storage Bucket Policies

```sql
-- supabase/migrations/004_storage_policies.sql

-- Avatars bucket: users can upload/update their own avatar
CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Gyms bucket: only gym admins can upload
CREATE POLICY "gyms_storage_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gyms');

CREATE POLICY "gyms_storage_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gyms'
    AND is_gym_admin((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY "gyms_storage_delete_admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gyms'
    AND is_gym_admin((storage.foldername(name))[1]::uuid)
  );

-- Walls bucket: gym admins via gym reference in path
CREATE POLICY "walls_storage_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'walls');

CREATE POLICY "walls_storage_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'walls'
    AND is_gym_admin(get_gym_id_from_wall((storage.foldername(name))[1]::uuid))
  );

CREATE POLICY "walls_storage_delete_admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'walls'
    AND is_gym_admin(get_gym_id_from_wall((storage.foldername(name))[1]::uuid))
  );

-- Boulders bucket: gym admins via boulder reference
CREATE POLICY "boulders_storage_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'boulders');

CREATE POLICY "boulders_storage_insert_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'boulders'
    AND is_gym_admin(get_gym_id_from_boulder((storage.foldername(name))[1]::uuid))
  );

CREATE POLICY "boulders_storage_delete_admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'boulders'
    AND is_gym_admin(get_gym_id_from_boulder((storage.foldername(name))[1]::uuid))
  );
```

## RLS Policy Matrix

| Table          | SELECT         | INSERT           | UPDATE       | DELETE              |
| -------------- | -------------- | ---------------- | ------------ | ------------------- |
| users          | Public         | Trigger only     | Owner        | Cascade only        |
| gyms           | Public         | Super admin      | Gym admin    | Super admin         |
| gym_admins     | Gym admins     | Gym admin        | -            | Gym admin           |
| walls          | Public         | Gym admin        | Gym admin    | Gym admin           |
| boulders       | Public         | Gym admin        | Gym admin    | Gym admin           |
| validations    | Public         | Owner            | -            | Owner               |
| favorites      | Owner          | Owner            | -            | Owner               |
| comments       | Public         | Owner            | -            | Owner / Gym admin   |
| *_photos       | Public         | Gym admin        | -            | Gym admin           |

## Security Considerations

**Defense in Depth:**

1. **API Level:** Supabase client uses anon key with RLS enforcement
2. **Database Level:** RLS policies filter all queries
3. **Storage Level:** Bucket policies control file access
4. **Application Level:** React Query cache + optimistic updates

**Key Security Rules:**

- `SECURITY DEFINER` functions run with elevated privileges - used sparingly for helper functions
- All policies use `auth.uid()` for identity verification
- No direct SQL access from client - all via PostgREST
- Storage paths encode ownership (user_id or gym_id as folder name)

**Testing RLS:**

```sql
-- Test as specific user
SET request.jwt.claim.sub = 'user-uuid-here';
SET role = 'authenticated';

-- Verify policy works
SELECT * FROM boulders; -- Should return all (public read)
INSERT INTO validations (user_id, boulder_id) VALUES ('other-user', 'boulder-id'); -- Should fail
```

---

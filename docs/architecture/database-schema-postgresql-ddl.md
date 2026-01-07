# Database Schema (PostgreSQL DDL)

Cette section fournit le schéma SQL complet pour Supabase, incluant les tables, contraintes, index et fonctions.

## Complete Schema

```sql
-- supabase/migrations/001_initial_schema.sql

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Gyms table
CREATE TABLE gyms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Gym admins (junction table)
CREATE TABLE gym_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, gym_id)
);

-- Gym photos
CREATE TABLE gym_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Walls table
CREATE TABLE walls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Wall photos
CREATE TABLE wall_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wall_id UUID NOT NULL REFERENCES walls(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Boulders table
CREATE TABLE boulders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wall_id UUID NOT NULL REFERENCES walls(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Boulder photos
CREATE TABLE boulder_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  boulder_id UUID NOT NULL REFERENCES boulders(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Validations table
CREATE TABLE validations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boulder_id UUID NOT NULL REFERENCES boulders(id) ON DELETE CASCADE,
  points_earned INTEGER NOT NULL,
  validated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, boulder_id)
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boulder_id UUID NOT NULL REFERENCES boulders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, boulder_id)
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boulder_id UUID NOT NULL REFERENCES boulders(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

-- Users
CREATE INDEX idx_users_total_points ON users(total_points DESC);
CREATE INDEX idx_users_username ON users(username) WHERE username IS NOT NULL;

-- Gyms
CREATE INDEX idx_gyms_location ON gyms(latitude, longitude);
CREATE INDEX idx_gyms_name ON gyms(name);

-- Walls
CREATE INDEX idx_walls_gym_id ON walls(gym_id);
CREATE INDEX idx_walls_order ON walls(gym_id, order_index);

-- Boulders
CREATE INDEX idx_boulders_wall_id ON boulders(wall_id);
CREATE INDEX idx_boulders_difficulty ON boulders(difficulty);

-- Validations
CREATE INDEX idx_validations_user_id ON validations(user_id);
CREATE INDEX idx_validations_boulder_id ON validations(boulder_id);
CREATE INDEX idx_validations_validated_at ON validations(validated_at DESC);

-- Favorites
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_boulder_id ON favorites(boulder_id);

-- Comments
CREATE INDEX idx_comments_boulder_id ON comments(boulder_id);
CREATE INDEX idx_comments_created_at ON comments(boulder_id, created_at DESC);

-- Photos
CREATE INDEX idx_gym_photos_gym_id ON gym_photos(gym_id);
CREATE INDEX idx_wall_photos_wall_id ON wall_photos(wall_id);
CREATE INDEX idx_boulder_photos_boulder_id ON boulder_photos(boulder_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_gyms_updated_at
  BEFORE UPDATE ON gyms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_walls_updated_at
  BEFORE UPDATE ON walls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_boulders_updated_at
  BEFORE UPDATE ON boulders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate points_earned on validation insert
CREATE OR REPLACE FUNCTION calculate_validation_points()
RETURNS TRIGGER AS $$
BEGIN
  SELECT difficulty * 10 INTO NEW.points_earned
  FROM boulders WHERE id = NEW.boulder_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_validation_points
  BEFORE INSERT ON validations
  FOR EACH ROW EXECUTE FUNCTION calculate_validation_points();

-- Update user total_points on validation change
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users
    SET total_points = total_points + NEW.points_earned
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users
    SET total_points = total_points - OLD.points_earned
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_user_points
  AFTER INSERT OR DELETE ON validations
  FOR EACH ROW EXECUTE FUNCTION update_user_total_points();

-- Create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Storage Buckets Configuration

```sql
-- supabase/migrations/002_storage_buckets.sql

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 1048576, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('gyms', 'gyms', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('walls', 'walls', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('boulders', 'boulders', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies (see Backend Architecture section for full RLS)
```

## Database Constraints Summary

| Table       | Constraint                    | Type   | Description                     |
| ----------- | ----------------------------- | ------ | ------------------------------- |
| users       | users_pkey                    | PK     | UUID from auth.users            |
| users       | users_username_key            | UNIQUE | Username unique si défini       |
| boulders    | boulders_difficulty_check     | CHECK  | 1 ≤ difficulty ≤ 10             |
| validations | validations_user_boulder_key  | UNIQUE | Une validation par user/boulder |
| favorites   | favorites_user_boulder_key    | UNIQUE | Un favori par user/boulder      |
| comments    | comments_content_check        | CHECK  | ≤ 500 caractères                |
| gym_admins  | gym_admins_user_gym_key       | UNIQUE | Un admin par user/gym           |

---

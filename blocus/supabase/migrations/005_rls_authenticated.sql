-- Migration: 005_rls_authenticated.sql
-- Purpose: Enable Row Level Security policies for authenticated user actions
-- Tables: favorites, validations, comments
-- Date: 2026-01-13

-- ============================================
-- FAVORITES TABLE
-- Users can only see, add, and remove their own favorites
-- ============================================

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

-- ============================================
-- VALIDATIONS TABLE
-- Anyone can read validations (needed for leaderboard)
-- Authenticated users can create/delete their own validations
-- ============================================

ALTER TABLE validations ENABLE ROW LEVEL SECURITY;

-- Anyone can read validations (for leaderboard display)
CREATE POLICY "validations_select_public"
  ON validations FOR SELECT
  USING (true);

-- Authenticated users can create their own validations
CREATE POLICY "validations_insert_own"
  ON validations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own validations (unvalidate a boulder)
CREATE POLICY "validations_delete_own"
  ON validations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS TABLE
-- Anyone can read comments
-- Authenticated users can create/delete their own comments
-- ============================================

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

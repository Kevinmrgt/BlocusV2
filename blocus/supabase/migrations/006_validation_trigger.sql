-- Migration 006: Validation Trigger and RLS Policies
-- Story 5.1: Boulder Validation
-- [Source: architecture/data-models.md#validation]

-- =====================================================
-- TRIGGER FUNCTION: Update user total_points on validation
-- =====================================================

-- Create trigger function to automatically update total_points
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Add points_earned to user's total_points
  UPDATE users
  SET total_points = COALESCE(total_points, 0) + NEW.points_earned
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to execute after validation insert
DROP TRIGGER IF EXISTS on_validation_insert ON validations;
CREATE TRIGGER on_validation_insert
AFTER INSERT ON validations
FOR EACH ROW
EXECUTE FUNCTION update_user_total_points();

-- =====================================================
-- UNIQUE CONSTRAINT: One validation per user per boulder
-- =====================================================

-- Add unique constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'validations_user_boulder_unique'
  ) THEN
    ALTER TABLE validations
    ADD CONSTRAINT validations_user_boulder_unique
    UNIQUE (user_id, boulder_id);
  END IF;
END $$;

-- =====================================================
-- RLS POLICIES: Validations table
-- =====================================================

-- Enable RLS on validations table
ALTER TABLE validations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "validations_select_public" ON validations;
DROP POLICY IF EXISTS "validations_insert_own" ON validations;

-- Policy: Anyone can read validations (for counts, leaderboard)
CREATE POLICY "validations_select_public"
  ON validations FOR SELECT
  USING (true);

-- Policy: Authenticated users can create their own validations
CREATE POLICY "validations_insert_own"
  ON validations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- COMMENTS: Documentation
-- =====================================================

COMMENT ON FUNCTION update_user_total_points() IS
  'Automatically adds points_earned to user total_points when a validation is inserted';

COMMENT ON TRIGGER on_validation_insert ON validations IS
  'Trigger to update user total_points after boulder validation';

COMMENT ON CONSTRAINT validations_user_boulder_unique ON validations IS
  'Ensures a user can only validate a boulder once';

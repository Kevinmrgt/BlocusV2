# Seed Data Documentation

This document explains how to populate the Blocus database with sample data for development and testing.

## Overview

The seed script creates:
- **3 gyms** in Paris area
- **12 walls** (3-5 per gym)
- **42 boulders** with varied difficulty (1-10)
- **51 photos** using placeholder images

## Running the Seed Script

### Option 1: Supabase SQL Editor (Recommended)

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `blocus/supabase/seed.sql`
4. Paste into the SQL Editor
5. Click **Run**

### Option 2: Supabase CLI

```bash
# From the blocus directory
cd blocus

# Reset database and run seed
supabase db reset
```

Note: `supabase db reset` will:
1. Drop all tables
2. Run all migrations
3. Execute `supabase/seed.sql`

### Option 3: Direct psql Connection

```bash
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f supabase/seed.sql
```

## Resetting Data

The seed script automatically clears existing data before inserting new records:

```sql
DELETE FROM boulder_photos;
DELETE FROM boulders;
DELETE FROM walls;
DELETE FROM gyms;
```

To reset, simply re-run the seed script.

## Data Summary

### Gyms

| Name | Location | Description |
|------|----------|-------------|
| Bloc Session Paris | 75011 Paris | Modern gym, 500m2 |
| Arkose Nation | 75020 Paris | Beginner & advanced areas |
| Climb Up Pantin | 93500 Pantin | Largest gym in IDF |

### Difficulty Distribution

| Level | Difficulty | Count | Percentage |
|-------|------------|-------|------------|
| Easy | 1-3 | 10 | ~24% |
| Medium | 4-6 | 17 | ~40% |
| Hard | 7-8 | 11 | ~26% |
| Expert | 9-10 | 4 | ~10% |

### Edge Cases Included

- Boulders with `NULL` description (6 total)
- Boulders with long descriptions
- Full difficulty range (1 to 10)
- Multiple photos per boulder (some have 2)
- French-language content

## Placeholder Images

Images use [picsum.photos](https://picsum.photos) with seeded URLs:

```
https://picsum.photos/seed/{unique-id}/400/300
```

Each boulder has a unique seed for consistent, varied images.

## Verification

After running the seed, verify with:

```sql
SELECT COUNT(*) as gyms FROM gyms;           -- Expected: 3
SELECT COUNT(*) as walls FROM walls;         -- Expected: 12
SELECT COUNT(*) as boulders FROM boulders;   -- Expected: 42
SELECT COUNT(*) as photos FROM boulder_photos; -- Expected: 51
```

## Testing in App

1. Run the seed script
2. Launch the app: `npx expo start`
3. Verify:
   - [ ] Gyms appear on map at Paris coordinates
   - [ ] Selecting a gym shows walls list
   - [ ] Each wall displays boulder grid
   - [ ] Boulder detail screen shows photos and info
   - [ ] Difficulty badges display correctly (1-10)

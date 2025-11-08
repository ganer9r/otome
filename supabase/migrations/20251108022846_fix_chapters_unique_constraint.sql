-- Fix chapters UNIQUE constraint for soft delete support
-- Description: Remove character_id UNIQUE constraint and add PARTIAL UNIQUE INDEX (deleted_at IS NULL only)

-- =====================================================
-- Drop existing UNIQUE constraint
-- =====================================================
ALTER TABLE "public"."chapters"
  DROP CONSTRAINT IF EXISTS "chapters_character_id_unique";

-- =====================================================
-- Add PARTIAL UNIQUE INDEX (only for active records)
-- =====================================================
-- This ensures only ONE active chapter per character (deleted_at IS NULL)
-- Multiple soft-deleted chapters are allowed
CREATE UNIQUE INDEX "chapters__character_id_active__uniq"
  ON "public"."chapters"("character_id")
  WHERE "deleted_at" IS NULL;

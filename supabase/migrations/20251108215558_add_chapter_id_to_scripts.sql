-- Add chapter_id to scripts table
-- Description: Adds chapter_id column to scripts table to link scripts with specific chapters

-- =====================================================
-- Add chapter_id column
-- =====================================================
ALTER TABLE "public"."scripts"
  ADD COLUMN "chapter_id" uuid;

-- =====================================================
-- Add foreign key constraint
-- =====================================================
-- Link scripts.chapter_id to chapters.id
-- ON DELETE SET NULL: When a chapter is deleted, the script remains but chapter_id becomes NULL
ALTER TABLE "public"."scripts"
  ADD CONSTRAINT "scripts_chapter_id_fkey"
  FOREIGN KEY ("chapter_id")
  REFERENCES "public"."chapters"("id")
  ON DELETE SET NULL;

-- =====================================================
-- Add index for performance
-- =====================================================
-- Index on chapter_id for efficient queries
CREATE INDEX "scripts__chapter_id__idx"
  ON "public"."scripts"
  USING btree ("chapter_id");

-- =====================================================
-- Comment
-- =====================================================
COMMENT ON COLUMN "public"."scripts"."chapter_id" IS 'Optional reference to a specific chapter. NULL means the script is not linked to any chapter.';

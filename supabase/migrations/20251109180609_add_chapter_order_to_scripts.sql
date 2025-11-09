-- Add chapter_order column to scripts table
ALTER TABLE "public"."scripts"
  ADD COLUMN "chapter_order" integer;

-- Add comment
COMMENT ON COLUMN "public"."scripts"."chapter_order" IS 'Order number of the chapter within the chapters data array (1-30)';

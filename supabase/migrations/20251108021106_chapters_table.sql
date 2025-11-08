-- Chapters Table Migration
-- Description: Creates chapters table for storing AI-generated chapters (30 chapters per character), RLS enabled (server-only access)

-- =====================================================
-- Chapters Table
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."chapters" (
  "id" uuid DEFAULT "public"."uuid_generate_v7"() NOT NULL,
  "uid" uuid NOT NULL,
  "character_id" uuid NOT NULL,
  "data" jsonb NOT NULL,
  "prompt" text NOT NULL,
  "model" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "deleted_at" timestamptz,
  CONSTRAINT "chapters_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "chapters_character_id_fkey" FOREIGN KEY ("character_id")
    REFERENCES "public"."characters"("id") ON DELETE RESTRICT,
  CONSTRAINT "chapters_character_id_unique" UNIQUE ("character_id")
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX "chapters__uid_created_at__idx"
  ON "public"."chapters"
  USING btree ("uid", "created_at" DESC);

CREATE INDEX "chapters__character_id_deleted_at__idx"
  ON "public"."chapters"
  USING btree ("character_id", "deleted_at");

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================
-- Enable RLS with no policies = block all client access
-- Only server-side access with service_role is allowed
ALTER TABLE "public"."chapters" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Permissions
-- =====================================================
-- Grant all privileges to service_role only
GRANT ALL ON TABLE "public"."chapters" TO service_role;

-- No grants for anon or authenticated = server-only access

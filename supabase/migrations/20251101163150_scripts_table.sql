-- Scripts Table Migration
-- Description: Creates scripts table for storing LLM-generated scripts, RLS enabled (server-only access)

-- =====================================================
-- Scripts Table
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."scripts" (
  "id" uuid DEFAULT "public"."uuid_generate_v7"() NOT NULL,
  "uid" uuid NOT NULL,
  "character_id" uuid NOT NULL,
  "prompt" text NOT NULL,
  "content" text NOT NULL,
  "model" text NOT NULL,
  "tokens_used" integer,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "scripts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "scripts_character_id_fkey" FOREIGN KEY ("character_id")
    REFERENCES "public"."characters"("id") ON DELETE CASCADE
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX "scripts__uid_created_at__idx"
  ON "public"."scripts"
  USING btree ("uid", "created_at" DESC);

CREATE INDEX "scripts__character_id__idx"
  ON "public"."scripts"
  USING btree ("character_id");

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================
-- Enable RLS with no policies = block all client access
-- Only server-side access with service_role is allowed
ALTER TABLE "public"."scripts" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Permissions
-- =====================================================
-- Grant all privileges to service_role only
GRANT ALL ON TABLE "public"."scripts" TO service_role;

-- No grants for anon or authenticated = server-only access

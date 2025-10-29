-- Character System Migration
-- Description: Creates characters table with UUID v7 support, RLS enabled (server-only access)

-- =====================================================
-- UUID v7 Function (from pi-friends pattern)
-- =====================================================
CREATE OR REPLACE FUNCTION "public"."uuid_generate_v7"() RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
declare
	v_time timestamp with time zone:= null;
	v_secs bigint := null;
	v_msec bigint := null;
	v_usec bigint := null;

	v_timestamp bigint := null;
	v_timestamp_hex varchar := null;

	v_random bigint := null;
	v_random_hex varchar := null;

	v_bytes bytea;

	c_variant bit(64):= x'8000000000000000'; -- RFC-4122 variant: b'10xx...'
begin

	-- Get seconds and micros
	v_time := clock_timestamp();
	v_secs := EXTRACT(EPOCH FROM v_time);
	v_msec := mod(EXTRACT(MILLISECONDS FROM v_time)::numeric, 10^3::numeric);
	v_usec := mod(EXTRACT(MICROSECONDS FROM v_time)::numeric, 10^3::numeric);

	-- Generate timestamp hexadecimal (and set version 7)
	v_timestamp := (((v_secs * 10^3) + v_msec)::bigint << 12) | (v_usec << 2);
	v_timestamp_hex := lpad(to_hex(v_timestamp), 16, '0');
	v_timestamp_hex := substr(v_timestamp_hex, 2, 12) || '7' || substr(v_timestamp_hex, 14, 3);

	-- Generate the random hexadecimal (and set variant b'10xx')
	v_random := ((random()::numeric * 2^62::numeric)::bigint::bit(64) | c_variant)::bigint;
	v_random_hex := lpad(to_hex(v_random), 16, '0');

	-- Concat timestemp and random hexadecimal
	v_bytes := decode(v_timestamp_hex || v_random_hex, 'hex');

	return encode(v_bytes, 'hex')::uuid;

end $$;

ALTER FUNCTION "public"."uuid_generate_v7"() OWNER TO "postgres";

-- =====================================================
-- Characters Table
-- =====================================================
CREATE TABLE IF NOT EXISTS "public"."characters" (
  "id" uuid DEFAULT "public"."uuid_generate_v7"() NOT NULL,
  "uid" uuid NOT NULL,
  "name" text NOT NULL,
  "info" text,
  "settings" text,
  "introduction" text,
  "options" jsonb DEFAULT '{}'::jsonb,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX "characters__uid_created_at__idx"
  ON "public"."characters"
  USING btree ("uid", "created_at" DESC);

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================
-- Enable RLS with no policies = block all client access
-- Only server-side access with service_role is allowed
ALTER TABLE "public"."characters" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Permissions
-- =====================================================
-- Grant all privileges to service_role only
GRANT ALL ON TABLE "public"."characters" TO service_role;

-- No grants for anon or authenticated = server-only access

-- Enable UUID extension if needed, though we use text IDs for users
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE "role" AS ENUM ('super_admin', 'admin', 'imam', 'bendahara', 'jamaah');
CREATE TYPE "transaction_type" AS ENUM ('income', 'expense');
CREATE TYPE "transaction_category" AS ENUM ('infaq', 'zakat', 'wakaf', 'operasional', 'maintenance', 'gaji', 'kegiatan', 'lainnya');
CREATE TYPE "event_type" AS ENUM ('kajian', 'ibadah', 'sosial', 'phbi', 'rapat', 'lainnya');
CREATE TYPE "event_status" AS ENUM ('scheduled', 'ongoing', 'completed', 'cancelled');
CREATE TYPE "asset_condition" AS ENUM ('good', 'maintenance', 'damaged', 'lost');
CREATE TYPE "donation_status" AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE "announcement_category" AS ENUM ('berita', 'laporan', 'pengumuman', 'jadwal');

-- Users
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"full_name" text,
	"role" "role" DEFAULT 'jamaah' NOT NULL,
	"phone" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

-- Sessions
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "user"("id"),
	"expires_at" timestamp with time zone NOT NULL
);

-- Mosque Profile
CREATE TABLE IF NOT EXISTS "mosque_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"phone" text,
	"email" text,
	"website" text,
	"vision" text,
	"mission" text,
	"history" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Financial Transactions
CREATE TABLE IF NOT EXISTS "financial_transaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "transaction_type" NOT NULL,
	"category" "transaction_category" NOT NULL,
	"amount" numeric(15, 2) NOT NULL,
	"description" text NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"proof_url" text,
	"recorded_by" text REFERENCES "user"("id"),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

-- Events
CREATE TABLE IF NOT EXISTS "event" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "event_type" NOT NULL,
	"status" "event_status" DEFAULT 'scheduled' NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"location" text,
	"speaker" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

-- Members
CREATE TABLE IF NOT EXISTS "member" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text REFERENCES "user"("id"),
	"full_name" text NOT NULL,
	"nik" text UNIQUE,
	"phone" text,
	"address" text,
	"birth_date" date,
	"join_date" date DEFAULT now(),
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

-- Inventory
CREATE TABLE IF NOT EXISTS "inventory_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL UNIQUE,
	"category" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"condition" "asset_condition" DEFAULT 'good' NOT NULL,
	"location" text,
	"purchase_date" date,
	"price" numeric(15, 2),
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

-- Donation Campaigns
CREATE TABLE IF NOT EXISTS "donation_campaign" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"target_amount" numeric(15, 2),
	"start_date" date NOT NULL,
	"end_date" date,
	"image_url" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Donations
CREATE TABLE IF NOT EXISTS "donation" (
	"id" serial PRIMARY KEY NOT NULL,
	"campaign_id" integer REFERENCES "donation_campaign"("id"),
	"donor_name" text DEFAULT 'Hamba Allah',
	"donor_phone" text,
	"amount" numeric(15, 2) NOT NULL,
	"payment_method" text,
	"status" "donation_status" DEFAULT 'pending' NOT NULL,
	"proof_url" text,
	"verified_by" text REFERENCES "user"("id"),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Announcements
CREATE TABLE IF NOT EXISTS "announcement" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" "announcement_category" NOT NULL,
	"author_id" text REFERENCES "user"("id"),
	"is_published" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);

-- Audit Log
CREATE TABLE IF NOT EXISTS "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"record_id" text NOT NULL,
	"action" text NOT NULL,
	"user_id" text REFERENCES "user"("id"),
	"old_values" text,
	"new_values" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

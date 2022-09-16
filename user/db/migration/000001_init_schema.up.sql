CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "field" varchar NOT NULL,
  "field_title" varchar NOT NULL,
  "bio" varchar(500),
  "password" text NOT NULL,
  "acc_type" text NOT NULL,
  "avatar_url" text,
  "avatar_id" text,
  "in_link" varchar(255),
  "tw_link" varchar(255),
  "wb_link" varchar(255),
  "gb_link" varchar(255),
  "active" boolean NOT NULL DEFAULT TRUE,
  "valid" boolean NOT NULL DEFAULT FALSE,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "user" ("id");
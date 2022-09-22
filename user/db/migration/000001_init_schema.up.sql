CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" varchar NOT NULL,
  "country" varchar(50) NOT NULL,  -- eventually would be set to not null
  "dob" date,  -- eventually would be set to not null
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
  "connections" int NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT (now()),
  "updated_at" timestamptz NOT NULL DEFAULT (now())
);

-- CREATE TYPE "post_type" AS ENUM ('public', 'private')

CREATE TABLE "connection" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_1" uuid NOT NULL,
  "user_2" uuid NOT NULL,
  "blocked" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "request" (
  "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_from" uuid NOT NULL,
  "user_to" uuid NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE INDEX ON "user" ("id");

CREATE INDEX ON "connection" ("id");

CREATE INDEX ON "connection" ("user_1");

CREATE INDEX ON "connection" ("user_2");

ALTER TABLE "connection" ADD FOREIGN KEY ("user_1") REFERENCES "user" ("id");

ALTER TABLE "connection" ADD FOREIGN KEY ("user_2") REFERENCES "user" ("id");

ALTER TABLE "request" ADD FOREIGN KEY ("user_from") REFERENCES "user" ("id");

ALTER TABLE "request" ADD FOREIGN KEY ("user_to") REFERENCES "user" ("id");
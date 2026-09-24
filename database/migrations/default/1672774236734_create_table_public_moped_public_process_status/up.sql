CREATE TABLE "public"."moped_public_process_statuses" ("id" serial NOT NULL, "name" text NOT NULL UNIQUE, "slug" text NOT NULL UNIQUE, PRIMARY KEY ("id") );
COMMENT ON TABLE "public"."moped_public_process_statuses" IS 'lookup table of public process statuses';
INSERT INTO moped_public_process_statuses (name, slug) VALUES 
    ('Needed', 'needed'),
    ('Not needed', 'not_needed'),
    ('In progress', 'in_progress'),
    ('Complete', 'complete');

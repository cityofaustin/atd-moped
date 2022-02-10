ALTER TABLE "public"."moped_proj_notes" ADD COLUMN "comm_id" int4;
ALTER TABLE "public"."moped_proj_notes" ALTER COLUMN "comm_id" DROP NOT NULL;
ALTER TABLE "public"."moped_proj_notes" ADD CONSTRAINT moped_proj_notes_comm_id_fkey FOREIGN KEY (comm_id) REFERENCES "public"."moped_proj_communication" (comm_id) ON DELETE restrict ON UPDATE restrict;

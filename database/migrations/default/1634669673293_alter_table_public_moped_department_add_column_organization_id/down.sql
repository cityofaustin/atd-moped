ALTER TABLE "public"."moped_department" DROP COLUMN "organization_id";

DELETE FROM public.moped_department WHERE department_id > 4;

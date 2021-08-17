CREATE TABLE "public"."moped_department"("department_id" serial NOT NULL, "department_name" text NOT NULL, "date_added" Timestamp NOT NULL DEFAULT now(), PRIMARY KEY ("department_id") );

INSERT INTO "public"."moped_department"(department_id, department_name)
VALUES (0, 'None'),
       (1, 'Austin Transportation'),
       (2, 'Corridor Program Office'),
       (3, 'Public Works'),
       (4, 'Other');

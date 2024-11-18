-- Insert new funding source and soft-delete existing funding sources that are merging into the new one
INSERT INTO "public"."moped_fund_sources" ("funding_source_name") VALUES
('Austin Transportation and Public Works');

UPDATE moped_fund_sources SET is_deleted = true WHERE funding_source_name IN ('Austin Transportation', 'Public Works');

-- Move moped_funds to deprecated schema and document
ALTER TABLE moped_funds SET SCHEMA deprecated;
COMMENT ON TABLE deprecated.moped_funds IS 'Legacy DTS-defined lookup table used to provide Fund part of FDUs (Deprecated Feb 2026)';

-- Fix date referenced in comment (Dec 2025 -> Jan 2026) to reflect actual date of eCAPRIS sync integration
COMMENT ON COLUMN "public"."moped_proj_funding"."is_legacy_funding_record" IS 'Indicates if the funding record was created before eCAPRIS sync integration (Jan 2026)';

-- Remove generated fund_dept_unit and fund_name columns from moped_proj_funding as they are no longer used by front end
ALTER TABLE public.moped_proj_funding
DROP COLUMN fund_dept_unit,
DROP COLUMN fund_name;

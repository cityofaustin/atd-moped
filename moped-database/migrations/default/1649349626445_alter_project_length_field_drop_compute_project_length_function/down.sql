-- Add compute_project_length function
-- Name: compute_project_length(); Type: FUNCTION; Schema: public; Owner: -

CREATE FUNCTION public.compute_project_length() RETURNS integer
    LANGUAGE sql STABLE
    AS $$
SELECT
case when moped_project.end_date is null
then date(now()) - moped_project.start_date
else moped_project.end_date - moped_project.start_date
end as project_length
FROM moped_project
$$;

-- Drop null default and set default to compute_project_length
ALTER TABLE "public"."moped_project"
    ALTER COLUMN "project_length" DROP DEFAULT,
    ALTER COLUMN "project_length" SET DEFAULT public.compute_project_length();
    
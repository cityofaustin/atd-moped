-- Create a temporary table to store the roles from duplicate records
CREATE TEMP TABLE temp_duplicate_roles AS
WITH duplicates AS (
    SELECT 
        project_id,
        user_id,
        COUNT(*) as duplicate_count
    FROM
        moped_proj_personnel
    WHERE is_deleted = FALSE   
    GROUP BY
        project_id,
        user_id
    HAVING
        COUNT(*) > 1
)
SELECT 
    p.project_personnel_id,
    p.project_id,
    p.user_id,
    r.project_role_id
FROM moped_proj_personnel p
JOIN duplicates d ON p.project_id = d.project_id AND p.user_id = d.user_id
JOIN moped_proj_personnel_roles r ON p.project_personnel_id = r.project_personnel_id
WHERE p.is_deleted = FALSE;

-- Keep the first record for each project/user pair and mark others as deleted
WITH first_records AS (
    SELECT DISTINCT ON (project_id, user_id)
        project_personnel_id
    FROM moped_proj_personnel
    WHERE is_deleted = FALSE
    ORDER BY project_id, user_id, project_personnel_id
)
UPDATE moped_proj_personnel
SET is_deleted = TRUE
WHERE project_personnel_id NOT IN (SELECT project_personnel_id FROM first_records)
AND is_deleted = FALSE;

-- Ensure all roles from deleted records are associated with the kept record
INSERT INTO moped_proj_personnel_roles (project_personnel_id, project_role_id, is_deleted)
SELECT 
    fr.project_personnel_id,
    tdr.project_role_id,
    FALSE
FROM temp_duplicate_roles tdr
JOIN (
    SELECT DISTINCT ON (project_id, user_id)
        project_personnel_id,
        project_id,
        user_id
    FROM moped_proj_personnel
    WHERE is_deleted = FALSE
    ORDER BY project_id, user_id, project_personnel_id
) fr ON tdr.project_id = fr.project_id AND tdr.user_id = fr.user_id
WHERE NOT EXISTS (
    SELECT 1 
    FROM moped_proj_personnel_roles pr 
    WHERE pr.project_personnel_id = fr.project_personnel_id 
    AND pr.project_role_id = tdr.project_role_id
    AND pr.is_deleted = FALSE
);

-- Clean up temporary table
DROP TABLE temp_duplicate_roles;

-- Add unique constraint to prevent duplicate project personnel entries using a partial index
CREATE UNIQUE INDEX moped_proj_personnel_project_id_user_id_key 
ON moped_proj_personnel (project_id, user_id) 
WHERE is_deleted = FALSE;
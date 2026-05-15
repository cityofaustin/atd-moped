ALTER TABLE files_ecapris_funding ADD COLUMN is_deleted boolean DEFAULT false NOT NULL;
ALTER TABLE files_project_funding ADD COLUMN is_deleted boolean DEFAULT false NOT NULL;

COMMENT ON COLUMN files_ecapris_funding.is_deleted IS 'Indicates soft deletion';
COMMENT ON COLUMN files_project_funding.is_deleted IS 'Indicates soft deletion';

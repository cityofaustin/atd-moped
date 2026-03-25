COMMENT ON COLUMN moped_users.picture IS 'Deprecated column to store the S3 path to uploaded profile image file';
COMMENT ON COLUMN moped_users.cognito_user_id IS 'Identifier for the user in AWS Cognito';
COMMENT ON COLUMN moped_users.is_coa_staff IS 'Indicates if the user is a COA staff member or not';
COMMENT ON COLUMN moped_users.roles IS 'Roles assigned to the user to determine platform access (Hasura)';

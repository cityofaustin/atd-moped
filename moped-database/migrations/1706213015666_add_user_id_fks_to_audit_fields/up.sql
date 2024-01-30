ALTER TABLE moped_proj_funding
    ADD CONSTRAINT created_by_user_fkey FOREIGN KEY (created_by_user_id) REFERENCES moped_users (user_id),
    ADD CONSTRAINT updated_by_user_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

ALTER TABLE moped_project
    ADD CONSTRAINT updated_by_user_fkey FOREIGN KEY (updated_by_user_id) REFERENCES moped_users (user_id);

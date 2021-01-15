create table moped_activity_log
(
	activity_id uuid default gen_random_uuid() not null
		constraint moped_activity_log_pk
			primary key,
	record_id int not null,
	record_type varchar(64) not null,
	record_data jsonb not null,
	description jsonb not null,
	created_at timestamp default now(),
	updated_by varchar(128) not null,
	updated_by_id int default null
);

/*
    Indexes
 */

create index moped_activity_log_record_id_index
	on moped_activity_log (record_id);

create index moped_activity_log_record_type_index
	on moped_activity_log (record_type);

create index moped_activity_log_updated_by_index
	on moped_activity_log (updated_by);

create index moped_activity_log_updated_by_id_index
	on moped_activity_log (updated_by_id);

/*
    Documentation
*/
COMMENT ON TABLE moped_activity_log IS 'Stores all changes made to records in the database relying on Hasura Events';
COMMENT ON COLUMN moped_activity_log.activity_id IS 'UUID that guarantees record uniqueness';
COMMENT ON COLUMN moped_activity_log.record_id IS 'Equivalent to the primary id value of the record type';
COMMENT ON COLUMN moped_activity_log.record_type IS 'The table being modified, ie. moped_project';
COMMENT ON COLUMN moped_activity_log.record_data IS 'The change payload as provided by Hasura';
COMMENT ON COLUMN moped_activity_log.description IS 'A summary description of the changes as provided by Python';
COMMENT ON COLUMN moped_activity_log.created_at IS 'An automatic timestamp at the time of creation';
COMMENT ON COLUMN moped_activity_log.updated_by IS 'The Cognito UUID or AzureID as text';
COMMENT ON COLUMN moped_activity_log.updated_by_id IS 'References the moped_users.user_id column';

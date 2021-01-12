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
	updated_by varchar(64) not null,
	updated_by_id int default null
);

create index moped_activity_log_record_id_index
	on moped_activity_log (record_id);

create index moped_activity_log_record_type_index
	on moped_activity_log (record_type);

create index moped_activity_log_updated_by_id_index
	on moped_activity_log (updated_by_id);

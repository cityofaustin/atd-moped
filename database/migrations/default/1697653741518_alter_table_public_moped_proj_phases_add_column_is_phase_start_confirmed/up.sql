alter table "public"."moped_proj_phases" add column "is_phase_start_confirmed" boolean
 not null default 'false';
alter table "public"."moped_proj_phases" add column "is_phase_end_confirmed" boolean
 not null default 'false';

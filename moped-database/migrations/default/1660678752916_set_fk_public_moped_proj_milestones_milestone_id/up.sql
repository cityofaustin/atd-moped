alter table "public"."moped_proj_milestones" drop constraint "moped_project_milestone_milestone_id_fkey",
  add constraint "moped_proj_milestones_milestone_id_fkey"
  foreign key ("milestone_id")
  references "public"."moped_milestones"
  ("milestone_id") on update cascade on delete set null;

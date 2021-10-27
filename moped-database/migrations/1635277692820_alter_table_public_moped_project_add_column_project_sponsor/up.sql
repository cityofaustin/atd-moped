ALTER TABLE "public"."moped_project" ADD COLUMN "project_sponsor" integer NULL;

alter table moped_project
	add constraint moped_project_moped_entity_entity_id_fk
		foreign key (project_sponsor) references moped_entity
			on update restrict on delete set null;

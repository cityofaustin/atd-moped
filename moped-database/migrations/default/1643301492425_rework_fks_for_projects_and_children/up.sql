-- moped_proj_phases.project_id => moped_project
alter table moped_proj_phases drop constraint moped_phase_history_project_id_fkey;
alter table moped_proj_phases
	add constraint moped_phase_history_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_proj_components.project_id => moped_project
alter table moped_proj_components drop constraint moped_proj_components_project_id_fkey;
alter table moped_proj_components
	add constraint moped_proj_components_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_proj_features.project_id => moped_project
alter table moped_proj_features drop constraint moped_proj_features_project_id_fkey;
alter table moped_proj_features
	add constraint moped_proj_features_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_proj_notes.project_id => moped_project
alter table moped_proj_notes drop constraint moped_proj_notes_project_id_fkey;
alter table moped_proj_notes
	add constraint moped_proj_notes_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_proj_personnel.project_id => moped_project
alter table moped_proj_personnel drop constraint moped_proj_personnel_project_id_fkey;
alter table moped_proj_personnel
	add constraint moped_proj_personnel_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_project_files.project_id => moped_project
alter table moped_project_files drop constraint moped_project_files_project_id_fkey;
alter table moped_project_files
	add constraint moped_project_files_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_proj_features_components.moped_proj_component_id => moped_proj_components
alter table moped_proj_features_components drop constraint moped_proj_features_components_moped_proj_component_id_fkey;
alter table moped_proj_features_components
	add constraint moped_proj_features_components_moped_proj_component_id_fkey
		foreign key (moped_proj_component_id) references moped_proj_components
			on update cascade on delete cascade;

-- moped_proj_milestones.project_id => moped_projects
alter table moped_proj_milestones drop constraint moped_project_milestone_project_id_fkey;
alter table moped_proj_milestones
	add constraint moped_project_milestone_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_proj_funding.project_id       => moped_project
alter table moped_proj_funding drop constraint moped_proj_fund_source_project_id_fkey;
alter table moped_proj_funding
	add constraint moped_proj_fund_source_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_proj_partners.project_id       => moped_project
alter table moped_proj_partners drop constraint moped_proj_partners_project_id_fkey;
alter table moped_proj_partners
	add constraint moped_proj_partners_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

-- moped_project_types.field       => moped_project
alter table moped_project_types drop constraint moped_project_types_project_id_fkey;
alter table moped_project_types
	add constraint moped_project_types_project_id_fkey
		foreign key (project_id) references moped_project
			on update cascade on delete cascade;

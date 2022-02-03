-- moped_proj_phases.project_id => moped_project
alter table moped_proj_phases drop constraint moped_phase_history_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_phases
    ADD CONSTRAINT moped_phase_history_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- moped_proj_components.project_id => moped_project
alter table moped_proj_components drop constraint moped_proj_components_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_components
    ADD CONSTRAINT moped_proj_components_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id);


-- moped_proj_features.project_id => moped_project
alter table moped_proj_features drop constraint moped_proj_features_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_features
    ADD CONSTRAINT moped_proj_features_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- moped_proj_notes.project_id => moped_project
alter table moped_proj_notes drop constraint moped_proj_notes_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_notes
    ADD CONSTRAINT moped_proj_notes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- moped_proj_personnel.project_id => moped_project
alter table moped_proj_personnel drop constraint moped_proj_personnel_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_personnel
    ADD CONSTRAINT moped_proj_personnel_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- moped_project_files.project_id => moped_project
alter table moped_project_files drop constraint moped_project_files_project_id_fkey;
ALTER TABLE ONLY public.moped_project_files
    ADD CONSTRAINT moped_project_files_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id);


-- moped_proj_features_components.moped_proj_component_id => moped_proj_components
alter table moped_proj_features_components drop constraint moped_proj_features_components_moped_proj_component_id_fkey;
ALTER TABLE ONLY public.moped_proj_features_components
    ADD CONSTRAINT moped_proj_features_components_moped_proj_component_id_fkey FOREIGN KEY (moped_proj_component_id) REFERENCES public.moped_proj_components(project_component_id);


-- moped_proj_milestones.project_id => moped_projects
alter table moped_proj_milestones drop constraint moped_project_milestone_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_milestones
    ADD CONSTRAINT moped_project_milestone_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- moped_proj_funding.project_id       => moped_project
alter table moped_proj_funding drop constraint moped_proj_fund_source_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_funding
    ADD CONSTRAINT moped_proj_fund_source_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


-- moped_proj_partners.project_id       => moped_project
alter table moped_proj_partners drop constraint moped_proj_partners_project_id_fkey;
ALTER TABLE ONLY public.moped_proj_partners
    ADD CONSTRAINT moped_proj_partners_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;



-- moped_project_types.field       => moped_project
alter table moped_project_types drop constraint moped_project_types_project_id_fkey;
ALTER TABLE ONLY public.moped_project_types
    ADD CONSTRAINT moped_project_types_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.moped_project(project_id) ON UPDATE RESTRICT ON DELETE RESTRICT;


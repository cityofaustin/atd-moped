--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 14.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: moped_users; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('9972fa62-1bbd-4f58-9b7d-80b9bc73a537', 'Mike', 'Schofield', 'Engineer', 'ATSD', 3, 1, NULL, '2020-10-09 13:44:02.15918+00', false, 'ms@emailhost.xyz', NULL, NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('e6bb053b-d6bf-4460-b9a5-c5cb7021958d', 'Nathan', 'Wilkes', 'Engineer', 'ATSD', 2, 1, NULL, '2020-10-09 13:44:02.159184+00', false, 'nw@emailhost.xyz', NULL, NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('9699d49f-c5ba-4dad-b286-510a5e178aa7', 'JD', 'Maccombs', 'Software Developer', 'Other', 1, 18, 'ec609228-4442-41e5-a0dc-2c417af00c6b', '2021-03-09 17:08:14+00', true, 'jd.maccombs@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('5ce31d2f-6739-4908-9f63-6a03466da68f', 'Mateo', 'Clarke', 'Software Developer', 'Data & Technology Services', 9, 3, '153f7bb2-ea74-4967-a6aa-61c51193e785', '2021-03-09 17:08:38+00', true, 'mateo.clarke@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('5d7086c2-de71-43db-bb95-f548d01d9cfc', 'Ivonne', 'Natal', 'Demo User', 'Arterial Management', 27, 2, '4ace7b3f-81a4-4cb4-b300-b38330aee9a5', '2021-03-09 17:08:59+00', true, 'mike.dilley+demo2@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('802d8efe-bcdc-48b4-b1ee-d69920a411b3', 'Mike', 'Dilley', 'Software Developer', 'Data & Technology Services', 8, 3, '022ddc8a-1917-4f71-b996-9b8681e77726', '2021-03-23 20:43:23+00', true, 'mike.dilley@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('4485b8a3-117b-40ec-ae3d-bda7440fb4ff', 'Test', 'Account', 'Testing password requirements', 'Other', 39, 18, 'd71fa82f-133d-4f85-93f0-cb00a64b1a94', '2021-04-13 23:38:58.237207+00', true, 'mike.dilley+testpw@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('13b7cae4-4b29-4d47-a4ee-28f7063c4cbd', 'Diana', 'Martin', 'Lead Applications Architect', 'Data & Technology Services', 41, 3, '498fd044-888c-4ca4-9640-7e634d0c11a5', '2021-04-14 15:48:36.603711+00', true, 'diana.martin@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('d5df6309-7657-4f98-8a97-b269d52b41a4', 'Laura', 'Dierenfield', 'Demo User', 'Active Transportation & Street Design', 32, 1, '930a4aa9-81b4-498f-bce0-2025a2b742f6', '2021-03-09 17:09:06+00', true, 'mike.dilley+demo7@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('4bb1231f-58de-4914-afcb-2c5249ff9eb6', 'Manuel', 'Gallegos', 'Demo User', 'Transportation Engineering', 30, 15, 'dc5b340a-54c7-449a-a06e-7f089d900da7', '2021-03-09 17:09:14+00', true, 'mike.dilley+demo5@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('d40a769e-c631-4bf8-81f5-b7009f9ec9b7', 'Amenity', 'Applewhite', 'Project Manager', 'Data & Technology Services', 11, 3, 'b596046f-9073-41c7-aff7-d197efd302ef', '2021-04-14 16:23:29.363634+00', true, 'amenity.applewhite@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('fa3d8240-37be-4f82-af5e-ae38e09b442a', 'Tilly', 'Whitson', 'Software Developer', 'Data & Technology Services', 13, 3, 'd4e75fdb-383c-4b5e-b4e5-4d979fa91765', '2021-03-09 17:09:22+00', true, 'tilly.whitson@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('8937c861-6a70-47d0-ac81-0613f91f5d3c', 'John', 'Clary', 'IT Manager', 'Data & Technology Services', 10, 3, '40422ee4-4aca-43b3-898c-ed2ad2f88f6d', '2021-03-09 17:09:31+00', true, 'john.clary@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('f5552741-aa99-46fa-8115-6e4e62260544', 'Test', 'Viewer', 'Test Account', 'Data & Technology Services', 33, 3, '973255a8-21d2-4a31-bcd7-037f61a0afac', '2021-03-09 17:09:40+00', true, 'transportation.data+mopedviewer@austintexas.gov', '["moped-viewer"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('f123a519-b97d-4b6d-8ac6-8c54f6fd75c6', 'Test', 'Editor', 'Test Account', 'Data & Technology Services', 34, 3, 'd0910558-23bb-4104-97ee-31db04d7361f', '2021-03-09 17:09:48+00', true, 'transportation.data+mopededitor@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('86a7c777-9e0d-4abc-b445-709adec25019', 'Renee', 'Orr', 'Demo User', 'Arterial Management', 26, 2, '34e6d556-9730-4991-ae5a-dff9449f7566', '2021-03-09 17:10:13+00', true, 'mike.dilley+demo1@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('7b3fef14-48e4-4ef1-bdb5-8368d2e82c6c', 'Test', 'Admin', 'Test Account', 'Data & Technology Services', 44, 3, '99d9d3ab-e839-45b2-8f99-1eec0d155d38', '2021-04-14 17:08:53.902354+00', true, 'transportation.data+mopedadmin@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('d0cff82f-f590-47cf-84e9-d84ba82cb482', 'Amica', 'Bose', 'Demo User', 'Transportation Engineering', 29, 15, '3fdb0168-d00f-4295-885b-16355e0b47bb', '2021-03-09 17:03:09+00', true, 'mike.dilley+demo4@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('7a755f49-58e6-4628-9c97-911634260164', 'Nathan', 'Wilkes', 'Demo User', 'Active Transportation & Street Design', 31, 1, 'b1a385f4-1a76-45b5-890a-05e5db1aca7c', '2021-03-09 17:05:59+00', true, 'mike.dilley+demo6@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('dcd52ab9-7dec-4965-892f-84b68745d14c', 'Leslie', 'Zavarella', 'Software Developer', 'Other', 12, 18, '69cbd881-c1c0-4028-8e0a-e5ddffd2dc9a', '2021-03-09 17:06:44+00', false, 'lazav2021@gmail.com', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('4ffa6438-a481-45a7-b9fa-dfdadd71584c', 'Robin', 'Osborne', 'Demo User', 'Arterial Management', 28, 2, '37dfb02d-1fce-4c2c-a6cb-a3b2b5071929', '2021-03-09 17:08:03+00', true, 'mike.dilley+demo3@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('ef99a830-b3de-4817-affc-39c541b2245c', 'Test', 'Again', 'Password test', 'Other', 40, 18, NULL, '2021-04-14 00:17:42.628346+00', true, 'mike.dilley+testpw1@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('ef33a1ea-f352-4425-9ea7-85253a674f7c', 'Sergio', 'Garcia', 'Software Developer', 'Data & Technology Services', 7, 3, '20c20b28-3b20-4e9e-a0bc-e1ef4e512f2c', '2021-03-09 17:07:29+00', true, 'sergio.garcia@austintexas.gov', '["moped-admin"]', 'private/user/7/03232021012023_2d3cdd69a5f77fb9_sergio_avatar.jpeg', false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('e5db3749-16f8-4ac2-85eb-f9e01a81a812', 'Andrew', 'Shensky', 'Senior Geospatial Analyst', 'Data & Technology Services', 45, 3, 'd1360260-6a50-4b30-b544-28ccea429485', '2021-04-14 17:12:05.928079+00', true, 'andrew.shensky@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('e82793d7-aed2-427b-a5ad-bac36c7fdffc', 'Janet', 'Chu', 'Design Researcher', 'Data & Technology Services', 56, 3, '965834c2-8142-453d-89ac-5268d478e04a', '2021-06-25 15:17:11.953756+00', true, 'janet.chu@austintexas.gov', '["moped-editor"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('59ebf0a1-2a08-497b-ba8c-43b647c3e4ea', 'Frank', 'Hereford', 'Software Developer', 'Data & Technology Services', 46, 3, 'aeaeb96f-6f69-4b95-a272-956445189c54', '2021-11-08 09:45:00+00', true, 'frank.hereford@austintexas.gov', '["moped-admin"]', NULL, false);
INSERT INTO public.moped_users (staff_uuid, first_name, last_name, title, workgroup, user_id, workgroup_id, cognito_user_id, date_added, is_coa_staff, email, roles, picture, is_deleted) VALUES ('a7a12362-0cca-481b-9e1d-0f37a34f36fa', 'Rebecca', 'Brand', 'UI/UX Design Fellow', 'Data & Technology Services', 74, 3, 'ef6b9978-fc85-49f4-bf6f-d0f95a074469', '2022-06-23 19:14:54.018091+00', true, 'rebecca.brand@austintexas.gov', '["moped-editor"]', NULL, false);


--
-- Data for Name: moped_project; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, ecapris_subproject_id, project_importance, project_order, project_id, timeline_id, end_date, project_length, fiscal_year, capitally_funded, project_priority, date_added, added_by, is_deleted, milestone_id, updated_at, project_sponsor, project_website, knack_project_id, task_order, work_assignment_id, parent_project_id, interim_project_id, project_lead_id) VALUES ('05dad987-acbf-4543-a623-fbc9c6f1e877', 'Demo Project #1', 'This is a demo project for demonstration purposes', NULL, 7333.001, NULL, NULL, 227, NULL, NULL, NULL, NULL, true, NULL, '2022-11-12 18:07:30.266299+00', 1, false, NULL, '2022-11-12 18:07:30.264117+00', 3, 'https://austinmobility.io', NULL, NULL, 'ABC123', NULL, 1, 1);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, ecapris_subproject_id, project_importance, project_order, project_id, timeline_id, end_date, project_length, fiscal_year, capitally_funded, project_priority, date_added, added_by, is_deleted, milestone_id, updated_at, project_sponsor, project_website, knack_project_id, task_order, work_assignment_id, parent_project_id, interim_project_id, project_lead_id) VALUES ('4bc62a02-a75d-4ac8-9354-f74358428c5a', ' CESAR CHAVEZ ST / ROBERT T MARTINEZ JR ST', 'It''s a fake signal project', NULL, NULL, NULL, NULL, 228, NULL, NULL, NULL, NULL, NULL, NULL, '2022-11-12 18:16:37.450157+00', 1, false, NULL, '2022-11-12 18:16:37.445531+00', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.moped_project (project_uuid, project_name, project_description, project_description_public, ecapris_subproject_id, project_importance, project_order, project_id, timeline_id, end_date, project_length, fiscal_year, capitally_funded, project_priority, date_added, added_by, is_deleted, milestone_id, updated_at, project_sponsor, project_website, knack_project_id, task_order, work_assignment_id, parent_project_id, interim_project_id, project_lead_id) VALUES ('f4298b3e-4393-4433-89f8-c13b4ecf3c74', 'Demo Project #2', 'Best project ever', NULL, 123.455, NULL, NULL, 229, NULL, NULL, NULL, NULL, true, NULL, '2022-11-15 16:47:15.440396+00', 1, false, NULL, '2022-11-15 16:47:15.438683+00', 11, 'https://austintexas.gov', NULL, '[{"dept": "6000", "name": "johnny Morris/Hwy 290 Water Line Extension", "status": "Active", "balance": "-1997.78", "tk_type": "Memo", "task_order": "60M7242QMD", "display_name": "60M7242QMD | johnny Morris/Hwy 290 Water Line Extension", "chargedamount": "1997.78", "current_estimate": "0"}, {"dept": "2400", "name": "FY17 Parking Mgmt. ROW", "status": "Inactive", "balance": "0", "tk_type": "Internal Billed", "buyer_fdus": "5610 2400 4200", "task_order": "24ROW51000", "display_name": "24ROW51000 | FY17 Parking Mgmt. ROW", "chargedamount": "119095.09", "current_estimate": "119095.09"}]', NULL, NULL, NULL, 10);


--
-- Data for Name: moped_proj_components; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_components (project_component_id, project_id, component_id, name, description, is_deleted, interim_project_component_id) VALUES (2, 227, 7, '', 'This will be nice', false, NULL);
INSERT INTO public.moped_proj_components (project_component_id, project_id, component_id, name, description, is_deleted, interim_project_component_id) VALUES (3, 227, 61, '', 'let there be light', false, NULL);
INSERT INTO public.moped_proj_components (project_component_id, project_id, component_id, name, description, is_deleted, interim_project_component_id) VALUES (4, 228, 18, 'Signal', 'Signal - Traffic', false, NULL);
INSERT INTO public.moped_proj_components (project_component_id, project_id, component_id, name, description, is_deleted, interim_project_component_id) VALUES (5, 229, 13, '', 'New crosswalks', false, NULL);


--
-- Data for Name: moped_proj_components_subcomponents; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_components_subcomponents (component_subcomponent_id, project_component_id, subcomponent_id, is_deleted) VALUES (2, 2, 10, false);


--
-- Data for Name: moped_proj_contract; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_contract (id, contractor, contract_number, description, project_id, is_deleted, work_assignment_id, contract_amount) VALUES (1, 'Acme Inc', 'ABC123', 'On call', 227, false, null, 889);
INSERT INTO public.moped_proj_contract (id, contractor, contract_number, description, project_id, is_deleted, work_assignment_id, contract_amount) VALUES (2, 'Taco Deli', '123YUM', 'Doña sauce', 229, false, 'GCS 12', null);
INSERT INTO public.moped_proj_contract (id, contractor, contract_number, description, project_id, is_deleted, work_assignment_id, contract_amount) VALUES (3, null, null, null, 229, false, 'WA - 10 Unity', 1224);

--
-- Data for Name: moped_proj_entities; Type: TABLE DATA; Schema: public; Owner: moped
--



--
-- Data for Name: moped_proj_features; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (2, '{"id": 1761, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72869357839227, 30.253303915208974], [-97.72825721651316, 30.254210981073953]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 102140, "TO_ADDRESS_MAX": 59, "FROM_ADDRESS_MIN": 50, "FULL_STREET_NAME": "CHALMERS AVE"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (3, '{"id": 31407, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72825721651316, 30.254210981073953], [-97.72790785878897, 30.255067357091647]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 136040, "TO_ADDRESS_MAX": 69, "FROM_ADDRESS_MIN": 60, "FULL_STREET_NAME": "CHALMERS AVE"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (4, '{"id": 33527, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72790785878897, 30.255067357091647], [-97.72746378555894, 30.25602653570455]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 137839, "TO_ADDRESS_MAX": 79, "FROM_ADDRESS_MIN": 70, "FULL_STREET_NAME": "CHALMERS AVE"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (5, '{"id": 59339, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72746378555894, 30.25602653570455], [-97.72708157077432, 30.25692083389619]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 126745, "TO_ADDRESS_MAX": 89, "FROM_ADDRESS_MIN": 80, "FULL_STREET_NAME": "CHALMERS AVE"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (6, '{"id": 29573, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72708157077432, 30.25692083389619], [-97.72664504125714, 30.25783611997062]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 133661, "TO_ADDRESS_MAX": 98, "FROM_ADDRESS_MIN": 90, "FULL_STREET_NAME": "CHALMERS AVE"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (7, '{"id": 27082, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72664504125714, 30.25783611997062], [-97.726237680763, 30.25872721611117]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 131137, "TO_ADDRESS_MAX": 117, "FROM_ADDRESS_MIN": 100, "FULL_STREET_NAME": "CHALMERS AVE"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (8, '{"id": 32344, "type": "Feature", "geometry": {"type": "MultiLineString", "coordinates": [[[-97.72619107738137, 30.258826258471856], [-97.72580064833164, 30.259656096315354]], [[-97.726237680763, 30.25872721611117], [-97.72596443071961, 30.259308147363043]]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 136700, "TO_ADDRESS_MAX": 217, "FROM_ADDRESS_MIN": 200, "FULL_STREET_NAME": "CHALMERS AVE"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (9, '{"id": 62, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72580064833164, 30.259656096315354], [-97.7248308621347, 30.259317414433937]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 100181, "TO_ADDRESS_MAX": 1724, "FROM_ADDRESS_MIN": 1700, "FULL_STREET_NAME": "E 3RD ST"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (10, '{"id": 28183, "type": "Feature", "geometry": {"type": "MultiLineString", "coordinates": [[[-97.7248308621347, 30.259317414433937], [-97.72378295660019, 30.258932975055757]], [[-97.72480554878712, 30.259308147363043], [-97.72378295660019, 30.258932975055757]]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 131873, "TO_ADDRESS_MAX": 1824, "FROM_ADDRESS_MIN": 1800, "FULL_STREET_NAME": "E 3RD ST"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (11, '{"id": 58736, "type": "Feature", "geometry": {"type": "MultiLineString", "coordinates": [[[-97.72378295660019, 30.258932975055757], [-97.72337224334478, 30.259832169888895]], [[-97.72366762161255, 30.259185503389375], [-97.72337224334478, 30.259832169888895]], [[-97.72378295660019, 30.258932975055757], [-97.72361163049936, 30.259308147363043]]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 153152, "TO_ADDRESS_MAX": 322, "FROM_ADDRESS_MIN": 300, "FULL_STREET_NAME": "CHICON ST"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (12, '{"id": 58604, "type": "Feature", "geometry": {"type": "LineString", "coordinates": [[-97.72337224334478, 30.259832169888895], [-97.72296437993646, 30.260737003528646]]}, "_isPresent": false, "properties": {"_symbol": 2, "LINE_TYPE": "On-Street", "sourceLayer": "ATD_ADMIN.CTN", "CTN_SEGMENT_ID": 147368, "TO_ADDRESS_MAX": 416, "FROM_ADDRESS_MIN": 400, "FULL_STREET_NAME": "CHICON ST"}}', 2, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (13, '{"id": 31688, "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.72746378555894, 30.25602653570455]}, "_isPresent": false, "properties": {"sourceLayer": "ATD_ADMIN.CTN_Intersections", "INTERSECTIONID": 225460}}', 3, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (14, '{"id": 31750, "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.72708157077432, 30.25692083389619]}, "_isPresent": false, "properties": {"sourceLayer": "ATD_ADMIN.CTN_Intersections", "INTERSECTIONID": 225769}}', 3, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (15, '{"id": 31605, "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.72790785878897, 30.255067357091647]}, "_isPresent": false, "properties": {"sourceLayer": "ATD_ADMIN.CTN_Intersections", "INTERSECTIONID": 225135}}', 3, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (16, '{"id": "7cb11a36-9f59-46d5-ba31-66b7d1cd5f88", "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.72068, 30.255787]}, "properties": {"id": "5817c088e052e0422be6c6c2", "signal_id": "365", "renderType": "Point", "signal_type": "TRAFFIC", "sourceLayer": "drawnByUser", "location_name": " CESAR CHAVEZ ST / ROBERT T MARTINEZ JR ST", "PROJECT_EXTENT_ID": "7cb11a36-9f59-46d5-ba31-66b7d1cd5f88"}}', 4, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (17, '{"id": 28834, "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.74212155491114, 30.26991055253903]}, "_isPresent": false, "properties": {"sourceLayer": "ATD_ADMIN.CTN_Intersections", "INTERSECTIONID": 225873}}', 5, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (18, '{"id": 28546, "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.7434235997498, 30.270272362977707]}, "_isPresent": false, "properties": {"sourceLayer": "ATD_ADMIN.CTN_Intersections", "INTERSECTIONID": 224868}}', 5, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (19, '{"id": 28475, "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.74378100410104, 30.269352704539784]}, "_isPresent": false, "properties": {"sourceLayer": "ATD_ADMIN.CTN_Intersections", "INTERSECTIONID": 224814}}', 5, false);
INSERT INTO public.moped_proj_features (feature_id, feature, project_component_id, is_deleted) VALUES (20, '{"id": 28759, "type": "Feature", "geometry": {"type": "Point", "coordinates": [-97.74247946217656, 30.26897163447613]}, "_isPresent": false, "properties": {"sourceLayer": "ATD_ADMIN.CTN_Intersections", "INTERSECTIONID": 225554}}', 5, false);


--
-- Data for Name: moped_proj_financials; Type: TABLE DATA; Schema: public; Owner: moped
--



--
-- Data for Name: moped_proj_fiscal_years; Type: TABLE DATA; Schema: public; Owner: moped
--



--
-- Data for Name: moped_proj_funding; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_funding (proj_funding_id, project_id, date_added, added_by, funding_source_id, funding_program_id, funding_amount, fund_dept_unit, funding_description, funding_status_id, fund, dept_unit, is_deleted) VALUES (2, 227, '2022-11-12 18:12:47.295511+00', 10, 4, 7, 0, '', 'cha ching', 2, '{"fund_id": "8400", "fund_name": "GCP-TPSD GENERAL IMPROVEMENTS"}', '{"dept": "2507", "unit": "9024", "dept_id": "180775091", "dept_unit_id": "359318059", "unit_long_name": "Pay Station Parking Meter Replacement", "unit_short_name": "8400-2507", "dept_unit_status": "Active"}', false);
INSERT INTO public.moped_proj_funding (proj_funding_id, project_id, date_added, added_by, funding_source_id, funding_program_id, funding_amount, fund_dept_unit, funding_description, funding_status_id, fund, dept_unit, is_deleted) VALUES (4, 227, '2022-11-12 18:12:47.295689+00', 10, 9, 11, 0, '', '', 1, '{"fund_id": "4730", "fund_name": "PARKING CIP"}', '{"dept": "2507", "unit": "9040", "dept_id": "180775091", "dept_unit_id": "207413510", "unit_long_name": "Parking Initiatives", "unit_short_name": "8400-2507", "dept_unit_status": "Active"}', false);
INSERT INTO public.moped_proj_funding (proj_funding_id, project_id, date_added, added_by, funding_source_id, funding_program_id, funding_amount, fund_dept_unit, funding_description, funding_status_id, fund, dept_unit, is_deleted) VALUES (3, 227, '2022-11-12 18:12:47.295683+00', 10, NULL, NULL, NULL, NULL, NULL, 2, '{"fund_id": "4730", "fund_name": "PARKING CIP"}', '{"dept": "2507", "unit": "9042", "dept_id": "180775091", "dept_unit_id": "153705858", "unit_long_name": "New & Repair Parking Stations", "unit_short_name": "4730-2507", "dept_unit_status": "Active"}', true);


--
-- Data for Name: moped_proj_milestones; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (3, 227, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965535+00', NULL, 35, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (4, 227, NULL, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965547+00', NULL, 36, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (5, 227, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965555+00', NULL, 37, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (6, 227, NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965563+00', NULL, 31, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (7, 227, NULL, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.96557+00', NULL, 38, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (8, 227, NULL, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965578+00', NULL, 39, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (9, 227, NULL, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965586+00', NULL, 40, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (10, 227, NULL, 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965593+00', NULL, 41, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (11, 227, NULL, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.9656+00', NULL, 42, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (12, 227, NULL, 11, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965607+00', NULL, 43, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (13, 227, NULL, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965615+00', NULL, 44, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (14, 227, 'traffic and pedestrian', 13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965622+00', NULL, 45, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (15, 227, NULL, 14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965632+00', NULL, 46, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (16, 227, NULL, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.96564+00', NULL, 47, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (17, 227, NULL, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965647+00', NULL, 48, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (18, 227, NULL, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965654+00', NULL, 49, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (19, 227, NULL, 18, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965664+00', NULL, 50, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (20, 227, NULL, 19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965672+00', NULL, 51, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (21, 227, 'typically 30 days', 20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965679+00', NULL, 52, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (22, 227, 'for signals constructed by others/documentation that burn in period is complete', 21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, '2022-11-12 18:10:41.965687+00', NULL, 53, false);
INSERT INTO public.moped_proj_milestones (project_milestone_id, project_id, milestone_description, milestone_order, completion_percentage, milestone_status, milestone_privacy, milestone_start, milestone_end, milestone_priority, milestone_date_type, milestone_related_phase_id, is_current_milestone, completed, started_by_user_id, completed_by_user_id, date_added, milestone_estimate, milestone_id, is_deleted) VALUES (2, 227, 'Some description', 1, NULL, NULL, NULL, NULL, '2022-11-11', NULL, NULL, NULL, NULL, true, NULL, NULL, '2022-11-12 18:10:41.965237+00', '2022-11-01', 34, false);


--
-- Data for Name: moped_proj_notes; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_notes (project_note_id, project_note, added_by, date_created, project_id, added_by_user_id, project_note_type, is_deleted) VALUES (2, '<p>This is a status update</p>', 'JD Maccombs', '2022-11-12 18:08:55.845376+00', 227, 1, 2, false);
INSERT INTO public.moped_proj_notes (project_note_id, project_note, added_by, date_created, project_id, added_by_user_id, project_note_type, is_deleted) VALUES (3, '<p>This is an internal note</p>', 'JD Maccombs', '2022-11-12 18:14:16.640873+00', 227, 1, 1, false);


--
-- Data for Name: moped_proj_partners; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD', 1, 2, 227, '2022-11-12 18:09:10.83628+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD Active Transportation & Street Design', 2, 3, 227, '2022-11-12 18:09:10.836658+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD Signs & Markings', 6, 4, 227, '2022-11-12 18:09:10.836667+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD Traffic Impact Analysis Fiscal', 12, 5, 227, '2022-11-12 18:09:10.836672+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA Aviation', 14, 6, 227, '2022-11-12 18:09:10.836677+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD Development Review', 4, 7, 229, '2022-11-15 16:47:43.293093+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD Systems Development', 7, 8, 229, '2022-11-15 16:47:43.293178+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD Transportation Engineering', 8, 9, 229, '2022-11-15 16:47:43.293185+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA ATD Traffic Impact Analysis Fiscal', 12, 10, 229, '2022-11-15 16:47:43.29319+00', NULL, false);
INSERT INTO public.moped_proj_partners (partner_name, entity_id, proj_partner_id, project_id, date_added, added_by, is_deleted) VALUES ('COA PWD Neighborhood Partnering', 21, 11, 229, '2022-11-15 16:47:43.293194+00', NULL, false);


--
-- Data for Name: moped_proj_personnel; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (227, 200, '2022-11-12 18:11:16.496855+00', NULL, 'Great designer', 10, false);
INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (227, 201, '2022-11-12 18:11:45.61511+00', NULL, 'Friend of the show', 1, false);
INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (227, 202, '2022-11-12 18:11:56.478758+00', NULL, NULL, 8, false);
INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (227, 203, '2022-11-12 18:12:02.662338+00', NULL, NULL, 46, false);
INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (227, 204, '2022-11-12 18:12:11.046501+00', NULL, NULL, 13, false);
INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (227, 205, '2022-11-12 18:12:20.960275+00', NULL, NULL, 11, false);
INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (227, 206, '2022-11-12 18:12:40.203738+00', NULL, '', 9, false);
INSERT INTO public.moped_proj_personnel (project_id, project_personnel_id, date_added, added_by, notes, user_id, is_deleted) VALUES (229, 207, '2022-11-15 16:49:03.086392+00', NULL, NULL, 1, false);


--
-- Data for Name: moped_proj_personnel_roles; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (1, 200, 8, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (2, 201, 5, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (3, 201, 9, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (4, 202, 10, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (5, 203, 16, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (6, 204, 11, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (7, 205, 1, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (8, 206, 17, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (9, 207, 8, false);
INSERT INTO public.moped_proj_personnel_roles (id, project_personnel_id, project_role_id, is_deleted) VALUES (10, 207, 15, false);


--
-- Data for Name: moped_proj_phases; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_phases (phase_description, phase_order, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added, phase_id, subphase_id, is_deleted) VALUES ('Some description', NULL, 0, NULL, NULL, '2022-11-14', '2022-11-25', NULL, false, false, 65, 227, NULL, NULL, '2022-11-12 18:07:30.267685+00', 1, 5, false);
INSERT INTO public.moped_proj_phases (phase_description, phase_order, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added, phase_id, subphase_id, is_deleted) VALUES ('Some other description', NULL, 0, NULL, NULL, '2022-11-30', NULL, NULL, true, false, 66, 227, NULL, NULL, '2022-11-12 18:10:31.179722+00', 3, 22, false);
INSERT INTO public.moped_proj_phases (phase_description, phase_order, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added, phase_id, subphase_id, is_deleted) VALUES (NULL, NULL, 0, NULL, NULL, '2022-12-05', NULL, NULL, false, false, 67, 227, NULL, NULL, '2022-11-12 18:15:58.500377+00', 9, NULL, false);
INSERT INTO public.moped_proj_phases (phase_description, phase_order, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added, phase_id, subphase_id, is_deleted) VALUES (NULL, NULL, 0, NULL, NULL, '2022-11-12', NULL, NULL, true, false, 68, 228, NULL, NULL, '2022-11-12 18:16:37.457285+00', 1, NULL, false);
INSERT INTO public.moped_proj_phases (phase_description, phase_order, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added, phase_id, subphase_id, is_deleted) VALUES (NULL, NULL, 0, NULL, NULL, '2022-10-30', '2022-11-17', NULL, false, false, 70, 229, NULL, NULL, '2022-11-15 16:50:49.717814+00', 6, 18, false);
INSERT INTO public.moped_proj_phases (phase_description, phase_order, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added, phase_id, subphase_id, is_deleted) VALUES ('This phase went really well', NULL, 0, NULL, NULL, '2022-11-01', '2022-11-02', NULL, false, false, 69, 229, NULL, NULL, '2022-11-15 16:47:15.442451+00', 1, 5, false);
INSERT INTO public.moped_proj_phases (phase_description, phase_order, completion_percentage, phase_status, phase_privacy, phase_start, phase_end, phase_priority, is_current_phase, completed, project_phase_id, project_id, started_by_user_id, completed_by_user_id, date_added, phase_id, subphase_id, is_deleted) VALUES (NULL, NULL, 0, NULL, NULL, '2022-11-16', '2022-11-17', NULL, true, false, 71, 229, NULL, NULL, '2022-11-15 16:51:03.146297+00', 9, 7, false);


--
-- Data for Name: moped_proj_tags; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_proj_tags (id, project_id, tag_id, is_deleted) VALUES (1, 227, 1, false);
INSERT INTO public.moped_proj_tags (id, project_id, tag_id, is_deleted) VALUES (2, 227, 7, false);
INSERT INTO public.moped_proj_tags (id, project_id, tag_id, is_deleted) VALUES (3, 227, 2, false);
INSERT INTO public.moped_proj_tags (id, project_id, tag_id, is_deleted) VALUES (4, 229, 10, false);
INSERT INTO public.moped_proj_tags (id, project_id, tag_id, is_deleted) VALUES (5, 229, 7, false);


--
-- Data for Name: moped_project_files; Type: TABLE DATA; Schema: public; Owner: moped
--



--
-- Data for Name: moped_user_followed_projects; Type: TABLE DATA; Schema: public; Owner: moped
--

INSERT INTO public.moped_user_followed_projects (id, project_id, user_id, created_at) VALUES (1, 227, 1, '2022-11-12 18:07:30.295804');
INSERT INTO public.moped_user_followed_projects (id, project_id, user_id, created_at) VALUES (2, 228, 1, '2022-11-12 18:16:37.476743');
INSERT INTO public.moped_user_followed_projects (id, project_id, user_id, created_at) VALUES (3, 229, 1, '2022-11-15 16:47:15.458074');


--
-- Name: moped_financials_financials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_financials_financials_id_seq', 1, true);


--
-- Name: moped_phase_history_project_milestone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_phase_history_project_milestone_id_seq', 71, true);


--
-- Name: moped_proj_components_project_component_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_components_project_component_id_seq', 5, true);


--
-- Name: moped_proj_components_subcomponen_component_subcomponent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_components_subcomponen_component_subcomponent_id_seq', 2, true);


--
-- Name: moped_proj_entities_entity_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_entities_entity_list_id_seq', 1, true);


--
-- Name: moped_proj_features_feature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_features_feature_id_seq', 20, true);


--
-- Name: moped_proj_fiscal_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_fiscal_years_id_seq', 1, false);


--
-- Name: moped_proj_fund_source_proj_fund_source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_fund_source_proj_fund_source_id_seq', 4, true);


--
-- Name: moped_proj_milestones_project_milestone_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_milestones_project_milestone_id_seq', 22, true);


--
-- Name: moped_proj_notes_project_note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_notes_project_note_id_seq', 3, true);


--
-- Name: moped_proj_partners_proj_partner_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_partners_proj_partner_id_seq', 11, true);


--
-- Name: moped_proj_personnel_project_personnel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_personnel_project_personnel_id_seq', 207, true);


--
-- Name: moped_proj_personnel_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_personnel_roles_id_seq', 10, true);


--
-- Name: moped_proj_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_proj_tags_id_seq', 5, true);


--
-- Name: moped_project_files_project_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_project_files_project_file_id_seq', 32, true);


--
-- Name: moped_project_project_id_simple_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_project_project_id_simple_seq', 229, true);


--
-- Name: moped_purchase_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_purchase_order_id_seq', 2, true);


--
-- Name: moped_user_followed_projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_user_followed_projects_id_seq', 3, true);


--
-- Name: moped_users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: moped
--

SELECT pg_catalog.setval('public.moped_users_user_id_seq', 56, true);


--
-- PostgreSQL database dump complete
--

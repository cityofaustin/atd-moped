
# IMPDB Access Migration

### Issues to make

- list view query performance - create indexes - see https://explain.dalibo.com/
  - https://github.com/cityofaustin/atd-data-tech/issues/10851
  
- project notes - stop using added_by (user text) - use added_by_user_id
- on moped_project, track this rel: moped_proj_contract . project_id  → moped_project . project_id  

- work authorizations - can we just mirror Data Tracker functionality in SMB?
  - if we must; strive for simplest implementation!
  - work order id (text)
  - implementation workgroup (fk, in)
  - created_by
  - created_at
  - updated_by
  - updated_at
  - description
- interim project component id column
- migrations to cascade delete on these, so that you can delete a project:
  - "moped_user_followed_projects_project_id_fkey" on table "moped_user_followed_projects"
  - "moped_purchase_order_project_id_fkey" on table "moped_proj_contract"
  - moped_proj_tags.project_id -> 
- create and track fk relationship between notes and projects
- use a lookup table for note types 
- drop unused moped_proj_phase columns

### NW Questions

- project description - these are not public friendly. there are very view "project description" public. propose we import project description as a note. but these projects need descriptions :/ 
- is there a table that holds project partners? where does the concatenation come from on the main projects table?


### Todo

- dedupe existing projects with interim_project_id
  - figure out how to handle these :/

### project list

- query performance troublemakers are:
    - project_note
    - construction_start_date
    - completion_end_date
    - use this: CREATE INDEX phase_project_idx ON moped_proj_phases (project_id);
    - and this: CREATE INDEX note_project_idx ON moped_proj_notes (project_id); 
    - probably also:
      - and this: CREATE INDEX partner_project_idx ON moped_proj_partners (project_id); 
    - on this note: should we index the project ID on the activity log? we write to it soooo often it worries me it will have a negative effect ?
### moped_project

- project_website: parse/cleanup



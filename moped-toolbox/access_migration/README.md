
# IMPDB Access Migration

### Issues to make
- remove dupe RRFB component
- update delete cascades: https://github.com/cityofaustin/atd-data-tech/issues/10848
- list view query performance - create indexes: https://github.com/cityofaustin/atd-data-tech/issues/10851
- on moped_project, track this rel: moped_proj_contract . project_id  → moped_project . project_id  

- project notes - stop using added_by (user text) - use added_by_user_id in the editor: https://github.com/cityofaustin/atd-data-tech/issues/9644


- list view: render nothing instead of "12/31/1969" if the project has no modified date? or default the modified date?

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

- create and track fk relationship between notes and projects - ? double check this
- use a lookup table for note types 
- drop unused moped_proj_phase columns

### NW Questions

- how to handle entities that don't exist in moped. see https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1400142967
- project description - these are not public friendly. there are very view "project description" public. propose we import project description as a note? but these projects need descriptions :/ 
- is there a table that holds project partners? where does the concatenation come from on the main projects table?

#### Facilities
- What to do with these project_facility columns?
  - PerfMeasureCategory
  - PerfMeasureName
  - PerfMeasureType
  - Categories

### Todo

- dedupe existing projects with interim_project_id
  - figure out how to handle these :/

### moped_project

- project_website: parse/cleanup



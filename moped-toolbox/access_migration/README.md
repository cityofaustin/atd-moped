
# IMPDB Access Migration

This directory is home to the tools that will migrate the Interim Mobility Project Database, an MS Access DB, into Moped.

The process is split into two steps.

1. Use Python to export all Access DB tables to JSON.
2. Use Javascript to transform and load the project data into Moped.

## Get it running

### Access DB Extraction

1. Download a snapshot of the Access DB from [Drive](https://drive.google.com/drive/u/2/folders/1-pNBTdfPBxJm8VpYjxpZwA8ziCLMZdRx). Save it as `./export_data/database/database.md`

2. From this directory, build the docker image:

```shell
$ docker build -t moped-migra -t moped-migra:latest .
```

3. Run the export script by mounting this directory into the docker container:

```shell
$ docker run -it --rm -v "$(pwd)":/app moped-migra python export_data/export_data.py
```

### Transform and Load

1. Start the Hasura cluster and Moped Editor

```shell
# from atd-moped/moped-database
$ ./hasura-cluster start

# from atd-moped/moped-editor
$ nvm use
$ npm run start
```

2. Navigate to `./migrate_data` and install package dependencies:

```shell
# requires node v18
$ nvm use 
# install packages
$ npm install
```

3. Run the migration!

```shell
$ node index.js
```

4. Open the Moped Editor to inspect projects ✨


### Issues to make

- drop unused moped_proj_phase columns
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



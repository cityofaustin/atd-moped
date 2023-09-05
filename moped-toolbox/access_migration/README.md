# IMPDB Access Migration

This directory is home to the tools that will migrate the Interim Mobility Project Database, an MS Access DB, into Moped.

The process is split into two steps.

1. Use Python to export all Access DB tables to JSON.
2. Use Javascript to transform and load the project data into Moped.

## Get it running

### Access DB Extraction

1. Download a snapshot of the Access DB from [Drive](https://drive.google.com/drive/u/2/folders/1-pNBTdfPBxJm8VpYjxpZwA8ziCLMZdRx). Save it as `./export_data/database/database.md`. These snapshots have been retrieved from G drive: ATD\ATD\Mobility Project Tracking

2. From this directory, build the docker image:

```shell
$ docker build -t moped-migra -t moped-migra:latest .
```

3. Run the export script by mounting this directory into the docker container:

```shell
$ docker run -it --rm -v "$(pwd)":/app moped-migra python export_data/export_data.py
```

4. Run the script that downloads facilities (aka components) spatial data from AGOL, as well as the canonical data sources we'll match against

```shell
$ docker run -it --rm -v "$(pwd)":/app moped-migra python export_data/get_facilities_geojson.py

$ docker run -it --rm -v "$(pwd)":/app moped-migra python export_data/get_ctn_segments_and_points_and_signals.py
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

3. Prepare the geospatial data for import - this may take 5+ minutes

```shell
$ node facility_line_matcher.js
$ node facility_point_matcher.js
```

4. Run the migration!

```shell
$ node index.js local
```

5. Open the Moped Editor to inspect projects ✨


### On deck

- project_dates
- project types
- files?

### Todo

- project groups (aka project tags):
  - holding off bc there seems like a lot of overlap with component tags. this should be a very quick implementation once we decide on what needs to be created.

- work types:
  - any remaining mappings?
  - options not implemented? https://docs.google.com/spreadsheets/d/1bQD0xBQm4BOdTJ1U4hbk98dywJVJZ7O6G-VYLRbviQU/edit#gid=0
- backfill is_coa_staff column in staging and prod for all users :/
- work authorizations:
  - WAPRefix and ID and workorderid_old :/
  - implementation workgroup options:
    - Sidewalks & Special Projects Div
    - Add "Other" and "General Contractor" (PDD uses a lot of that)
- finish transit - bust stop component/subcomponent maps.
- disable creative crosswalk component? on indefinite hold per heather b
- there are facility spatial records with multiple features within one layer and across geom types.
- add user matching to project `added_by`
- list view: render nothing instead of "12/31/1969" if the project has no modified date? or default the modified date?
- use a lookup table for note types
- check geometry types of components - some may need to be converted to point or line
- dedupe existing projects with interim_project_id
  - figure out how to handle these :/
- moped editor: nix summary map zoom animation
- moped editor: project list: cannot search for projects with no/unknown status
- moped editor: projects: should we use "Current phase" instead of "status"? Status is a confusing term because it only appears in search filter
- search for todos :)


### NW Questions
- project personnel:
- IF NOT DESIGNATED: USE how to handle when role is null? default role? currently falling back to "Project Support". attribute Nathan Wilkes.

- project funding:
  - very few sources have a status. currently defaulting to tentatitve.
    - OK

- work authorizations statusID: default to....planned? complete?
  - > futue/potential



-> todo: add project funding status order integer

-> issues to make: merge fund and dept-unit
- protection type:
  - it's subcomponent now. check out the allowed subcomponents list to verify it's ok

- does the "ProjectPhase" column on the projects table always have a corresponding status update? because the migration is going purely based on status updates

- should we assign "New" work type to anything that doesn't have a work type?
- facility type "Corridor Plan" (and similalry the ProjecType) attribute - what to do with these? 
- we are converting unmatched signals to intersection improvement components: review these with AMD
- how to handle entities that don't exist in moped. see https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1400142967
- some project descriptions missing
- after the migration, maybe we should import the moped project IDs into the Access DB?
- 
- not migrating these project facility colummns:
  - PerfMeasureCategory
  - PerfMeasureName
  - PerfMeasureType
  - Categories

### Test deployment notes:
- how to deal w/ login?
- nearmap imagery will not work
- file uploads will not work

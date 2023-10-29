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
# optionally run facility line matcher—we've decided not to use this. all
# line features will be imported as drawn lines
$ node facility_line_matcher.js

# definitely run this one
$ node facility_point_matcher.js
```

4. Run the migration!

```shell
$ node index.js local
```

5. Open the Moped Editor to inspect projects ✨

### Recovering from failure

1. Delete all migrated projects, reset ID sequences, and restore DB triggers: `rollback.sql`

2. Restore Hasura event triggers by re-applying metadata


### Todo

- what happened to the `moped_components` id sequence? `moped_components_component_id_seq`???

```
SELECT
    setval('moped_components_component_id_seq', (
            SELECT
                max(component_id) FROM moped_components));
```

- clarify: should migrate components for dupe projects? assuming answer is no unless on sheet
- also: wtf: what does it mean to migrate a component which has a project ocmponent id on the dupe list? i am very oost
- logging and rollback of dedupe: just make detailed logs and hope it goes well. can reproduce/debug migration if we need to figure more detail
- set parent project ID of existing projects to migrate projects (have to do this after migration)
- after migration: send NW list of facility - project component/project IDs
- merge migrations and deploy on test you fool
- ask Andrew about weird curvePath geomtries
- create a report of projects that have no description
- download the latest copy of the DB :)
- increase production ECS cpu/ram
- decrease/tear down access test instance

- reasses impact of geom change on moped prod
- connect to test instance and double check hdb invocation logs
- prepare script to backfill council district? or enable council district?
- load metadata from database dir—instead of backing it up?
- project types
  - mostly done
  - see items highlighted in yellow on project_types tab
  - https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1679186191
- move "School zone beacon" to not be a signal component
- john to check on unmapped project groups
- work types:
  - can we backfill SMO links based on work order ID old?
- review all the component/subcomponent and component/work type mapping
- there are facility spatial records with multiple features within one layer and across geom types.
- search for todos :)

### NW Questions
- project personnel:
  - IF NOT DESIGNATED: USE how to handle when role is null? default role? currently falling back to "Project Support". attribute Nathan Wilkes.
- work authorizations statusID: default to....planned? complete?
  - > futue/potential
- should we assign "New" work type to anything that doesn't have a work type?
- facility type "Corridor Plan" (and similalry the ProjecType) attribute - what to do with these?
- how to handle entities that don't exist in moped. see https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1400142967

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

- confirm that event triggers are not firing during migration.
- load metadata from database dir—instead of backing it up?
- fiscal year and calendar year: completion date:
- project types
  - mostly done
  - see items highlighted in yellow on project_types tab
  - https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1679186191
- move "School zone beacon" to not be a signal component
- john to check on unmapped project groups
- work types:
  - can we backfill SMO links based on work order ID old?
- finish transit - bust stop component/subcomponent maps.
- there are facility spatial records with multiple features within one layer and across geom types.
- list view: render nothing instead of "12/31/1969" if the project has no modified date? or default the modified date?
- check geometry types of components - some may need to be converted to point or line
- moped editor: project list: cannot search for projects with no/unknown status
- moped editor: projects: should we use "Current phase" instead of "status"? Status is a confusing term because it only appears in search filter
- search for todos :)
- sort projects by interim project ID before we migrate them, so that older projects have a lower project ID?

### NW Questions
- project personnel:
  - IF NOT DESIGNATED: USE how to handle when role is null? default role? currently falling back to "Project Support". attribute Nathan Wilkes.
- work authorizations statusID: default to....planned? complete?
  - > futue/potential
- should we assign "New" work type to anything that doesn't have a work type?
- facility type "Corridor Plan" (and similalry the ProjecType) attribute - what to do with these?
- how to handle entities that don't exist in moped. see https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1400142967

- not migrating these project facility colummns:
  - PerfMeasureCategory
  - PerfMeasureName
  - PerfMeasureType
  - Categories
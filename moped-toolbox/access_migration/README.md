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

4. Run the data transform

```shell
$ node transform.js local
```

5. Run the loader

```shell
$ node load.js local
```

6. Open the Moped Editor to inspect projects ✨

### Recovering from failure

1. A copy of all data that was migrated is available at `./data/ready/project_data_in_progress_{env}.json.`
   
2. ☝️ Make a backup of this file before you further troubleshoot the migration.

3. If the failure occured during the bulk project inserts, you can safely run delete all migrated projects, reset ID sequences, and restore DB triggers: with `node rollback.js <env`.

4. Restore Hasura event triggers by re-applying metadata


5. If the failure occured during the project/component updates. You will need to inspect the `project_data_in_progress_{env}.json` and determine a course of actinon. In this case, remember also that there are activty log events to delete as well.


### Todo

- activity log for dedupe projects
- merge v1.35.1 migrations and deploy on test
- reasses impact of geom change on moped prod
- after migration: fix projects impacted by geometry changes
- after migration: facility ID 17179 after migration
- after migration: set parent project ID of existing projects to migrate projects
- after migration: send NW list of facility - project component/project IDs
- after migration: create a report of projects that have no description
- after migration: decrease/tear down access test instance
- after migration: move "School zone beacon" to not be a signal component
- after migration: can we backfill work activity SMO links based on work activity ID?
- prepare script to backfill council district? or enable council district?
- load metadata from database dir—instead of backing it up?
- john to check on unmapped project groups
- review all the component/subcomponent and component/work type mapping
- there are facility spatial records with multiple features within one layer and across geom types
- search for todos :)
- after migration: moped editor: check on weird CTN curvePath geomtries

### NW Questions


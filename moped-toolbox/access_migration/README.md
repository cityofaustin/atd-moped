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

4. Run the script that downloads facilities (aka components) spatial data from AGOL

```shell
$ docker run -it --rm -v "$(pwd)":/app moped-migra python export_data/get_facilities_geojson.py
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
$ node index.js local
```

4. Open the Moped Editor to inspect projects ✨

### Issues to make / todo

- SRTS ID field on components form -> alphanum
- add interim_project_id to project_list_view and add to advanced search
- there are facility spatial records with multiple features within one layer and across geom types.
- how to handle unmapped components?
- clean up/de-dupe RRFB component
- implement new subcomponents / split out work types
- list view: render nothing instead of "12/31/1969" if the project has no modified date? or default the modified date?
- use a lookup table for note types
- physical protection type ("Protection Type"): can we move this to subcomponents?
- check geometry types of components - some may need to be converted to point or line
- dedupe existing projects with interim_project_id
  - figure out how to handle these :/

### NW Questions

- we are converting unmatched signals to intersection improvement components
- how to handle entities that don't exist in moped. see https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1400142967
- some project descriptions missing

- not migrating these project facility colummns:
  - PerfMeasureCategory
  - PerfMeasureName
  - PerfMeasureType
  - Categories

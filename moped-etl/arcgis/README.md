# ArcGIS ETLs

Scripts which integrate Moped data with Esri ArcGIS

## Publish components to ArcGIS Online (AGOL)

The script `components_to_agol.py` is used to publish component record data to ArcGIS Online (AGOL). It replaces all records in the AGOL feature services with the latest component data in Moped.

The data is sourced from a view, `component_arcgis_online_view` which defines all columns which are available to be processed.

The AGOL layers can be found here:

- [Project component points](https://austin.maps.arcgis.com/home/item.html?id=997555f6e0904aa88eafe73f19ee65c0)
- [Project component lines](https://austin.maps.arcgis.com/home/item.html?id=e8f03d2cec154cacae539b630bcaa70b)

### Get it running

1. Configure an `env_file` according to the `env_template` example. You can find the AGOL Scripts Publisher username and password in the API Secrets vault in the team password store.

2. Create and activate a Python environment that meets the requirments in `requirements.txt`. Alternatively, you can use the provided Dockerfile.
 
3. Run the script.

```shell
$ python components_to_agol.py
```

or, to mount your local copy to a Docker container

```shell
docker run -it --rm  --network host --env-file env_file -v ${PWD}:/app  atddocker/atd-moped-etl-arcgis:production python components_to_agol.py
```

### Sync evaluation script

On first deployment of this ETL, duplicate records were created in the Knack `projects` table. The `sync_evaluation.py` script:

- Gathers all Knack project record IDs stored in the `moped_project` table rows in the `knack_project_id` column
- Gather all Knack record IDs of all rows in the Data Tracker `projects` table
- Evaluates the overlap (synced correctly) and difference (mark for deletion) of these two lists
- Evaluates the list of differences to make sure there are no connections between Knack records marked for deletion and `work_order_signals` records
- Deletes the records with no connections and logs records with connections that were not deleted
  
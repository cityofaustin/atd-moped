# Moped → ArcGIS Online ETL

Python script integration pushing Moped data to ESRI's ArcGIS Online (AGOL) platform

## Publish components to AGOL

The script `components_to_agol.py` is used to publish component record data to AGOL. It has two primary modes of operation:

- Full refresh: This mode will delete all existing records in the AGOL feature layer and replace them with the current data from the Moped database.
- Incremental refresh: This mode will only update records that have been modified since a given timestamp.

The script is responsible for maintaining four layers in the AGOL in the [Moped Project Components](https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2) feature service:

- [Moped Points](https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2&sublayer=0): Components best represented as points, utilizing MultiPoint geometries
- [Moped Lines](https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2&sublayer=1): Components best represented as lines, using Line geometries
- [MOPED CombinedGeometries](https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2&sublayer=2) (SIC): All components, where points are transformed into a line ringing the location
- [Moped Feature Points](https://austin.maps.arcgis.com/home/item.html?id=1c084c8756a84e6db7e2796c98c850a2&sublayer=3): Components best represented as points, but where MultiPoints are exploded into individual points. Note, the same component can be represented as multiple features, one for each point in the MultiPoint.

The data for the first three layers listed above is sourced from a view, `component_arcgis_online_view` which defines all columns which are available to be processed.

The fourth layer is sourced from a derivative view, `exploded_component_arcgis_online_view`, which takes the previous view and explodes MultiPoint geometries into individual points.

## Running the Script

1. Configure an `env_file` according to the `env_template` example. You can find the AGOL Scripts Publisher username and password in the API Secrets vault in the team password store.

1. `docker compose build` to build the container.

1. Run the script via one or more of the following:
   - `docker compose run arcgis -d` to start the script with the default interval of changes over the last week.
   - `docker compose run arcgis -f` to start the script with a full refresh.
   - `docker compose run arcgis -d <timestamptz>` to start the script with a refresh since the given timestamp.
   - `docker compose run --entrypoint /bin/bash arcgis` to start a shell inside the container.

## Testing the Script

To run the script without making changes to the AGOL dataset, use the `-t` flag (`--test`) to fetch the project IDs to delete and the component data to use for AGOL record replacement. This is useful to observe what projects have updated and what component data will be transferred without updating the production AGOL dataset.

1. Run the script with the test flag and any of the available options above:
   - `docker compose run arcgis -d` to start the script in test mode with the default interval of changes over the last week.
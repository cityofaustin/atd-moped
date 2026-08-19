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

## Configuration

Environment variables are defined and validated in [`.env.schema`](.env.schema) using [Varlock](https://varlock.dev/). AGOL credentials are resolved from 1Password at runtime via the `@varlock/1password-plugin`; Hasura settings default to the local Moped stack (`host.docker.internal:8082`).

### Prerequisites

1. [Node.js](https://nodejs.org/) v24 (see [`.nvmrc`](.nvmrc); run `nvm use` if you use nvm).
1. The [1Password CLI](https://developer.1password.com/docs/cli/get-started/) (`op`) installed and on your `$PATH`.
1. The [1Password desktop app](https://1password.com/downloads/) with [CLI integration enabled](https://developer.1password.com/docs/cli/app-integration/), signed in to the team vault that holds the AGOL Scripts Publisher credentials.

### Setup

From this directory:

1. `npm install` to install Varlock and the 1Password plugin.
1. (Optional) `npx varlock load` to validate the schema and confirm 1Password secrets resolve.

## Running the Script

1. (If running full refresh) Ensure the local Moped stack is running with a current snapshot.

1. `docker compose build` to build the container.

1. Run the script via Varlock so resolved environment variables are passed into Docker Compose. Use one or more of the following:
   - `npx varlock run -- docker compose run arcgis -d` to start the script with the default interval of changes over the last week.
   - `npx varlock run -- docker compose run arcgis -f` to start the script with a full refresh.
   - `npx varlock run -- docker compose run arcgis -d <timestamptz>` to start the script with a refresh since the given timestamp.
   - `npx varlock run -- docker compose run --entrypoint /bin/bash arcgis` to start a shell inside the container.

## Testing the Script

To run the script without making changes to the AGOL dataset, use the `-n` flag (`--dry-run`) to see what changes would be made without executing them. This is useful to observe what projects have updated and what component data will be transferred without updating the production AGOL dataset.

1. Run the script with the dry-run flag and any of the available options above:
   - `npx varlock run -- docker compose run arcgis -d <timestamptz> -n` to start the script in dry-run mode with a refresh since the given timestamp.
   - `npx varlock run -- docker compose run arcgis -f -n` to see what a full refresh would do without actually executing it.

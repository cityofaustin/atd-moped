# eCAPRIS funding → Moped eCAPRIS funding table

Python script that transfers eCAPRIS funding to the Moped database to provide a cached dataset for the UI and reporting

## Sync eCAPRIS funding

The script `ecapris_funding_sync.py` is used to copy eCAPRIS subproject funding records to the Moped database:
- FDUs are synced from a EDP dataset (s4mj-68pg) that is populated nightly by our [atd-finance-data program tagging ETL](https://github.com/cityofaustin/atd-airflow/blob/production/dags/atd_finance_data_fdu_program_tagging.py).
- These records contain program and subprogram information tagging in addition to eCAPRIS data.
- The original FDUs come from an Oracle Data Warehouse and a view set up by FSD called `ATD_FDUS_VW`.
- These FDUs are up-to-date as of end of business of the previous day so nightly schedules are sufficient for providing the latest data.
- The upsert mutation utilizes the unique `fao_id` as a constraint to avoid duplicating FDUs from the EDP dataset and consume updates.

## Testing the script locally using Docker Compose

1. Ensure the local Moped stack is running with a current snapshot.
1. Configure an `env_file` according to the `env_template` example. Find the Socrata (ODP) secrets in the secret store entry called `Socrata Key ID, Secret, and Token`.
1. `docker compose build` to build the container.
1. Dry run the script via:
   ```bash
   docker compose run --rm ecapris-funding -n
   ```
1. Run the script via:
   ```bash
   docker compose run --rm ecapris-funding
   ```

## Testing the script locally using Airflow

1. Ensure the local Moped stack is running with a current snapshot.
1. If you are making code updates, you will want to update the `development` tag Docker image that the Airflow DAG will reference as you makes changes.
   ```bash
   # See https://www.docker.com/blog/how-to-rapidly-build-multi-architecture-images-with-buildx/
   docker buildx build --push \
   --platform linux/amd64,linux/arm64 \
   --tag atddocker/atd-moped-etl-ecapris-funding:development .
   ```
1. Start your local Airflow instance ([atd-airflow](https://github.com/cityofaustin/atd-airflow)).
1. The DAG is setup to use `development` as the Docker image tag in the local development stack which references the local Hasura API for queries and mutations done by the ETL. 

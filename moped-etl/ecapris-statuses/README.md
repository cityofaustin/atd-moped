# eCapris statuses → Moped eCapris statuses table

Python script that transfers eCapris statuses to the Moped DB

## Sync eCapris statuses

The script `ecapris_statuses_sync.py` is used to copy eCapris subproject statuses to the Moped database:

- The statuses come from an Oracle Data Warehouse and a view setup by FSD called `ATD_SUB_PROJECT_STATUS_VW`.
- See the secret called `Finance Data Warehouse Oracle DB` for the Data Warehouse credentials used in the environment
- This process fetches any eCapris statuses available that are associated with eCapris subproject IDs set on Moped projects.
- The insert mutation utilizes the unique `subproject_status_id` as a constraint to avoid duplicating eCapris statuses.

## Testing the script locally using Docker Compose

1. Ensure the local Moped stack is running with a current snapshot.
1. This process queries the Financial Services Division Oracle Data Warehouse so you must be on the VPN.
1. Configure an `env_file` according to the `env_template` example. Find the Oracle secrets in the secret store entry called `Finance Data Warehouse Oracle DB`.
1. `docker compose build` to build the container.
1. Run the script via:
   ```bash
   docker compose run ecapris-statuses
   ```

## Testing the script locally using Airflow

1. Ensure the local Moped stack is running with a current snapshot.
1. This process queries the Financial Services Division Oracle Data Warehouse so you must be on the VPN.
1. If you are making code updates, you will want to update the `development` tag Docker image that the Airflow DAG will reference as you makes changes.
   ```bash
   # See https://www.docker.com/blog/how-to-rapidly-build-multi-architecture-images-with-buildx/
   docker buildx build --push \
   --platform linux/amd64,linux/arm64 \
   --tag atddocker/atd-moped-etl-ecapris-statuses:development .
   ```
1. Start your local Airflow instance ([atd-airflow](https://github.com/cityofaustin/atd-airflow)). You will need to make sure you are running the Airflow web server on a port other than 8080 to prevent conflicts with the Moped local stack.
1. The DAG is setup to use `development` as the Docker image tag in the local development stack which references the local Hasura API for queries and mutations done by the ETL. 

# eCapris statuses → Moped eCapris statuses table

Python script integration pushing eCapris statuses to the Moped DB

## Sync eCapris statuses

The script `ecapris_statuses_sync.py` is used to copy eCapris subproject statuses to the Moped database:

- The statuses come from an Oracle Data Warehouse and a view setup by FSD called `ATD_SUB_PROJECT_STATUS_VW`.
- See the secret called `Finance Data Warehouse Oracle DB` for the Data Warehouse credentials used in the environment
- This process fetches any eCapris statuses available that are associated with eCapris subproject IDs set on Moped projects.
- The insert mutation utilizes the unique `subproject_status_id` as a constraint to avoid duplicating eCapris statuses.

## Testing the script

1. Ensure the local Moped stack is running with a current snapshot.

1. Configure an `env_file` according to the `env_template` example. Find the Oracle secrets in the secret store entry called `Finance Data Warehouse Oracle DB`.

1. `docker compose build` to build the container.

2. Run the script via:
```bash
docker compose run ecapris-statuses
```

### How to generate new seeds

1. Navigate to `./moped-database`
2. Start the hasura cluster
3. Add / edit whatever data
4. ❗️Warning: adding subprojects creates a circular reference that will cause seeds to fail
5. Run pg_dump to generate the seeds. You can add additional tables as needed - do not include lookup tables - these tables are hydrated through migrations:

```shell
# grab postgres image name from currently running container
$ PG_IMAGE=$(docker ps -f name='moped-database_hasura_1' |  grep 'moped-database_hasura_1'| awk '{ print $2 }')

# run pg_dump using postgres image
$ docker run -it --rm --network host \
  -v "$(pwd)"/seeds:/seeds $PG_IMAGE \
  pg_dump --column-inserts --data-only --schema public \
    -t moped_proj_components \
    -t moped_proj_components_subcomponents \
    -t moped_proj_contract \
    -t moped_proj_entities \
    -t moped_proj_features \
    -t moped_proj_financials \
    -t moped_proj_fiscal_years \
    -t moped_proj_funding \
    -t moped_proj_milestones \
    -t moped_proj_notes \
    -t moped_proj_partners \
    -t moped_proj_personnel \
    -t moped_proj_personnel_roles \
    -t moped_proj_phases \
    -t moped_proj_tags \
    -t moped_project \
    -t moped_project_files \
    -t moped_user_followed_projects \
    -t moped_users \
    postgres://moped:moped@localhost:5432/moped > seeds/1602292389297_initial_seed_staging.sql
```

6. At the top of the updated seed file (), check make sure the search path configuration looks like this - change it if necessary:

```sql
SELECT pg_catalog.set_config('search_path', 'public', false);
```

7. Restart the hasura cluster

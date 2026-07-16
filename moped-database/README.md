# MOPED Database

You will want to check the documentation in the [Moped Technical Docs](https://atd-dts.gitbook.io/moped-documentation/dev-guides/hasura)

## Architecture Description

Broadly, the Moped application uses a backend [PostgreSQL](https://www.postgresql.org/) database server which is protected from the larger internet on a private subnet. An instance of [Hasura](https://hasura.io/)'s [graphql-engine](https://github.com/hasura/graphql-engine) is used as middleware exposing a GraphQL endpoint for use by the application running on a client's computer. The `graphql-engine` instance is provided by [the official Docker images](https://hub.docker.com/r/hasura/graphql-engine) provided by Hasura on DockerHub. 

### `graphql-engine` update plan

The update schedule for Moped's `graphql-engine` deployment is as follows:

* The deployment's ECS service should be updated to the latest, odd minor release available.

The intent is to stay generally up-to-date, but avoid `.0` releases and to maintain a sustainable update cadence. 

## Getting Started

#### 1. Install Docker & Docker Compose

You will want to follow the Docker documentation on how to install Docker in your system.

For Mac: https://docs.docker.com/docker-for-mac/install/

For Windows: https://docs.docker.com/docker-for-windows/install/

#### 2. Install the Hasura CLI

In your Terminal, run the following command:

```
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
```

This will install the Hasura CLI in /usr/local/bin. You might have to provide your sudo password depending on the permissions of your /usr/local/bin location.

If you'd prefer to install to a different location other than /usr/local/bin, set the env var INSTALL_PATH:

```
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | INSTALL_PATH=$HOME/bin bash
```

There is another way to install Hasura via npm, but if you managed to install with the steps above you already have the super-powers you need to start working with migrations.

**Installation - Windows:** Download the binary cli-hasura-windows-amd64.exe available under Assets of the latest release from the GitHub release page: https://github.com/hasura/graphql-engine/releases
Rename the downloaded file to hasura. You can add the path to the environment variable PATH for making hasura accessible globally.

For more info, refer to their documentation:
https://hasura.io/docs/1.0/graphql/core/hasura-cli/install-hasura-cli.html

#### 3. The Hasura Cluster Helper

There is a tool we've created that has a few shortcuts available, it's called [hasura-cluster](https://github.com/cityofaustin/atd-moped/blob/main/moped-database/hasura-cluster).
It is a bash script that runs a few `docker compose` commands.

Syntax:

```
$ ./hasura-cluster <command> <params>
```

[1] Set your environment:
```
$ ./hasura-cluster setenv local
```

[2] Start the cluster with seed data

```
$ ./hasura-cluster start
```

[3] Start the hasura console (press Ctrl+C to stop)

```bash
$ ./hasura-cluster console
# - or -
$ hasura console
```

[4] Stop the cluster (whenever you are finished):

```
$ ./hasura-cluster stop
```

### Using production data

_Here are some docs in Gitbook that explain [How to load production data into a local instance](https://atd-dts.gitbook.io/moped-documentation/dev-guides/how-tos/how-to-load-production-data-into-a-local-instance)_

Configure your environment:

1. Copy the env_template file into env and fill in your credentials:

```bash
   $ cp env_template env
```

2. Pull a copy of production data, start the cluster, and apply local migrations and metadata. This will get a new copy of production (once per day) and store the snapshot in the `./snapshots/` folder. Subsequent invocations of this command on the same day will not download a new copy. 

```bash
$ ./hasura-cluster replicate
```

If you would prefer to bypass downloading a new copy of production and instead just use whatever the last snapshot in the folder, add `--use-any-snapshot` or `-j` 

```bash
$ ./hasura-cluster replicate -j
```

- Restarting the Hasura cluster without migrations:

```bash
./hasura-cluster reload
```
### Hasura-Cluster Reference

- `start_only`: Starts the cluster and does NOT run migrations.
- `start`: Starts the cluster and runs all migrations, applies metadata and seed data.
- `stop`: Stops the cluster, removes any volumes left out.
- `replicate`: Download a copy of the production database, start it and apply local migrations and metadata
- `replicate -j` : Start the cluster with the most recent snapshot in the `./snapshots` directory
- `prune`: Deletes any volumes left out by the cluster. 
- `status`: Displays the current status of the cluster
- `setenv`: Changes the current environment.

#### Hasura-Cluster SetEnv: 

What `setenv` really does is to copy an existing file from the ./config folder into
the current folder and renames it into `config.yaml`. The `hasura` command (CLI) will
read its settings from `config.yaml`.

For example, there should only be a file in the ./config folder called `hasura.local.yaml`
which contains the connection information for the local cluster. Notice the format
`hasura.<environment>.yaml`.

### Database Migrations

#### Views

To version control database views, SQL files are stored in `/views/` and the steps to modify a view and create a migration are available [here](./views/README.md) along with details about the dependencies of the views.

#### Audit fields and triggers

Most tables use a standard set of audit columns to track record history:

- `created_at` and `updated_at`: timestamps set on insert or update
- `created_by_user_id` and `updated_by_user_id`: use foreign keys to `moped_users` and set by Hasura from the requesting user's session variables

`moped_project` is the parent record for most of what gets edited in Moped, and our incremental ArcGIS Online (AGOL) components sync ETL only re-processes projects whose `moped_project.updated_at` has changed since its last run. That means an edit made anywhere in a project's tree of related tables needs to bubble up and touch `moped_project.updated_at`, or the ETL won't pick it up. Three trigger functions handle this, at different levels of the table hierarchy:

- `set_updated_at()`: Sets `updated_at = NOW()` on the row itself.
- `update_self_and_project_updated_audit_fields()`: Sets its own `updated_at` on update, then updates the related `moped_project` row's `updated_at` and `updated_by_user_id`. If a row's `project_id` is reassigned (like when moving a component from one project to another), it updates both the old and new parent project. Set on direct children of `moped_project` like `moped_proj_components`, `moped_proj_funding`, `moped_proj_milestones`, `moped_proj_notes`, `moped_proj_partners`, `moped_proj_personnel`, `moped_proj_phases`, `moped_proj_tags`, `moped_proj_work_activity`, and `moped_project_files`
- `update_audit_fields_with_dynamic_parent_table_name(parent_table, parent_pk_column, fk_column)`: Parameterized trigger that updates the immediate parent row (like `moped_proj_components`) and directly updates `moped_project`, so the change reaches the project level in one step. Set on grandchildren of `moped_project` like the feature geometry tables, `moped_proj_component_tags`, `moped_proj_component_work_types`, `moped_proj_components_subcomponents`, and `moped_proj_personnel_roles`

#### Skipping triggers in migrations

`manage_trigger(trigger_name, table_name, should_enable)` enables or disables a named trigger on a table by wrapping `ALTER TABLE ... ENABLE/DISABLE TRIGGER ...`. It checks that the trigger exists first so it's safe to call in migrations without erroring. Use it to bypass audit/cascade triggers during bulk loads or backfills where the side effects (redundant `updated_at` updates or shuffling the project list in the app) aren't wanted:

```sql
SELECT manage_trigger('set_moped_project_updated_at', 'moped_project', false); -- disable
-- ...bulk operation
SELECT manage_trigger('set_moped_project_updated_at', 'moped_project', true); -- re-enable
```

See [this migration](./migrations/default/1779396806012_work_activity_attachments/up.sql) for an example of usage.

#### Other notable trigger functions

- `update_council_district()`: on the feature geometry tables, associates a drawn feature with overlapping council districts via a spatial join
- `find_ecapris_user_match_by_email()`: on `ecapris_subproject_statuses`, tries to match a eCAPRIS user's email to a Moped user record on insert.
- `match_ecapris_funding_to_source_and_programs_foreign_keys()`: on `ecapris_subproject_funding`, tries to match funding program/source foreign keys by matching names against `moped_fund_programs` / `moped_fund_sources`.
- `set_user_last_seen_date()`: on `moped_user_events`, updates `moped_users.last_seen_date`.

We use triggers with prefixes of `notify_hasura_activity_log_` that are auto-generated by Hasura event trigger configuration to power the in-app activity log feed.

### SQL Formatting

We use [sqruff](https://github.com/quarylabs/sqruff) to lint and format SQL code. You'll need `sqruff` installed and on your path. If you're using `brew`, you can `brew install sqruff`. Confirm it's on your path with `which sqruff` in your terminal, and, if it gives you the path to the program, you're good to go.

VSCode users: install the [sqruff extension](https://marketplace.visualstudio.com/items?itemName=Quary.sqruff), which depends on the CLI being installed.

Users of other editors can adapt the following commands to best suit their needs. These are being run from the `atd-moped/moped-database/views` folder, using the `.sqruff` config file at the repo root. From the database folder:

#### Lint (ie, tell me what i'm doing wrong)

`sqruff lint --config ../.sqruff ./views/project_list_view.sql`

#### Fix (ie, clean up all my indention and fix things you can fix automatically):

`sqruff fix --config ../.sqruff ./views/project_list_view.sql`

## How to connect the database with Postgres GUI tools (example: TablePlus, DBeaver, etc)

_Here are some docs in Gitbook that explain [How to connect the database with Postgres GUI tools](https://atd-dts.gitbook.io/moped-documentation/dev-guides/how-tos/connecting-with-postgres-gui)_

## Read the docs

More documentation is available in the [Moped Technical Docs](https://atd-dts.gitbook.io/moped-documentation/dev-guides/hasura)

You are also encouraged to learn [Hasura Migrations from their documentation](https://hasura.io/docs/2.0/migrations-metadata-seeds/overview/).

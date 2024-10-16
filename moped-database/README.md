# MOPED Database

You will want to check the documentation in the [MOPED Technical Docs](https://atd-dts.gitbook.io/moped-documentation/dev-guides/hasura)

## Architecture Description

Broadly, the Moped application uses a backend [PostgreSQL](https://www.postgresql.org/) database server which is protected from the larger internet on a private subnet. An instance of [Hasura](https://hasura.io/)'s [graphql-engine](https://github.com/hasura/graphql-engine) is used as middleware exposing a graphql endpoint for use by the application running on a client's computer. The `graphql-engine` instance is provided by [the official docker images](https://hub.docker.com/r/hasura/graphql-engine) provided by hasura on DockerHub. 

### `graphql-engine` update plan

The update schedule for Moped's `graphql-engine` deployment is as follows:

* The deployment's ECS service should be updated to the latest, odd minor release available.

The intent is to stay generally up-to-date, but avoid `.0` releases and to maintain a sustainable update cadence. 

## Getting Started

#### 1. Install Docker & Docker Compose

You will want to follow the docker documentation on how to install docker in your system.

For Mac: https://docs.docker.com/docker-for-mac/install/

For Windows: https://docs.docker.com/docker-for-windows/install/

#### 2. Install the Hasura CLI

In your Terminal, run the following command:

```
curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash
```

This will install the Hasura CLI in /usr/local/bin. You might have to provide your sudo password depending on the permissions of your /usr/local/bin location.

If you’d prefer to install to a different location other than /usr/local/bin, set the env var INSTALL_PATH:

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
It is a bash script that runs a few docker-compose commands.

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

- Restarting the hasura cluster without migrations:

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

To version control database views, SQL files are stored in `/views/` and the steps to modify a view and create a migration are available [here](/views/README.md).

### SQL Formatting

We use [SQLFluff](https://sqlfluff.com/) to format SQL code. You'll need to get `sqlfluff` installed on your computer and in the path. If you're using `brew`, you can `brew install sqlfluff`. Make sure it's in your path by doing `which sqlfluff` in your terminal, and if it gives you the path to program, then you're good to go. 

VSCode users: The extension I'm using to provide linting and formatting capabilities in VSCode is [here](https://marketplace.visualstudio.com/items?itemName=dorzey.vscode-sqlfluff).

Users of other editors can adapt the following commands to best suit their needs. These are being run from the `moped-editor/moped-database/views` folder. 

Lint (ie, tell me what i'm doing wrong):

`sqlfluff lint --config ../../.sqlfluff project_list_view.sql`

Format (ie, clean up all my indention and fix things you can fix automatically):

`sqlfluff format --config ../../.sqlfluff project_list_view.sql`

## How to connect the database with Postgres GUI tools (example: TablePlus, DBeaver, P etc)

_Here are some docs in Gitbook that explain [How to connect the database with Postgres GUI tools](https://atd-dts.gitbook.io/moped-documentation/dev-guides/how-tos/connecting-with-postgres-gui)_

## Read the docs

More documentation is available in the [MOPED Technical Docs](https://atd-dts.gitbook.io/moped-documentation/dev-guides/hasura)

You are also encouraged to learn [Hasura Migrations from their documentation](https://hasura.io/docs/2.0/migrations-metadata-seeds/overview/). 

[SchemaSpy Analysis of moped](https://db-docs.austinmobility.io/atd-moped-production/index.html)

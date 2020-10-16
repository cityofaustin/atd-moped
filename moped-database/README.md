# MOPED Database

You will want to check the documentation in the [MOPED Technical Docs](https://app.gitbook.com/@atd-dts/s/moped-technical-docs/dev-guides/hasura-migrations)

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
This just a bash script that runs a few docker-compose commands.

Syntax:

```
$ ./hasura-cluster <command> <params>
```

[1] Set your environment:
```
$ ./hasura-cluster setenv local
```

[2] Start the cluster:

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

### Hasura-Cluster Reference

- `run_migration`: Runs all 3 hasura migrations: database, metadata, seed data. 
- `start_only`: Starts the cluster and does NOT run migrations.
- `start`: Starts the cluster and runs all migrations.
- `stop`: Stops the cluster, removes any volumes left out.
- `prune`: Deletes any volumes left out by the cluster. 
- `follow`: Shows the logs for the running cluster.
- `status`: Displays the current status of the cluster
- `setenv`: Changes the current environment.

#### Hasura-Cluster SetEnv: 

What `setenv` really does is to copy an existing file from the ./config folder into
the current folder and renames it into `config.yaml`. The `hasura` command (CLI) will
read its settings from `config.yaml`.

For example, there should only be a file in the ./config folder called `hasura.local.yaml`
which contains the connection information for the local cluster. Notice the format
`hasura.<environment>.yaml`. If for example, you need to connect the Hasura Staging cluster, 
you would need to create a new file called `hasura.staging.yaml`, provide all the info, 
then run `$ hasura-cluster setenv staging` and `hasura console`.


## Read the docs

More documentation is available in the [MOPED Technical Docs](https://app.gitbook.com/@atd-dts/s/moped-technical-docs/dev-guides/hasura-migrations)

You are also encouraged to learn [Hasura Migrations from their documentation](https://hasura.io/docs/1.0/graphql/core/migrations/index.html). 

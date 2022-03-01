# Remote DB replicate to local

## Background
This is a tool which can be used to largely automate the cloning of a remote PostgreSQL database to your local development environment. This is potentially useful when you need to work with database data that is created or modified by lambda functions resulting from `graphql-engine` triggers. 

## Usage
1) Create a `.env` file based on the provided template.
1) From the `moped-toolbox/pg_replicate_to_local` directory execute `./scripts/reload_from_remote_db.sh`.

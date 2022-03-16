# Hasura Configurations Folder

This directory is intended to provide a place to store configuration files for the database in your local clone of the repository. It contains a `.gitignore` file which is intended to prevent accidentally committing files in this directory. 

File Descriptions:

* hasura.local.yaml: Template for the configuration which governs how `hasura-cluster` operates in local deployments for developers. A copy of this file ends up being deposited in the `moped-database` directory with the name `config.yaml`.
* hasura_cluster_template.json: Template for parameters concerning database servers and bastion hosts for use by `hasura-cluster`. A copy of this file ends up being deposited into the `.ssh` directory within your home directory.
* primary_key_map.json: This file maps table names to the primary key column for that table. When a table is created, altered or dropped, the file representing the production or staging environment should be updated in conjunction with the roll-out of migrations into staging and production respectively. These files are stored in S3 and currently are found in [this location](https://github.com/cityofaustin/atd-moped/blob/eecf4127e5f9548fcf6aed6b13a3baff2d21e972/moped-data-events/activity_log/MopedEvent.py#L151). Please see [this issue](https://github.com/cityofaustin/atd-data-tech/issues/8526).

# TOOLBOX

This is a collection of scripts which have been written to serve a one-time or infrequent purpose. They are not intended to be run in an automated fashion and commonly would be used from the command line when needed. They will each have different parameters and possible environment variables which need to be set for the script to function as intended.

## backfill_data_tracker_url_field

The Moped application supports keeping correlated records in ATD's Knack Data Tracker instance. This script can be used to populate the label field for all synchronized records.

### Usage instructions

The docker image does not automatically run the script when it is instantiated from the container. It will spin on a `tail -f /dev/null` `CMD` and the user is expected to attach to the running container and execute the script manually.

1. Spin up your local database or prepare yourself to be able to connect to the read replica
1. Navigate to `moped-toolbox/backfill_data_tracker_url_field`
1. Using the `environment_file_template` template, create an environment file, `development.env` named by default...
   - **NB:** If you put production knack configuration values in this file, you will write to production Data Tracker when you run the script. Use the development Data Tracker instance set aside for moped development for testing.
1. .. and change the reference if needed in the `docker-compose.yml` file.
1. Start the docker image: `docker-compose up -d`
1. Attach to the docker image, `docker exec -it moped_backfill_url_field bash`
1. And execute the script.
1. `docker-compose stop` will stop the container.

## amd_milestones_backfill

This tool inserts `moped_proj_milestones` records into signal and PHB projects. It was created
to backfill project milestones after implementing the milestone template feature for issue [#9102](https://github.com/cityofaustin/atd-data-tech/issues/9102).

_Be aware that this script depends on database schema values which are in flux at the time of writing. In particular, the use of `status_id` to identify deleted records may be changed in a future release. Make sure this script aligns with your current database schema_

### Usage instructions

1. Create a python 3.x environment with `requests` installed.
2. Configure authentication details in `secrets.py`
3. Run `create_milestones.py`, and set the `--env (-e)` arg to your desired environment and `--max-date-added (-d)` arg date accordingly.

```shell
$ python create_milestones.py -e local -d '2022-06-17 00:00:00'
```

## purchase_order_backfill

This tool populates the `moped_purchase_order table` [see issue #8259](https://github.com/cityofaustin/atd-data-tech/issues/8259) with existing contractor and purchase order information from the `moped_projects` columns purchase_order_number and contractor. This script is intended only to be used once, to move the data from the moped_projects table before we remove the purchase_order_number and contractor columns.

### Usage instructions

1. Create a python 3.x environment with `requests` installed.
2. Configure authentication details in `secrets.py`
3. Run `create_purchase_orders.py`, and set the `--env (-e)` arg to your desired environment.

```shell
$ python create_purchase_orders.py -e local
```

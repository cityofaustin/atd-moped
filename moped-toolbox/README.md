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

# Sync Moped projects with Knack Data Tracker ETL

This ETL creates and updates `projects` table records in the Arterial Management
Data Tracker app - a Knack application used for asset management from Moped project
data.

If a Moped project has been associated with signal components, the project created
in Knack will have ties to the `signals` table records in the Knack app. These
linkages are formed by including the signal's Knack record ID, which acts a
foreign key to the signals table in the Data Tracker. A Moped project does not
require a connection to Knack signal records.

## Getting Started

### Set up the environment file for local testing

In production, secrets will come from 1Password and be fed to the script from
within an Airflow DAG. To test locally, we can use a local file.

Make a copy of `env_template` and call it `env_file`. Fill in the values as follows:
- HASURA_ secrets: these point to the local Moped Hasura instance
- KNACK_ secrets: these point to the test Data Tracker app and be found in the `development`
section of the 1Password entry called **Knack AMD Data Tracker**. They can also be
found by navigating to the **API & Code** section within a test copy of Data Tracker app 
in the Knack Builder.
- TEST_KNACK_SIGNAL_RECORD_ID: this is the Knack record ID of a signal in the test
Data Tracker app. You can find one by going to the `signals` table in the Knack app
and copying a unique signal ID from the URL that shows when you edit a row.
- TEST_MOPED_PROJECT_ID: This will be where you set the Moped project ID of the project
that you create in the testing steps.

### Testing

#### Testing by running the script locally

Testing the sync process outside of the production environment requires a few steps since the
we don't want to test on production and the unique signal IDs differ between the production app
and test copies. The steps are as follows:

1. Start the local instance of the Moped Hasura cluster from a production snapshot or using the seed data
2. Create a new project in Moped and set the environment variable called TEST_MOPED_PROJECT_ID to the
Moped project ID
3. Get a ISO 8601 timestamp (like `2024-01-22T22:53:57+0000` for example) for the current 
UTC time and set the `--start` argument to that timestamp
4. To execute the sync script, run the following command with your timestamp filled in:
```bash
docker run -it --rm  --network host --env-file env_file -v ${PWD}:/app atd-moped-etl-data-tracker-sync python data_tracker_sync.py --start <your timestamp> --test
```
5. The output of the script should be a list of created and updated Knack records.
6. It should show that one record was created, and no records were updated
7. Go to the test Data Tracker app and find the most recent record that was created in the
projects table. It should show the title and other details of your created Moped project
8.  Run the sync script again but update the timestamp to the current time again to simulate
the next run of the script in the future
9.  You should see that the script does not create or update any records.
10.  Edit the title of the Moped project you created earlier through the local Hasura console
or through the Moped Editor
11.  Run the sync script again with the last timestamp that you used. You should see the script
log an update of the Knack record that you created earlier. Check the row in the test
Data Tracker app and you should see that the title has been updated with your edit

#### Testing with Airflow

This script can also be run from the local Airflow stack. The `--test` flag is added when using
the `development` environment and development secrets are consumed from the 1Password
entries called **Knack AMD Data Tracker** and **Moped Hasura Admin** for the script to read.

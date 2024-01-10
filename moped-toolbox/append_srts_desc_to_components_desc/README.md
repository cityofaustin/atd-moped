# Append Safe Routes to Schools info to project component descriptions

## Running locally

1. Start the Hasura cluster [with production data](https://app.gitbook.com/o/-LzDQOVGhTudbKRDGpUA/s/-MIQvl_rKnZ_-wHRdp4J/dev-guides/how-tos/how-to-load-production-data-into-a-local-instance).

2. Use `secrets_template.py` as a template to create `secrets.py`

3. Export https://docs.google.com/spreadsheets/d/1M2dwi-GqheZLmy-GJwmrf6LAJpu07aoiD3aTEOo7IUQ/edit#gid=102248273
   as a csv file and place in the /data/ directory 

4. Create a virtual environment and install requirements.txt.

5. Log in using the username/password in the 1PW entry called **Moped Local Editor User Login**. Then, run the following SQL statement on your local database to make sure that the inserts to the activity log don't run into a foreign key error.

```sql
UPDATE "public"."moped_users" SET "user_id" = 1 WHERE "user_id" = 60;
```

6. Start Moped Editor locally and grab your token from the Authorization header of one of the GraphQL requests. Then, run:

```
$ python append_srts_desc.py -e local -t <your token minus the Bearer part>
```
## Running on staging or production

1. Update `secrets.py` with the endpoint for target environment then run with `staging` or `prod` for env arg. For production, log in using the username/password in the 1PW entry called **Moped Production Test Admin**. Use a token obtained with this username to make sure events are credited to **Data and Technology Admin** in the activity log.

# Backfill component phases and completion date from SRTS source statuses and complete dates

This script takes a csv that lists completed SRTS IDs and their current completion dates and updates
Moped components with the same SRTS ID to reflect the current status and completion date. Components
with existing substantial completion dates are excluded.

## Running locally

1. Start the Hasura cluster with production data

1. Use `secrets_template.py` as a template to create `secrets.py`

1. Export https://docs.google.com/spreadsheets/d/1M2dwi-GqheZLmy-GJwmrf6LAJpu07aoiD3aTEOo7IUQ/edit?gid=1500102334#gid=1500102334
   as a csv file and place in the `moped-toolbox/backfill_complete_srts_ids/data` directory 

2. Create a virtual environment and install requirements.txt:
```shell
pip install -r requirements.txt
```

1. Run the script with env flag:
```shell
python backfill_complete_srts_ids.py -e local
```
1. Or with more logging:

```shell
python backfill_complete_srts_ids.py -e local -v
```
## Running on staging or production

1. Update `secrets.py` with the environment-specific secrets then run with `staging` or `prod` for env arg. For staging and production secrets, see the 1PW entry called **Moped Hasura Admin**.

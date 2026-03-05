# Backfill PHB completion phase and dates using Data Tracker data

## Summary

This script uses the Data Tracker signals ODP dataset to find PHBs with `TURNED_ON` status and `turn_on_date` populated, 
and then compares to Moped PHB data. If the PHB is captured as a new install ("New" work type), then the complete phase
and completion date are populated. If not, the PHB is added to a project that this script creates with complete phase
and completion date populated.

## Running the script
1. If you have Node Version Manager installed, you will be prompted to install Node version 24. Otherwise, install it.

1. Set up your `.env` file see the `.env.example` file as a template

1. To run in dry mode to preview what the script will do, run:
```shell
npm run start:dry
```

1. To run the script against the credentials in your `.env` file:
```shell
npm run start
```

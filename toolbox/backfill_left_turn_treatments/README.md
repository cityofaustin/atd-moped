# Backfill left turn treatments and completion dates using Data Tracker data

## Summary

This script uses the Data Tracker signals ODP dataset to retrieve traffic signal data to pair with left-turn treatment implementation data from the (Austin Left Turn Treatment Evaluation (MMC) dashboard)[https://app.powerbigov.us/groups/me/reports/746b8c1d-d0e5-45a8-a661-bea2fd331764/ReportSectiond62e57c030a1e78218a9] to create completed Moped traffics signal components with protected left-turn phase subcomponent. Left turn treatments are collapsed so that treatments for different directions on the same signal on the same day are treated as a single component. Treatments on different days on the same signal id are treated as separate components.

## Running the script

**This script currently requires running in CST/CDT. If we reuse, we can update to convert to UTC at that time.**

1. If you have [Node Version Manager](https://github.com/nvm-sh/nvm) installed, you can install Node version 24 with `nvm use`. Otherwise, install it.

2. Set up your `.env` file see the `.env.example` file as a template

3. Install dependencies with:

```shell
npm install
```

4. To run in dry mode to preview what the script will do, run:

```shell
npm run start:dry
```

5. To run the script against the credentials in your `.env` file:

```shell
npm run start
```

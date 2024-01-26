#!/usr/bin/env python

import os
import argparse
import logging
from datetime import datetime, timezone

import knackpy

from process.request import make_hasura_request
from process.logging import get_logger
from process.knack_data import build_knack_project_from_moped_project
from process.queries import (
    GET_SYNCED_PROJECTS,
    GET_TEST_SYNCED_PROJECTS,
    GET_UNSYNCED_PROJECTS,
    GET_TEST_UNSYNCED_PROJECTS,
    UPDATE_MOPED_PROJECT_KNACK_ID,
)

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_API_KEY = os.getenv("KNACK_DATA_TRACKER_API_KEY")
TEST_MOPED_PROJECT_ID = os.getenv("TEST_MOPED_PROJECT_ID")

KNACK_DATA_TRACKER_PROJECT_OBJECT = "object_201"


def find_unsynced_moped_projects(is_test=False):
    """
    Find a list of Moped projects that have not been synced to Data Tracker

    Parameters:
        is_test (boolean): test flag added to query a defined project ID

    Returns:
        List: Moped project records to be synced to Data Tracker
    """
    unsynced_projects = []

    # If we are testing, request a Moped project record with a known ID.
    if is_test:
        data = make_hasura_request(
            query=GET_TEST_UNSYNCED_PROJECTS,
            variables={"project_id": TEST_MOPED_PROJECT_ID},
        )
        unsynced_projects = data["moped_project"]
    else:
        data = make_hasura_request(query=GET_UNSYNCED_PROJECTS)
        unsynced_projects = data["moped_project"]

    logger.info(f"Found {len(unsynced_projects)} unsynced projects")
    logger.debug(f"Found unsynced projects: {unsynced_projects}")
    return unsynced_projects


def create_knack_project_from_moped_project(app, moped_project_record, is_test=False):
    """
    Create a Knack project record to sync a Moped project to Data Tracker

    Parameters:
        app (knackpy.App): Knackpy app instance
        moped_project_record (dict): A Moped project record
        is_test (boolean): test flag added to add a complatible Knack signal record id to payload

    Returns:
        String: Knack record ID of created record
    """
    knack_project_record = build_knack_project_from_moped_project(
        moped_project_record=moped_project_record, is_test=is_test
    )

    created = app.record(
        method="create",
        data=knack_project_record,
        obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
    )

    logger.debug(f"Created Knack record: {created}")
    knack_record_id = created["id"]
    return knack_record_id


def update_moped_project_knack_id(moped_project_id, knack_project_id):
    """
    Update a Moped project record with the Knack record ID of the synced record

    Parameters:
        moped_project_id (string): A Moped project record ID
        knack_project_id (string): A Data Tracker project record ID

    Returns:
        String: Knack record ID of created record
    """
    update = make_hasura_request(
        query=UPDATE_MOPED_PROJECT_KNACK_ID,
        variables={
            "moped_project_id": moped_project_id,
            "knack_project_id": knack_project_id,
        },
    )

    logger.debug(
        f"Updated Moped project {moped_project_id} with Knack ID {knack_project_id}"
    )
    return update


def find_synced_moped_projects(last_run_date, is_test=False):
    """
    Find a list of Moped projects that are already synced to Data Tracker

    Parameters:
        last_run_date (string): ISO date string of latest updated_at value to find project records to update
        is_test (boolean): test flag added to query a defined project ID

    Returns:
        List: Moped project records to be updated in Data Tracker
    """
    synced_projects = []

    # If we are testing, request a Moped project record with a known ID.
    if is_test:
        data = make_hasura_request(
            query=GET_TEST_SYNCED_PROJECTS,
            variables={
                "last_run_date": last_run_date,
                "project_id": TEST_MOPED_PROJECT_ID,
            },
        )
        synced_projects = data["moped_project"]
    else:
        data = make_hasura_request(
            query=GET_SYNCED_PROJECTS,
            variables={
                "last_run_date": last_run_date,
            },
        )
        synced_projects = data["moped_project"]

    logger.info(f"Found {len(synced_projects)} synced projects")
    logger.debug(f"Found synced projects: {synced_projects}")
    return synced_projects


def update_knack_project_from_moped_project(app, moped_project_record, is_test=False):
    """
    Update a Knack project record already synced to Data Tracker from a Moped project record

    Parameters:
        app (knackpy.App): Knackpy app instance
        moped_project_record (dict): A Moped project record
        is_test (boolean): test flag added to add a complatible Knack signal record id to payload

    Returns:
        String: Knack record ID of updated record
    """
    logger.debug(f"Updating Knack record for {moped_project_record}")

    # Build Knack record and add existing Knack record ID for update
    knack_project_record = build_knack_project_from_moped_project(
        moped_project_record=moped_project_record, is_test=is_test
    )
    knack_project_record["id"] = moped_project_record["knack_project_id"]

    updated = app.record(
        method="update",
        data=knack_project_record,
        obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
    )

    knack_record_id = updated["id"]
    return knack_record_id


def main(args):
    app = knackpy.App(
        app_id=KNACK_DATA_TRACKER_APP_ID, api_key=KNACK_DATA_TRACKER_API_KEY
    )

    # Find all projects that are not synced to Data Tracker
    unsynced_moped_projects = find_unsynced_moped_projects(is_test=args.test)

    # Create a Knack project for each unsynced Moped project
    created_knack_records = []
    for project in unsynced_moped_projects:
        moped_project_id = project["project_id"]
        knack_record_id = create_knack_project_from_moped_project(
            app=app, moped_project_record=project, is_test=args.test
        )
        created_knack_records.append(
            {
                "moped_project_id": moped_project_id,
                "knack_record_id": knack_record_id,
            }
        )

        # Update Moped project with Knack record ID of created record
        logger.info(
            f"Updating Knack ID {knack_record_id} from Moped project {moped_project_id}"
        )
        update_moped_project_knack_id(moped_project_id, knack_record_id)

    # Find all projects that are synced to Data Tracker to update them
    synced_moped_projects = find_synced_moped_projects(
        last_run_date=args.date, is_test=args.test
    )

    # Update synced Moped projects in Data Tracker and skip those just created
    updated_knack_records = []
    updates_to_skip = [record["moped_project_id"] for record in created_knack_records]

    for project in synced_moped_projects:
        if project["project_id"] in updates_to_skip:
            continue

        moped_project_id = project["project_id"]
        knack_record_id = update_knack_project_from_moped_project(
            app=app, moped_project_record=project, is_test=args.test
        )
        updated_knack_records.append(
            {"moped_project_id": moped_project_id, "knack_record_id": knack_record_id}
        )

    logger.info(f"Done syncing.")
    logger.info(f"Created {len(created_knack_records)} new Knack records")
    logger.debug(f"Records created: {created_knack_records}")
    logger.info(f"Updated {len(updated_knack_records)} existing Knack records")
    logger.debug(f"Updated Knack records: {updated_knack_records}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-d",
        "--date",
        type=str,
        default=datetime.now(timezone.utc).isoformat(),
        help=f"ISO date string of latest updated_at value to find project records to update.",
    )

    parser.add_argument("-t", "--test", action="store_true")

    args = parser.parse_args()

    log_level = logging.DEBUG if args.test else logging.INFO
    logger = get_logger(name="moped-knack-sync", level=log_level)
    logger.info(
        f"Starting sync. Creating Knack records for Moped projects not synced and updating synced Knack records with latest project data from Moped since {args.date}."
    )

    main(args)

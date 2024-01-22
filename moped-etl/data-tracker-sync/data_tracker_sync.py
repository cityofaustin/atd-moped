#!/usr/bin/env python

import re
import os
import argparse
from datetime import datetime, timezone

import knackpy

from process.request import make_hasura_request
from process.logging import get_logger
from process.knack_data import build_knack_project_from_moped_project
from process.queries import (
    GET_SYNCED_PROJECTS,
    GET_TEST_UNSYNCED_PROJECTS,
    GET_UNSYNCED_PROJECTS,
    UPDATE_MOPED_PROJECT_KNACK_ID,
)

logger = get_logger("moped-knack-sync")

logger.debug("Syncing Moped Project Data to Data Tracker")

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_API_KEY = os.getenv("KNACK_DATA_TRACKER_API_KEY")
TEST_MOPED_PROJECT_ID = os.getenv("TEST_MOPED_PROJECT_ID")

KNACK_DATA_TRACKER_PROJECT_OBJECT = "object_201"


def find_unsynced_moped_projects(is_test=False):
    # If we are testing, request a Moped project record with a known ID.
    if is_test:
        data = make_hasura_request(
            query=GET_TEST_UNSYNCED_PROJECTS,
            variables={"project_id": TEST_MOPED_PROJECT_ID},
        )
        unsynced_projects = data["moped_project"]
        logger.debug(f"Found unsynced projects: {unsynced_projects}")
    else:
        data = make_hasura_request(query=GET_UNSYNCED_PROJECTS)
        unsynced_projects = data["moped_project"]
        logger.info(f"Found {len(unsynced_projects)} unsynced projects")

    return unsynced_projects


def create_knack_project_from_moped_project(app, moped_project_record, is_test=False):
    logger.debug(f"Creating Knack record for {moped_project_record}")

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
    logger.debug(
        f"Updating Moped project {moped_project_id} with Knack ID {knack_project_id}"
    )

    update = make_hasura_request(
        query=UPDATE_MOPED_PROJECT_KNACK_ID,
        variables={
            "moped_project_id": moped_project_id,
            "knack_project_id": knack_project_id,
        },
    )

    return update


def find_synced_moped_projects(last_run_date, is_test=False):
    data = make_hasura_request(
        query=GET_SYNCED_PROJECTS, variables={"last_update_date": last_run_date}
    )
    synced_projects = data["moped_project"]
    logger.info(f"Found {len(synced_projects)} synced projects")
    logger.debug(f"Found synced projects: {synced_projects}")

    return synced_projects


def update_knack_project_from_moped_project(app, moped_project_record, is_test=False):
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
        update_moped_project_knack_id(moped_project_id, knack_record_id)

    # Find all projects that are synced to Data Tracker to update them
    synced_moped_projects = find_synced_moped_projects(
        last_run_date=args.start, is_test=args.test
    )

    # Update synced Moped projects in Data Tracker
    updated_knack_records = []
    for project in synced_moped_projects:
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
        "--start",
        type=str,
        default=datetime.now(timezone.utc).isoformat(),
        help=f"ISO date string (in UTC) of latest updated_at value to find project records to update.",
    )

    parser.add_argument("-t", "--test", action="store_true")

    args = parser.parse_args()

    main(args)

# TODO: Add documentation on how to test this:
# From React code:
# Warning: It's not possible to test this feature outside of a produciton environment,
# because our signals' unique knack record identifiers only exist in production.
# To test, you can patch in a valid knack ID by uncommenting the line below that sets
# body.signals_connection.

# TODO: From React code:
# /**
#  * This feature enables the user to create a "project" record in Arterial Management
#  * Data Tracker app - a knack application used for asset management.
#  *
#  * Any Moped user can push any project to the Data Tracker. If the project has signal
#  * components, the project created in Knack will have ties to the signal records in
#  * Knack. These linkages are formed by including the signal's knack record ID, which
#  * acts a foreign key to the signals table in the Data Tracker. If the project does not
#  * have signal components, that's fine.
#  */

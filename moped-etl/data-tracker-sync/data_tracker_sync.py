#!/usr/bin/env python

import re
import os
import argparse
from datetime import datetime, timezone

import knackpy

from process.request import make_hasura_request
from process.logging import get_logger
from process.knack_data import build_knack_project_from_moped_project

logger = get_logger("moped-knack-sync")

logger.debug("Syncing Moped Project Data to Data Tracker")

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_API_KEY = os.getenv("KNACK_DATA_TRACKER_API_KEY")
KNACK_DATA_TRACKER_PROJECT_OBJECT = "object_201"


UNSYNCED_PROJECTS_QUERY = """
query UnsyncedProjects {
  moped_project(where: { project_id: { _eq: 3409 }, knack_project_id: { _is_null: true }}) {
    project_id
    project_name
    current_phase_view {
      phase_name
    }
    moped_proj_components {
      feature_signals {
        knack_id
      }
    }
  }
}
"""

SYNCED_PROJECTS_QUERY = """
query SyncedProjects($last_update_date: timestamptz) {
  moped_project(where: { knack_project_id: { _is_null: false }, updated_at: {_gte: $last_update_date} }) {
    project_id
    project_name
    current_phase_view {
      phase_name
    }
    moped_proj_components {
      feature_signals {
        knack_id
      }
    }
  }
}
"""


def find_unsynced_moped_projects():
    data = make_hasura_request(query=UNSYNCED_PROJECTS_QUERY)
    unsynced_projects = data["moped_project"]
    logger.info(f"Found {len(unsynced_projects)} unsynced projects")

    return unsynced_projects


def create_knack_project_from_moped_project(app, moped_project_record):
    logger.debug(f"Creating Knack record for {moped_project_record}")

    knack_project_record = build_knack_project_from_moped_project(moped_project_record)
    created = app.record(
        method="create",
        data=knack_project_record,
        obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
    )

    logger.debug(f"Created Knack record: {created}")
    knack_record_id = created["id"]
    return knack_record_id


def find_synced_moped_projects(last_run_date):
    data = make_hasura_request(
        query=SYNCED_PROJECTS_QUERY, variables={"last_update_date": last_run_date}
    )
    synced_projects = data["moped_project"]
    logger.info(f"Found {len(synced_projects)} synced projects")

    return synced_projects


def update_knack_project_from_moped_project(app, moped_project_record):
    logger.debug(f"Updating Knack record for {moped_project_record}")

    knack_project_record = build_knack_project_from_moped_project(moped_project_record)
    updated = app.record(
        method="update",
        data=knack_project_record,
        obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
    )

    knack_record_id = updated["id"]
    return knack_record_id


def main(last_run_date):
    # Initialize KnackPy app
    app = knackpy.App(
        app_id=KNACK_DATA_TRACKER_APP_ID, api_key=KNACK_DATA_TRACKER_API_KEY
    )

    # Find all projects that are not synced to Data Tracker
    unsynced_moped_projects = find_unsynced_moped_projects()

    # Create a Knack project for each unsynced Moped project
    created_knack_records = []
    for project in [unsynced_moped_projects[0]]:
        logger.info(project)  # remove this
        knack_record_id = create_knack_project_from_moped_project(
            app=app, moped_project_record=project
        )
        created_knack_records.append(
            {
                "moped_project_id": project["project_id"],
                "knack_record_id": knack_record_id,
            }
        )
        # TODO: Update Moped record with knack_record_id

    # Find all projects that are synced to Data Tracker to update them
    synced_moped_projects = find_synced_moped_projects(last_run_date)

    # Update synced Moped projects in Data Tracker
    # updated_knack_records = []
    # for synced_moped_project in synced_moped_projects:
    #     knack_record_id = update_knack_project_from_moped_project(synced_moped_project)

    logger.info(f"Done syncing.")
    logger.info(f"Created {len(created_knack_records)} new Knack records")
    logger.debug(f"Records created: {created_knack_records}")
    # logger.info(f"Updated {len(updated_knack_records)} existing Knack records")
    # logger.debug(f"Updated Knack records: {created_knack_records}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "--start",
        type=str,
        default=datetime.now(timezone.utc).isoformat(),
        help=f"ISO date string (in UTC) of latest updated_at value to find project records to update.",
    )

    args = parser.parse_args()

    main(args.start)

# TODO: Add documentation on how to test this:
# From React code:
# Warning: It's not possible to test this feature outside of a produciton environment,
# because our signals' unique knack record identifiers only exist in production.
# To test, you can patch in a valid knack ID by uncommenting the line below that sets
# body.signals_connection.

# TODO: Test with Knack test app
# uncomment this line to test this request against the Knack test env - this is signal ID #2 - GUADALUPE ST / LAMAR BLVD
# body.signals_connection = ["62195eedf538d8072b16a0f6"];

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
#  *
#  * Although this component has logic to *update* (instead of create) a project record
#  * in Knack (with a PUT request) — we currently do not provide the users with this
#  * option. The "Sync w/ Data Tracker" button is hidden once a project is created.
#  */

# TODO: Create url for moped_url_object (field_4162)
# Helper from React code:
# const getUrlObject = (project) => {
#   const url =
#     process.env.REACT_APP_KNACK_DATA_TRACKER_URL_BASE + project.project_id;
#   return {
#     url: url,
#     label: project.project_name,
#   };
# };

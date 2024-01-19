#!/usr/bin/env python

import re
import os
import argparse
from datetime import datetime, timezone

import knackpy

from process.request import make_hasura_request
from process.logging import get_logger

logger = get_logger("moped-knack-sync")

logger.debug("Syncing Moped Project Data to Data Tracker")

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_API_KEY = os.getenv("KNACK_DATA_TRACKER_API_KEY")
KNACK_DATA_TRACKER_VIEW = os.getenv("KNACK_DATA_TRACKER_VIEW")
KNACK_DATA_TRACKER_PROJECT_OBJECT = os.getenv("KNACK_DATA_TRACKER_PROJECT_OBJECT")

KNACK_OBJECT_PROJECT_ID = os.getenv("KNACK_OBJECT_PROJECT_ID")
KNACK_OBJECT_PROJECT_NAME = os.getenv("KNACK_OBJECT_PROJECT_NAME")
KNACK_OBJECT_CURRENT_STATUS = os.getenv("KNACK_OBJECT_CURRENT_STATUS")
KNACK_OBJECT_SIGNALS = os.getenv("KNACK_OBJECT_SIGNALS")

MOPED_TO_KNACK_FIELD_MAP = {
    project_id: "field_4133",
    project_name: "field_3857",
    current_phase_name: "field_4136",
    signals_connection: "field_3861",
    moped_url_object: "field_4162",
}

UNSYNCED_PROJECTS_QUERY = """
query UnsyncedProjects {
  moped_project(where: { knack_project_id: { _is_null: true }}) {
    project_id
    project_name
    current_phase_view {
      phase_name
    }
    moped_proj_components {
      feature_signals {
        signal_id
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
        signal_id
      }
    }
  }
}
"""


def find_unsynced_moped_projects():
    data = make_hasura_request(query=UNSYNCED_PROJECTS_QUERY)
    unsynced_projects = data["moped_project"]
    logger.debug(f"Found {len(synced_projects)} unsynced projects")

    return unsynced_projects


def create_knack_project_from_moped_project(app, moped_project_record):
    print("Creating Knack projects from unsynced Moped projects")
    logger.debug(moped_project_record)
    # Build a Knack project record from unsynced Moped project records and POST to Knack
    # Return id from created Knack record: res.record.id


def find_synced_moped_projects(last_run_date):
    data = make_hasura_request(
        query=UNSYNCED_PROJECTS_QUERY, variables={"last_update_date": last_run_date}
    )
    synced_projects = data["moped_project"]
    logger.debug(f"Found {len(synced_projects)} synced projects")

    return synced_projects


def update_knack_project_from_moped_project(moped_project_record):
    # Build a Knack project record from unsynced Moped project records and POST to Knack
    # Return id from created Knack record: res.record.id
    print("Updating synced projects")


def build_signal_set_from_moped_record(record):
    """
    Build a set of signal IDs connected to a moped projet record

    Parameters:
        Moped Project (dictionary): A moped project as returned by graphql-engine

    Returns:
        Set: A set of all internal IDs used by Knack to for the signals
    """
    signals = set()
    for feature in record["moped_proj_features"]:
        signals.add(feature["location"]["properties"]["id"])
    return signals


def main(last_run_date):
    # Initialize KnackPy app
    app = knackpy.App(
        app_id=KNACK_DATA_TRACKER_APP_ID, api_key=KNACK_DATA_TRACKER_API_KEY
    )

    # Find all projects that are not synced to Data Tracker
    unsynced_moped_projects = find_unsynced_moped_projects()

    # Create a Knack project for each unsynced Moped project
    for project in unsynced_moped_projects:
        create_knack_project_from_moped_project(app=app, moped_project_record=project)

    # Find all projects that are synced to Data Tracker to update them
    synced_moped_projects = find_synced_moped_projects(last_run_date)

    for synced_moped_project in synced_moped_projects:
        update_knack_project_from_moped_project(synced_moped_project)


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

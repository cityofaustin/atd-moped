#!/usr/bin/env python

import re
import os
import argparse

import knackpy

from process.request import run_query
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
    current_status
    knack_project_id
    moped_proj_features 
      {
        feature_id
        location
      }
  }
}
"""

SYNCED_PROJECTS_QUERY = """
query SyncedProjects {
  moped_project(where: { knack_project_id: { _is_null: false }}) {
    project_id
    project_name
    current_status
    knack_project_id
    moped_proj_features 
      {
        feature_id
        location
      }
  }
}
"""


def find_unsynced_moped_projects():
    print("Finding unsynced projects")
    # TODO: Use get_unsynced_projects request to find all projects that are not synced
    return []


def create_knack_project_from_moped_project(moped_project_record):
    print("Creating Knack projects from unsynced Moped projects")
    # Build a Knack project record from unsynced Moped project records and POST to Knack
    # Return id from created Knack record: res.record.id
    return ""


def find_synced_moped_projects():
    print("Finding synced projects")
    # TODO: Use get_unsynchronized_projects request to find all projects that are not synced
    return []


def update_knack_project_from_moped_project(moped_project_record):
    # Build a Knack project record from unsynced Moped project records and POST to Knack
    # Return id from created Knack record: res.record.id
    print("Updating synced projects")


def build_signal_set_from_knack_record(record):
    """
    Build a set of signal IDs connected to a knack project record

    Parameters:
        Knack record (Record): A KnackPy record

    Returns:
        Set: A set of all internal IDs used by Knack to for the signals
    """
    signals = set()
    if record["Signals"]:  # KnackPy will have None in place if there are no signals
        for signal in record["Signals"]:
            signals.add(signal["id"])
    return signals


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


# Get Moped's current state of synchronized projects
moped_data = run_query(get_all_synchronized_projects)
# logger.debug(moped_data)

# Use KnackPy to pull the current state of records in Data Tracker
app = knackpy.App(app_id=KNACK_DATA_TRACKER_APP_ID, api_key=KNACK_DATA_TRACKER_API_KEY)

knack_query_filter = {
    "match": "and",
    "rules": [
        {"field": KNACK_OBJECT_PROJECT_ID, "operator": "is not blank"},
    ],
}

records = app.get(
    "view_" + KNACK_DATA_TRACKER_VIEW, filters=knack_query_filter, generate=1
)
knack_records = {}
for record in records:
    if not record[KNACK_OBJECT_PROJECT_ID]:
        continue
    knack_records[record[KNACK_OBJECT_PROJECT_ID]] = record

# Iterate over projects, checking for data mismatches, indicating a needed update
for moped_project in moped_data["data"]["moped_project"]:
    update_needed = False
    knack_data = dict(knack_records[moped_project["project_id"]])

    for key in knack_object_keys:
        if (
            not moped_project[key]
            == knack_records[moped_project["project_id"]][knack_object_keys[key]]
        ):
            update_needed = True
            knack_data[knack_object_keys[key]] = moped_project[key]

    knack_signals = build_signal_set_from_knack_record(
        knack_records[moped_project["project_id"]]
    )
    moped_signals = build_signal_set_from_moped_record(moped_project)

    if not moped_signals == knack_signals:
        update_needed = True
        knack_data[KNACK_OBJECT_SIGNALS] = list(moped_signals)

    if update_needed:
        logger.debug(
            f"""Need to update knack for Moped project {moped_project["project_id"]}"""
        )
        app.record(
            method="update",
            data=knack_data,
            obj="object_" + KNACK_DATA_TRACKER_PROJECT_OBJECT,
        )
    else:
        logger.debug(
            f"""No update needed for Moped project {moped_project["project_id"]}"""
        )


def main():
    # Initialize KnackPy app
    app = knackpy.App(
        app_id=KNACK_DATA_TRACKER_APP_ID, api_key=KNACK_DATA_TRACKER_API_KEY
    )

    # Find all projects that are not synced to Data Tracker
    unsynced_moped_projects = find_unsynced_moped_projects()

    # Create a Knack project for each unsynced Moped project
    for unsynced_moped_project in unsynced_moped_projects:
        create_knack_project_from_moped_project(unsynced_moped_project)

    # Find all projects that are synced to Data Tracker to update them
    synced_moped_projects = find_synced_moped_projects()

    for synced_moped_project in synced_moped_projects:
        update_knack_project_from_moped_project(synced_moped_project)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    # TODO: Check in on date format needed for filter on SYNCED_PROJECTS_QUERY
    parser.add_argument(
        "--start",
        type=str,
        default=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        help=f"Date (in UTC) of earliest records to be fetched (YYYY-MM-DD). Defaults to today",
    )

    args = parser.parse_args()

    main()

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

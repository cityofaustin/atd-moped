#!/usr/bin/env python

import re
import os
import knackpy
from process.request import run_query
from process.logging import getLogger

logger = getLogger("moped-knack-sync")

logger.debug("Syncing Moped Project Data to Data Tracker")

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_API_KEY = os.getenv("KNACK_DATA_TRACKER_API_KEY")
KNACK_DATA_TRACKER_VIEW = os.getenv("KNACK_DATA_TRACKER_VIEW")
KNACK_DATA_TRACKER_PROJECT_OBJECT = os.getenv("KNACK_DATA_TRACKER_PROJECT_OBJECT")

KNACK_OBJECT_PROJECT_ID = os.getenv("KNACK_OBJECT_PROJECT_ID")
KNACK_OBJECT_PROJECT_NAME = os.getenv("KNACK_OBJECT_PROJECT_NAME")
KNACK_OBJECT_CURRENT_STATUS = os.getenv("KNACK_OBJECT_CURRENT_STATUS")

# Define mapping between column names and knack column fields
knack_object_keys = {
    "project_id": KNACK_OBJECT_PROJECT_ID,
    "project_name": KNACK_OBJECT_PROJECT_NAME,
    "current_status": KNACK_OBJECT_CURRENT_STATUS,
}

get_all_synchronized_projects = """
query get_all_projects {
  moped_project(where: {knack_project_id: {_is_null: false}}) {
    project_id
    project_name
    current_status
    knack_project_id
  }
}
"""

# Get Moped's current state of synchronized projects
moped_data = run_query(get_all_synchronized_projects)
logger.debug(moped_data)

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
    if update_needed:
        logger.debug(
            f"""Need to update knack for Moped project {moped_project["project_id"]}"""
        )
        app.record(
            method="update",
            data=knack_data,
            obj="object_" + KNACK_DATA_TRACKER_PROJECT_OBJECT,
        )

#!/usr/bin/env python

import os
import argparse
import logging
from datetime import datetime, timezone

import knackpy

from process.request import make_hasura_request
from process.logging import get_logger

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_API_KEY = os.getenv("KNACK_DATA_TRACKER_API_KEY")

KNACK_DATA_TRACKER_PROJECT_OBJECT = "object_201"

GET_MOPED_PROJECTS = """
query GetMopedProjects {
  moped_project(where: { knack_project_id: { _is_null: false }}) {
    project_id
    knack_project_id
  }
}
"""


# def create_knack_project_from_moped_project(moped_project_record, is_test=False):
#     """
#     Create a Knack project record to sync a Moped project to Data Tracker

#     Parameters:
#         moped_project_record (dict): A Moped project record
#         is_test (boolean): test flag added to add a complatible Knack signal record id to payload

#     Returns:
#         String: Knack record ID of created record
#     """
#     knack_project_record = build_knack_project_from_moped_project(
#         moped_project_record=moped_project_record, is_test=is_test
#     )

#     created = knackpy.api.record(
#         app_id=KNACK_DATA_TRACKER_APP_ID,
#         api_key=KNACK_DATA_TRACKER_API_KEY,
#         method="create",
#         data=knack_project_record,
#         obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
#     )

#     logger.debug(f"Created Knack record: {created}")
#     knack_record_id = created["id"]
#     return knack_record_id


def get_synced_moped_project_knack_ids():
    data = make_hasura_request(query=GET_MOPED_PROJECTS)
    projects = data["moped_project"]
    knack_ids = [project["knack_project_id"] for project in projects]

    logger.debug(f"Found Knack IDs: {knack_ids}")
    logger.info(f"Found {len(knack_ids)} Knack IDs")
    return knack_ids


def get_knack_project_record_ids():
    knack_projects = knackpy.api.get(
        app_id=KNACK_DATA_TRACKER_APP_ID,
        api_key=KNACK_DATA_TRACKER_API_KEY,
        obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
    )
    knack_ids = [project["id"] for project in knack_projects]
    logger.info(knack_projects[0])

    logger.debug(f"Found Knack projects: {knack_ids}")
    logger.info(f"Found {len(knack_ids)} Knack projects")
    return knack_ids


def main(args):
    knack_project_ids_in_moped = get_synced_moped_project_knack_ids()
    knack_project_ids_in_knack = get_knack_project_record_ids()

    ids_in_both_tables = list(
        set(knack_project_ids_in_knack) & set(knack_project_ids_in_moped)
    )
    ids_not_in_both_tables = list(
        set(knack_project_ids_in_knack) - set(knack_project_ids_in_moped)
    )

    logger.info(f"Found {len(ids_in_both_tables)} records in both tables")
    # logger.debug(f"IDs in both tables: {ids_in_both_tables}")

    logger.info(
        f"Found {len(ids_not_in_both_tables)} records in Knack but not in Moped"
    )
    # logger.debug(f"IDs in Knack but not in Moped: {ids_not_in_both_tables}")

    # logger.info(f"Done syncing.")
    # logger.info(f"Created {len(created_knack_records)} new Knack records")
    # logger.debug(f"Records created: {created_knack_records}")
    # logger.info(f"Updated {len(updated_knack_records)} existing Knack records")
    # logger.debug(f"Updated Knack records: {updated_knack_records}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument("-t", "--test", action="store_true")

    args = parser.parse_args()

    log_level = logging.INFO
    logger = get_logger(name="knack-orphan-records", level=log_level)
    logger.info(f"Starting.")

    main(args)

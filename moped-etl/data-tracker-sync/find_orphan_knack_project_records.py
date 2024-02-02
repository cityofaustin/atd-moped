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
KNACK_DATA_TRACKER_WORK_ORDER_SIGNALS_OBJECT = "object_31"

WORK_ORDER_SIGNALS_PROJECT_FIELD = "field_3965"

GET_MOPED_PROJECTS = """
query GetMopedProjects {
  moped_project(where: { knack_project_id: { _is_null: false }}) {
    project_id
    knack_project_id
  }
}
"""


def get_synced_moped_project_knack_ids():
    data = make_hasura_request(query=GET_MOPED_PROJECTS)
    projects = data["moped_project"]
    knack_ids = [project["knack_project_id"] for project in projects]

    logger.debug(f"Found Moped Project Knack IDs: {knack_ids}")
    logger.info(f"Found {len(knack_ids)} Moped Project Knack IDs")
    return knack_ids


def get_knack_project_record_ids():
    knack_projects = knackpy.api.get(
        app_id=KNACK_DATA_TRACKER_APP_ID,
        api_key=KNACK_DATA_TRACKER_API_KEY,
        obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
    )
    knack_ids = [project["id"] for project in knack_projects]

    logger.debug(f"Found Knack projects: {knack_ids}")
    logger.info(f"Found {len(knack_ids)} Knack projects")
    return knack_ids


def check_for_work_order_signals_connection(knack_id):
    work_orders = knackpy.api.get(
        app_id=KNACK_DATA_TRACKER_APP_ID,
        api_key=KNACK_DATA_TRACKER_API_KEY,
        obj=KNACK_DATA_TRACKER_WORK_ORDER_SIGNALS_OBJECT,
        filters=[
            {
                "field": WORK_ORDER_SIGNALS_PROJECT_FIELD,
                "operator": "is",
                "value": knack_id,
            }
        ],
    )

    logger.debug(f"Found Knack work orders: {work_orders}")
    logger.info(f"Found {len(work_orders)} Knack work orders")
    return work_orders


def main(args):
    knack_project_ids_in_moped = get_synced_moped_project_knack_ids()
    knack_project_ids_in_knack = get_knack_project_record_ids()

    ids_in_both_tables = list(
        set(knack_project_ids_in_knack) & set(knack_project_ids_in_moped)
    )
    logger.info(f"Found {len(ids_in_both_tables)} records in both tables")

    ids_not_in_both_tables = list(
        set(knack_project_ids_in_knack) - set(knack_project_ids_in_moped)
    )
    logger.info(
        f"Found {len(ids_not_in_both_tables)} records in Knack but not in Moped"
    )

    deletes_to_skip = []
    for id in ids_not_in_both_tables:
        project = check_for_work_order_signals_connection(id)
        logger.debug(
            f"Found work order signals connected to project ID {id}: {project}"
        )
        if len(project) > 0:
            deletes_to_skip.append(id)

    logger.info(f"Found {len(deletes_to_skip)} records to skip deleting")
    logger.debug(f"Records to skip deleting: {deletes_to_skip}")

    # TODO: Do the delete part

    logger.info(f"Done.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument("-t", "--test", action="store_true")

    args = parser.parse_args()

    log_level = logging.DEBUG
    logger = get_logger(name="knack-orphan-records", level=log_level)
    logger.info(f"Starting.")

    main(args)

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
    work_order_signals = knackpy.api.get(
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

    logger.debug(f"Found Knack work order signals record: {work_order_signals}")
    return work_order_signals


def delete_knack_project_record(knack_id):
    logger.info(f"Deleting Knack project record with ID: {knack_id}")
    knackpy.api.record(
        app_id=KNACK_DATA_TRACKER_APP_ID,
        api_key=KNACK_DATA_TRACKER_API_KEY,
        obj=KNACK_DATA_TRACKER_PROJECT_OBJECT,
        method="delete",
        data={"id": knack_id},
    )


def main():
    logger.info(f"Getting all Knack project IDs from Moped projects...")
    knack_project_ids_in_moped = get_synced_moped_project_knack_ids()
    logger.info(f"Getting all Knack project IDs from Knack...")
    knack_project_ids_in_knack = get_knack_project_record_ids()

    logger.info(f"Finding overlap and differences in those lists...")
    ids_in_both_tables = list(
        set(knack_project_ids_in_knack) & set(knack_project_ids_in_moped)
    )
    logger.info(
        f"Found {len(ids_in_both_tables)} records in both tables that should be retained"
    )

    ids_not_in_both_tables = list(
        set(knack_project_ids_in_knack) - set(knack_project_ids_in_moped)
    )
    logger.info(f"Records in Knack but not in Moped: {ids_not_in_both_tables}")
    logger.info(
        f"Found {len(ids_not_in_both_tables)} records in Knack but not in Moped that are ready to delete"
    )

    logger.info(f"Checking Knack project records for work order signals connections...")
    deletes_to_skip = []
    count = 1
    for id in ids_not_in_both_tables:
        logger.info(f"{count}/{len(ids_not_in_both_tables)}: Knack ID {id}")

        work_order_signals = check_for_work_order_signals_connection(id)
        count += 1

        if len(work_order_signals) > 0:
            logger.info(
                f"Found work order signals connected to project ID {id}: {work_order_signals}"
            )
            deletes_to_skip.append(id)
        else:
            logger.info(f"No work order signals connection found deleting...")
            delete_knack_project_record(id)

    logger.info(
        f"Record IDs of {len(deletes_to_skip)} deletes skipped: {deletes_to_skip}"
    )
    logger.info(f"Done.")


if __name__ == "__main__":
    log_level = logging.INFO
    logger = get_logger(name="knack-orphan-records", level=log_level)
    logger.info(f"Starting.")

    main()

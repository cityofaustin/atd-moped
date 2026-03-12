""" Update Knack project records with Moped project ID"""
import argparse
import json
import os
from pprint import pprint as print
import sys

import knackpy

from logger import get_logger
from queries import MOPED_KNACK_PROJECTS_QUERY
from settings import LOG_DIR, KNACK_PROJECTS_OBJECT, KNACK_MOPED_PROJECT_ID_FIELD
from secrets import HASURA, KNACK_AUTH
from utils import make_hasura_request


def main(env):
    if (env) != "local":
        proceed = None
        proceed = input(
            f"About to fetch projects in Moped {env} environment. Type 'yes' to proceed or any key to quit > "
        )
        if proceed != "yes":
            sys.exit()

    logger.info("Initializing Knack app...")
    app = knackpy.App(app_id=KNACK_AUTH["app_id"], api_key=KNACK_AUTH["api_key"])

    logger.info("Fetching Moped projects with Knack ID")
    moped_projects_with_knack_ids = make_hasura_request(
        query=MOPED_KNACK_PROJECTS_QUERY, variables=None, key="moped_project", env=env
    )

    logger.info(f"{len(moped_projects_with_knack_ids)} projects to update in Knack...")
    for i, project in enumerate(moped_projects_with_knack_ids):
        logger.info(f"Updating {i + 1} of {len(moped_projects_with_knack_ids)}")
        record = {
            "id": project["knack_project_id"],
            KNACK_MOPED_PROJECT_ID_FIELD: project["project_id"],
        }
        app.record(obj=KNACK_PROJECTS_OBJECT, data=record, method="update")
        logger.info(
            f"Updated Knack record {record['id']} with Moped project ID {record[KNACK_MOPED_PROJECT_ID_FIELD]}"
        )
    logger.info("Done :)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-e",
        "--env",
        type=str,
        required=True,
        choices=["local", "staging", "prod"],
        help=f"The environment",
    )
    args = parser.parse_args()
    logger = get_logger(name=os.path.basename(__file__), log_dir=LOG_DIR)
    main(args.env)

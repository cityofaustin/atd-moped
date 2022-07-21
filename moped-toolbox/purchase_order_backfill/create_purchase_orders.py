"""
This script takes contractors and DO#s from existing moped projects and moves them into
their own table

Usage:

"""

import argparse


from amd_milestones_backfill.utils import get_logger, make_hasura_request
from queries import PROJECTS_QUERY, ADD_PURCHASE_ORDER
from amd_milestones_backfill.secrets import HASURA


def main(env):
    logger.info(f"Getting moped projects in {env} env")

    data = make_hasura_request(
        query=PROJECTS_QUERY,
        variables={},
        endpoint=HASURA["hasura_graphql_endpoint"][env],
        admin_secret=HASURA["hasura_graphql_admin_secret"][env],
    )

    projects = data["moped_project"]
    logger.info(projects)

    logger.info(f"{len(projects)} projects to process")

    records_to_add = []
    for project in projects:
        project_id = project["project_id"]
        contractor = project["contractor"]
        purchase_order_number = project["purchase_order_number"]
        if contractor is None and purchase_order_number is None:
            continue

        records_to_add.append({"project_id": project_id, "purchase_order_number": purchase_order_number,
                               "vendor": contractor})

    for record in records_to_add:
        make_hasura_request(
            query=ADD_PURCHASE_ORDER,
            variables={"objects": record},
            endpoint=HASURA["hasura_graphql_endpoint"][env],
            admin_secret=HASURA["hasura_graphql_admin_secret"][env]
        )
        logger.info(f"record added for project id {record['project_id']}")

    logger.info(f"{len(records_to_add)} records added")


if __name__ == "__main__":
    logger = get_logger(name="create_purchase_orders")

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
    print(args)

    main(args.env)

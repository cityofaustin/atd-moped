"""The script inserts moped_proj_milestones into signal and PHB projects. It was created
to backfill project milestones after implementing the milestone template feature for
AMD: https://github.com/cityofaustin/atd-data-tech/issues/9102.

Usage:
    python create_milestones.py -e local -d 2023-01-01
"""
import argparse

from utils import get_logger, make_hasura_request, TEMPLATE_MILESTONES
from queries import PROJECTS_QUERY, PROJ_MILESTONES_MUTATION
from secrets import HASURA


def main(env, max_date_added):

    logger.info(f"Gettings projects added on or before {max_date_added} in {env} env")

    data = make_hasura_request(
        query=PROJECTS_QUERY,
        variables={"max_date_added": max_date_added},
        endpoint=HASURA["hasura_graphql_endpoint"][env],
        admin_secret=HASURA["hasura_graphql_admin_secret"][env],
    )

    projects = data["moped_project"]
    all_milestones = data["moped_proj_milestones"]

    logger.info(f"{len(projects)} projects to process")

    update_count = 0

    for project in projects:
        project_id = project["project_id"]

        existing_milestone_ids = [
            m["moped_milestone"]["milestone_id"]
            for m in all_milestones
            if m["project_id"] == project_id
        ]

        proj_milestones_new = []

        for m in TEMPLATE_MILESTONES:
            if m["milestone_id"] not in existing_milestone_ids:
                # copy template milestone
                new_milestone = dict(m)
                # add default vals and project ID
                new_milestone.update(
                    {"status_id": 1, "completed": False, "project_id": project_id}
                )
                proj_milestones_new.append(new_milestone)

        if not proj_milestones_new:
            logger.info(f"Project #{project_id}: skipping because it has all milestones")
            continue

        logger.info(
            f"Project #{project_id}: inserting {len(proj_milestones_new)} milestones"
        )

        make_hasura_request(
            query=PROJ_MILESTONES_MUTATION,
            variables={"objects": proj_milestones_new},
            endpoint=HASURA["hasura_graphql_endpoint"][env],
            admin_secret=HASURA["hasura_graphql_admin_secret"][env],
        )["insert_moped_proj_milestones"]

        update_count += 1

    logger.info(f"Created milestones for {update_count} projects")


if __name__ == "__main__":
    logger = get_logger(name="create_milestones")

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-e",
        "--env",
        type=str,
        required=True,
        choices=["local", "staging", "prod"],
        help=f"The environment",
    )
    parser.add_argument(
        "-d",
        "--max-date-added",
        type=str,
        required=True,
        help=f"The maximum project date_added to include in this update. Formatted as a postgres-compliant timestamptz string",
    )

    args = parser.parse_args()

    main(args.env, args.max_date_added)

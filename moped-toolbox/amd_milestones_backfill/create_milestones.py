"""The script inserts moped_proj_milestones into signal and PHB projects. It was created
to backfill project milestones after implementing the milestone template feature for
AMD: https://github.com/cityofaustin/atd-data-tech/issues/9102."""
import argparse

from utils import get_milestones, make_hasura_request
from queries import PROJECTS_QUERY, PROJ_MILESTONES_MUTATION
from secrets import HASURA


def exclude_existing_milestones(proj_milestones_current, proj_milestones_new):
    """Check if a project's existing milestones include any we intend to add. If so
    remove them from the list of new milestones to be added.

    Args:
        proj_milestones_current (list): list of a project's current moped_proj_milestones
        proj_milestones_new (list): list of moped_proj_milestones we intend to add to the
            project

    Returns:
        list: the list of new milestones to add, with existing milestones excluded
    """
    existing_milestone_ids = [
        m["moped_milestone"]["milestone_id"] for m in proj_milestones_current
    ]
    return [
        m
        for m in proj_milestones_new
        if m["milestone_id"] not in existing_milestone_ids
    ]


def main(env, max_date_added):
    if env == "prod" and max_date_added != "2022-06-10":
        raise ValueError(
            """
    Max date must be 2022-06-10 in production, this ensures we capture all projects created up to 
    Moped v1.4 release, including one project created the day of the v1.4 release which needs
    milestones added.
        """
        )
    projects = make_hasura_request(
        query=PROJECTS_QUERY,
        variables={"max_date_added": max_date_added},
        endpoint=HASURA["hasura_graphql_endpoint"][env],
        admin_secret=HASURA["hasura_graphql_admin_secret"][env],
    )["moped_project"]

    for proj in projects:
        proj_milestones_new = get_milestones(project_id=proj["project_id"])
        print("BEFORE MILESTONES", len(proj_milestones_new))

        proj_milestones_new = exclude_existing_milestones(
            proj["moped_proj_milestones"], proj_milestones_new
        )
        print("AFTER MILESTONES", len(proj_milestones_new))
        if not proj_milestones_new:
            continue

        print("todo: error handling")
        results = make_hasura_request(
            query=PROJ_MILESTONES_MUTATION,
            variables={"objects": proj_milestones_new},
            endpoint=HASURA["hasura_graphql_endpoint"][env],
            admin_secret=HASURA["hasura_graphql_admin_secret"][env],
        )["insert_moped_proj_milestones"]
        print(results)


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
    parser.add_argument(
        "-d",
        "--max-date-added",
        type=str,
        required=True,
        help=f"The maximum project date_added to include in this update: YYYY-MM-DD",
    )
    args = parser.parse_args()
    print("TODO: logging")
    main(args.env, args.max_date_added)

import argparse

from utils import get_milestones, make_hasura_request
from queries import PROJECTS_QUERY, PROJ_MILESTONES_MUTATION


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
    projects = make_hasura_request(
        query=PROJECTS_QUERY,
        variables={"max_date_added": max_date_added},
        key="moped_project",
        env=env,
    )

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
            env=env,
            query=PROJ_MILESTONES_MUTATION,
            variables={"objects": proj_milestones_new},
            key="insert_moped_proj_milestones",
        )
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
        help=f"The maximum project date_added which will be used to filter projects to update",
    )
    args = parser.parse_args()
    print("TODO: logging")
    main(args.env, args.max_date_added)

"""Updates the `added_by` column of moped_project records based on the `moped_activity_log`.
This script can safely be run repeatedly as needed."""

import argparse
import json
import requests
from secrets import HASURA_AUTH


PROJECTS_TODO_QUERY = """
query ProjectsWithNoAddedBy {
  moped_project(
    where: {
      _and: {
        added_by: {_is_null: true},
        is_deleted: {_eq: false}
      }
    },
    order_by: { project_id: asc }) {
    project_id
    added_by
    date_added
  }
}
"""

ACTIVITY_LOG_LOOKUP_QUERY = """
query ProjectInsertActivities {
  moped_activity_log(where: {_and: {operation_type: {_eq: "INSERT"}, record_type: {_eq: "moped_project"}}}) {
    record_project_id
    record_type
    updated_by
    moped_user {
      user_id
    }
  }
}
"""

MOPED_USERS_QUERY = """
query AllMopedUsers {
  moped_users {
    first_name
    last_name
    user_id
    cognito_user_id
  }
}
"""

UPDATE_PROJECT_ADDED_BY_MUTATION = """
mutation UpdateProjectAddedBy($project_id: Int!, $added_by: Int!) {
  update_moped_project_by_pk(pk_columns: {project_id: $project_id}, _set: {added_by: $added_by}) {
    added_by
  }
}
"""


def make_hasura_request(*, query, variables, env):
    """Fetch data from hasura

    Args:
        query (str): the hasura query
        env (str): the environment name, which will be used to acces secrets

    Raises:
        ValueError: If no data is returned

    Returns:
        dict: Hasura JSON response data
    """
    admin_secret = HASURA_AUTH["hasura_graphql_admin_secret"][env]
    endpoint = HASURA_AUTH["hasura_graphql_endpoint"][env]
    headers = {
        "X-Hasura-Admin-Secret": admin_secret,
        "content-type": "application/json",
    }
    payload = {"query": query, "variables": variables}
    res = requests.post(endpoint, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)


def main(env):
    projects = make_hasura_request(query=PROJECTS_TODO_QUERY, env=env, variables=None)[
        "moped_project"
    ]
    activities = make_hasura_request(
        query=ACTIVITY_LOG_LOOKUP_QUERY, env=env, variables=None
    )["moped_activity_log"]
    users = make_hasura_request(query=MOPED_USERS_QUERY, env=env, variables=None)[
        "moped_users"
    ]

    # we will attribute AMD projects to ivonne if no user info is available
    amd_user = next(user for user in users if user["first_name"].lower() == "ivonne")
    if not amd_user:
        raise Exception("Unable to find default AMD user")
    amd_user_id = amd_user["user_id"]

    ready = []
    unable_to_process = []

    for proj in projects:
        proj_id = proj["project_id"]
        logs = [l for l in activities if l["record_project_id"] == proj["project_id"]]
        if not logs:
            # some projects are missing logs - presumably to due SQS/event handler failures
            if proj["date_added"].startswith("2022-02-10"):
                # this is an AMD project migrated on 2 Feb 2022
                ready.append({"project_id": proj_id, "added_by": amd_user_id})
                continue
            else:
                unable_to_process.append(
                    {"project_id": proj_id, "reason": "no 'insert' event log found"}
                )
                continue
        # ignore extra logs (there may be dupes due to SQS/event handler bug )
        log = logs[0]
        user = log["moped_user"]

        if not user:
            if proj["date_added"].startswith("2022-02-10"):
                # this is an AMD project migrated on 2 Feb 2022 - it was created without a session token so no user ID was logged
                ready.append({"project_id": proj_id, "added_by": amd_user_id})
                continue
            elif log["updated_by"]:
                # we logged a cognito user ID but it is no longer associated with a user in the DB
                unable_to_process.append(
                    {"project_id": proj_id, "reason": "unknown cognito user ID"}
                )
                continue
            else:
                unable_to_process.append(
                    {"project_id": proj_id, "reason": "no user data"}
                )
                continue
        # this project is ready to go
        user_id = user["user_id"]
        ready.append({"project_id": proj_id, "added_by": user_id})

    counts = {
        "updated": 0,
        "todo": len(ready),
        "unable_to_process": len(unable_to_process),
    }

    print(counts)

    for proj in ready:
        make_hasura_request(
            query=UPDATE_PROJECT_ADDED_BY_MUTATION,
            variables={"project_id": proj["project_id"], "added_by": proj["added_by"]},
            env=env,
        )
        counts["updated"] += 1
        counts["todo"] -= 1
        print(counts)

    print("Writing inoperable projects to 'log.json'")

    with open("log.json", "w") as fout:
        json.dump(unable_to_process, fout, indent=2)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-e",
        "--env",
        type=str,
        choices=["local", "staging", "prod"],
        default="local",
        help=f"Environment",
    )

    args = parser.parse_args()

    main(args.env)

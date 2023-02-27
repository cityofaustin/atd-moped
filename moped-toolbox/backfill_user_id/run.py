"""Updates the `added_by` column of moped_project records based on the `moped_activity_log`.
This script can safely be run repeatedly as needed."""

import argparse
import json
import requests
from secrets import HASURA_AUTH


ACTIVITY_LOG_TODO_QUERY = """
query ActivityWithNoUser {
  moped_activity_log(where: {updated_by_user_id: {_is_null: true}}) {
    activity_id
    updated_by
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

UPDATE_ACTIVITY_USER_MUTATION = """
mutation UpdateActivityUserId($activity_id: uuid!, $updated_by_user_id: Int!) {
  update_moped_activity_log_by_pk(
    pk_columns: {activity_id: $activity_id},
    _set: {updated_by_user_id: $updated_by_user_id}
    ){
    updated_by_user_id
  }
}

"""


def make_hasura_request(*, query, variables, env):
    """Fetch data from hasura

    Args:
        query (str): the hasura query
        variables : variables needed in the query
        env (str): the environment name, which will be used to access secrets

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


def make_user_dict(users):
    user_dict = {}
    for u in users:
        if u["cognito_user_id"] is None:
            continue
        user_dict[u["cognito_user_id"]] = u["user_id"]
    return user_dict


def main(env):
    activities = make_hasura_request(query=ACTIVITY_LOG_TODO_QUERY, env=env, variables=None)[
        "moped_activity_log"
    ]
    users = make_hasura_request(query=MOPED_USERS_QUERY, env=env, variables=None)[
        "moped_users"
    ]

    cognito_lookup = make_user_dict(users)

    ready = []
    unable_to_process = []
    missing_ids = []

    for activity in activities:
        activity_id = activity["activity_id"]
        updated_by_cognito_id = activity["updated_by"]
        try:
            user_id = cognito_lookup[updated_by_cognito_id]
            ready.append({"activity_id": activity_id, "updated_by_user_id": user_id})
        except KeyError:
            unable_to_process.append({"activity_id": activity_id, "cognito_id": updated_by_cognito_id})
            if updated_by_cognito_id not in missing_ids:
                missing_ids.append(updated_by_cognito_id)

    print(unable_to_process)

    counts = {
        "updated": 0,
        "todo": len(ready),
        "unable_to_process": len(unable_to_process),
    }

    print(counts)

    for entry in ready:
        make_hasura_request(
            query=UPDATE_ACTIVITY_USER_MUTATION,
            variables={"activity_id": entry["activity_id"], "updated_by_user_id": entry["updated_by_user_id"]},
            env=env,
        )
        counts["updated"] += 1
        counts["todo"] -= 1
        print(counts)

    # print("Writing inoperable projects to 'log.json'")

    # with open("log.json", "w") as fout:
    #     json.dump(unable_to_process, fout, indent=2)


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

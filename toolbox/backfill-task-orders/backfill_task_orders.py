"""Migrates moped_project.task_order to moped_proj_work activities.task_orders"""
import argparse
import json
import requests
from secrets import HASURA


PROJECT_TASK_ORDER_QUERY = """
{
  moped_project(where: {is_deleted: {_eq: false}, _and: {task_order: {_is_null: false}}}) {
    project_id
    task_order
  }
}
"""

INSERT_WORK_ACTIVITY_MUTATION = """
mutation InsertWorkActivities($objects: [moped_proj_work_activity_insert_input!]!) {
  insert_moped_proj_work_activity(objects: $objects) {
    affected_rows
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
    token = HASURA["token"][env]
    endpoint = HASURA["hasura_graphql_endpoint"][env]
    headers = {
        "Authorization": token,
        "content-type": "application/json",
        "X-Hasura-Role": "moped-admin",
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
    inserts = []
    projects = make_hasura_request(
        query=PROJECT_TASK_ORDER_QUERY, env=env, variables=None
    )["moped_project"]
    for proj in projects:
        project_id = proj["project_id"]
        task_orders = proj["task_order"]
        if not task_orders:
            # shoudl never happen because of filter
            continue
        inserts.append({"project_id": project_id, "task_orders": task_orders})

    print(f"Inserting {len(inserts)} records...")

    insert_count = make_hasura_request(
        query=INSERT_WORK_ACTIVITY_MUTATION, variables={"objects": inserts}, env=env
    )["insert_moped_proj_work_activity"]["affected_rows"]

    print(f"✅ Inserted {insert_count} records")

    with open("results.json", "w") as fout:
        json.dump(projects, fout)

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

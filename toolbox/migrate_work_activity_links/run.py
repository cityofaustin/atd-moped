"""Takes all work activities rows that have work_order_url populated and are not soft deleted and inserts
files and attachments to the original work activity record."""

import argparse
import requests
from secrets import HASURA_AUTH


WORK_ACTIVITIES_TO_MIGRATE_QUERY = """
query WorkActivityRecords {
  moped_proj_work_activity(where: {is_deleted: {_eq: false}, work_order_url: {_is_null: false}}) {
    work_order_url
    id
    project_id
  }
}
"""


ADD_FILE_WITH_WORK_ACTIVITY_CONNECTION_MUTATION = """
mutation InsertFileWithWorkActivityConnection($object: moped_project_files_insert_input!) {
  insert_moped_project_files_one(object: $object) {
    project_file_id
    project_id
    files_project_work_activities {
      id
      entity_id
    }
  }
}
"""


def make_hasura_request(*, query, variables, env):
    """
    Args:
        query (str): the hasura query
        env (str): the environment name, which will be used to access secrets

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


def make_file_name(work_order_url):
    """Using the same logic as getExternalLinkText in editor/src/components/ExternalLink.jsx, defaulting to 'Work order link'"""
    if "https://atd.knack.com/amd" in work_order_url.lower():
        return "AMD Data Tracker"
    if "https://atd.knack.com/signs-markings" in work_order_url.lower():
        return "Signs & Markings"
    return "Work order link"


def main(env, dry_run=False):
    work_activities = make_hasura_request(
        query=WORK_ACTIVITIES_TO_MIGRATE_QUERY, env=env, variables=None
    )["moped_proj_work_activity"]

    new_file_records = []

    for record in work_activities:
        project_id = record["project_id"]
        entity_id = record["id"]
        file_url = record["work_order_url"]
        file_name = make_file_name(record["work_order_url"])

        new_file_records.append(
            {
                "project_id": project_id,
                "file_name": file_name,
                "file_type": 5,  # "work activity links" is file type with id 5
                "file_size": 0,  # required
                "file_url": file_url,
                "files_project_work_activities": {
                    "data": {
                        "entity_id": entity_id,
                        "created_by_user_id": 1,
                        "updated_by_user_id": 1,
                    }
                },
                "created_by_user_id": 1,
                "updated_by_user_id": 1,
            }
        )

    if dry_run:
        print(f"[DRY RUN], would create {len(new_file_records)} files")
    else:
        for new_file in new_file_records:
            response = make_hasura_request(
                query=ADD_FILE_WITH_WORK_ACTIVITY_CONNECTION_MUTATION,
                variables={"object": new_file},
                env=env,
            )["insert_moped_project_files_one"]
            print(
                f"Inserted file {response["project_file_id"]} for project {response["project_id"]}"
            )
        print(f"{len(new_file_records)} files created")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-e",
        "--env",
        type=str,
        choices=["local", "staging", "prod"],
        default="local",
        help=f"Which moped environment to use, defaults to local",
    )

    parser.add_argument(
        "-n",
        "--dry-run",
        action="store_true",
        help="Log what changes would be made without executing them",
    )

    args = parser.parse_args()

    main(args.env, args.dry_run)

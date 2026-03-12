"""Updates the `project_lead_id` column of moped_project records based on the the user who created the project.
This script can safely be run repeatedly as needed."""

import argparse
import json
import requests
from secrets import HASURA_AUTH


PROJECTS_TODO_QUERY = """
query ProjectsWithNoAddedBy {
  moped_project(where: {_and: {project_lead_id: {_is_null: true}, is_deleted: {_eq: false}}}, order_by: {project_id: asc}) {
    project_id
    added_by
    moped_user {
      first_name
      last_name
      moped_workgroup {
        workgroup_id
        workgroup_name
      }
    }
  }
}
"""


ENTITY_LOOKUP_QUERY = """
query MopedEntitiesWithWorkgroup {
  moped_entity {
    entity_id
    entity_name
  }
  moped_workgroup {
    workgroup_name
  }
}
"""

UPDATE_PROJECT_LEAD_MUTATION = """
mutation UpdateProjectAddedBy($project_id: Int!, $project_lead_id: Int!) {
  update_moped_project_by_pk(pk_columns: {project_id: $project_id}, _set: {project_lead_id: $project_lead_id}) {
    project_lead_id
  }
}
"""

# these are the four workgroups accountable for all projects created in production at the time of writing
WORKGROUP_ENTITY_MAP = {
    "Arterial Management": "COA ATD Arterial Management",
    "Project Delivery": "COA ATD Project Delivery",
    "Transportation Engineering": "COA ATD Transportation Engineering",
    "Active Transportation & Street Design": "COA ATD Active Transportation & Street Design",
}


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


def get_entity_id(*, workgroup_name, entities_lookup):
    entity_name = WORKGROUP_ENTITY_MAP.get(workgroup_name)

    if not entity_name:
        # we don't have an entry in our map for this workgroup - possibly created by a DTS user?
        return None
    matching_entity = next(
        e for e in entities_lookup if e["entity_name"] == entity_name
    )
    return matching_entity["entity_id"]


def main(env):
    projects = make_hasura_request(query=PROJECTS_TODO_QUERY, env=env, variables=None)[
        "moped_project"
    ]
    entities_lookup = make_hasura_request(
        query=ENTITY_LOOKUP_QUERY, env=env, variables=None
    )["moped_entity"]
    unable_to_process = []
    ready = []
    for proj in projects:
        proj_id = proj["project_id"]
        try:
            added_by_workgroup = proj["moped_user"]["moped_workgroup"]
        except TypeError:
            unable_to_process.append(
                {"project_id": proj_id, "reason": "no added_by user workgroup"}
            )
            continue
        workgroup_name = added_by_workgroup["workgroup_name"]
        entity_id = get_entity_id(
            entities_lookup=entities_lookup, workgroup_name=workgroup_name
        )
        if not entity_id:
            unable_to_process.append(
                {
                    "project_id": proj_id,
                    "reason": f"unable to match entity to workgroup {workgroup_name}",
                }
            )
            continue
        ready.append({"project_id": proj_id, "project_lead_id": entity_id})

    counts = {
        "updated": 0,
        "todo": len(ready),
        "unable_to_process": len(unable_to_process),
    }

    print(counts)

    for proj in ready:
        make_hasura_request(
            query=UPDATE_PROJECT_LEAD_MUTATION,
            variables={
                "project_id": proj["project_id"],
                "project_lead_id": proj["project_lead_id"],
            },
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

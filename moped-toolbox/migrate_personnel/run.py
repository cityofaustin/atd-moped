import argparse
import requests

from secrets import HASURA_AUTH


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


PROJ_PERSONNEL_QUERY = """
  query GetProjectPersonnel {
    moped_proj_personnel(
      where: {
        _and: [
          { is_deleted: { _eq: false } }
          { _not: { moped_proj_personnel_roles: {} } }
        ]
      }
    ) {
      role_id
      project_personnel_id
      project_id
      user_id
      notes
    }
  }
"""

PROJ_PERSONNEL_UPDATE = """
mutation UpdateProjectPersonnel(
    $id: Int!,
    $object: moped_proj_personnel_set_input!,
    $project_roles: [moped_proj_personnel_roles_insert_input!]!,
    $delete_ids: [Int!]!
  ) {
  update_moped_proj_personnel_by_pk(pk_columns: {project_personnel_id: $id}, _set: $object) {
    project_personnel_id
  }
  insert_moped_proj_personnel_roles(objects: $project_roles) {
    affected_rows
  }
  update_moped_proj_personnel(where: {project_personnel_id: {_in: $delete_ids}}, _set: {is_deleted: true}) {
    affected_rows
  }
}
"""


def get_personnel_index(personnel):
    index = {}
    for p in personnel:
        key = f"{p['project_id']}_{p['user_id']}"
        index.setdefault(key, [])
        index[key].append(p)
    return index


def main(env):
    counts = { "updated": 0, "roles_created": 0, "deleted": 0}
    # fetch all records which do not have any moped_proj_personnel_roles records
    data = make_hasura_request(query=PROJ_PERSONNEL_QUERY, env=env, variables=None)
    personnel = data["moped_proj_personnel"]

    if not personnel:
        # this script can safely be run repeatedly
        print(counts)
        return

    # there are duplicate moped_proj_personnel records, one for each role
    # so group them by unique project_id + user_id combo
    p_index = get_personnel_index(personnel)
    # update these in batches per unique project_id + user_id
    for pers in p_index.values():
        id = pers[0]["project_personnel_id"]
        # we'll keep one personnel record and update it
        updated_pers = {}
        notes = [p["notes"] for p in pers if p["notes"]]
        # string-join notes in the same way the editor used to do it
        updated_pers["notes"] = " ".join(notes) or None
        # create new moped_proj_personnel_roles records, one for each role
        project_roles = [
            {"project_role_id": p["role_id"], "project_personnel_id": id} for p in pers
        ]
        # all but the first record will be soft deleted
        pers_to_delete_ids = None
        if len(pers) > 0:
            pers_to_delete_ids = [p["project_personnel_id"] for p in pers[1:]]

        """ this mutation will:
        1. update one personnel record with the merged notes
        2. insert new moped_proj_personnel_roles records for each role
        3. delete any other personnel records, which are now redundant
        """
        make_hasura_request(
            query=PROJ_PERSONNEL_UPDATE,
            variables={
                "id": id,
                "object": updated_pers,
                "project_roles": project_roles,
                "delete_ids": pers_to_delete_ids,
            },
            env=env,
        )
        counts["updated"] += 1
        counts["roles_created"] += len(project_roles)
        counts["deleted"] += len(pers_to_delete_ids)
        print(counts)

    print(counts)

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

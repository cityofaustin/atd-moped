#!/usr/bin/env python3
"""
Appends SRTS info to project component descriptions by matching SRTS
IDs in a csv file to the moped_proj_components.srts_id column value
"""
import argparse
import csv
import json
import requests
from time import sleep
from secrets import HASURA

csv_filename = "ATSD Moped Issue Tracking - SRTSInfo.csv"

# Query for project components with SRTS ID. This query captures descriptions that are
# null, empty string, or do not start with "SRTS Recommendation:" so we can repeat this
# process if needed without appending SRTS info multiple times to the same record.
GET_COMPONENTS_BY_SRTS_ID = """
query GetProjectComponentsBySrtsId($srts_id: String) {
  moped_proj_components(
    where: { 
      _and: [
        { srts_id: { _eq: $srts_id } }, 
        { _or: [{ description: { _nilike: "%SRTS Recommendation:%" } }, { description: { _is_null: true } }] }
      ]
    }
  ) {
    project_component_id
    description
  }
}
"""

# Mutate project component description to include SRTS info from csv
UPDATE_COMPONENT_DESCRIPTION = """
mutation UpdateProjectComponentDescription($project_component_id: Int!, $description: String) {
    update_moped_proj_components_by_pk(pk_columns: {project_component_id: $project_component_id}, _set: {description: $description}) {
        project_component_id
    }
}
"""


def make_hasura_request(*, query, variables, endpoint, token):
    headers = {
        "authorization": f"Bearer {token}",
        "x-hasura-role": "moped-admin",
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


def get_srts_data_from_csv(filepath):
    rows = []

    with open(filepath) as csv_file:
        reader = csv.DictReader(csv_file)
        for row in reader:
            rows.append(
                {
                    "srts_id": row["SRTS_ID"],
                    "srts_info": row["SRTS Info to add to project description"],
                }
            )

    return rows


# This assumes all rows in the csv have a value for srts_info
def make_updated_component_description(description, srts_info):
    if description == None or len(description) == 0:
        return srts_info
    else:
        return f"{description}\n{srts_info}"


def main(env, token):
    rows = get_srts_data_from_csv(f"data/{csv_filename}")
    print(f"Found {len(rows)} rows in csv file.")

    # Collect updates, SRTS IDs from csv with no match, and mutation errors
    updates = []
    no_match = []
    errors = []

    print(f"Fetching components matching collected SRTS IDs.")
    for row in rows:
        srts_id = row["srts_id"]
        srts_info = row["srts_info"]

        existing_components_matched_by_srts_id = make_hasura_request(
            query=GET_COMPONENTS_BY_SRTS_ID,
            variables={"srts_id": srts_id},
            endpoint=HASURA["HASURA_ENDPOINT"][env],
            token=token,
        )["moped_proj_components"]

        if len(existing_components_matched_by_srts_id) > 0:
            for component in existing_components_matched_by_srts_id:
                project_component_id = component["project_component_id"]
                description = component["description"]

                new_description = make_updated_component_description(
                    description, srts_info
                )

                updates.append(
                    {
                        "project_component_id": project_component_id,
                        "description": new_description,
                    }
                )
        else:
            no_match.append(srts_id)

    print(f"Found {len(updates)} components to update. Updating...")
    for update in updates:
        project_component_id = update["project_component_id"]
        description = update["description"]

        try:
            existing_components_matched_by_srts_id = make_hasura_request(
                query=UPDATE_COMPONENT_DESCRIPTION,
                variables={
                    "project_component_id": project_component_id,
                    "description": description,
                },
                endpoint=HASURA["HASURA_ENDPOINT"][env],
                token=token,
            )["update_moped_proj_components_by_pk"]
        except Exception as e:
            print(f"Error updating component {project_component_id}: {e}")
            errors.append(project_component_id)

        sleep(0.5)

    print("Done.\n")
    print(f"Updated {len(updates)} components.")
    print(
        f"Found {len(no_match)} SRTS IDs in csv with no match in database: {no_match}"
    )
    print(f"Errors on project component IDs: {errors}")


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

    parser.add_argument(
        "-t",
        "--token",
        type=str,
        help=f"Bearer token for Hasura endpoint",
    )

    args = parser.parse_args()

    main(args.env, args.token)

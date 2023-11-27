#!/usr/bin/env python3
"""
Appends SRTS info to project component descriptions by matching SRTS
IDs in a csv file to the moped_proj_components.srts_id column value
"""
import argparse
import csv
import json
import requests
from secrets import HASURA

csv_filename = "ATSD Moped Issue Tracking - SRTSInfo.csv"

# Query for project component with SRTS ID
GET_COMPONENTS_BY_SRTS_ID = """
query GetProjectComponentsBySrtsId($srtsId: String) {
  moped_proj_components(where: {srts_id: {_eq: $srtsId}}) {
    component_id
    description
  }
}
"""

# Mutate project component description to include SRTS info from csv
UPDATE_COMPONENT_DESCRIPTION = """"""


def make_hasura_request(*, query, variables, endpoint, admin_secret):
    headers = {"X-Hasura-Admin-Secret": admin_secret}
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
        csv_reader = csv.reader(csv_file, delimiter=",")

        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                line_count += 1
                continue
            else:
                rows.append({"srts_id": row[0], "info": row[1]})
                line_count += 1

    return rows


def main(env):
    # Consume csv file with SRTS IDs and info to append
    srts_id = "from csv"
    srts_csv_rows = [{"id": "an id", "info": "info"}]

    rows = get_srts_data_from_csv(f"data/{csv_filename}")
    print(f"Found {len(rows)} rows in csv file.")

    # Fetch existing project components that match SRTS IDs and collect info to update
    updates = []

    print(f"Fetching components matching collected SRTS IDs.")
    for row in rows:
        srts_id = row["srts_id"]
        srts_info = row["info"]

        existing_components_matched_by_srts_id = make_hasura_request(
            query=GET_COMPONENTS_BY_SRTS_ID,
            variables={"srtsId": srts_id},
            endpoint=HASURA["HASURA_ENDPOINT"][env],
            admin_secret=HASURA["HASURA_ADMIN_SECRET"][env],
        )["moped_proj_components"]

        if len(existing_components_matched_by_srts_id) > 0:
            for component in existing_components_matched_by_srts_id:
                component_id = component["component_id"]
                description = component["description"]

                # Append SRTS info to existing project component description
                new_description = description

                if len(srts_info) > 0:
                    new_description = f"{description}\n{srts_info}"

                updates.append(
                    {
                        "component_id": component_id,
                        "description": new_description,
                    }
                )

    print(f"Found {len(updates)} components to update.")

    # Mutate project component description to include SRTS info from csv
    for update in updates:
        component_id = update["component_id"]
        description = update["description"]
        srts_info = update["srts_info"]

        # Make request to update component descriptions

    return

    # Fetch existing project components that match an SRTS ID
    # More than one component can match an SRTS ID
    # existing_project_components = make_hasura_request(
    #     query=query,
    #     variables={"srtsId": srts_id},
    #     endpoint=auth[env]["HASURA_ENDPOINT"],
    #     admin_secret=auth[env]["HASURA_ADMIN_SECRET"],
    # )["moped_proj_components"]

    # Collect SRTS IDs from csv with no match to log
    no_match = []

    # Append SRTS info to project component description

    # Mutate project component description to include SRTS info from csv


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

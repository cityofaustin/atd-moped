#!/usr/bin/env python3
"""
Updates project component phase and completion date by matching SRTS
IDs in a csv file to the srts_id and substantial_completion_date column values
in the component_arcgis_online_view DB view.
"""
import argparse
import csv
import json
from datetime import datetime, timezone
from time import sleep
from zoneinfo import ZoneInfo

import requests

from secrets import HASURA

csv_filename = "ATSD Moped Issue Tracking - SRTS Complete IDs.csv"

# Query for project components AGOL view with SRTS ID. This query captures components that
# have not been substantially completed yet and match a given Safe Routes to School ID.
GET_COMPONENTS_BY_SRTS_ID = """
query GetProjectComponentsBySrtsId($srts_id: String) {
  component_arcgis_online_view(
    where: { 
      _and: [
        { srts_id: { _eq: $srts_id } }, 
        { substantial_completion_date: { _is_null: true } }
      ]
    }
  ) {
    project_component_id
    project_id
    component_url
    srts_id
  }
}
"""

# Mutate project component description to include PROJECT_END_DATE (completion_date) from csv
UPDATE_COMPONENT_PHASE_AND_COMPLETION_DATE = """
mutation UpdateProjectComponentDescription($project_component_id: Int!, $completion_date: timestamptz, $phase_id: Int!, $updated_by_user_id: Int!) {
    update_moped_proj_components_by_pk(pk_columns: {project_component_id: $project_component_id}, 
    _set: {phase_id: $phase_id, completion_date: $completion_date, updated_by_user_id: $updated_by_user_id}) {
        project_component_id
    }
}
"""


def convert_to_timezone_aware_timestamp(date_str):
    """
    Converts a date string in the format 'MM/DD/YY' to a timezone-aware
    timestamp in the 'America/Chicago' timezone.

    Args:
        date_str (str): The date string to convert, in the format 'MM/DD/YY'.

    Returns:
        str: The ISO timestamp string in the 'America/Chicago' timezone.
    """
    date_format = "%m/%d/%y"
    parsed_date = datetime.strptime(date_str, date_format)
    parsed_date_tz = parsed_date.replace(tzinfo=ZoneInfo("America/Chicago"))
    timestamptz = parsed_date_tz.isoformat()

    return timestamptz


def make_hasura_request(*, query, variables, endpoint, secret):
    headers = {"X-Hasura-Admin-Secret": secret}
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
                    "completion_date": row["PROJECT_END_DATE"],
                }
            )

    return rows


def save_to_csv(rows, fieldnames, filepath):
    with open(filepath, mode="w", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=fieldnames,
        )
        writer.writeheader()
        writer.writerows(rows)


def main(env, verbose):
    rows = get_srts_data_from_csv(f"data/{csv_filename}")
    print(f"Found {len(rows)} rows in csv file.")

    # Collect updates, SRTS IDs from csv with no match, and mutation errors
    updates = []
    no_match = []
    errors = []

    print(f"Fetching components matching collected SRTS IDs.")
    for row in rows:
        srts_id = row["srts_id"]
        new_completion_date = row["completion_date"]

        if verbose:
            print(f"Checking for components with SRTS ID: {srts_id}")

        existing_components_matched_by_srts_id = make_hasura_request(
            query=GET_COMPONENTS_BY_SRTS_ID,
            variables={"srts_id": srts_id},
            endpoint=HASURA["HASURA_ENDPOINT"][env],
            secret=HASURA["HASURA_ADMIN_SECRET"][env],
        )["component_arcgis_online_view"]

        if len(existing_components_matched_by_srts_id) > 0:
            for component in existing_components_matched_by_srts_id:
                project_component_id = component["project_component_id"]
                project_id = component["project_id"]
                component_url = component["component_url"]
                srts_id = component["srts_id"]

                updates.append(
                    {
                        "project_id": project_id,
                        "project_component_id": project_component_id,
                        "completion_date": new_completion_date,
                        "component_url": component_url,
                        "srts_id": srts_id,
                    }
                )

            if verbose:
                print(
                    f"Found {len(existing_components_matched_by_srts_id)} components with SRTS ID: {srts_id}"
                )
        else:
            if verbose:
                print(f"No components found with SRTS ID: {srts_id}")

            no_match.append(srts_id)

    print(f"Found {len(updates)} components to update. Updating...")

    for update in updates:
        project_component_id = update["project_component_id"]
        completion_date = update["completion_date"]
        timestamp = convert_to_timezone_aware_timestamp(completion_date)

        if verbose:
            print(
                f"Updating component {project_component_id} with completion date: {timestamp}"
            )

        try:
            existing_components_matched_by_srts_id = make_hasura_request(
                query=UPDATE_COMPONENT_PHASE_AND_COMPLETION_DATE,
                variables={
                    "project_component_id": project_component_id,
                    "completion_date": timestamp,
                    # Complete phase
                    "phase_id": 11,
                    # Data and Tech Admin user ID
                    "updated_by_user_id": 1,
                },
                endpoint=HASURA["HASURA_ENDPOINT"][env],
                secret=HASURA["HASURA_ADMIN_SECRET"][env],
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

    # Save updates to a CSV file
    save_to_csv(
        updates,
        [
            "project_id",
            "project_component_id",
            "srts_id",
            "completion_date",
            "component_url",
        ],
        "data/updated_project_components.csv",
    )

    # Save SRTS IDs with no match to a CSV file
    save_to_csv(
        [{"srts_id": srts_id} for srts_id in no_match],
        ["srts_id"],
        "data/srts_ids_no_match.csv",
    )


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
        "-v",
        "--verbose",
        action="store_true",
        help="Enable verbose output",
    )

    args = parser.parse_args()

    main(args.env, args.verbose)

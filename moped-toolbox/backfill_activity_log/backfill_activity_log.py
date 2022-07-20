#!/usr/bin/env python3
"""
Restores missing activity logs by downloading event logs from S3 and dispatching them to
our event log lambda
"""
import argparse
import csv
import os
from io import StringIO
import json

import boto3
import requests


auth = {
    "staging": {
        "MOPED_API_HASURA_APIKEY": "",
        "API_EVENT_ENDPOINT": "",
        "HASURA_ENDPOINT": "",
        "HASURA_ADMIN_SECRET": "",
    },
    "prod": {
        "MOPED_API_HASURA_APIKEY": "",
        "API_EVENT_ENDPOINT": "",
        "HASURA_ENDPOINT": "",
        "HASURA_ADMIN_SECRET": "",
    },
}

os.environ["AWS_ACCESS_KEY_ID"] = ""
os.environ["AWS_SECRET_ACCESS_KEY"] = ""

BUCKET = ""

dates_of_concern = [
    "2022-07-06",
    "2022-07-07",
    "2022-07-08",
    "2022-07-09",
    "2022-07-10",
    "2022-07-11",
    "2022-07-12",
    "2022-07-13",
]

invoc_log_fieldnames = ["id", "event_id", "status", "request", "response", "created_at"]

query = """query GetActivityLogs {
    moped_activity_log(where: {created_at: {_gt: "2022-07-04"}}) {
        activity_id
        record_data
    }
}"""


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


def download_file(client, key):
    """Download a file from S3

    Args:
        client (botocore.client.S3): the boto client
        key (str): the S3 object key
    Returns:
        bytes: the encoded file data
    """
    response = client.get_object(Bucket=BUCKET, Key=key)
    return response["Body"].read()


def format_request(request_raw):
    # load original requestion json from invocation log
    req_dict = json.loads(request_raw)
    headers = {}
    # format headers as requests.get() needs them
    for h in req_dict["headers"]:
        headers[h["name"]] = h.get("value")
    return req_dict["payload"], headers


def main(env):
    client = boto3.client("s3")

    # fetch filenames to process
    prefix = f"backups/atd_moped_{'production' if env == 'prod' else 'staging'}/2022-07"
    response = client.list_objects(Bucket=BUCKET, Prefix=prefix)

    invoc_files = [
        obj["Key"]
        for obj in response["Contents"]
        if "event_invocation_logs.csv" in obj["Key"]
    ]

    all_events = []

    for key in invoc_files:
        # exclude files not in our date range of concern
        file_datestring = key.split("/")[2]
        if file_datestring not in dates_of_concern:
            continue

        print(key)

        # download file and parse CSV to dict
        encoded_file = download_file(client, key)
        if not encoded_file:
            continue

        csv_text = encoded_file.decode()
        f = StringIO(csv_text)
        reader = csv.DictReader(f, fieldnames=invoc_log_fieldnames)

        # accumulate all event records across all files
        all_events.extend([row for row in reader])

    # dedupe events list - its possible that one event triggered multiple invocations due to failures
    # (although u have not seen it happen)
    unique_event_ids = []
    unique_events = []
    for e in all_events:
        if e["event_id"] not in unique_event_ids:
            unique_event_ids.append(e["event_id"])
            unique_events.append(e)

    # fetch existing activity logs
    existing_activity_logs = make_hasura_request(
        query=query,
        variables=None,
        endpoint=auth[env]["HASURA_ENDPOINT"],
        admin_secret=auth[env]["HASURA_ADMIN_SECRET"],
    )["moped_activity_log"]

    # identify which logs have are missing from DB
    existing_event_ids = [row["record_data"]["id"] for row in existing_activity_logs]
    events_todo = [e for e in unique_events if e["event_id"] not in existing_event_ids]

    print(f"Processing {len(events_todo)} events...")
    for event in events_todo:
        payload, headers = format_request(event["request"])
        headers["MOPED_API_APIKEY"] = auth[env]["MOPED_API_HASURA_APIKEY"]
        print(event["event_id"])
        res = requests.post(
            auth[env]["API_EVENT_ENDPOINT"], json=payload, headers=headers
        )
        res.raise_for_status()

    # save results
    with open(f"results_{env}.log", "w") as fout:
        json.dump(events_todo, fout)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-e",
        "--env",
        type=str,
        choices=["staging", "prod"],
        default="staging",
        help=f"Environment",
    )

    args = parser.parse_args()

    raise Exception("""At the time of writing, this script produces duplicated activity
        logs due to flaws in our event handling pipeline.  See discussion here:
        https://github.com/cityofaustin/atd-data-tech/issues/9773""")

    main(args.env)

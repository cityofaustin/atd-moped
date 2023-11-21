#!/usr/bin/env python3
"""
Appends SRTS info to project component descriptions by matching SRTS
IDs in a csv file to the moped_proj_components.srts_id column value
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

# Query for project component with SRTS ID
query = """"""

# Mutate project component description to include SRTS info from csv
mutation = """"""


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


def format_request(request_raw):
    # load original requestion json from invocation log
    req_dict = json.loads(request_raw)
    headers = {}
    # format headers as requests.get() needs them
    for h in req_dict["headers"]:
        headers[h["name"]] = h.get("value")
    return req_dict["payload"], headers


def main(env):
    # Consume csv file with SRTS IDs and info to append

    # Fetch existing project component description
    existing_activity_logs = make_hasura_request(
        query=query,
        variables=None,
        endpoint=auth[env]["HASURA_ENDPOINT"],
        admin_secret=auth[env]["HASURA_ADMIN_SECRET"],
    )["moped_proj_components"]

    # Collect SRTS IDs from csv with no match to log

    # Append SRTS info to project component description

    # Mutate project component description to include SRTS info from csv


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

    raise Exception(
        """At the time of writing, this script produces duplicated activity
        logs due to flaws in our event handling pipeline.  See discussion here:
        https://github.com/cityofaustin/atd-data-tech/issues/9773"""
    )

    main(args.env)

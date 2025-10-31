#!/usr/bin/env python3
"""
Fetch eCAPRIS funding records from the ODP and sync to Moped moped_proj_funding table
"""
import os
import sys
import logging

from process.request import make_hasura_request
from process.queries import GRAPHQL_QUERIES
from process.logging import get_logger
from process.time import convert_to_timezone_aware_timestamp


def main():
    # Funding records have three types:
    # 1. Manual entered (syncing will ignore these, completely manual)
    # 2. Imported (syncing will ignore these and not duplicate, amount can be overridden and not details automatically updated)
    # 3. Synced (sync all FDUs that aren't already present on the project: legacy or new; amount cannot be overriden)

    # 1. Get list of projects need syncing (have eCAPRIS subproject ID and should_sync_ecapris_funding is true)
    results = make_hasura_request(
        query=GRAPHQL_QUERIES["subprojects_to_query_for_funding"]
    )
    print(results)
    # 2. For each project, query ODP endpoint for FDUs for that subproject ID
    # 3. For each FDU, check if it already exists on the project
    # 4. If it doesn't exist, insert it as a synced FDU
    # 5. If it does exist, skip it


if __name__ == "__main__":
    log_level = logging.DEBUG
    logger = get_logger(name="moped-ecapris-funding-sync", level=log_level)
    logger.info(
        f"Starting sync. Transferring eCapris funding records from ODP to Moped DB."
    )

    main()

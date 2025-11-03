#!/usr/bin/env python3
"""
Fetch eCAPRIS funding records from the ODP and sync to Moped moped_proj_funding table
"""
import os
import sys
import logging
import sodapy

from process.args import get_cli_args
from process.logging import get_logger
from process.queries import GRAPHQL_QUERIES
from process.request import make_hasura_request

SO_WEB = os.getenv("SO_WEB")
SO_TOKEN = os.getenv("SO_TOKEN")
SO_USER = os.getenv("SO_USER")
SO_PASS = os.getenv("SO_PASS")
FUNDING_DATASET_IDENTIFIER = os.getenv("FUNDING_DATASET_IDENTIFIER")
CHUNK_SIZE = os.getenv("CHUNK_SIZE", 500)


def get_socrata_client():
    return sodapy.Socrata(
        SO_WEB,
        SO_TOKEN,
        username=SO_USER,
        password=SO_PASS,
        timeout=60,
    )


def main(args):
    # Funding records have three types:
    # 1. Manual entered (syncing will ignore these, completely manual)
    # 2. Imported (syncing will ignore these and not duplicate, amount can be overridden and not details automatically updated)
    # 3. Synced (sync all FDUs that aren't already present on the project: legacy or new; amount cannot be overriden)

    # 1. Get list of projects need syncing
    results = make_hasura_request(
        query=GRAPHQL_QUERIES["subprojects_to_query_for_funding"]
    )

    # eCapris subproject IDs are de-duplicated in the GraphQL query
    distinct_project_ecapris_ids = [
        project["ecapris_subproject_id"] for project in results["moped_project"]
    ]
    logger.info(
        f"Found {len(distinct_project_ecapris_ids)} unique eCapris subproject IDs to sync: {', '.join(distinct_project_ecapris_ids)}"
    )

    # 2. Query ODP for all funding records and make list of records to upsert into Moped DB
    socrata_client = get_socrata_client()

    # Fetch all funding records from ODP
    logger.info(f"Fetching all eCAPRIS funding records from ODP...")
    ecapris_funding_records = socrata_client.get(
        FUNDING_DATASET_IDENTIFIER, limit=100000
    )

    logger.info(
        f"Fetched {len(ecapris_funding_records)} total eCAPRIS funding records from ODP."
    )

    # Upsert into the ecapris_subproject_funding table
    funding_records_to_upsert = []

    for record in ecapris_funding_records:
        funding_records_to_upsert.append(
            {
                "ecapris_subproject_id": record.get("sp_number"),
                "fao_id": record.get("fao_id"),
                "fdu": record.get("fdu"),
                "funding_amount": int(float(record.get("app", 0))),
                "unit_long_name": record.get("unit_long_name"),
                "subprogram": record.get("subprogram"),
                "program": record.get("program"),
            }
        )

    logger.info(f"Built {len(funding_records_to_upsert)} funding records to upsert.")

    # 3. Upsert records into Moped DB
    for chunk in range(0, len(funding_records_to_upsert), CHUNK_SIZE):
        chunk_payload = funding_records_to_upsert[chunk : chunk + CHUNK_SIZE]
        logger.info(
            f"Upserting chunk of {len(chunk_payload)} funding records into Moped DB..."
        )

        if args.dry_run:
            logger.info(
                f"[DRY RUN] Would upsert chunk of {len(chunk_payload)} funding records into Moped DB..."
            )
        else:
            logger.info(
                f"Upserting chunk of {len(chunk_payload)} funding records into Moped DB..."
            )
            results = make_hasura_request(
                query=GRAPHQL_QUERIES["project_funding_upsert"],
                variables={"objects": chunk_payload},
            )


if __name__ == "__main__":
    log_level = logging.DEBUG
    logger = get_logger(name="moped-ecapris-funding-sync", level=log_level)
    logger.info(
        f"Starting sync. Transferring eCapris funding records from ODP to Moped DB."
    )

    args = get_cli_args()

    main(args)

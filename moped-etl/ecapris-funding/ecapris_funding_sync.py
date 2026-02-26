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
from process.format import format_sp_number

SOCRATA_ENDPOINT = os.getenv("SOCRATA_ENDPOINT")
SOCRATA_TOKEN = os.getenv("SOCRATA_TOKEN")
SOCRATA_API_KEY_ID = os.getenv("SOCRATA_API_KEY_ID")
SOCRATA_API_KEY_SECRET = os.getenv("SOCRATA_API_KEY_SECRET")
FUNDING_DATASET_IDENTIFIER = os.getenv("FUNDING_DATASET_IDENTIFIER")
CHUNK_SIZE = os.getenv("CHUNK_SIZE", 500)


def get_socrata_client():
    return sodapy.Socrata(
        SOCRATA_ENDPOINT,
        SOCRATA_TOKEN,
        username=SOCRATA_API_KEY_ID,
        password=SOCRATA_API_KEY_SECRET,
        timeout=60,
    )


def main(args):
    # Query ODP for all funding records and make list of records to upsert into Moped DB
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
        # Update eCAPRIS subproject id with trailing zero to match eCAPRIS format
        sp_number = record.get("sp_number")
        ecapris_subproject_id = format_sp_number(sp_number)

        funding_records_to_upsert.append(
            {
                "ecapris_subproject_id": ecapris_subproject_id,
                "fao_id": record.get("fao_id"),
                "fdu": record.get("fdu"),
                "app": int(float(record.get("app", 0))),
                "unit_long_name": record.get("unit_long_name"),
                "subprogram": record.get("subprogram"),
                "program": record.get("program"),
                "created_by_user_id": 1,
                "updated_by_user_id": 1,
                "fdu_status": record.get("fdu_status"),
                "bond_year": record.get("bond_year"),
            }
        )

    logger.info(f"Built {len(funding_records_to_upsert)} funding records to upsert.")

    # Upsert records into Moped DB
    for chunk in range(0, len(funding_records_to_upsert), CHUNK_SIZE):
        chunk_payload = funding_records_to_upsert[chunk : chunk + CHUNK_SIZE]

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

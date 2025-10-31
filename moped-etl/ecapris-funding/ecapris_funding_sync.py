#!/usr/bin/env python3
"""
Fetch eCAPRIS funding records from the ODP and sync to Moped moped_proj_funding table
"""
import os
import sys
import logging
import sodapy

from process.request import make_hasura_request
from process.queries import GRAPHQL_QUERIES
from process.logging import get_logger

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


def main():
    # Funding records have three types:
    # 1. Manual entered (syncing will ignore these, completely manual)
    # 2. Imported (syncing will ignore these and not duplicate, amount can be overridden and not details automatically updated)
    # 3. Synced (sync all FDUs that aren't already present on the project: legacy or new; amount cannot be overriden)

    # 1. Get list of projects need syncing (have eCAPRIS subproject ID and should_sync_ecapris_funding is true)
    results = make_hasura_request(
        query=GRAPHQL_QUERIES["subprojects_to_query_for_funding"]
    )

    project_ids_to_sync = [
        project["project_id"] for project in results["moped_project"]
    ]
    unique_ecapris_ids = set(
        project["ecapris_subproject_id"] for project in results["moped_project"]
    )

    logger.info(
        f"Found {len(project_ids_to_sync)} projects to sync funding for with {len(unique_ecapris_ids)} unique eCAPRIS subproject ids."
    )

    # 2. Query ODP for all funding records and make list of records to upsert into Moped DB
    socrata_client = get_socrata_client()

    # Build mapping of eCAPRIS subproject ID to Moped project IDs
    ecapris_subproject_id_to_project_ids = {}
    for project in results["moped_project"]:
        ecapris_id = project["ecapris_subproject_id"]
        project_id = project["project_id"]

        if ecapris_id not in ecapris_subproject_id_to_project_ids:
            ecapris_subproject_id_to_project_ids[ecapris_id] = []

        ecapris_subproject_id_to_project_ids[ecapris_id].append(project_id)

    # Fetch all funding records from ODP
    logger.info(f"Fetching all eCAPRIS funding records from ODP...")
    ecapris_funding_records = socrata_client.get(
        FUNDING_DATASET_IDENTIFIER, limit=100000
    )

    logger.info(
        f"Fetched {len(ecapris_funding_records)} total eCAPRIS funding records from ODP."
    )

    # Use map of eCAPRIS subproject ID to project IDs to build list of funding records to upsert
    funding_records_to_upsert = []

    for ecapris_id, project_ids in ecapris_subproject_id_to_project_ids.items():
        # Filter funding records for this eCAPRIS subproject ID
        matching_funding_records = [
            record
            for record in ecapris_funding_records
            if record.get("sp_number") == ecapris_id
        ]

        if not matching_funding_records:
            logger.info(
                f"No funding records found for eCAPRIS subproject ID {ecapris_id}."
            )
            continue

        for project_id in project_ids:
            for record in matching_funding_records:
                funding_records_to_upsert.append(
                    {
                        "project_id": project_id,
                        "ecapris_funding_id": record.get("fao_id"),
                        "fdu": record.get("fdu"),
                        "description": "Synced from eCAPRIS",
                        "amount": float(record.get("app", 0)),
                        "is_synced_from_ecapris": True,
                        "unit_long_name": record.get("unit_long_name"),
                    }
                )

    # 3. Upsert records into Moped DB
    for chunk in range(0, len(funding_records_to_upsert), CHUNK_SIZE):
        chunk_payload = funding_records_to_upsert[chunk : chunk + CHUNK_SIZE]
        logger.info(
            f"Upserting chunk of {len(chunk_payload)} funding records into Moped DB..."
        )

        results = make_hasura_request(
            query=GRAPHQL_QUERIES["project_funding_upsert"],
            variables={"objects": chunk_payload},
        )


if __name__ == "__main__":
    # TODO: Add dry run -n flag

    log_level = logging.DEBUG
    logger = get_logger(name="moped-ecapris-funding-sync", level=log_level)
    logger.info(
        f"Starting sync. Transferring eCapris funding records from ODP to Moped DB."
    )

    main()

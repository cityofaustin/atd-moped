#!/usr/bin/env python3
"""
Fetch ecapris status records from the FSD Data Warehouse and sync to Moped ecapris_subproject_statuses table
"""
import os
import sys
import logging

import oracledb as cx_Oracle

from process.request import make_hasura_request
from process.queries import GRAPHQL_QUERIES, ORACLE_QUERIES
from process.logging import get_logger
from process.time import convert_to_timezone_aware_timestamp

# FSD Data Warehouse
ORACLE_USER = os.getenv("ORACLE_USER")
ORACLE_PASSWORD = os.getenv("ORACLE_PASSWORD")
ORACLE_HOST = os.getenv("ORACLE_HOST")
ORACLE_PORT = os.getenv("ORACLE_PORT")
ORACLE_SERVICE = os.getenv("ORACLE_SERVICE")


def get_conn(host, port, service, user, password):
    # Ensure client uses UTF-8 so the Oracle client converts from DB charset (e.g., WE8MSWIN1252)
    os.environ.setdefault("NLS_LANG", "AMERICAN_AMERICA.AL32UTF8")

    # Initialize thick client if available; otherwise fall back to thin mode
    try:
        cx_Oracle.init_oracle_client()
        logging.getLogger("moped-ecapris-statuses-sync").debug(
            "Initialized Oracle thick client."
        )
    except Exception as init_err:
        logging.getLogger("moped-ecapris-statuses-sync").debug(
            f"Oracle thick client not initialized, using thin mode: {init_err}"
        )

    # Prefer modern keyword args over makedsn; cast port to int
    try:
        port_int = int(port) if port is not None else None
    except (TypeError, ValueError):
        raise ValueError(f"Invalid ORACLE_PORT value: {port!r}. Must be an integer.")

    return cx_Oracle.connect(
        user=user,
        password=password,
        host=host,
        port=port_int,
        service_name=service,
    )


def main():
    # Connect to Moped DB and get distinct eCapris subproject IDs set on any project
    results = make_hasura_request(query=GRAPHQL_QUERIES["subproject_statuses"])

    # eCapris subproject IDs are de-duplicated in the GraphQL query
    distinct_project_ecapris_ids = [
        project["ecapris_subproject_id"] for project in results["moped_project"]
    ]
    logger.info(
        f"Found {len(distinct_project_ecapris_ids)} unique eCapris subproject IDs to sync: {', '.join(distinct_project_ecapris_ids)}"
    )

    # Connect to Oracle DB and query status updates matching those subproject IDs
    conn = get_conn(
        ORACLE_HOST, ORACLE_PORT, ORACLE_SERVICE, ORACLE_USER, ORACLE_PASSWORD
    )
    cursor = conn.cursor()
    cursor.prepare(ORACLE_QUERIES["subproject_statuses"])

    # Loop through the distinct project eCapris IDs, query the status updates, and collect them by id
    statuses_by_ecapris_id = {}
    no_result_ids = []

    for i, sp_number in enumerate(distinct_project_ecapris_ids):
        cursor.execute(None, sp_number=sp_number)

        if i == 0:
            # Use a row factory to convert the results to a list of dictionaries with k/v pairs
            # See https://python-oracledb.readthedocs.io/en/latest/user_guide/sql_execution.html#changing-query-results-with-rowfactories
            columns = [col.name for col in cursor.description]
            cursor.rowfactory = lambda *args: dict(zip(columns, args))

        results = cursor.fetchall()

        if len(results) > 0:
            statuses_by_ecapris_id[sp_number] = results
        else:
            no_result_ids.append(sp_number)

    logger.info(f"No results for eCapris IDs: {', '.join(no_result_ids)}")

    # Loop through the eCapris IDs and upsert the status updates into the Moped DB
    updated_ecapris_ids = []

    for ecapris_id, statuses in statuses_by_ecapris_id.items():
        payload = []

        for status in statuses:
            review_timestamp = status["STATUS_REVIEW_DATE"]
            timezone_aware_review_timestamp = convert_to_timezone_aware_timestamp(
                review_timestamp
            )

            payload.append(
                {
                    "subproject_status_id": status["SUB_PROJECT_STATUS_ID"],
                    "subproject_name": status["SP_NAME"],
                    "ecapris_subproject_id": status["SP_NUMBER"],
                    "current_status_fl": status["CURR_STATUS_FL"],
                    "sub_project_status_desc": status["SUB_PROJECT_STATUS_DESC"],
                    "review_timestamp": timezone_aware_review_timestamp,
                    "subproject_status_impacts": status["SUB_PROJECT_STATUS_IMPACTS"],
                    "summary_description": status["SUMM_DESC"],
                    "reviewed_by_name": status["REVIEWED_BY"],
                    "reviewed_by_email": status["REVIEWED_BY_EMAIL"],
                }
            )

        results = make_hasura_request(
            query=GRAPHQL_QUERIES["subproject_statuses_upsert"],
            variables={"objects": payload},
        )

        if len(results["insert_ecapris_subproject_statuses"]["returning"]) > 0:
            updated_ecapris_ids.append(ecapris_id)

    if len(updated_ecapris_ids) == 0:
        logger.info(
            "No new eCapris statuses were found for subproject IDs associated with Moped projects."
        )
    else:
        logger.info(
            f"Upserted eCapris statuses for eCapris IDs: {', '.join(updated_ecapris_ids)}"
        )


if __name__ == "__main__":
    log_level = logging.DEBUG
    logger = get_logger(name="moped-ecapris-statuses-sync", level=log_level)
    logger.info(
        f"Starting sync. Transferring eCapris status updates from FSD Data Warehouse to Moped DB."
    )

    main()

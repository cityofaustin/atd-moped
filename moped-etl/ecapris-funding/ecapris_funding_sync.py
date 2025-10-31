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
    # Need to run this once if you want to work locally
    # Change lib_dir to your cx_Oracle library location
    # https://stackoverflow.com/questions/56119490/cx-oracle-error-dpi-1047-cannot-locate-a-64-bit-oracle-client-library
    # lib_dir = r"/Users/charliehenry/instantclient_23_3"
    # cx_Oracle.init_oracle_client(lib_dir="/Users/atd/lib/oracle/instantclient_23_3")
    cx_Oracle.init_oracle_client()
    dsn_tns = cx_Oracle.makedsn(host, port, service_name=service)
    return cx_Oracle.connect(user=user, password=password, dsn=dsn_tns)


def main():
    # 1. Manual entered (syncing will ignore these, completely manual)
    # 2. Imported (syncing will ignore these and not duplicate, amount can be overridden and not details automatically updated)
    # 3. Synced (sync all FDUs that aren't already present on the project: legacy or new; amount cannot be overriden)
    print("TBD")

    # 1. Find existing legacy FDUs
    # 2. Get list of projects need syncing (have eCAPRIS subproject ID and should_sync_ecapris_funding is true)
    # 3. For each project, query Socrata endpoint for FDUs for that subproject ID
    # 4. For each FDU, check if it already exists on the project
    # 5. If it doesn't exist, insert it as a synced FDU
    # 6. If it does exist, skip it


if __name__ == "__main__":
    log_level = logging.DEBUG
    logger = get_logger(name="moped-ecapris-funding-sync", level=log_level)
    logger.info(
        f"Starting sync. Transferring eCapris funding updates from FSD Data Warehouse to Moped DB."
    )

    main()

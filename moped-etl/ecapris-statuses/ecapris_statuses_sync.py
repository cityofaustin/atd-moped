#!/usr/bin/env python3
# docker run -it --rm --env-file env_file -v /Users/john/Dropbox/atd/atd-finance-data:/app  atddocker/atd-finance-data:production /bin/bash
"""
Fetch ecapris status records from the FSD Data Warehouse and sync to Moped projects
"""
import os
import sys
import logging

import oracledb as cx_Oracle

from process.request import make_hasura_request
from process.queries import GRAPHQL_QUERIES, ORACLE_QUERIES
from process.logging import get_logger

# FSD Data Warehouse
ORACLE_USER = os.getenv("ORACLE_USER")
ORACLE_PASSWORD = os.getenv("ORACLE_PASSWORD")
ORACLE_HOST = os.getenv("ORACLE_HOST")
ORACLE_PORT = os.getenv("ORACLE_PORT")
ORACLE_SERVICE = os.getenv("ORACLE_SERVICE")

# Moped GraphQL Endpoint

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
    # TODO: Connect to Moped DB and get eCapris subproject IDs
    # TODO: Connect to Oracle DB and query status updates matching those subproject IDs
    # TODO: Update Moped DB with new status updates (if not already present - check by unique status ID)
    projects = make_hasura_request(query=GRAPHQL_QUERIES["subproject_statuses"])
    
    ecapris_subproject_ids = [project["ecapris_subproject_id"] for project in projects["moped_project"]]
    deduped_ecapris_subproject_ids = set(ecapris_subproject_ids)
    print(f"Found {len(ecapris_subproject_ids)} eCapris subproject IDs to sync.")
    
    conn = get_conn(ORACLE_HOST, ORACLE_PORT, ORACLE_SERVICE, ORACLE_USER, ORACLE_PASSWORD)
    cursor = conn.cursor()
    cursor.prepare(QUERIES["subproject_statuses"])

    for sp_number in ecapris_subproject_ids:
        cursor.execute(None, sp_number=sp_number)  # Bind the parameter
        results = cursor.fetchall()
        print(results)

if __name__ == "__main__":
    log_level = logging.DEBUG
    logger = get_logger(name="moped-knack-sync", level=log_level)
    logger.info(
        f"Starting sync. Transferring eCapris status updates from FSD Data Warehouse to Moped DB."
    )

    main()
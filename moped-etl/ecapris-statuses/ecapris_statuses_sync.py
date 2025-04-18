#!/usr/bin/env python3
# docker run -it --rm --env-file env_file -v /Users/john/Dropbox/atd/atd-finance-data:/app  atddocker/atd-finance-data:production /bin/bash
"""
Fetch ecapris status records from the FSD Data Warehouse and sync to Moped projects
"""

import oracledb as cx_Oracle

def get_conn(host, port, service, user, password):
    # Need to run this once if you want to work locally
    # Change lib_dir to your cx_Oracle library location
    # https://stackoverflow.com/questions/56119490/cx-oracle-error-dpi-1047-cannot-locate-a-64-bit-oracle-client-library
    # lib_dir = r"/Users/charliehenry/instantclient_23_3"
    cx_Oracle.init_oracle_client()
    dsn_tns = cx_Oracle.makedsn(host, port, service_name=service)
    return cx_Oracle.connect(user=user, password=password, dsn=dsn_tns)

def main():
    # TODO: Env file
    # TODO: Connect to Moped DB and get eCapris subproject IDs
    # TODO: Connect to Oracle DB and query status updates matching those subproject IDs
    # TODO: Update Moped DB with new status updates (if not already present - check by unique status ID)
    conn = get_conn(HOST, PORT, SERVICE, USER, PASSWORD)
    # query = QUERIES[name]
    cursor = conn.cursor()

if __name__ == "__main__":
    log_level = logging.DEBUG
    logger = get_logger(name="moped-knack-sync", level=log_level)
    logger.info(
        f"Starting sync. Transferring eCapris status updates from FSD Data Warehouse to Moped DB."
    )

    main()
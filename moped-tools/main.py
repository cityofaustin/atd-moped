import pdb
import csv
import json
import jaydebeapi

from graphql import run_query

# Import cleanup functions
from moped_project import moped_project_process
from moped_users import moped_user_process


# Maybe change this to be dynamic by accepting a command line parameter?
db_path = "/app/database.mdb"

# JDBC Database Drivers
ucanaccess_jars = [
    "/app/jdbc/ucanaccess-5.0.1.jar",
    "/app/jdbc/lib/commons-lang3-3.8.1.jar",
    "/app/jdbc/lib/commons-logging-1.2.jar",
    "/app/jdbc/lib/hsqldb-2.5.0.jar",
    "/app/jdbc/lib/jackcess-3.0.1.jar",
]

# Class path
classpath = ":".join(ucanaccess_jars)

print("Connecting to the database...")
# Establish connection object using drivers
db_connection = jaydebeapi.connect(
    "net.ucanaccess.jdbc.UcanaccessDriver",
    f"jdbc:ucanaccess://{db_path};newDatabaseVersion=V2010",
    ["", ""],
    classpath,
)

print("Database connection established")

# Every step is followed in order. This configuration
# can get very long, maybe it's best to use python
# comprehensions to distribute these settings.
process_list = [
    # moped_project_process,
    moped_user_process,
]

# Processes a single record
def process_record(record: dict, graphql: str, cleanup: callable):
    if cleanup is not None:
        record = cleanup(record)

    response = run_query(object=record, query=graphql)

    print(f"Record: {json.dumps(record)}")
    print(f"Query: {graphql}")
    print(f"Response: {json.dumps(response)}")


#
# For every table configuration in process_list...
#
for process in process_list:
    db_rows = []

    print(f"Working on: {process['table']}")

    # Establish new cursor
    db_cursor = db_connection.cursor()
    # Execute SQL on cursor
    db_cursor.execute(process["sql"])
    # Iterate through the cursor
    for row in db_cursor.fetchall():
        db_rows.append(row)

    # Transform (or Map) every individual record from type tuple into dictionary
    data_records = list(map(process["transform"], db_rows))

    # For every individual record
    for record in data_records:
        # Go ahead and process it
        process_record(
            record=record, graphql=process["graphql"], cleanup=process["cleanup"]
        )
        print("--------------------------------")

    db_cursor.close()

db_connection.close()

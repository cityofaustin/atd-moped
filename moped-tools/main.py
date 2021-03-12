import pdb
import csv
import json
import jaydebeapi

from graphql import run_query

# Import cleanup functions
from moped_project import moped_project_cleanup


# Maybe change this to be dynamic by accepting a command line parameter?
db_path="/app/database.mdb"

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

# Establish connection object using drivers
db_connection = jaydebeapi.connect(
    "net.ucanaccess.jdbc.UcanaccessDriver",
    f"jdbc:ucanaccess://{db_path};newDatabaseVersion=V2010",
    ["", ""],
    classpath
)

# Every step is followed in order. This configuration
# can get very long, maybe it's best to use python
# comprehensions to distribute these settings.
process_list = [
    {
        # Lave it here for now...
        "table": "projects",

        # SQL Query (the order of the columns affects the lambda function below)
        "sql": "SELECT ProjectID,ProjectName,Description,PhaseSimple,ProjectInitiationDate,ECapris_ProjectID FROM PROJECTS",

        # Basically, this lambda function will rename the keys
        # so that it's compatible with Hasura by creating/replacing
        # the current object with a new one.
        "transform": lambda row: {
            "project_id": row[0],
            "project_name": row[1],
            "project_description": row[2],
            "current_status": row[3],
            "start_date": row[4],
            "eCapris_id": row[5],
            # We need it to be false if ecapris is empty
            "capitally_funded": False if row[5] == "" else True
        },

        # Special rules that cannot be put here
        "cleanup": moped_project_cleanup,

        # Mutation Template
        "graphql": """
            mutation MigrateMopedProjects($object: moped_project_insert_input!) {
                insert_moped_project(
                    objects: [$object],
                    on_conflict: {
                        constraint: moped_project_pkey,
                        update_columns: [
                            project_name,
                            project_description,
                            current_status,
                            start_date,
                            eCapris_id,
                            capitally_funded,
                        ]
                    }
                ) {
                    affected_rows
                }
            }
        """
    },
]

# Processes a single record
def process_record(record: dict, graphql: str, cleanup: callable):
    record = cleanup(record)

    response = run_query(
        object=record,
        query=graphql
    )

    print(f"Record: {json.dumps(record)}")
    print(f"Query: {graphql}")
    print(f"Response: {json.dumps(response)}")


#
# For every table configuration in process_list...
#
for process in process_list:
    db_rows = []

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
            record=record,
            graphql=process["graphql"],
            cleanup=process["cleanup"]
        )
        print("--------------------------------")
        

import csv
import json
import subprocess
import io

from graphql import run_query

# Import cleanup functions
from moped_project import moped_project_cleanup


# Maybe change this to be dynamic by accepting a command line parameter?
database_file_name="database.mdb"

# Every step is followed in order. This configuration
# can get very long, maybe it's best to use python
# comprehensions to distribute these settings.
process_list = [
    {
        "table": "projects",
        # Basically, this lambda function will rename the keys
        # so that it's compatible with Hasura by creating/replacing
        # the current object with a new one.
        "transform": lambda accdb: {
            "project_id": accdb["ProjectID"],
            "project_name": accdb["ProjectName"],
            "project_description": accdb["Description"],
            "current_status": accdb["PhaseSimple"],
            "start_date": accdb["ProjectInitiationDate"],
            "eCapris_id": accdb["ECapris_ProjectID"],
            # We need it to be false if ecapris is empty
            "capitally_funded": False if accdb["ECapris_ProjectID"] == "" else True
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
    # Run mdb-export to retrieve the CSV for a table
    data_raw = subprocess.run(["mdb-export", database_file_name, process["table"]], stdout=subprocess.PIPE).stdout.decode('utf-8')

    # Convert the CSV output into JSON
    data_json = csv.DictReader(io.StringIO(data_raw))

    # Turn JSON into a dictionary list object
    data_dict = json.loads(json.dumps(list(data_json)))

    # Transform (or Map) every individual record in data_dict using the transform lambda function
    data_records = list(map(process["transform"], data_dict))

    # For every individual record
    for record in data_records:
        # Go ahead and process it
        process_record(
            record=record,
            graphql=process["graphql"],
            cleanup=process["cleanup"]
        )

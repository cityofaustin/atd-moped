#!/usr/bin/python3

import os

# the usual suspects
import knackpy
import psycopg2

# using this extras library to enable dictionary like behavior on db results
from psycopg2 import (
    extras,
)

# get connected to a postgres database
pg = psycopg2.connect(
    host=os.getenv("MOPED_RR_HOSTNAME"),
    database=os.getenv("MOPED_RR_DATABASE"),
    user=os.getenv("MOPED_RR_USERNAME"),
    password=os.getenv("MOPED_RR_PASSWORD"),
)

# instantiate our knackpy client
knack = knackpy.App(
    app_id=os.getenv("KNACK_APP_ID"), api_key=os.getenv("KNACK_API_KEY")
)

# pull a copy of all the projects in the projects table
records = knack.get(os.getenv("KNACK_PROJECT_VIEW"))

# iterate over all knack projects
for knack_record in records:

    # only operate on knack projects which have an associated moped project
    if knack_record[os.getenv("KNACK_MOPED_ID_FIELD")]:
        # make a little whitespace to show iterations in STDOUT
        print()

        # extract the moped_project.project_id value
        project_id = knack_record[os.getenv("KNACK_MOPED_ID_FIELD")]

        # get the moped record in question out of the DB
        sql = """
          select * 
          from moped_project
          where project_id = %s
          """
        cursor = pg.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(sql, (project_id,))
        moped_db_record = cursor.fetchone()
        cursor.close()

        # No sense in continuing if we can't find one. This can happen when
        # you have development environment-like situations where knack and
        # the pg database are not from the same lineage of data.
        if not moped_db_record:
            continue

        print("Project Name from DB: ", moped_db_record["project_name"])

        print(
            "Knack data prior to update: ",
            knack_record[os.getenv("KNACK_MOPED_URL_FIELD")],
        )

        # build out payload to send to knack
        knack_payload = {
            "id": knack_record["id"],
            os.getenv("KNACK_MOPED_URL_FIELD"): {
                "url": knack_record[os.getenv("KNACK_MOPED_URL_FIELD")]["url"],
                "label": moped_db_record["project_name"]
                if moped_db_record["project_name"]
                else "View project in the Moped application",
            },
        }

        print(
            "URL Payload to be sent to Knack: ",
            knack_payload[os.getenv("KNACK_MOPED_URL_FIELD")],
        )

        # execute update of knack record:w
        record = knack.record(
            method="update", data=knack_payload, obj=os.getenv("KNACK_PROJECT_VIEW")
        )

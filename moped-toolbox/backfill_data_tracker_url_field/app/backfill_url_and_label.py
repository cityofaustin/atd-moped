#!/usr/bin/python3

import os

import knackpy
import psycopg2

from psycopg2 import (
    extras,
)

pg = psycopg2.connect(
    host=os.getenv("MOPED_RR_HOSTNAME"),
    database=os.getenv("MOPED_RR_DATABASE"),
    user=os.getenv("MOPED_RR_USERNAME"),
    password=os.getenv("MOPED_RR_PASSWORD"),
)

knack = knackpy.App(
    app_id=os.getenv("KNACK_APP_ID"), api_key=os.getenv("KNACK_API_KEY")
)

records = knack.get(os.getenv("KNACK_PROJECT_VIEW"))

for knack_record in records:
    if knack_record["moped_project_id"] == "156":
        continue
    if knack_record[os.getenv("KNACK_MOPED_ID_FIELD")]:
        print()
        project_id = knack_record[os.getenv("KNACK_MOPED_ID_FIELD")]
        sql = """
          select * 
          from moped_project
          where project_id = %s
          """
        cursor = pg.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cursor.execute(sql, (project_id,))
        moped_db_record = cursor.fetchone()
        if not moped_db_record:
            continue
        cursor.close()

        # print(moped_db_record)
        print(moped_db_record["project_name"])

        knack_data = dict(knack_record)
        print(knack_data[os.getenv("KNACK_MOPED_URL_FIELD")])
        # knack_data["url"]
        record = knack.record(
            method="update", data=knack_data, obj=os.getenv("KNACK_PROJECT_VIEW")
        )

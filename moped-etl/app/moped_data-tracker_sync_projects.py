#!/usr/bin/env python

import re
import os
import pprint
import knackpy
from process.request import run_query

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_VIEW = os.getenv("KNACK_DATA_TRACKER_VIEW")

pp = pprint.PrettyPrinter(width=120, indent=2)

get_all_projects = """
query get_all_projects {
  moped_project(where: {knack_project_id: {_is_null: false}}) {
    project_id
    project_name
    current_status
    knack_project_id
  }
}
"""

knack_object_keys = {}
object_regex = re.compile('^KNACK_OBJECT_(?P<object_key>\S+)')
for variable in list(os.environ):
    match = object_regex.search(variable)
    if match:
        key = match.group('object_key')
        knack_object_keys[key.lower()] = os.getenv(variable)


moped_data = run_query(get_all_projects)
#pp.pprint(moped_data)

#knack_data = run_knack_project_query(knack_object_keys)

app = knackpy.App(app_id=KNACK_DATA_TRACKER_APP_ID)
records = app.get('view_' + KNACK_DATA_TRACKER_VIEW, generate=1)
knack_records = {}
for record in records:
    if (record[knack_object_keys['project_id']] == None):
        continue
    #print(record[knack_object_keys['PROJECT_ID']]) # accessing a particular field value defined by env variables
    knack_records[record[knack_object_keys['project_id']]] = record

#print(knack_records)


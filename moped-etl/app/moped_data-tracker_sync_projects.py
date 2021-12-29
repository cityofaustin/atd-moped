#!/usr/bin/env python

import re
import os
import pprint
import knackpy
from process.request import run_query

KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_API_KEY = os.getenv("KNACK_DATA_TRACKER_API_KEY")
KNACK_DATA_TRACKER_VIEW = os.getenv("KNACK_DATA_TRACKER_VIEW")
KNACK_DATA_TRACKER_PROJECT_OBJECT= os.getenv("KNACK_DATA_TRACKER_PROJECT_OBJECT")

pp = pprint.PrettyPrinter(width=120, indent=2)

get_all_synchronized_projects = """
query get_all_projects {
  moped_project(where: {knack_project_id: {_is_null: false}}) {
    project_id
    project_name
    current_status
    knack_project_id
  }
}
"""

# Extract mapping between field names and Knack's field codes from environment
knack_object_keys = {}
object_regex = re.compile('^KNACK_OBJECT_(?P<object_key>\S+)')
for variable in list(os.environ):
    match = object_regex.search(variable)
    if match:
        key = match.group('object_key')
        knack_object_keys[key.lower()] = os.getenv(variable)
#print(knack_object_keys)

# Get Moped's current state of synchronized projects
moped_data = run_query(get_all_synchronized_projects)
#pp.pprint(moped_data)

# Use KnackPy to pull the current state of records in Data Tracker
records = app.get('view_' + KNACK_DATA_TRACKER_VIEW, generate=1)
knack_records = {}
for record in records:
    if (record[knack_object_keys['project_id']] == None):
        continue
    knack_records[record[knack_object_keys['project_id']]] = record
#print(knack_records)

# Iterate over projects, checking for data mismatches, indicating a needed update
for moped_project in moped_data['data']['moped_project']:
    knack_data = dict(knack_records[moped_project['project_id']])
    for key in knack_object_keys:
        if not moped_project[key] == knack_records[moped_project['project_id']][knack_object_keys[key]]:
            #print('mismatch, knack update required!')
            knack_data[knack_object_keys[key]] = moped_project[key]

    print(knack_data)

        # the following works iff you have an API key defined in the app invocation

    #app.record(method="update", data=knack_data)
    #app.record(method="update", data=knack_data, scene='scene_514', view='view_3047')
    #app.record(method="update", data=knack_data, obj='projects')
    #app.record(method="update", data=knack_data, obj='view_3047')
    app.record(method="update", data=knack_data, obj='object_201')

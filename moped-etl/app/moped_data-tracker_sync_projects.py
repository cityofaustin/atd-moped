#!/usr/bin/env python

import re
import os
import pprint
from process.request import run_query, run_knack_project_query

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

knack_data = run_knack_project_query()
#print(knack_data)

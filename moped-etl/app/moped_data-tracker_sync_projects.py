#!/usr/bin/env python

import json
import pprint
from process.request import run_query, run_knack_project_query

pp = pprint.PrettyPrinter(width=120, indent=2)

get_all_projects = """
query get_all_projects {
  moped_project {
    project_id
    project_name
    current_status
    knack_project_id
  }
}
"""

moped_data = run_query(get_all_projects)
#pp.pprint(moped_data)

knack_data = run_knack_project_query()
#print(knack_data)

#!/usr/bin/env python

import json
import requests
from process.request import run_query


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

result = run_query(get_all_projects)

print(result)
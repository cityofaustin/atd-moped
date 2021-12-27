#!/usr/bin/env python

import json
import requests
from string import Template



# Query to gather a subset of list of specific Locations
get_all_projects = Template("""
query get_all_projects {
  moped_project {
    project_id
    project_name
    current_status
    knack_project_id
  }
}
""")

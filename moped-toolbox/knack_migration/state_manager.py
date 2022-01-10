import json
import os

import requests

from queries import GET_KNACK_PROJECTS
from settings import LOG_DIR, DATA_READY_DIR

HASURA_GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"


class Project:
    def __repr__(self):
        return f"<Project knack='{self.knack_project_id}'  moped='{self.moped_project_id}'>"

    def __init__(self, *, knack_project_id, moped_project_id=None, error=None):
        self.knack_project_id = knack_project_id
        self.moped_project_id = moped_project_id
        self.error = error

class ProjectManager:
    def __repr__(self):
        return f"<ProjectManager '{len(self.knack_projects)} projects'>"
    def __init__(self, *, log_dir):
        self.knack_projects = self._load_knack_projects()
        self.moped_projects = self._load_moped_projects()
        self.state = self._initialize_state()

    def _load_knack_projects(self):
        with open(f"{DATA_READY_DIR}/projects.json", "r") as fin:
            return json.load(fin)

    def _load_moped_projects(self):
        payload = {"query": GET_KNACK_PROJECTS}
        res = requests.post(HASURA_GRAPHQL_ENDPOINT, json=payload)
        res.raise_for_status()
        data = res.json()
        try:
            return data["data"]["moped_project"]
        except KeyError:
            raise ValueError(data)

    def _get_project_state(self, knack_project_id):
        return {
            "knack_project_id": knack_project_id,
            "moped_project_id": self.moped_index.get(knack_project_id),
        }

    def _initialize_state(self):
        state = {}
        moped_index = {
            project["knack_project_id"]: project for project in self.moped_projects
        }
        for knack_project in self.knack_projects:
            knack_project_id = knack_project["knack_project_id"]
            moped_project_id = moped_index.get(knack_project_id, {}).get("project_id")
            state[knack_project_id] = Project(
                knack_project_id=knack_project_id, moped_project_id=moped_project_id
            )
        return state

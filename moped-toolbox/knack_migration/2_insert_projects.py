import json
import os
from pprint import pprint as print

import requests

from logger import get_logger
from settings import DATA_READY_DIR, LOG_DIR
from queries import GET_KNACK_PROJECTS


HASURA_GRAPHQL_ENDPOINT = "http://localhost:8080/v1/graphql"


class Project:
    def __repr__(self):
        return f"<Project knack='{self.knack_project_id}'  moped='{self.moped_project_id}'>"

    def __init__(self, *, knack_project_id, payload, moped_project_id=None, error=None):
        self.knack_project_id = knack_project_id
        self.moped_project_id = moped_project_id
        self.payload = payload
        self.error = error


def load_knack_projects():
    with open(f"{DATA_READY_DIR}/projects.json", "r") as fin:
        return json.load(fin)


def load_moped_projects():
    payload = {"query": GET_KNACK_PROJECTS}
    res = requests.post(HASURA_GRAPHQL_ENDPOINT, json=payload)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]["moped_project"]
    except KeyError:
        raise ValueError(data)


def initialize_projects(knack_projects, moped_projects):
    projects = []
    moped_index = {project["knack_project_id"]: project for project in moped_projects}
    for knack_project in knack_projects:
        knack_project_id = knack_project["knack_project_id"]
        moped_project_id = moped_index.get(knack_project_id, {}).get("project_id")
        p = Project(
            knack_project_id=knack_project_id,
            moped_project_id=moped_project_id,
            payload=knack_project,
        )
        projects.append(p)
    return projects


def main():
    knack_projects = load_knack_projects()
    moped_projects = load_moped_projects()
    projects = initialize_projects(knack_projects, moped_projects)
    for project in projects:
        if project.moped_project_id:
            continue
        print("do upload")
        print("log it")

    breakpoint()
    pass


if __name__ == "__main__":
    logger = get_logger(name=__file__, log_dir=LOG_DIR)
    main()

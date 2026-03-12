""" Insert projects via Hasura graphql endpoint """
import argparse
import json
import os
from pprint import pprint as print
import sys


from logger import get_logger
from queries import MOPED_KNACK_PROJECTS_QUERY, INSERT_PROJECT
from settings import DATA_READY_DIR, LOG_DIR
from secrets import HASURA
from utils import make_hasura_request

class Project:
    def __repr__(self):
        return f"<Project knack_id='{self.knack_project_id}'  moped_id='{self.moped_project_id}'>"

    def __init__(self, *, knack_project_id, payload, moped_project_id=None, error=None):
        self.knack_project_id = knack_project_id
        self.moped_project_id = moped_project_id
        self.payload = payload
        self.error = error


def load_knack_projects():
    with open(f"{DATA_READY_DIR}/projects.json", "r") as fin:
        return json.load(fin)


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


def main(env):
    if (env) != "local":
        proceed = None
        logger.warning("ARE YOU SURE YOUVE REFRESHED THE SOURCE FILES?")
        proceed = input(
            f"About to migrate projects in {env} environment. Type 'yes' to proceed or any key to quit > "
        )
        if proceed != "yes":
            sys.exit()

    knack_projects = load_knack_projects()
    moped_projects = make_hasura_request(
        query=MOPED_KNACK_PROJECTS_QUERY, variables=None, key="moped_project", env=env
    )
    projects = initialize_projects(knack_projects, moped_projects)
    logger.info(
        f"{len([p for p in projects if not p.moped_project_id])} projects to create..."
    )
    for project in projects:
        if project.moped_project_id:
            continue
        response = make_hasura_request(
            query=INSERT_PROJECT,
            variables={"object": project.payload},
            key="insert_moped_project_one",
            env=env,
        )
        project.moped_project_id = response["project_id"]
        logger.info(f"Created {project}")
    logger.info("Done :)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-e",
        "--env",
        type=str,
        required=True,
        choices=["local", "staging", "prod"],
        help=f"The environment",
    )
    args = parser.parse_args()
    logger = get_logger(name=os.path.basename(__file__), log_dir=LOG_DIR)
    main(args.env)

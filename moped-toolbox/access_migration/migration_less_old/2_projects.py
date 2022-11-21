# docker run -it --rm -v /Users/john/Desktop/atd-moped/moped-tools:/app moped-migra /bin/bash
import json
from pprint import pprint as pr
from utils.graphql import make_hasura_request
from utils.queries import INSERT_PROJECT_MUTATION

fields = [
    {
        "in": "ProjectID",
        "out": "interim_project_id",
        "transform": None,
        "required": True,
    },
    {
        "in": "ProjectName",
        "out": "project_name",
        "transform": None,
        "required": True,
    },
    {
        "in": "Description",
        "out": "project_description",
        "transform": None,
        "required": True,
    },
    # {
    #     "in": "Sponsor",
    #     "out": "project_lead_id",
    #     "transform": None,
    #     "fk_in": "ProjectSponsorID",
    #     "lookup": "entities"
    # },
]


def map_row(row):
    new_row = {field["out"]: row[field["in"]] for field in fields}
    test_is_valid(new_row)
    return new_row


def load_json(fname):
    with open(fname, "r") as fin:
        return json.load(fin)


def test_is_valid(row):
    assert all([row[field["out"]] for field in fields if field["required"]])


def main():
    data = load_json("data/raw/projects.json")
    ready = [map_row(row) for row in data]
    for proj in ready:
        print(proj)
        make_hasura_request(query=INSERT_PROJECT_MUTATION, variables={"object": proj})
    breakpoint()


if __name__ == "__main__":
    main()

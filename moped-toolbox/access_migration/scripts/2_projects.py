# docker run -it --rm -v /Users/john/Desktop/atd-moped/moped-tools:/app moped-migra /bin/bash
import json
from pprint import pprint as pr

fields = [
    {
        "name_in": "ProjectId",
        "name_out": "interim_project_id",
        "transform": None,
    },
    {
        "name_in": "ProjectName",
        "name_out": "project_name",
        "transform": None,
    },
    {
        "name_in": "Description",
        "name_out": "project_description",
        "transform": None,
    },
    {
        "name_in": "Sponsor",
        "name_out": "project_lead_id",
        "transform": None,
        "fk_in": "ProjectSponsorID",
        "lookup": "entities"
    },
]

# # SQL Query (the order of the columns affects the lambda function below)
# "sql": "SELECT ProjectID,
# ProjectName,Description,ProjectPhase,ProjectInitiationDate,ECapris_ProjectID FROM PROJECTS",

# # Basically, this lambda function will rename the keys
# # so that it's compatible with Hasura by creating/replacing
# # the current object with a new one.
# "transform": lambda row: {
#     "project_id": row[0],
#     "project_name": row[1],
#     "project_description": str(row[2]),
#     "current_status": get_moped_status_name(row[3]),
#     "subphase_id": get_moped_subphase_id(row[3]),
#     "start_date": row[4],
#     "ecapris_subproject_id": row[5],
#     # We need it to be false if ecapris is empty
#     "capitally_funded": False if row[5] == "" or row[5] is None else True
# },

def load_json(fname):
    with open(fname, "r") as fin:
        return json.load(fin)

def main():
    data = load_json("data/projects.json")
    breakpoint()


if __name__ == "__main__":
    main()

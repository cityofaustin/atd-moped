"""
TODO:
- tasks orders
- funding
- phase dates
- comments
- setting user IDs (remember to use prod user id's)
- logging
"""
import json
from pprint import pprint as print

from settings import DATA_SOURCES
from project_template import construct_project_object


def construct_moped_proj_note(record, project_id):
    # moped db: moped_proj_notes
    return {
        "project_id": project_id,
        "status_id": 1,
        "project_note_type": 1,
        "added_by": record["TODO"],
        "added_by_user_id": "TODO",
        "project_note": record["field_3950"],
    }


def get_signal_index(signals):
    index = {}
    for signal in signals:
        signal_id = int(signal["field_199"])  # signal_id
        index[signal_id] = signal
    return index


def format_signal(signal):
    return {
        "id": signal["id"],
        "signal_id": signal["field_199"],
        "type": signal["field_201"],
        "location_name": signal["field_211_raw"].strip(),
        "coordinates": [
            float(signal["field_182_raw"]["longitude"]),
            float(signal["field_182_raw"]["latitude"]),
        ],
    }


def append_signals_to_projects(projects, signal_index):
    """Raises KeyError if a project's signal can't be found"""
    for p in projects:
        signal_ids = p["field_199_raw"]
        if not signal_ids:
            continue
        p["signals"] = [format_signal(signal_index[signal_id]) for signal_id in signal_ids]


def load_json(fname):
    with open(fname, "r") as fin:
        return json.load(fin)

def parse_comments(projects):
    for p in projects:
        comments_raw = p["field_3950"]
        comments = comments_raw.split("\n")
        # remove empty strings (b/c of linebreaks)
        p["comments"] = [c for c in comments if c]

def extract_mutation_data(projects):
    data = []
    for p in projects:
        project_data = {
            "project_name": p["field_3857"].strip(),
            "project_description": p["field_3857"].strip(),
            "current_phase": p["field_3860"],
            "phase_name": p["field_3860"],
            "phase_start": "2021-01-01",
            "current_status": "",
            "signals": p["signals"],
            "comments": p["field_3950"]
        }
        data.append(project_data)
    return data

def main():
    data = {}
    for source in DATA_SOURCES:
        data[source["name"]] = load_json(source["path"])

    signal_index = get_signal_index(data["signals"])
    append_signals_to_projects(data["projects"], signal_index)
    projects = extract_mutation_data(data["projects"])
    breakpoint()

    for p in projects:
        kwargs = {
            "project_name": p["field_3857"],
            "project_description": p["field_3857"],
            "current_phase": p["field_3860"],
            "phase_name": p["field_3860"],
            "phase_start": "2021-01-01",
            "current_status": "",
            "signals": p["signals"],
            "knack_project_id": p["id"]
        }
        variables = construct_project_object(p)
        breakpoint()
    print("todo: save data")


if __name__ == "__main__":
    main()

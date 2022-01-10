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
import os
from pprint import pprint as print

from logger import get_logger
from project_template import construct_project
from settings import DATA_SOURCES, DATA_READY_DIR, LOG_DIR, FIELDS
from state_manager import StateManager


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


def format_signal_type(signal_type):
    if signal_type == "TRAFFIC":
        return "Signal - Traffic"
    elif signal_type == "PHB":
        return "Signal - PHB"
    else:
        raise ValueError(f"Invalid signal type: {signal_type}")


def format_signal(signal):
    return {
        "id": signal["id"],
        "signal_id": signal["field_199"],
        "signal_type": format_signal_type(signal["field_201"]),
        "location_name": signal["field_211_raw"].strip(),
        "coordinates": [
            float(signal["field_182_raw"]["longitude"]),
            float(signal["field_182_raw"]["latitude"]),
        ],
    }


def append_signals_to_projects(projects, signal_index):
    """Raises KeyError if a project's signal can't be found"""
    for p in projects:
        signal_ids = p["signals"]
        if not signal_ids:
            p["signals"] = []
            continue
        p["signals"] = [
            format_signal(signal_index[signal_id]) for signal_id in signal_ids
        ]


def get_task_orders_index(task_orders):
    return {tk["id"]: tk for tk in task_orders}


def append_task_orders_to_projects(projects, task_order_index):
    for p in projects:
        task_orders = []
        task_order_children = p["task_orders"]
        for tk in task_order_children:
            tk_id = tk["id"]
            tk = task_order_index[tk_id]
            task_orders.append(tk)
        p["task_orders"] = task_orders


def load_json(fname):
    with open(fname, "r") as fin:
        return json.load(fin)


def save_json(data, fname):
    with open(fname, "w") as fout:
        json.dump(data, fout)


def replace_project_keys(projects, fields):
    return [
        {fields[key]: val for key, val in project.items() if key in fields}
        for project in projects
    ]


def main():
    data = {}
    # load data sources
    for source in DATA_SOURCES:
        data[source["name"]] = load_json(source["path"])
    # reduce to keys of concern and rename keys
    projects = replace_project_keys(data["projects"], FIELDS)
    signal_index = get_signal_index(data["signals"])
    task_orders_index = get_task_orders_index(data["task_orders"])
    append_signals_to_projects(projects, signal_index)
    append_task_orders_to_projects(projects, task_orders_index)
    for project in projects:
        project = construct_project(**project)
    save_json(projects, f"{DATA_READY_DIR}/projects.json")
    logger.info(f"Saved {len(projects)} projects to {DATA_READY_DIR}/projects.json")


if __name__ == "__main__":
    logger = get_logger(name=__file__, log_dir=LOG_DIR)
    if not os.path.exists(DATA_READY_DIR):
        os.makedirs(DATA_READY_DIR)
    main()

# docker run -it --rm -v /Users/john/Desktop/atd-moped/moped-tools:/app moped-migra /bin/bash
import json
from pprint import pprint as pr




def load_json(fname):
    with open(fname, "r") as fin:
        return json.load(fin)


def group_by_id(status_updates, key="ProjectID"):
    grouped = {}
    for update in status_updates:
        _id = update[key]
        grouped.setdefault(_id, [])
        grouped[_id].append(update)
    return grouped

def phases_from_status(statuses):
    phases = []
    unique_phase_names = list(set([s["ProjectPhase"] for s in statuses]))
    for phase_name in unique_phase_names:
        max_date = max([s for s in statuses if s["ProjectPhase"] == phase_name], key=lambda x:x['StatusDate'])
        min_date = min([s for s in statuses if s["ProjectPhase"] == phase_name], key=lambda x:x['StatusDate'])
        
    # if there's only one status - its phase will be the current phase
    if len(statuses) == 1:
        statuses[0]["is_current_phase"] = True
        phases.append(statuses)
        return
    breakpoint()

def main():
    status_updates = load_json("data/project_statusupdate.json")
    status_updates = group_by_id(status_updates)
    for project_id, statuses in status_updates.items():
        phases = phases_from_status(statuses)




if __name__ == "__main__":
    main()

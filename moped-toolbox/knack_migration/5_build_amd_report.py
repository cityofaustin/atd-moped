"""Generate a report of projects that need manual review by AMD staff"""
import json
import csv

def load_json(fname):
    with open(fname, "r") as fin:
        return json.load(fin)


def save_json(data, fname):
    with open(fname, "w") as fout:
        json.dump(data, fout)


def replace_project_keys(projects, fields):
    return [
        {fields[knack_key]: project.get(knack_key) for knack_key in fields.keys()}
        for project in projects
    ]


def main():
    report_data = load_json("PROJECTS_TO_REVEIW.json")
    rows = []
    columns = ["skipped_fund_codes", "target_construct_start", "skipped_sponsors", "skipped_funding_sources", "skipped_designer"]

    for knack_id, info in report_data.items():
        row = {key: None for key in columns}
        row["knack_id"] = knack_id
        for key in columns:
            if info.get(key):
                row[key] = True

        rows.append(row)

    with open("amd_project_review.csv", "w") as fout:
        columns.append("knack_id")
        writer = csv.DictWriter(fout, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)



if __name__ == "__main__":
    main()

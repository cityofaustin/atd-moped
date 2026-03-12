""" Download project file attachments from knack and generate a CSV report of them """
import json
import os
from pprint import pprint as print
import sys
import csv

import knackpy

from logger import get_logger
from settings import (
    KNACK_ATTACHMENT_FIELD_ID,
    LOG_DIR,
    KNACK_PROJECT_FILES_OBJECT,
    KNACK_ATTACHMENT_MOPED_PROJ_ID_FIELD,
    KNACK_ATTACHMENT_MOPED_PROJ_ID_FIELD,
)
from secrets import KNACK_AUTH

def write_csv(records):
    rows = [record.format() for record in records]
    # extract file name from each file
    for row in rows:
        url = row["File"]
        row["Moped Project File Name"] = os.path.basename(url)

    with open("_knack_files/knack_files.csv", "w") as fout:
        fieldnames = rows[0].keys()
        writer = csv.DictWriter(fout, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main():
    logger.info("Initializing Knack app...")
    app = knackpy.App(app_id=KNACK_AUTH["app_id"], api_key=KNACK_AUTH["api_key"])

    logger.info("Saving file list...")
    records = app.get(KNACK_PROJECT_FILES_OBJECT)
    write_csv(records)

    logger.info("Downloading files. This may take a while...")    
    app.download(
        container=KNACK_PROJECT_FILES_OBJECT,
        field=KNACK_ATTACHMENT_FIELD_ID,
        out_dir="_knack_files",
        label_keys=[KNACK_ATTACHMENT_MOPED_PROJ_ID_FIELD],
    )
    

if __name__ == "__main__":
    logger = get_logger(name=os.path.basename(__file__), log_dir=LOG_DIR)
    main()

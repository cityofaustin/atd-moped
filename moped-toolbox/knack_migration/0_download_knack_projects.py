"""Download project and signal records from knack and store in local json files"""
import json
import os

import knackpy

from logger import get_logger
from settings import DATA_SOURCES, DATA_RAW_DIR, LOG_DIR
from secrets import KNACK_AUTH


if not os.path.exists(DATA_RAW_DIR):
    os.makedirs(DATA_RAW_DIR)

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

logger = get_logger(name=os.path.basename(__file__), log_dir=LOG_DIR)

for source in DATA_SOURCES:
    logger.info(f"Downloading {source['name']} records")
    records = knackpy.get(
        app_id=KNACK_AUTH["app_id"],
        api_key=KNACK_AUTH["api_key"],
        view=source.get("view"),
        scene=source.get("scene"),
        obj=source.get("object"),
    )

    logger.info(f"{len(records)} {source['name']} records downloaded")
    with open(source["path"], "w") as fout:
        json.dump(records, fout)

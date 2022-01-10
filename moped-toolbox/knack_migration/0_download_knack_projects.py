"""Download project and signal records from knack and store in local json files"""
import json
import os

import knackpy

from logger import get_logger
from settings import DATA_SOURCES, DATA_RAW_DIR, LOG_DIR

APP_ID = os.getenv("APP_ID")
API_KEY = os.getenv("API_KEY")


if not os.path.exists(DATA_RAW_DIR):
    os.makedirs(DATA_RAW_DIR)

if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

logger = get_logger(name=__file__, log_dir=LOG_DIR)

for source in DATA_SOURCES:
    logger.info(f"Downloading {source['name']} records")
    records = knackpy.get(
        app_id=APP_ID, api_key=API_KEY, view=source["view"], scene=source["scene"]
    )
    
    logger.info(f"{len(records)} {source['name']} records downloaded")
    with open(source["path"], "w") as fout:
        json.dump(records, fout)

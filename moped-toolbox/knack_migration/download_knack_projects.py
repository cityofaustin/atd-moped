"""Download project and signal records from knack and store in local json files"""
import json
import os

import knackpy

from settings import DATA_SOURCES

APP_ID = os.getenv("APP_ID")
API_KEY = os.getenv("API_KEY")


for source in DATA_SOURCES:
    print(f"Downloading {source['name']} records")
    records = knackpy.get(
        app_id=APP_ID, api_key=API_KEY, view=source["view"], scene=source["scene"]
    )
    
    print(f"{len(records)} {source['name']} records downloaded")
    with open(source["path"], "w") as fout:
        json.dump(records, fout)

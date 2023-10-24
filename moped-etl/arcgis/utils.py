import json
import logging
import os
import sys

import requests

from settings import LAYER_IDS

AGOL_USERNAME = os.getenv("AGOL_USERNAME")
AGOL_PASSWORD = os.getenv("AGOL_PASSWORD")
HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT")
HASURA_ADMIN_SECRET = os.getenv("HASURA_ADMIN_SECRET")
AGOL_ORG_BASE_URL = "https://austin.maps.arcgis.com"


def get_endpoint(method, feature_type):
    """Get the AGOL REST API endpoint.

    The docs are bad—but we only care about `addFeatures` or `deleteFeatures`.
    https://developers.arcgis.com/rest/services-reference/enterprise/

    Args:
        method (Str): the REST API operation: addFeatures or deleteFeatures
        feature_type (Str): the feature type we're adding: "points" or "lines"

    Returns:
        Str: an endpoint URL
    """
    layer_id = LAYER_IDS[feature_type]
    return f"https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/Moped_Project_Components/FeatureServer/{layer_id}/{method}"


def chunks(lst, n):
    """Yield successive n-sized chunks from lst"""
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


def make_hasura_request(*, query):
    """Fetch data from hasura

    Args:
        query (str): the hasura query

    Raises:
        ValueError: If no data is returned

    Returns:
        dict: Hasura JSON response data
    """
    headers = {
        "X-Hasura-Admin-Secret": HASURA_ADMIN_SECRET,
        "content-type": "application/json",
    }
    payload = {"query": query}
    res = requests.post(HASURA_ENDPOINT, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)


def handle_arcgis_response(responseData):
    """Checks AGOL response data and tries to determine if there was an error.
    Args:
        responseData (Dict): the JSON response data from the AGOL REST api

    Arcgis does not raise HTTP errors for data-related issues; we must manually
    parse the response
    """
    if not responseData:
        return

    if responseData.get("error"):
        # sometimes there is an error in the root of the response object 👍
        raise ValueError(responseData["error"])

    keys = ["addResults", "updateResults", "deleteResults"]
    # parsing something like this
    # {'addResults': [{'objectId': 3977021, 'uniqueId': 3977021, 'globalId': None, 'success': True},...], ...}
    for key in keys:
        if responseData.get(key):
            for feature_status in responseData.get(key):
                if feature_status.get("success"):
                    continue
                else:
                    raise ValueError(feature_status["error"])
    return


def delete_features(feature_type):
    """Deletes all features from an arcgis online feature service

    Args:
        feature_type (Str): the feature type we're adding: "points" or "lines"

    Raises:
        Exception: if the deletion failes
    """
    endpoint = get_endpoint("deleteFeatures", feature_type)
    data = {
        "token": os.getenv("AGOL_TOKEN"),
        "f": "json",
        "where": "1=1",
        "returnDeleteResults": False,
    }
    res = requests.post(endpoint, data=data)
    res.raise_for_status()
    responseData = res.json()
    try:
        assert responseData["success"]
    except AssertionError:
        raise Exception(f"Delete features failed: {responseData}")


def add_features(feature_type, features):
    """Inserts feature objects into AGOL feature service

    Read more about the feature json spec here:
    https://developers.arcgis.com/documentation/common-data-types/feature-object.htm

    Args:
        feature_type (Str): the feature type we're adding: "points" or "lines"
        features (List): Esri feature objects to upload
    """
    endpoint = get_endpoint("addFeatures", feature_type)
    data = {
        "token": os.getenv("AGOL_TOKEN"),
        "features": json.dumps(features),
        "rollbackOnFailure": False,
        "f": "json",
    }
    res = requests.post(endpoint, data=data)
    res.raise_for_status()
    responseData = res.json()
    handle_arcgis_response(responseData)


def get_token():
    """Get an Esri REST API Token and save it to env var AGOL_TOKEN

    Raises:
        ValueError: If something goes wrong
    """
    url = f"{AGOL_ORG_BASE_URL}/sharing/rest/generateToken"
    data = {
        "username": AGOL_USERNAME,
        "password": AGOL_PASSWORD,
        "referer": "http://www.arcgis.com",
        "f": "pjson",
    }
    res = requests.post(url, data=data)
    res.raise_for_status()
    # like all the Esri REST endpoints this endpoint returns 200 where you would expect
    # 4xx - so we need to catch errors 👍👍👍👍👍
    try:
        os.environ["AGOL_TOKEN"] = res.json()["token"]
    except Exception as e:
        raise ValueError(f"Unable to get token: {e.response.text}")


def get_logger(name, level=logging.INFO):
    """Return a module logger that streams to stdout"""
    logger = logging.getLogger(name)
    handler = logging.StreamHandler(stream=sys.stdout)
    formatter = logging.Formatter(fmt=" %(name)s.%(levelname)s: %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(level)
    return logger

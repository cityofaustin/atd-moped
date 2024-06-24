import json
import logging
import os
import sys
import time

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


def make_hasura_request(*, query, variables=None):
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
    payload = {"query": query, "variables": variables}
    res = requests.post(HASURA_ENDPOINT, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)


def handle_arcgis_response(response_data):
    """Checks AGOL response data and tries to determine if there was an error.
    Args:
        response_data (Dict): the JSON response data from the AGOL REST api

    Arcgis does not raise HTTP errors for data-related issues; we must manually
    parse the response
    """
    if not response_data:
        return

    if response_data.get("error"):
        # sometimes there is an error in the root of the response object 👍
        raise ValueError(response_data["error"])

    keys = ["addResults", "updateResults", "deleteResults"]
    # parsing something like this
    # {'addResults': [{'objectId': 3977021, 'uniqueId': 3977021, 'globalId': None, 'success': True},...], ...}
    for key in keys:
        if response_data.get(key):
            for feature_status in response_data.get(key):
                if feature_status.get("success"):
                    continue
                else:
                    raise ValueError(feature_status["error"])
    return


def delete_all_features(feature_type):
    """Deletes all features from an arcgis online feature service.

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
    res = resilient_layer_request(endpoint, data=data)
    response_data = res.json()
    try:
        assert response_data["success"]
    except AssertionError:
        raise Exception(f"Delete features failed: {response_data}")


def delete_features_by_project_ids(feature_type, project_ids):
    """Deletes all features from an arcgis online feature service.

    Args:
        feature_type (Str): the feature type we're adding: "points" or "lines"
        project_ids (List): the project ids to delete

    Raises:
        Exception: if the deletion failes
    """
    endpoint = get_endpoint("deleteFeatures", feature_type)
    data = {
        "token": os.getenv("AGOL_TOKEN"),
        "f": "json",
        "where": f"project_id in {", ".join(project_ids)}",
        "returnDeleteResults": False
    }
    res = resilient_layer_request(endpoint, data=data)
    response_data = res.json()
    try:
        assert response_data["success"]
    except AssertionError:
        raise Exception(f"Delete features failed: {response_data}")


def add_features(feature_type, features):
    """Inserts feature objects into AGOL feature service

    Read more about the feature json spec here:
    https://developers.arcgis.com/documentation/common-data-types/feature-object.htm

    Args:
        feature_type (Str): the feature type we're adding: "points" or "lines"
        features (List): Esri feature objects to upload
    """
    token = os.getenv("AGOL_TOKEN")
    endpoint = get_endpoint("addFeatures", feature_type)
    data = {
        "token": token,
        "features": json.dumps(features),
        "rollbackOnFailure": False,
        "f": "json",
    }
    res = resilient_layer_request(endpoint, data=data)
    response_data = res.json()
    handle_arcgis_response(response_data)


def resilient_layer_request(endpoint, data, max_retries=10, sleep_seconds=2):
    """An ArcGIS request wrapper to enable re-trying. Will try on any HTTP error
    except status code 400. Bear in mind that AGOL returns 200 for most invalid
    request errors, so those will be handled separately.

    Args:
        endpoint (str): The AGOL HTTP endpooint
        data (dict): The request payload
        max_retries (int, optional): The number of times to retry. Defaults to 3.
        sleep_seconds (int, optional): The amount of time to sleep between retries.
            Defaults to 2. This tends to help mitigate strange errors like random
            404 errors.

    Returns:
        requests.Response: the request response if successful
    """
    attempts = 0
    while True:
        attempts += 1
        res = requests.post(endpoint, data=data)
        try:
            res.raise_for_status()
            response_data = res.json()
            if response_data.get("error"):
                if response_data.get("error").get("code") == 499:
                    # this is an inexplicable "token required" error
                    # which will have a status_code of 200 👍
                    res.status_code = 499
                    raise Exception("Token Required")
        except Exception as e:
            if attempts >= max_retries or res.status_code == 400:
                raise e
            logger.warn(
                f"Retrying after status {res.status_code} on attempt #{attempts} of {max_retries}"
            )
            time.sleep(sleep_seconds)
            continue
        return res


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
    print(data)
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


logger = get_logger(__file__)

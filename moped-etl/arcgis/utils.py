import os

import requests

from settings import SERVICE_NAMES

AGOL_USERNAME = os.getenv("AGOL_USERNAME")
AGOL_PASSWORD = os.getenv("AGOL_PASSWORD")
HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT")
HASURA_ADMIN_SECRET = os.getenv("HASURA_ADMIN_SECRET")
AGOL_ORG_BASE_URL = "https://austin.maps.arcgis.com"

# https://developers.arcgis.com/rest/services-reference/enterprise/delete-features.htm


def get_endpoint(method, feature_type):
    service_name = SERVICE_NAMES[feature_type]
    return f"https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/{service_name}/FeatureServer/0/{method}"


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


def handle_arcgis_response(response):
    """arcgis does not raise HTTP errors for data-related issues; we must manually
    parse the response"""
    if not response:
        return
    keys = ["addResults", "updateResults", "deleteResults"]
    # parsing something like this
    # {'addResults': [{'objectId': 3977021, 'uniqueId': 3977021, 'globalId': None, 'success': True},...], ...}
    for key in keys:
        if response.get(key):
            for feature_status in response.get(key):
                if feature_status.get("success"):
                    continue
                else:
                    raise ValueError(feature_status["error"])
    return


def delete_features(feature_type):
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
    endpoint = get_endpoint("addFeatures", feature_type)
    data = {
        "token": os.getenv("AGOL_TOKEN"),
        "features": features,
        "rollbackOnFailure": False,
        "f": "json",
    }
    res = requests.post(endpoint, data=data)
    res.raise_for_status()
    responseData = res.json()
    handle_arcgis_response(responseData)


def get_token():
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

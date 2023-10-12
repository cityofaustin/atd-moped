import argparse
import os
import time

import arcgis
import requests

# from settings import PROJECT_LIST_KEYS, QUERY_TEMPLATE, OUTPUT_DIR
from secrets import HASURA

AGOL_URL = "https://austin.maps.arcgis.com"
AGOL_USERNAME = os.getenv("AGOL_USERNAME")
AGOL_PASSWORD = os.getenv("AGOL_PASSWORD")

service_ids = {
    "points": "997555f6e0904aa88eafe73f19ee65c0",
    "lines": "e8f03d2cec154cacae539b630bcaa70b",
}


def get_query():
    return """
    query {
    component_arcgis_online_view {
        added_by
        completion_date
        completion_end_date
        component_description
        component_id
        component_name
        component_name_full
        component_phase_id
        component_phase_name
        component_subtype
        component_tags
        construction_start_date
        contract_numbers
        contractors
        council_districts
        current_phase_name
        current_phase_name_simple
        ecapris_subproject_id
        feature_ids
        funding_source_name
        geometry
        interim_project_component_id
        interim_project_id
        is_project_component_deleted
        is_project_deleted
        location_description
        project_component_id
        project_description
        project_designer
        project_id
        project_inspector
        project_lead
        project_name
        project_note
        project_partner
        project_phase_id
        project_phase_name
        project_sponsor
        project_tags
        project_team_members
        public_process_status
        signal_ids
        srts_id
        subcomponents
        task_order_name
        type_name
        updated_at
        work_types
    }
}
"""


def make_hasura_request(*, query, env):
    """Fetch data from hasura

    Args:
        query (str): the hasura query
        env (str): the environment name, which will be used to acces secrets

    Raises:
        ValueError: If no data is returned

    Returns:
        dict: Hasura JSON response data
    """
    admin_secret = HASURA["hasura_graphql_admin_secret"][env]
    endpoint = HASURA["hasura_graphql_endpoint"][env]
    headers = {
        "X-Hasura-Admin-Secret": admin_secret,
        "content-type": "application/json",
    }
    payload = {"query": query}
    res = requests.post(endpoint, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)


def make_esri_feature(feature):
    # init feature obj with all properties and  WGS84 spatial ref
    esri_feature = {
        "attributes": feature["properties"],
        "geometry": {"spatialReference": {"wkid": 4326}},
    }
    # convert geojson geoms to esri
    if feature["geometry"]["type"] == "MultiPoint":
        esri_feature["geometry"]["points"] = feature["geometry"]["coordinates"]
    elif feature["geometry"]["type"] == "MultiLineString":
        esri_feature["geometry"]["paths"] = feature["geometry"]["coordinates"]
    else:
        raise ValueError(
            f"Unknown/unsupported geomtery type: {feature['geometry']['type']}"
        )
    return esri_feature


def make_esri_features(features):
    esri_features = []
    for f in features:
        esri_features.append(make_esri_feature(f))
    return esri_features


def handle_response(response):
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


def delete_features(layer):
    res = layer.delete_features(where="1=1", future=True)
    # returns a "<Future>" response class which does not appear to be documented
    breakpoint()
    while res._state != "FINISHED":
        print(f"Response state: {res._state}. Sleeping for 1 second")
        time.sleep(1)
    handle_response(res._result)


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


def main(env):
    gis = arcgis.GIS(url=AGOL_URL, username=AGOL_USERNAME, password=AGOL_PASSWORD)

    query = get_query()
    print("Fetching project data...")
    data = make_hasura_request(query=query, env=env)["component_arcgis_online_view"]
    features = {"lines": [], "points": []}

    for row in data:
        geometry = row.pop("geometry")
        feature = {"type": "Feature", "properties": row, "geometry": geometry}
        if geometry["type"] == "MultiLineString":
            features["lines"].append(feature)
        elif geometry["type"] == "MultiPoint":
            features["points"].append(feature)
        else:
            raise ValueError(f"Found unsupported feature type: {geometry['type']}")

    for feature_type in ["points", "lines"]:
        service = gis.content.get(service_ids[feature_type])
        layer = service.layers[0]
        esri_features = make_esri_features(features[feature_type])
        print("deleting features...")
        delete_features(layer)
        for features_chunk in chunks(esri_features, 100):
            print("Uploading chunk...")
            res = layer.edit_features(adds=features_chunk, rollback_on_failure=False)
            handle_response(res)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-e",
        "--env",
        type=str,
        required=True,
        choices=["local", "staging", "prod"],
        help=f"The environment",
    )
    args = parser.parse_args()

    main(args.env)

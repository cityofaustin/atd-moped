import argparse
import json

import requests

# from settings import PROJECT_LIST_KEYS, QUERY_TEMPLATE, OUTPUT_DIR
from secrets import HASURA


def get_query():
    return """
    {
    component_arcgis_online_view {
        added_by
        completion_date
        completion_end_date
        component_id
        component_phase_id
        component_phase_name
        construction_start_date
        contract_numbers
        contractors
        council_districts
        current_phase_name
        description
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
        project_feature
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
        subphase_id
        task_order_name
        type_name
        updated_at
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


def main(env):
    query = get_query()
    print("Fetching project data...")
    data = make_hasura_request(query=query, env=env)["component_arcgis_online_view"]
    features = []
    for row in data:
        geometry = row.pop("geometry")
        features.append(
            { "type": "Feature", "properties": row, "geometry": geometry }
        )
    fc = { "type": "FeatureCollection", "features": features }
    with open("test.geojson", "w") as fout:
        json.dump(fc, fout)


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

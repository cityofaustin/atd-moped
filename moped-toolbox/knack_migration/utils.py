"""Utils to create project mutation objects"""
import imp
import uuid

import requests

from secrets import HASURA


def make_hasura_request(*, query, variables, key, env):
    endpoint = HASURA["HASURA_GRAPHQL_ENDPOINT"][env]
    admin_secret = HASURA["HASURA_GRAPHQL_ADMIN_SECRET"][env]
    headers = {"X-Hasura-Admin-Secret": admin_secret}
    payload = {"query": query, "variables": variables}
    res = requests.post(endpoint, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"][key]
    except KeyError:
        breakpoint()
        raise ValueError(data)


def construct_component(*, signal_id, location_name, signal_type, id, coordinates):
    uid = str(uuid.uuid4())
    if "traffic" in signal_type.lower():
        component_id = 18
    else:
        component_id = 16
    return {
        "name": "Signal",
        "component_id": component_id,
        "status_id": 1,
        "moped_proj_features": {
            "data": [
                {
                    "status_id": 1,
                    "feature": {
                        "type": "Feature",
                        "properties": {
                            "signal_id": signal_id,
                            "location_name": location_name,
                            "signal_type": signal_type,
                            "id": id,
                            "renderType": "Point",
                            "PROJECT_EXTENT_ID": uid,
                            "sourceLayer": "drawnByUser",
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": coordinates,
                        },
                        "id": uid,
                    },
                }
            ]
        },
    }


def construct_project(
    *,
    project_name,
    phase_name,
    phases,
    signals,
    knack_project_id,
    task_orders,
    moped_proj_notes,
    moped_project_types,
    contractor,
    purchase_order_number,
    work_assignment_id,
    ecapris_subproject_id,
    moped_proj_funding,
    project_sponsor,
    moped_proj_partners,
    moped_proj_personnel,
    updated_at,
    project_status_id,
    **kwargs
):

    return {
        "current_phase": phase_name.lower(),
        "project_description": "",
        "project_name": project_name.strip(),
        "start_date": "2021-12-30",
        "current_status": phase_name,
        "contractor": contractor,
        "work_assignment_id": work_assignment_id,
        "purchase_order_number": purchase_order_number,
        "ecapris_subproject_id": ecapris_subproject_id,
        "project_sponsor": project_sponsor,
        "status_id": project_status_id,
        "knack_project_id": knack_project_id,
        "moped_proj_phases": {"data": phases},
        "moped_proj_notes": {"data": moped_proj_notes},
        "moped_project_types": {"data": moped_project_types},
        "moped_proj_components": {
            "data": [construct_component(**signal) for signal in signals]
        },
        "moped_proj_funding": {"data": moped_proj_funding},
        "moped_proj_partners": {"data": moped_proj_partners},
        "moped_proj_personnel": {"data": moped_proj_personnel},
        "task_order": task_orders,
        "updated_at": updated_at,
    }

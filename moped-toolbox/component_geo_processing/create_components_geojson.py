"""
Create component geojson files which can be imported to ArcGIS.

Merges component features into a single feature per component and ouputs two feature collections:
- lines.geojson: component features of type line
- points.geojson: component featuers of type point
"""
import argparse
import json
import os

import requests

from settings import PROJECT_LIST_KEYS, QUERY_TEMPLATE, OUTPUT_DIR
from secrets import HASURA


def get_query(query_template, project_list_keys):
    """Formats a Hasura query with the columns of interest"""
    key_string = "\n".join(project_list_keys)
    return query_template.replace("$keys", key_string)


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


def get_merged_geom_type(feature):
    """Determines the *merged* component geometry type of a geojson feature. Because we
    are merging multiple component features into one feature, we use the MultiPoint
    or MultiLineString geojson type based on input type.

    Args:
        feature (dict): a geojson feature from `moped_proj_features`

    Returns:
        string: `MultiPoint` or `MultiLineString`
    """
    if "Point" in feature["geometry"]["type"]:
        return "MultiPoint"
    else:
        return "MultiLineString"


def has_uniform_geometry(features):
    """Check if all of a component's featuers have the same geometry type.

    A component must have all "Point" types, or a mix of "LineString" and
    "MultiLineString". We enforce this through the editor UI"""
    return all(["Line" in feature["geometry"]["type"] for feature in features]) or all(
        ["Point" in feature["geometry"]["type"] for feature in features]
    )


def merge_geoms(features):
    """Merge multiple features into a single feature geometry

    Args:
        features (list): list of `moped_proj_features` which belong to a single
        `moped_proj_component`.

    Return:
        dict: a geojson geometry object which holds geometries of all input features
    """
    if not has_uniform_geometry(features):
        raise ValueError("Geometry is not uniform")

    merged_geom_type = get_merged_geom_type(features[0])
    geometry = {"type": merged_geom_type, "coordinates": []}

    for feature in features:
        # for point features, we can append each feature's coordinates to our
        # coordinate array
        if feature["geometry"]["type"] == "Point":
            geometry["coordinates"].append(feature["geometry"]["coordinates"])
        elif feature["geometry"]["type"] == "MultiLineString":
            coords = feature["geometry"]["coordinates"]
            geometry["coordinates"] += coords
        elif feature["geometry"]["type"] == "LineString":
            coords = feature["geometry"]["coordinates"]
            geometry["coordinates"] += [coords]
        else:
            raise ValueError("Feature has unsupported geometry type")
    return geometry


def get_component_properties(component):
    """Extracts `moped_components` properties and converts array types
    to strings.

    Args:
        component (dict): a `moped_component` object

    Returns:
        dict: a dict of component properties
    """
    properties = {}
    properties["component_name"] = component["component_name"]
    properties["component_subtype"] = component["component_subtype"]
    properties["moped_subcomponents"] = ", ".join(
        [sub["subcomponent_name"] for sub in component["moped_subcomponents"]]
    )
    return properties


def add_project_properties(properties, project_data, project_list_keys):
    """Adds data from the `project_list_view` to component properties

    Args:
        properties (dict): a dict of component properties
        project_data (dict): a dict of project data from `project_list_view`
        project_list_keys (list): a list of column names to be added from project
            data to the component properties
    """
    for key in project_list_keys:
        properties[key] = project_data[key]


def add_project_tags(properties, moped_proj_tags):
    tags = [proj_tag["moped_tag"]["name"] for proj_tag in moped_proj_tags]
    properties["moped_proj_tags"] = ",".join(tags) if tags else None
    return


def main(env):
    query = get_query(QUERY_TEMPLATE, PROJECT_LIST_KEYS)
    print("Fetching project data...")
    data = make_hasura_request(query=query, env=env)

    component_features = []
    projects_components = data["moped_project"]
    projects_list = data["project_list_view"]
    print(f"Processing {len(projects_components)} projects")

    for proj in projects_components:
        # find matching project in the project_list_view
        project_id = proj["project_id"]
        project_data = next(p for p in projects_list if p["project_id"] == project_id)

        if not project_data:
            raise ValueError("Unable to find project - this should never happen :/")

        for proj_component in proj["moped_proj_components"]:
            # create a single geojson feature with merged geometry from all
            # moped_proj_features, with properties from the `project_list_view`
            features = [f["feature"] for f in proj_component["moped_proj_features"]]
            geometry = merge_geoms(features)
            properties = get_component_properties(proj_component["moped_components"])
            add_project_properties(properties, project_data, PROJECT_LIST_KEYS)
            add_project_tags(properties, proj["moped_proj_tags"])
            component_features.append(
                {
                    "type": "Feature",
                    "properties": properties,
                    "geometry": geometry,
                }
            )

    # filter features by geometry type and write geojson files
    print("Writing files...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for geom_type in [
        {"key": "MultiLineString", "name": "lines"},
        {"key": "MultiPoint", "name": "points"},
    ]:
        features = [
            f for f in component_features if f["geometry"]["type"] == geom_type["key"]
        ]
        geojson = {"type": "FeatureCollection", "features": features}

        with open(f"{OUTPUT_DIR}/{geom_type['name']}.geojson", "w") as fout:
            json.dump(geojson, fout)


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

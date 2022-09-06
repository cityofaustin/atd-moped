"""
Create component geojson files which can be imported to ArcGIS.

Merges component features into a single feature per component and ouputs three feature collections:
- all.geojson: all component features
- lines.geojson: component features of type line
- points.geojson: component featuers of type point

"""
import json
from pprint import pprint as print
import csv
import requests

# endpoint = myendpoint
# admin_secret = mysecret

project_list_keys = [
    "project_id",
    "project_description",
    "capitally_funded",
    "completion_end_date",
    "construction_start_date",
    "current_phase",
    "current_status",
    "date_added",
    "ecapris_subproject_id",
    "end_date",
    "fiscal_year",
    "funding_source_name",
    "is_deleted",
    "milestone_id",
    "project_designer",
    "project_inspector",
    "project_length",
    "project_name",
    "project_note",
    "project_order",
    "project_partner",
    "project_sponsor",
    "project_team_members",
    "status_id",
    "status_name",
    "task_order_name",
    "timeline_id",
    "type_name",
    "updated_at",
]

query_template = """
query MyQuery {
    moped_project(where: {is_deleted: {_eq: false}}) {
    project_id
    moped_proj_components(where: {is_deleted: {_eq: false}}) {
      moped_components {
        component_name
        component_subtype
        line_representation
        status_id
        moped_subcomponents {
          subcomponent_name
        }
      }
      moped_proj_features(where: {is_deleted: {_eq: false}}) {
        feature
      }
    }
  }
  project_list_view {
    $keys
  }
}
"""


def get_query(query_template, project_list_keys):
    key_string = "\n".join(project_list_keys)
    return query_template.replace("$keys", key_string)


def make_hasura_request(*, query, variables, endpoint, admin_secret):
    headers = {
        "X-Hasura-Admin-Secret": admin_secret,
        "content-type": "application/json",
    }
    payload = {"query": query, "variables": variables}
    res = requests.post(endpoint, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)


def get_geom_type(feature):
    if "Point" in feature["geometry"]["type"]:
        return "MultiPoint"
    else:
        return "MultiLineString"


def is_multiline(coords):
    try:
        coords[0][0][0]
        return True
    except TypeError:
        return False


def uniform_geometry(features):
    types = list(set([get_geom_type(f) for f in features]))
    return [len(types) == 1, types[0]]


def merge_geoms(features):
    is_uniform, geom_type = uniform_geometry(features)
    if not is_uniform:
        # this should never happen!
        raise ValueError("geometry is not uniform")

    geometry = {"type": geom_type, "coordinates": []}

    for f in features:
        if geom_type == "MultiPoint":
            geometry["coordinates"].append(f["geometry"]["coordinates"])
        else:
            coords = f["geometry"]["coordinates"]
            if is_multiline(coords):
                geometry["coordinates"] += coords
            else:
                geometry["coordinates"] += [coords]
    return geometry


# {'component_name': 'Signage', 'line_representation': False, 'status_id': 1, 'moped_subcomponents': []}, 'moped_proj_features': [{'feature': {'id': 29221, 'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [-97.7403829805553, 30.267399994400208]}, '_isPresent': False, 'properties': {'sourceLayer': 'ATD_ADMIN.CTN_Intersections', 'INTERSECTIONID': 226954}}}]


def get_component_properties(component):
    properties = {}
    properties["component_name"] = component["component_name"]
    properties["component_subtype"] = component["component_subtype"]
    properties["moped_subcomponents"] = ", ".join(
        [sub["subcomponent_name"] for sub in component["moped_subcomponents"]]
    )
    return properties


def add_project_properties(properties, project_data):
    for key in project_list_keys:
        properties[key] = project_data[key]


def main():
    query = get_query(query_template, project_list_keys)
    data = make_hasura_request(
        query=query,
        variables=None,
        endpoint=endpoint,
        admin_secret=admin_secret,
    )

    component_features = []
    projects_components = data["moped_project"]
    projects_list = data["project_list_view"]
    for proj in projects_components:
        project_id = proj["project_id"]
        # find matching project from the project_list_view
        project_data = next(p for p in projects_list if p["project_id"] == project_id)
        if not project_data:
            raise ValueError("Unable to find project - this should never happen :/")

        for proj_component in proj["moped_proj_components"]:
            features = [f["feature"] for f in proj_component["moped_proj_features"]]
            geometry = merge_geoms(features)
            properties = get_component_properties(proj_component["moped_components"])
            add_project_properties(properties, project_data)
            component_features.append(
                {
                    "type": "Feature",
                    "properties": properties,
                    "geometry": geometry,
                }
            )

    # filter features by geometry type and write geojson files
    for geom_type in [
        {"key": "MultiLineString", "name": "lines"},
        {"key": "MultiPoint", "name": "points"},
    ]:
        features = [
            f for f in component_features if f["geometry"]["type"] == geom_type["key"]
        ]
        geojson = {"type": "FeatureCollection", "features": features}

        with open(f"{geom_type['name']}.geojson", "w") as fout:
            json.dump(geojson, fout)

    with open("all.geojson", "w") as fout:
        json.dump({"type": "FeatureCollection", "features": component_features}, fout)

if __name__ == "__main__":
    main()

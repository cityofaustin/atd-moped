#!/usr/bin/env python
"""Copies all Moped component records to ArcGIS Online (AGOL)"""
# docker run -it --rm  --network host --env-file env_file -v ${PWD}:/app  moped-agol /bin/bash
from settings import COMPONENTS_QUERY, UPLOAD_CHUNK_SIZE
from utils import make_hasura_request, get_token, delete_features, add_features, chunks


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


def main():
    print("Initializing ArcGIS instance...")
    get_token()
    print("Fetching project data...")
    data = make_hasura_request(query=COMPONENTS_QUERY)["component_arcgis_online_view"]
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
        esri_features = make_esri_features(features[feature_type])
        print("deleting features...")
        delete_features(feature_type)
        print("adding features...")
        for feature_chunk in chunks(esri_features, UPLOAD_CHUNK_SIZE):
            print("Uploading chunk....")
            add_features(feature_chunk, esri_features)


if __name__ == "__main__":
    main()

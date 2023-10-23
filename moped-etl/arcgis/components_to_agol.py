#!/usr/bin/env python
"""Copies all Moped component records to ArcGIS Online (AGOL)"""
# docker run -it --rm  --network host --env-file env_file -v ${PWD}:/app  moped-agol /bin/bash
from settings import COMPONENTS_QUERY, UPLOAD_CHUNK_SIZE
from utils import (
    make_hasura_request,
    get_token,
    delete_features,
    add_features,
    chunks,
    get_logger,
)


def get_geometry_key(geometry):
    """Identify the name of the geometry property that will hold coordinate data in an
    Esri feature object.

    See: https://developers.arcgis.com/documentation/common-data-types/feature-object.htm

    Args:
        geometry (dict): A geojson geomtery object

    Returns:
        Str: "points" or "paths"
    """
    return "points" if geometry["type"] == "MultiPoint" else "paths"


def make_esri_feature(*, geometry, **attributes):
    """Create an Esri feature object that can be uploaded to the AGOL REST API.

    See: https://developers.arcgis.com/documentation/common-data-types/feature-object.htm

    Args:
        geometry (Dict): A geojson geometry object, such as one returned from our
            component view in Moped
        attribute (Dict): Any additional properties to be included as feature attributes

    Returns:
        Dict: An Esri feature object
        Bool: if the feature is a point feature type
    """
    if not geometry:
        return None, None

    geometry_key = get_geometry_key(geometry)
    feature = {
        "attributes": attributes,
        "geometry": {
            "spatialReference": {"wkid": 4326},
        },
    }
    feature["geometry"][geometry_key] = geometry["coordinates"]
    return feature, geometry_key == "points"


def main():
    logger.info("Getting token...")
    get_token()

    logger.info("Downloading component data...")
    data = make_hasura_request(query=COMPONENTS_QUERY)["component_arcgis_online_view"]

    logger.info(f"{len(data)} component records to process")

    # lines and points must be stored in different layers in AGOL
    all_features = {"lines": [], "points": []}

    for component in data:
        feature, is_point_feature = make_esri_feature(**component)
        if not feature:
            continue

        if is_point_feature:
            all_features["points"].append(feature)
        else:
            all_features["lines"].append(feature)

    for feature_type in ["points", "lines"]:
        logger.info(f"Processing {feature_type} features...")
        features = all_features[feature_type]

        logger.info("Deleting all existing features...")
        delete_features(feature_type)

        logger.info(
            f"Uploading {len(features)} features in chunks of {UPLOAD_CHUNK_SIZE}..."
        )
        for feature_chunk in chunks(features, UPLOAD_CHUNK_SIZE):
            logger.info("Uploading chunk....")
            add_features(feature_type, feature_chunk)


if __name__ == "__main__":
    logger = get_logger(__file__)
    main()

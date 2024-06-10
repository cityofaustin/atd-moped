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


def get_esri_geometry_key(geometry):
    """Identify the name of the geometry property that will hold coordinate data in an
    Esri feature object.

    See: https://developers.arcgis.com/documentation/common-data-types/feature-object.htm

    Args:
        geometry (dict): A geojson geomtery object

    Returns:
        Str: "points" or "paths"
    """
    return "points" if geometry["type"] == "MultiPoint" else "paths"


def make_esri_feature(*, esri_geometry_key, geometry, attributes):
    """Create an Esri feature object that can be uploaded to the AGOL REST API.

    See: https://developers.arcgis.com/documentation/common-data-types/feature-object.htm

    Args:
        esri_geometry_key (str): `paths` or `points`: see the `get_esri_geometry_key` docstring
        geometry (dict): A geojson geometry object, such as one returned from our
            component view in Moped
        attribute (dict): Any additional properties to be included as feature attributes

    Returns:
        dict: An Esri feature object
    """
    if not geometry:
        return None, None

    feature = {
        "attributes": attributes,
        "geometry": {
            "spatialReference": {"wkid": 4326},
        },
    }
    feature["geometry"][esri_geometry_key] = geometry["coordinates"]
    return feature


# TODO: Get component project's updated_at date
# TODO: Check if the last run date
# TODO: If the component project's updated_at date is greater than the last run date, then update the component project
# TODO: If not, do not update the component in AGOL
# TODO: Determine if can update the component in AGOL by OBJECTID
# TODO: Or, if we should delete the component in AGOL and re-add it. Do OBJECTIDs need to be stable?


def main():
    logger.info("Getting token...")
    get_token()

    logger.info("Downloading component data...")
    data = make_hasura_request(query=COMPONENTS_QUERY)["component_arcgis_online_view"]

    logger.info(f"{len(data)} component records to process")

    # lines and points must be stored in different layers in AGOL
    all_features = {"lines": [], "points": [], "combined": []}

    logger.info("Building Esri feature objects...")
    for component in data:
        # extract geometry and line geometry from component data
        # for line features, the line geometry is redundant/identical to geometry
        # for point features, it is the buffered ring around the point as defined
        # in the Moped component view
        geometry = component.pop("geometry")
        line_geometry = component.pop("line_geometry")

        if not geometry:
            continue

        esri_geometry_key = get_esri_geometry_key(geometry)
        feature = make_esri_feature(
            esri_geometry_key=esri_geometry_key, geometry=geometry, attributes=component
        )

        # adds a special `source_geometry_type` column that will be useful on the `combined` layer
        # so that we can keep track of if the original feature was a point or line geometry
        feature["attributes"]["source_geometry_type"] = (
            "point" if esri_geometry_key == "points" else "line"
        )

        if not feature:
            continue

        if esri_geometry_key == "points":
            all_features["points"].append(feature)
            # create the point -> line feature
            if line_geometry["type"] == "LineString":
                # if we're converting a single point to a line, we need to convert that line geom to
                # a multi-line geometry
                line_geometry["coordinates"] = [line_geometry["coordinates"]]
            line_feature = make_esri_feature(
                esri_geometry_key="paths", geometry=line_geometry, attributes=component
            )
            all_features["combined"].append(line_feature)
        else:
            all_features["lines"].append(feature)
            all_features["combined"].append(feature)

    for feature_type in ["points", "lines", "combined"]:
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

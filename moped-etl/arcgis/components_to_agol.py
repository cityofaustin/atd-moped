#!/usr/bin/env python
"""Copies all Moped component records to ArcGIS Online (AGOL)"""
# docker run -it --rm  --network host --env-file env_file -v ${PWD}:/app  moped-agol /bin/bash
import argparse
import logging
from datetime import datetime, timezone

from process.logging import get_logger
from settings import (
    COMPONENTS_QUERY,
    COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
    UPLOAD_CHUNK_SIZE,
)
from utils import (
    make_hasura_request,
    get_token,
    delete_all_features,
    delete_features_by_project_id,
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


# TODO: Before updating the component in AGOL, deleted all existing components from updated project
# TODO: Log ids of deleted components and log ids replaced components (for troubleshooting etl failures)
# TODO: If not, do not update the component in AGOL
# TODO: Query the objectids of components in AGOL per updated project
# TODO: Batch or 1 by 1? If batch, how many components per batch?
# TODO: See https://github.com/cityofaustin/atd-knack-services for example


def main(args):
    logger.info("Getting token...")
    get_token()

    if args.full:
        logger.info("Getting component features from all projects...")
        data = make_hasura_request(query=COMPONENTS_QUERY)[
            "component_arcgis_online_view"
        ]

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
                esri_geometry_key=esri_geometry_key,
                geometry=geometry,
                attributes=component,
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
                    esri_geometry_key="paths",
                    geometry=line_geometry,
                    attributes=component,
                )
                all_features["combined"].append(line_feature)
            else:
                all_features["lines"].append(feature)
                all_features["combined"].append(feature)

        for feature_type in ["points", "lines", "combined"]:
            logger.info(f"Processing {feature_type} features...")
            features = all_features[feature_type]

            logger.info("Deleting all existing features...")
            delete_all_features(feature_type)

            logger.info(
                f"Uploading {len(features)} features in chunks of {UPLOAD_CHUNK_SIZE}..."
            )
            for feature_chunk in chunks(features, UPLOAD_CHUNK_SIZE):
                logger.info("Uploading chunk....")
                add_features(feature_type, feature_chunk)
    else:
        logger.info("Getting component features from recently updated projects...")
        data = make_hasura_request(
            query=COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
            variables={"lastRunDate": args.date},
        )["component_arcgis_online_view"]

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
                esri_geometry_key=esri_geometry_key,
                geometry=geometry,
                attributes=component,
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
                    esri_geometry_key="paths",
                    geometry=line_geometry,
                    attributes=component,
                )
                all_features["combined"].append(line_feature)
            else:
                all_features["lines"].append(feature)
                all_features["combined"].append(feature)

        # Get project IDs that need to have features deleted & replaced and then delete them from AGOL
        project_ids = []

        for component in data:
            project_ids.append(component["project_id"])

        project_ids_for_feature_delete = list(set(project_ids))

        for project_id in project_ids_for_feature_delete:
            logger.info(f"Deleting all existing features for project {project_id}...")
            delete_features_by_project_id(project_id)

        # Adding updated features to AGOL
        for feature_type in ["points", "lines", "combined"]:
            logger.info(f"Processing {feature_type} features...")
            features = all_features[feature_type]

            logger.info(
                f"Uploading {len(features)} features in chunks of {UPLOAD_CHUNK_SIZE}..."
            )
            for feature_chunk in chunks(features, UPLOAD_CHUNK_SIZE):
                logger.info("Uploading chunk....")
                add_features(feature_type, feature_chunk)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-d",
        "--date",
        type=str,
        default=datetime.now(timezone.utc).isoformat(),
        help=f"ISO date string of latest updated_at value to find project records to update.",
    )

    parser.add_argument(
        "-f",
        "--full",
        action="store_true",
        help=f"Delete and replace all project components.",
    )

    parser.add_argument("-t", "--test", action="store_true")

    args = parser.parse_args()

    log_level = logging.DEBUG if args.test else logging.INFO
    logger = get_logger(name="components-to-agol", level=log_level)

    if args.full:
        logger.info(f"Starting sync. Replacing all projects' components data...")
    else:
        logger.info(
            f"Starting sync. Finding projects updated since {args.date} and replacing components data..."
        )

    main(args)

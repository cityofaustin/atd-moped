#!/usr/bin/env python
"""Copies all Moped component records to ArcGIS Online (AGOL)"""
# docker compose run arcgis;
import logging
import json

from bs4 import BeautifulSoup

from process.logging import get_logger
from cli import get_cli_args
from settings import (
    COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
    EXPLODED_COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
    UPLOAD_CHUNK_SIZE,
)
from utils import (
    make_hasura_request,
    get_token,
    delete_all_features,
    delete_features_by_project_ids,
    add_features,
    chunks,
    get_logger,
)


def has_html_tags(html_string_to_check):
    """Identify if a string contains HTML tags.

    See: https://pypi.org/project/beautifulsoup4/

    Args:
        html_string_to_check (str): A string to test for HTML tags

    Returns:
        bool: True if the string contains HTML tags, False otherwise
    """
    return bool(BeautifulSoup(html_string_to_check, "html.parser").find())


def is_valid_HTML_tag(html_string_to_check):
    """Identify if a string contains valid HTML.

    See: https://pypi.org/project/beautifulsoup4/

    Args:
        html_string_to_check (str): A string that contains HTML to test for valid HTML.

    Returns:
        bool: True if the string contains valid HTML, False otherwise
    """
    soup = BeautifulSoup(html_string_to_check, "html.parser")
    return html_string_to_check == str(soup)


def handle_status_updates(features):
    """Check project status updates for valid or invalid HTML; escape HTML if needed.
    Project status updates can be plain text, valid HTML, or invalid HTML. If invalid HTML is found,
    the content of the update is escaped to prevent it from being rejected by AGOL (504 or 400 error).

    Args:
        features (list): list of Esri feature objects

    Returns:
        list: list of Esri feature objects with status update HTML escaped if needed
    """
    for record in features:
        id = record["attributes"]["project_id"]

        status_update = record["attributes"]["project_status_update"]

        if status_update != None and has_html_tags(status_update):
            if not is_valid_HTML_tag(status_update):
                logger.info(
                    f"Invalid HTML tag found in project_id: {id}. Getting HTML text..."
                )
                html_text = BeautifulSoup(status_update, "html.parser").get_text()
                record["attributes"]["project_status_update"] = html_text

    return features


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
        esri_geometry_key (str): `paths` or `points`, `point`: see the `get_esri_geometry_key` docstring
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
    if (esri_geometry_key == "points") or (esri_geometry_key == "paths"):
        feature["geometry"][esri_geometry_key] = geometry["coordinates"]
    elif esri_geometry_key == "point":
        geometry = json.loads(geometry)
        feature["geometry"]["y"] = geometry["coordinates"][1]
        feature["geometry"]["x"] = geometry["coordinates"][0]
    else:
        feature["geometry"]["y"] = geometry["coordinates"][1]
        feature["geometry"]["x"] = geometry["coordinates"][0]

    return feature


def make_all_features(data, exploded_geometry):
    """Take a list of component feature records and create Esri feature objects for lines, points, and combined layers in AGOL.

    Args:
        data (dict): a list of component feature records
        exploded_geometry (dict): a dictionary of exploded geometry data from the component_arcgis_online_view. This is created
            by taking the multi-point geometry from the component_arcgis_online_view and "exploding" it into individual points.

    Returns:
        dict: An object with lists of Esri feature objects for lines, points, and combined layers
    """

    all_features = {"lines": [], "points": [], "combined": [], "exploded": []}

    logger.info("Building Esri feature objects...")
    for component in data:

        # Extract geometry and line geometry from component data.
        # For line features, the line geometry is redundant/identical to geometry.
        # For point features, it is the buffered ring around the point as defined
        # in the Moped component view.

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
            line_feature = make_esri_feature(
                esri_geometry_key="paths",
                geometry=line_geometry,
                attributes=component,
            )
            all_features["combined"].append(line_feature)

            project_component_id = feature["attributes"]["project_component_id"]
            # Filter exploded_geometry to only include dicts with matching project_component_id
            matching_exploded_geometry_records = [
                feature
                for feature in exploded_geometry
                if feature.get("project_component_id") == project_component_id
            ]
            for record in matching_exploded_geometry_records:
                geometry = record.pop("geometry")
                esri_geometry_key = "point"

                feature = make_esri_feature(
                    esri_geometry_key="point",
                    geometry=geometry,
                    attributes=component,
                )

                feature["attributes"]["source_geometry_type"] = "point"
                all_features["exploded"].append(feature)

        else:
            all_features["lines"].append(feature)
            all_features["combined"].append(feature)

    return all_features


def main(args):
    logger.info("Getting token...")
    get_token()

    # Pass filters to the GraphQL query: none if full replace OR include a date filter for incremental updates
    variables = (
        {"project_where": {}, "component_where": {}}
        if args.full
        else {
            "project_where": {"updated_at": {"_gt": args.date}},
            "component_where": {"project_updated_at": {"_gt": args.date}},
        }
    )

    logger.info(
        f"Getting {'all' if args.full else 'recently updated'} component features from all projects..."
    )
    data = make_hasura_request(
        query=COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
        variables=variables,
    )
    components_data = data["component_arcgis_online_view"]
    projects_data = data["moped_project"]

    exploded_data = make_hasura_request(
        query=EXPLODED_COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
        variables={"where": variables["component_where"]},
    )["exploded_component_arcgis_online_view"]

    all_features = make_all_features(components_data, exploded_data)

    if args.full:
        for feature_type in ["points", "lines", "combined", "exploded"]:
            logger.info(f"Processing {feature_type} features...")
            features_of_type = all_features[feature_type]
            features = handle_status_updates(features_of_type)

            logger.info("Deleting all existing features...")
            if not args.test:
                delete_all_features(feature_type)

            logger.info(
                f"Uploading {len(features)} features in chunks of {UPLOAD_CHUNK_SIZE}..."
            )
            for feature_chunk in chunks(features, UPLOAD_CHUNK_SIZE):
                logger.info("Uploading chunk....")
                if not args.test:
                    add_features(feature_type, feature_chunk)
    else:
        # Get project IDs that have been updated (including soft-deleted projects) for deletes
        project_ids_for_delete = [project["project_id"] for project in projects_data]

        # Delete outdated feature from AGOL and add updated features
        for feature_type in ["points", "lines", "combined", "exploded"]:
            logger.info(f"Processing {feature_type} features...")
            features_of_type = all_features[feature_type]
            features = handle_status_updates(features_of_type)

            logger.info(
                f"Deleting all existing features in {feature_type} layer for updated projects in chunks of {UPLOAD_CHUNK_SIZE}..."
            )
            for delete_chunk in chunks(project_ids_for_delete, UPLOAD_CHUNK_SIZE):
                joined_project_ids = ", ".join(str(x) for x in delete_chunk)
                logger.info(f"Deleting features with project ids {joined_project_ids}")
                if not args.test:
                    delete_features_by_project_ids(feature_type, joined_project_ids)

            logger.info(
                f"Uploading {len(features)} features in chunks of {UPLOAD_CHUNK_SIZE}..."
            )
            for feature_chunk in chunks(features, UPLOAD_CHUNK_SIZE):
                logger.info("Uploading chunk....")
                if not args.test:
                    add_features(feature_type, feature_chunk)


if __name__ == "__main__":
    args = get_cli_args()
    logger = get_logger(name="components-to-agol", level=logging.INFO)

    if args.date and args.full:
        raise Exception(
            "Please provide either the -d flag with ISO date string with TZ offset or the -f flag and not both."
        )

    if not args.date and not args.full:
        raise Exception(
            "Please provide either the -d flag with optional ISO date string with TZ offset or the -f flag."
        )

    if args.full:
        logger.info(f"Starting sync. Replacing all projects' components data...")
    else:
        logger.info(
            f"Starting sync. Finding projects updated since {args.date} and replacing components data..."
        )

    main(args)

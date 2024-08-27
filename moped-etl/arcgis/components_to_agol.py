#!/usr/bin/env python
"""Copies all Moped component records to ArcGIS Online (AGOL)"""
# docker compose run arcgis;
import argparse
import logging
import json
from datetime import datetime, timezone, timedelta

from process.logging import get_logger
from settings import (
    COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
    UPLOAD_CHUNK_SIZE,
)
from utils import (
    make_hasura_request,
    make_hasura_sql_query,
    get_token,
    delete_all_features,
    delete_features_by_project_ids,
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


def write_pretty_json(variable, filename):
    with open(filename, "w") as file:
        json.dump(variable, file, indent=4, sort_keys=True)


def make_all_features(data, exploded_geometry):
    """Take a list of component feature records and create Esri feature objects for lines, points, and combined layers in AGOL.

    Args:
        data (dict): a list of component feature records
        exploded_geometry (dict): a dictionary of exploded geometry data from the component_arcgis_online_view

    Returns:
        dict: An object with lists of Esri feature objects for lines, points, and combined layers
    """

    # from pprint import pprint
    # pprint(f"data[0]: {data[0]}")
    # pprint(f"exploded_geometry[0]: {exploded_geometry[0]}")
    # quit()

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

            project_component_id = feature["attributes"]["project_component_id"]

            # Find the elements in exploded_geometry which match the project_component_id
            matching_elements = [
                element
                for element in exploded_geometry
                if element["project_component_id"] == str(project_component_id)
            ]

            for component in matching_elements:

                geometry_json = component.pop(
                    "geometry"
                )  # reminder, this is `pop()` on a dict, not an array

                geometry = json.loads(
                    geometry_json
                )  # Decode JSON string into Python dictionary

                if not geometry:
                    continue
                esri_geometry_key = get_esri_geometry_key(geometry)
                feature = make_esri_feature(
                    esri_geometry_key=esri_geometry_key,
                    geometry=geometry,
                    attributes=component,
                )
                feature["attributes"]["source_geometry_type"] = (
                    "point" if esri_geometry_key == "points" else "line"
                )
                if not feature:
                    continue

                all_features["exploded"].extend(matching_elements)
        else:
            all_features["lines"].append(feature)
            all_features["combined"].append(feature)

    return all_features


def transform_data(input_data):
    if not input_data or len(input_data) < 2:
        return []

    field_names = input_data[0]
    result = []

    for row in input_data[1:]:
        obj = {field: value for field, value in zip(field_names, row)}
        result.append(obj)

    return result


def main(args):
    logger.info("Getting token...")
    get_token()

    query = """
SELECT 
    --ST_GeometryType(dump.geom) AS geometry_type,
    --dump.path[1] AS point_index, -- ordinal value of the point in the MultiPoint geometry
    ST_AsGeoJSON(dump.geom) as geometry,
    component_arcgis_online_view.completion_date,
    component_arcgis_online_view.completion_end_date,
    component_arcgis_online_view.component_categories,
    component_arcgis_online_view.component_description,
    component_arcgis_online_view.component_id,
    component_arcgis_online_view.component_location_description,
    component_arcgis_online_view.component_name,
    component_arcgis_online_view.component_name_full,
    component_arcgis_online_view.component_phase_id,
    component_arcgis_online_view.component_phase_name,
    component_arcgis_online_view.component_phase_name_simple,
    component_arcgis_online_view.component_subcomponents,
    component_arcgis_online_view.component_subtype,
    component_arcgis_online_view.component_tags,
    component_arcgis_online_view.component_url,
    component_arcgis_online_view.component_work_types,
    component_arcgis_online_view.construction_start_date,
    component_arcgis_online_view.contract_numbers,
    component_arcgis_online_view.council_districts,
    component_arcgis_online_view.council_districts_searchable,
    component_arcgis_online_view.current_phase_name,
    component_arcgis_online_view.current_phase_name_simple,
    component_arcgis_online_view.ecapris_subproject_id,
    component_arcgis_online_view.feature_ids,
    component_arcgis_online_view.funding_source_name,
    component_arcgis_online_view.funding_sources,
    component_arcgis_online_view.geometry,
    component_arcgis_online_view.interim_project_component_id,
    component_arcgis_online_view.interim_project_id,
    component_arcgis_online_view.is_within_city_limits,
    component_arcgis_online_view.knack_data_tracker_project_record_id,
    component_arcgis_online_view.length_feet_total,
    component_arcgis_online_view.length_miles_total,
    component_arcgis_online_view.line_geometry,
    component_arcgis_online_view.parent_project_id,
    component_arcgis_online_view.parent_project_name,
    component_arcgis_online_view.parent_project_name_full,
    component_arcgis_online_view.parent_project_url,
    component_arcgis_online_view.project_added_by,
    component_arcgis_online_view.project_component_id,
    component_arcgis_online_view.project_description,
    component_arcgis_online_view.project_designer,
    component_arcgis_online_view.project_development_status,
    component_arcgis_online_view.project_development_status_date,
    component_arcgis_online_view.project_development_status_date_calendar_year,
    component_arcgis_online_view.project_development_status_date_calendar_year_month,
    component_arcgis_online_view.project_development_status_date_calendar_year_month_numeric,
    component_arcgis_online_view.project_development_status_date_calendar_year_quarter,
    component_arcgis_online_view.project_development_status_date_fiscal_year,
    component_arcgis_online_view.project_development_status_date_fiscal_year_quarter,
    component_arcgis_online_view.project_id,
    component_arcgis_online_view.project_inspector,
    component_arcgis_online_view.project_lead,
    component_arcgis_online_view.project_name,
    component_arcgis_online_view.project_name_secondary,
    component_arcgis_online_view.project_name_full,
    component_arcgis_online_view.project_partners,
    component_arcgis_online_view.project_phase_id,
    component_arcgis_online_view.project_phase_name,
    component_arcgis_online_view.project_phase_name_simple,
    component_arcgis_online_view.project_sponsor,
    component_arcgis_online_view.project_status_update,
    component_arcgis_online_view.project_status_update_date_created,
    component_arcgis_online_view.project_tags,
    component_arcgis_online_view.project_team_members,
    component_arcgis_online_view.project_updated_at,
    component_arcgis_online_view.project_url,
    component_arcgis_online_view.project_website,
    component_arcgis_online_view.public_process_status,
    component_arcgis_online_view.related_project_ids,
    component_arcgis_online_view.related_project_ids_searchable,
    component_arcgis_online_view.signal_ids,
    component_arcgis_online_view.srts_id,
    component_arcgis_online_view.substantial_completion_date,
    component_arcgis_online_view.substantial_completion_date_estimated,
    component_arcgis_online_view.task_order_names,
    component_arcgis_online_view.type_name,
    component_arcgis_online_view.workgroup_contractors
FROM 
    component_arcgis_online_view,
    LATERAL ST_Dump(ST_GeomFromGeoJSON(component_arcgis_online_view.geometry)) AS dump
WHERE
    ST_GeometryType(ST_GeomFromGeoJSON(component_arcgis_online_view.geometry)) = 'ST_MultiPoint'
"""

    exploded_geometry = transform_data(make_hasura_sql_query(query=query))

    variables = (
        {"where": {}}
        if args.full
        else {"where": {"project_updated_at": {"_gt": args.date}}}
    )

    logger.info(
        f"Getting {'all' if args.full else 'recently updated'} component features from all projects..."
    )
    data = make_hasura_request(
        query=COMPONENTS_QUERY_BY_LAST_UPDATE_DATE,
        variables=variables,
    )["component_arcgis_online_view"]

    all_features = make_all_features(data, exploded_geometry)

    if args.full:
        for feature_type in ["points", "lines", "combined", "exploded"]:
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
        # Get unique project IDs that need to have features deleted & replaced
        project_ids = []

        for component in data:
            project_ids.append(component["project_id"])

        project_ids_for_feature_delete = list(set(project_ids))

        # Delete outdated feature from AGOL and add updated features
        for feature_type in ["points", "lines", "combined"]:
            logger.info(f"Processing {feature_type} features...")
            logger.info(
                f"Deleting all {len(all_features[feature_type])} existing features in {feature_type} layer for updated projects in chunks of {UPLOAD_CHUNK_SIZE}..."
            )
            for delete_chunk in chunks(
                project_ids_for_feature_delete, UPLOAD_CHUNK_SIZE
            ):
                joined_project_ids = ", ".join(str(x) for x in delete_chunk)
                logger.info(f"Deleting features with project ids {joined_project_ids}")
                delete_features_by_project_ids(feature_type, joined_project_ids)

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
        nargs="?",
        const=(datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
        default=None,
        help="ISO date string with TZ offset (ex. 2024-06-28T00:06:16.360805+00:00) of latest updated_at value to find project records to update. Defaults to 7 days ago if -d is used without a value.",
    )

    parser.add_argument(
        "-f",
        "--full",
        action="store_true",
        help="Delete and replace all project components.",
    )

    args = parser.parse_args()
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

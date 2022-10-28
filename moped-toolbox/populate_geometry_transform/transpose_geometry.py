#!/usr/bin/python3

from operator import truediv
import os

import psycopg2
import psycopg2.extras
import geojson
import time

import pprint

pp = pprint.PrettyPrinter(indent=4)

DB_HOST = os.environ.get("DB_HOST", "host.docker.internal")
DB_USER = os.environ.get("DB_USER", "moped")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "moped")
DB_NAME = os.environ.get("DB_NAME", "moped")

pg = psycopg2.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, dbname=DB_NAME)

# function to remove leading underscore from argument if there is one
def remove_leading_underscore(arg):
    if arg.startswith("_"):
        return arg[1:]
    else:
        return arg

def check_keys(obj, keys):
    target_keys = set(keys)
    provided_keys = set(obj.keys())
    if (target_keys == provided_keys):
        return True
    return False

def execute(sql, values, get_result=False):
    try:
        update = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        update.execute(
            sql,
            values,
        )
        if get_result:
            result = update.fetchone()
    except psycopg2.errors.InternalError_ as e:
        print("\n\b🛎Postgres error: " + str(e))
        print(geojson.dumps(feature, indent=2))
        pg.rollback()
    else:  # no exception
        pg.commit()
    if get_result:
        return result
    else:
        return True


def moped_proj_features():
    # this should make you pass an argument because it's destructive
    sql = """
    truncate feature_drawn_lines;
    truncate feature_drawn_points;
    truncate feature_intersections;
    truncate feature_signals;
    truncate feature_street_segments;
    truncate features;
    """
    execute(sql, [], get_result=False)

    feature_attributes = []

    sql = """
    select
      moped_proj_components.project_id,
      moped_components.component_id as component_archtype_id,
      moped_proj_components.project_component_id,
      moped_components.component_name,
      moped_components.component_subtype,
      feature_layers.internal_table,
      feature_layers.id as feature_layer_id,
      feature_id,
      feature::character varying as feature,
      moped_proj_features.feature_id
    from moped_proj_features
    join moped_proj_components on (moped_proj_components.project_component_id = moped_proj_features.project_component_id)
    join moped_components on (moped_proj_components.component_id = moped_components.component_id)
    left join feature_layers on (feature_layers.id = moped_components.feature_layer_id)
    where true
    --and feature_layers.internal_table in ('feature_signals')
    --and feature_layers.internal_table in ('feature_street_segments')
    --and moped_proj_components.project_id = 228
    order by moped_proj_features.feature_id asc
    """

    cursor = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute(sql)
    features = cursor.fetchall()

    for record in features:
        feature = geojson.loads(record["feature"])

        if not feature.is_valid:
            raise Exception("Invalid feature")

        if True:
            print("Project ID: ", record["project_id"])
            print("Component ID: ", record["project_component_id"])
            print("Component Name: ", record["component_name"])
            print("Component Subtype: ", record["component_subtype"])
            print("Feature ID: ", record["feature_id"])
            print("Default internal table: ", record["internal_table"])
            print(str(record["feature_id"]) + ": " + str(feature["geometry"]["type"]))
            pp.pprint(feature["properties"])
            pp.pprint(feature["geometry"])
        feature_attributes.append(feature["properties"])

        print(feature["properties"])

        feature_id = None

        if (check_keys(
            feature["properties"],
            ["PROJECT_EXTENT_ID", "renderType", "sourceLayer"])
            and feature["properties"]["renderType"] == "Point"):

            print("Found a drawn point layer!")
            pp.pprint(feature["properties"])

            sql = f"""
            insert into feature_drawn_points
            """

            fields = ["component_id", "project_extent_id", "render_type", "source_layer"]
            values = [
                record["project_component_id"],
                feature["properties"]["PROJECT_EXTENT_ID"],
                feature["properties"]["renderType"],
                feature["properties"]["sourceLayer"],
            ]

            sql += "(" + ",\n".join(fields) + ") values ("
            sql += ",\n".join(["%s"] * len(values)) + ")"
            sql += "\nreturning id"

            print(sql, values)
            result = execute(sql, values, get_result=True)
            feature_id = result["id"]

            sql = f"""
            update feature_drawn_points
            set geography = ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))::geography
            where id = %s
            """
            values = [str(feature["geometry"]), feature_id]

            print(sql, values)
            execute(sql, values, get_result=False)

        elif (check_keys(
            feature["properties"],
            ["PROJECT_EXTENT_ID", "renderType", "sourceLayer"])
            and feature["properties"]["renderType"] == "LineString"):

            print("Found a drawn line layer!")
            pp.pprint(feature["properties"])

            sql = f"""
            insert into feature_drawn_lines
            """

            fields = ["component_id", "project_extent_id", "render_type", "source_layer"]
            values = [
                record["project_component_id"],
                feature["properties"]["PROJECT_EXTENT_ID"],
                feature["properties"]["renderType"],
                feature["properties"]["sourceLayer"],
            ]

            sql += "(" + ",\n".join(fields) + ") values ("
            sql += ",\n".join(["%s"] * len(values)) + ")"
            sql += "\nreturning id"

            print(sql, values)
            result = execute(sql, values, get_result=True)
            feature_id = result["id"]

            sql = f"""
            update feature_drawn_lines
            set geography = ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))::geography
            where id = %s
            """
            values = [str(feature["geometry"]), feature_id]

            print(sql, values)
            execute(sql, values, get_result=False)


        elif (
            record["component_name"] == "Project Extent - Generic"
            and str(feature["geometry"]["type"]) == "Point"
        ):
            # i think this code which is so similar to the blocks around it could be DRYed up
            # but i don't think it's worth the effort here. see comment below.

            sql = f"""
            insert into feature_intersections
            """

            fields = ["component_id"]
            values = [record["project_component_id"]]

            for key, value in feature["properties"].items():

                # key transformation rules
                key = remove_leading_underscore(key)
                key = key.lower()
                key = "render_type" if key == "rendertype" else key
                key = "knack_id" if key == "id" else key
                key = "source_layer" if key == "sourcelayer" else key
                key = "intersection_id" if key == "intersectionid" else key

                fields.append(key)
                values.append(value)

            sql += "(" + ",\n".join(fields) + ") values ("
            sql += ",\n".join(["%s"] * len(values)) + ")"
            sql += "\nreturning id"

            print(sql, values)
            result = execute(sql, values, get_result=True)
            feature_id = result["id"]

            sql = f"""
            update feature_intersections
            set geography = ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))::geography
            where id = %s
            """
            values = [str(feature["geometry"]), feature_id]

            print(sql, values)
            execute(sql, values, get_result=False)

        elif (
            (
                record["component_name"] == "Sidewalk"
                and record["component_subtype"] == "With Curb and Gutter"
                and str(feature["geometry"]["type"]) == "Point"
            )
            or
            # the next three line are just being explicit about how i found record 297
            (
                record["component_name"] == "Transit"
                and record["component_subtype"] == "Transit/Bike Lane"
                and str(feature["geometry"]["type"]) == "Point"
                and record["feature_id"] == 297
            )
        ):

            # i think this code which is so similar to the blocks around it could be DRYed up
            # but i don't think it's worth the effort here

            sql = f"""
            insert into feature_signals
            """

            fields = ["component_id"]
            values = [record["project_component_id"]]
            for key, value in feature["properties"].items():

                # key transformation rules
                key = remove_leading_underscore(key)
                key = key.lower()
                key = "render_type" if key == "rendertype" else key
                key = "knack_id" if key == "id" else key
                key = "source_layer" if key == "sourcelayer" else key
                key = "intersection_id" if key == "intersectionid" else key

                fields.append(key)
                values.append(value)

            sql += "(" + ",\n".join(fields) + ") values ("
            sql += ",\n".join(["%s"] * len(values)) + ")"
            sql += "\nreturning id"

            print(sql, values)
            result = execute(sql, values, get_result=True)
            feature_id = result["id"]

            sql = f"""
            update feature_signals
            set geography = ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))::geography
            where id = %s
            """
            values = [str(feature["geometry"]), feature_id]

            print(sql, values)
            execute(sql, values, get_result=False)

        else:
            # This is the branch which handles records which require no special handling.
            # It handles the vast majority of records.

            sql = f"""
            insert into {record["internal_table"]}
            """

            fields = ["component_id"]
            values = [record["project_component_id"]]
            for key, value in feature["properties"].items():

                # key transformation rules
                key = remove_leading_underscore(key)
                key = key.lower()
                key = "render_type" if key == "rendertype" else key
                key = "knack_id" if key == "id" else key
                key = "source_layer" if key == "sourcelayer" else key
                key = "intersection_id" if key == "intersectionid" else key

                fields.append(key)
                values.append(value)

            sql += "(" + ",\n".join(fields) + ") values ("
            sql += ",\n".join(["%s"] * len(values)) + ")"
            sql += "\nreturning id"

            print(sql, values)
            result = execute(sql, values, get_result=True)
            feature_id = result["id"]

            sql = f"""
            update {record["internal_table"]}
            set geography = ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))::geography
            where id = %s
            """
            values = [str(feature["geometry"]), feature_id]

            print(sql, values)
            execute(sql, values, get_result=False)
        print("\n\n\n")

    pp.pprint(feature_attributes)


def main():
    # i thought there were maybe multiple tables to migrate, 😅
    moped_proj_features()


if __name__ == "__main__":
    main()

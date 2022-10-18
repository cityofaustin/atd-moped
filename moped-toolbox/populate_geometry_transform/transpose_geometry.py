#!/usr/bin/python3

import os
import json
import argparse

import psycopg2
import psycopg2.extras
import geojson

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


def moped_proj_features(args):
    sql = """
truncate component_feature_map;
truncate feature_drawn_lines;
truncate feature_drawn_points;
truncate feature_intersections;
truncate feature_signals;
truncate feature_street_segments;
truncate features;
"""
    values = []
    try:
        update = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        update.execute(
            sql, values,
        )
    except psycopg2.errors.InternalError_ as e:
        print("\n\b🛎Postgres error: " + str(e))
        print(geojson.dumps(feature, indent=2))
        pg.rollback()
    else:  # no exception
        pg.commit()


    sql = """
    select
      moped_proj_components.project_id,
      moped_components.component_id,
      moped_components.component_name,
      moped_components.component_subtype,
      feature_layers.internal_table,
      feature_id,
      feature::character varying as feature,
      moped_proj_features.feature_id
    from moped_proj_features
    join moped_proj_components on (moped_proj_components.project_component_id = moped_proj_features.project_component_id)
    join moped_components on (moped_proj_components.component_id = moped_components.component_id)
    left join feature_layers on (feature_layers.id = moped_components.feature_layer_id)
    where feature_layers.internal_table in ('feature_signals')
    --where feature_layers.internal_table in ('feature_street_segments')
    order by moped_proj_features.feature_id asc
    """

    cursor = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cursor.execute(sql)
    features = cursor.fetchall()

    for record in features:
        feature = geojson.loads(record["feature"])

        if not feature.is_valid:
            raise Exception("Invalid feature")

        #if str(feature["geometry"]["type"]) == 'Point':
            #continue

        # These need special handling, I think they will be half intersections, half segments.
        # It is a genuinely un-geographically typed feature. 🤔
        if record["component_name"] == "Project Extent - Generic":
            continue

        if record["component_name"] == "Sidewalk" and record["component_subtype"] == 'With Curb and Gutter' and str(feature["geometry"]["type"]) == 'Point':
            continue

        if True:
            print("Project ID: ", record["project_id"])
            print("Component Name: ", record["component_name"])
            print("Component Subtype: ", record["component_subtype"])
            print("Feature ID: ", record["feature_id"])
            print(str(record["feature_id"]) + ": " + str(feature["geometry"]["type"]))
            pp.pprint(feature["properties"])

        sql = f"""
        insert into {record["internal_table"]}
        """

        fields = []
        values = []
        for key, value in feature["properties"].items():

            key = remove_leading_underscore(key)
            key = key.lower()
            key = 'render_type' if key == 'rendertype' else key
            key = 'knack_id' if key == 'id' else key
            key = 'source_layer' if key == 'sourcelayer' else key

            fields.append(key)
            values.append(value)
        
        sql += "(" + ",\n".join(fields) + ") values ("
        sql += ",\n".join(["%s"] * len(values)) + ')'
        sql += "\nreturning id"

        print(sql)
        print("\n")

        try:
            update = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            update.execute(
                sql, values,
            )
            result = update.fetchone()
        except psycopg2.errors.InternalError_ as e:
            print("\n\b🛎Postgres error: " + str(e))
            print(geojson.dumps(feature, indent=2))
            pg.rollback()
        else:  # no exception
            pg.commit()

        feature_id = result["id"]

        sql = f"""
        insert into component_feature_map
        (component_id, feature_id) values (%s, %s)
        returning id
        """
        values = [record["component_id"], feature_id]

        try:
            update = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            update.execute(
                sql, values,
            )
            result = update.fetchone()
        except psycopg2.errors.InternalError_ as e:
            print("\n\b🛎Postgres error: " + str(e))
            print(geojson.dumps(feature, indent=2))
            pg.rollback()
        else:  # no exception
            pg.commit()




        continue;

        if feature["geometry"]["type"] == "Point":
            sql = """
            update moped_proj_features 
            set 
            geography_collection = ST_ForceCollection(ST_GeomFromGeoJSON(%s)),
            geography_point = ST_GeomFromGeoJSON(%s),
            attributes = %s
            where feature_id = %s
            ;
            """
            try:
                update = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                update.execute(
                    sql,
                    (
                        geojson.dumps(feature["geometry"]),
                        geojson.dumps(feature["geometry"]),
                        geojson.dumps(feature["properties"]),
                        record["feature_id"],
                    ),
                )
            except psycopg2.errors.InternalError_ as e:
                print("\n\b🛎Postgres error: " + str(e))
                print(geojson.dumps(feature, indent=2))
                pg.rollback()
            else:  # no exception
                pg.commit()
        if feature["geometry"]["type"] == "LineString":
            sql = """
            update moped_proj_features 
            set 
            geography_collection = ST_ForceCollection(ST_GeomFromGeoJSON(%s)),
            geography_linestring = ST_GeomFromGeoJSON(%s),
            attributes = %s
            where feature_id = %s
            ;
            """
            try:
                update = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                update.execute(
                    sql,
                    (
                        geojson.dumps(feature["geometry"]),
                        geojson.dumps(feature["geometry"]),
                        geojson.dumps(feature["properties"]),
                        record["feature_id"],
                    ),
                )
            except psycopg2.errors.InternalError_ as e:
                print("\n\b🛎Postgres error: " + str(e))
                print(geojson.dumps(feature, indent=2))
                pg.rollback()
            else:  # no exception
                pg.commit()


def main(args):
    moped_proj_features(args)


if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-s",
        "--schema",
        action="store_true",
        help=f"Make schema changes",
    )
    args = parser.parse_args()
    main(args)

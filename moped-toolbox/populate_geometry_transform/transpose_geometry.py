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

def execute(sql, values, get_result=False):
    try:
        update = pg.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        update.execute(
            sql, values,
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
    execute(sql, [], get_result=False)


    sql = """
    select
      moped_proj_components.project_id,
      moped_components.component_id as component_archtype_id,
      moped_proj_components.project_component_id,
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

        #if str(feature["geometry"]["type"]) == 'Point':
            #continue

        feature_id = None
        # These need special handling, I think they will be half intersections, half segments.
        # It is a genuinely un-geographically typed feature. 🤔
        if record["component_name"] == "Project Extent - Generic":
            continue

        elif (record["component_name"] == "Sidewalk" and
                record["component_subtype"] == 'With Curb and Gutter' and 
                str(feature["geometry"]["type"]) == 'Point'):
            continue

        elif (record["component_name"] == "Transit" and 
                record["component_subtype"] == 'Transit/Bike Lane' and 
                str(feature["geometry"]["type"]) == 'Point'):
            continue
        
        else:

            if True:
                print("Project ID: ", record["project_id"])
                print("Component Name: ", record["component_name"])
                print("Component Subtype: ", record["component_subtype"])
                print("Feature ID: ", record["feature_id"])
                print("Default internal table: ", record["internal_table"])
                print(str(record["feature_id"]) + ": " + str(feature["geometry"]["type"]))
                pp.pprint(feature["properties"])
                pp.pprint(feature["geometry"])

            sql = f"""
            insert into {record["internal_table"]}
            """

            fields = []
            values = []
            for key, value in feature["properties"].items():

                # key transformation rules
                key = remove_leading_underscore(key)
                key = key.lower()
                key = 'render_type' if key == 'rendertype' else key
                key = 'knack_id' if key == 'id' else key
                key = 'source_layer' if key == 'sourcelayer' else key
                key = 'intersection_id' if key == 'intersectionid' else key

                fields.append(key)
                values.append(value)
            
            sql += "(" + ",\n".join(fields) + ") values ("
            sql += ",\n".join(["%s"] * len(values)) + ')'
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

        sql = f"""
        insert into component_feature_map
        (component_id, feature_id) values (%s, %s)
        returning id
        """
        values = [record["project_component_id"], feature_id]

        print(sql, values)
        result = execute(sql, values, get_result=True)
        feature_id = result["id"]


        print("\n\n\n")


def main(args):
    moped_proj_features(args)


if __name__ == "__main__":

    #parser = argparse.ArgumentParser()
    #parser.add_argument()
    #args = parser.parse_args()
    main(args)

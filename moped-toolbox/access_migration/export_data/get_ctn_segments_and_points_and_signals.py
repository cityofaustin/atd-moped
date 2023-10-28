"""Download access db facilities spatial data from arcgis online"""
import json
import arcgis
from secrets import AGOL_USER, AGOL_PW

out_dir = "./migrate_data/data/agol"

services = [
    {"name": "ctn_segments", "id": "24455c781dbd48669c601ede4b365d1f"},
    {"name": "ctn_intersections", "id": "d92be8916fd24966aa9c33c481cd1a2c"},
    {"name": "signals", "id": "e6eb94d1e7cc45c2ac452af6ae6aa534"},
]


def main():
    gis = arcgis.GIS(
        url="https://austin.maps.arcgis.com", username=AGOL_USER, password=AGOL_PW
    )

    for service_def in services:
        print(f"Getting {service_def['name']}")
        service = gis.content.get(service_def["id"])
        layer = service.layers[0]
        # by default, an empty query() call will return all features
        # https://developers.arcgis.com/python/api-reference/arcgis.features.toc.html#featurelayer
        featureSet = layer.query(out_sr=4326)
        # some features for whatever reason do not have a geometry - which will cause the `to_geojson` method to fail
        # so create a new featureSet with only features who have a valid geomtery
        if service_def["name"] == "ctn_segments":
            #  ingores "curvePaths" - which seriously wtf
            # unclear wtf these are - they appeared on 27 oct 2023
            featureSetGeomOnly = arcgis.features.FeatureSet(
                [
                    f
                    for f in featureSet.features
                    if f.geometry and f.geometry.get("paths")
                ]
            )
        else:
            featureSetGeomOnly = arcgis.features.FeatureSet(
                [f for f in featureSet.features if f.geometry]
            )
        # save this data as geojson
        geojson = featureSetGeomOnly.to_geojson
        fname = f"{out_dir}/{service_def['name']}.geojson"
        print(f"Saving to {fname}")
        with open(fname, "w") as fout:
            fout.write(geojson)


if __name__ == "__main__":
    main()

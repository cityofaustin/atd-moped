"""Download access db facilities spatial data from arcgis online"""
import json
import arcgis
from secrets import AGOL_USER, AGOL_PW

out_dir = "../migrate_data/data/agol"

services = [
    { "name": "lines", "id": "879053efe2314d67a5b7f7c062381059"},
    { "name": "points", "id": "1bbf7aca09754f858781a121e9510f0f"}
]

def main():
    gis = arcgis.GIS(url="https://austin.maps.arcgis.com", username=AGOL_USER, password=AGOL_PW)

    for service_def in services:
        print(f"Getting {service_def['name']}")
        service = gis.content.get(service_def["id"])
        layer = service.layers[0]
        # by default, an empty query() call will return all features
        # https://developers.arcgis.com/python/api-reference/arcgis.features.toc.html#featurelayer
        featureSet = layer.query(out_sr=4326)
        # some features for whatever reason do not have a geometry - which will cause the `to_geojson` method to fail
        # so create a new featureSet with only features who have a valid geomtery
        featureSetGeomOnly = arcgis.features.FeatureSet( [f for f in featureSet.features if f.geometry])
        # save this data as geojson
        geojson = featureSetGeomOnly.to_geojson
        fname = f"{out_dir}/interim_facility_{service_def['name']}.geojson"
        print(f"Saving to {fname}")
        with open(fname, "w") as fout:
            fout.write(geojson)

if __name__ == "__main__":
    main()

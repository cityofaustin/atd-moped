"""Downloads council districts geojson from AGOL and inserts it into Moped"""
import argparse
import requests
from secrets import HASURA


DISTRICTS_URL = "https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/BOUNDARIES_single_member_districts/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=8&outSR=4326&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="

MUTATION = """
mutation InsertCouncilDistricts($objects: [layer_council_district_insert_input!]!) {
  insert_layer_council_district(objects: $objects) {
    returning {
      id
    }
  }
}
"""


def make_hasura_request(*, query, env, variables=None):
    """Fetch data from hasura

    Args:
        query (str): the hasura query
        variables (dict): optional variables to be included
        env (str): the environment name, which will be used to acces secrets

    Raises:
        ValueError: If no data is returned

    Returns:
        dict: Hasura JSON response data
    """
    admin_secret = HASURA["hasura_graphql_admin_secret"][env]
    endpoint = HASURA["hasura_graphql_endpoint"][env]
    headers = {
        "X-Hasura-Admin-Secret": admin_secret,
        "content-type": "application/json",
    }
    payload = {"query": query, "variables": variables}
    res = requests.post(endpoint, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"]
    except KeyError:
        raise ValueError(data)


def get_council_districts_geojson():
    res = requests.get(DISTRICTS_URL)
    res.raise_for_status()
    return res.json()["features"]


def make_multipoly(features):
    for feature in features:
        if feature["geometry"]["type"] == "Polygon":
            feature["geometry"]["type"] = "MultiPolygon"
            feature["geometry"]["coordinates"] = [feature["geometry"]["coordinates"]]
            print(
                f"Converted district {feature['properties']['COUNCIL_DISTRICT']} to MuliPolygon"
            )

def merge_district_2(features):
    district_2s = [f for f in features if f["properties"]["COUNCIL_DISTRICT"] == 2]
    other_districts = [f for f in features if f["properties"]["COUNCIL_DISTRICT"] != 2]
    new_district_2_coordinates = []
    # combine geometries of all district 2's
    for f in district_2s:
        if f["geometry"]["type"] != "MultiPolygon":
            raise Exception("Feature must be multipolygon for this hack to work")
        new_district_2_coordinates = new_district_2_coordinates + f["geometry"]["coordinates"]
    # update the first district 2 with the geometry of all district 2s
    new_district_2 = district_2s[0]
    new_district_2["geometry"]["coordinates"] = new_district_2_coordinates
    # add this back into our feature array
    other_districts.append(new_district_2)
    return other_districts

def main(env):
    print(f"Env: {env}")
    print("Downloading features from AGOL...")
    features = get_council_districts_geojson()
    # ensure all features are of same type (AGOL returns a mix of multi/not multi polygons)
    make_multipoly(features)
    # combine bizarre multiple district twos into one multipoly
    features_de_duped = merge_district_2(features)
    # parse out the only columns of interest and make lower case (the agol layer has additional metadata)
    inserts = [
        {
            "council_district": f["properties"]["COUNCIL_DISTRICT"],
            "geography": f["geometry"],
        }
        for f in features_de_duped
    ]
    # test to make sure we now have exactly the districts we're expecting
    district_ids = [f["council_district"] for f in inserts]

    try:
        assert(len(district_ids) == 10)
        assert(set(district_ids) == set([1,2,3,4,5,6,7,8,9,10]))
    except AssertionError:
        raise ValueError("Unexpected district mismatch encountered :/")


    print("Uploading features to Moped...")
    variables = {"objects": inserts}
    make_hasura_request(query=MUTATION, variables=variables, env=env)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-e",
        "--env",
        type=str,
        required=True,
        choices=["local", "staging", "prod"],
        help=f"The environment",
    )
    args = parser.parse_args()

    main(args.env)

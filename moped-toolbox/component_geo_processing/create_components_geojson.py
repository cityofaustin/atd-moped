"""
Create component geojson files which can be imported to ArcGIS.

Merges component features into a single feature per component and ouputs three feature collections:
- all.geojson: all component features
- lines.geojson: component features of type line
- points.geojson: component featuers of type point

Any component that has both point and line features is excluded as this is not supported by ArcGIS.

"""
import json
from pprint import pprint as print

# these files are required json extracts from Moped DB
# see SQL queries in this directory
components_file = "components.json"
features_file = "features.json"

def get_geom_type(feature):
	if "Point" in feature["geometry"]["type"]:
		return "MultiPoint"
	else:
		return "MultiLineString"


def is_multiline(coords):
	try:
		coords[0][0][0]
		return True
	except TypeError:
		return False


def uniform_geometry(features):
	types = list(set([get_geom_type(f) for f in features]))
	return [len(types) == 1, types[0]]

def merge_geoms(features):
	is_uniform, geom_type = uniform_geometry(features)
	if not geom_type:
		breakpoint()
		print("whi")
	if not is_uniform:
		return None
	geometry = {"type": geom_type, "coordinates": []}
	
	for f in features:
		if geom_type == "MultiPoint":
			geometry["coordinates"].append(f["geometry"]["coordinates"])
		else:
			coords = f["geometry"]["coordinates"]
			if is_multiline(coords):
				geometry["coordinates"] += coords
			else:
				geometry["coordinates"] += [coords]
	return geometry



def build_component_feature(component):
	features = component.pop("_features")
	geometry = merge_geoms(features)
	if not geometry:
		print(f"Not uniform geometry! {component['project_id']}, {component['component_name']}")
		return None

	return {"type": "Feature", "geometry": geometry, "properties": component}


with open(components_file, "r") as fin:
	components = json.load(fin)

with open(features_file, "r") as fin:
	features = json.load(fin)

for c in components:
	proj_component_id = c["project_component_id"]
	c["_features"] = []
	for f in features:
		if f["moped_proj_component_id"] == proj_component_id:
			c["_features"].append(json.loads(f["location"]))


fc_all = { "type": "FeatureCollection", "features": [] }
fc_lines = { "type": "FeatureCollection", "features": [] }
fc_points = { "type": "FeatureCollection", "features": [] }

for c in components:
	if not c["_features"]:
		continue
	compoment_feature = build_component_feature(c)
	if not compoment_feature:
		continue
	fc_all["features"].append(compoment_feature)
	if "Point" in compoment_feature["geometry"]["type"]:
		fc_points["features"].append(compoment_feature)
	elif "Line" in compoment_feature["geometry"]["type"]:
		fc_lines["features"].append(compoment_feature)
	else:
		raise Exception("This should never happen!")

with open("all.geojson", "w") as fout:
    json.dump(fc_all, fout)

with open("points.geojson", "w") as fout:
    json.dump(fc_points, fout)

with open("lines.geojson", "w") as fout:
    json.dump(fc_lines, fout)
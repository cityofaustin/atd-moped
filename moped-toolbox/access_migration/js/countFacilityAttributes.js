/* Count usage of facility_attributestypes */
const { loadJsonFile } = require("./utils/loader");
const facilityAttributeTypesFile = "./data/raw/facility_attributestypes.json";
const facilityAttributesFile = "data/raw/facility_attributes.json";

function main() {
  // this is the lookup table
  const facilityAttributeTypes = loadJsonFile(facilityAttributeTypesFile);
  // these are records that reference the lookup table
  const facilityAttributes = loadJsonFile(facilityAttributesFile);
  // count actual usage
  const usageCounts = facilityAttributes.reduce((prev, curr) => {
    const key = curr["Attribute"];
    prev[key] ??= 0;
    prev[key]++;
    return prev;
  }, {});
  // output json with a count for each attribute type
  const counts = [];
  facilityAttributeTypes.map((thing) => {
    const key = thing["AttributeID"];
    const count = usageCounts[key] || 0;
    counts.push({ key, count });
  });
  console.log(JSON.stringify(counts, null, 4));
}

main();

// def test_is_valid(row):
//     assert all([row[field["out"]] for field in fields if field["required"]])

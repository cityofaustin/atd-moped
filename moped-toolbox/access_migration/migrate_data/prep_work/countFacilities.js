/* Count usage of facility_attributestypes */
const { loadJsonFile } = require("../utils/loader");

const facilityTypesFile = "./data/raw/project_facilitytypes.json";
const facilitiesFile = "./data/raw/project_facilities.json";

function main() {
  // this is the lookup table
  const facilityTypes = loadJsonFile(facilityTypesFile);
  // these are records that reference the lookup table
  const facilities = loadJsonFile(facilitiesFile);

  // count actual usage
  const usageCounts = facilities.reduce((prev, curr) => {
    const key = curr["FacilityType"];
    prev[key] ??= 0;
    prev[key]++;
    return prev;
  }, {});
  // output json with a count for each attribute type
  const counts = [];
  facilityTypes.map((thing) => {
    const key = thing["FacilityTypeID"];
    const count = usageCounts[key] || 0;
    counts.push({ key, count });
  });
  console.log(JSON.stringify(counts, null, 4));
}

main();

// def test_is_valid(row):
//     assert all([row[field["out"]] for field in fields if field["required"]])

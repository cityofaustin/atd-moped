/**
 * Translate bikeways facility data to component tags
 */
const { loadJsonFile } = require("./utils/loader");

const BIKEWAYS_FNAME = "./data/raw/bikewaysdata.json";

const fieldMap = [
  {
    col_name: "AAABicycleNetwork",
    col_val: "CouncilAdopted2014",
    tag_id: 1,
  },
  {
    col_name: "AAABicycleNetwork",
    col_val: "CouncilAdopted2019",
    tag_id: 2,
  },
  {
    col_name: "AAABicycleNetwork",
    col_val: (val) =>
      [
        "ProposedPreATXWBR",
        "Proposed",
        "ProposedATXWBR(tentative)",
        "ProposedPostATXWBR",
        "ProposedATXWBR",
      ].includes(val),
    tag_id: 3,
  },
  //   { col_name: "AAABicycleNetwork", col_val: "???No data???", tag_id: 4 },
  {
    col_name: "AAABicycleNetwork",
    col_val: "OtherJuristiction",
    tag_id: 5,
  },
  { col_name: "ImpPlan2017", col_val: (val) => !!val, tag_id: 6 },
  { col_name: "ImpPlan2018", col_val: (val) => !!val, tag_id: 7 },
  { col_name: "ImpPlan2019", col_val: (val) => !!val, tag_id: 8 },
  { col_name: "ImpPlan2020", col_val: (val) => !!val, tag_id: 9 },
  { col_name: "ImpPlan2021", col_val: (val) => !!val, tag_id: 10 },
  { col_name: "ImpPlan2022", col_val: (val) => !!val, tag_id: 11 },
  { col_name: "ImpPlan2023", col_val: (val) => !!val, tag_id: 12 },
  //   { col_name: "???No data???", col_val: "???No data???", tag_id: 13 },
  { col_name: "UrbanTrailsNetwork", col_val: "UrbanTrail", tag_id: 14 },
  //   { col_name: "UrbanTrailsNetwork", col_val: "???No data???", tag_id: 15 },
  //   { col_name: "UrbanTrailsNetwork", col_val: "???No data???", tag_id: 16 },
  { col_name: "UrbanTrailsNetwork", col_val: "Sidepath", tag_id: 17 },
  {
    col_name: "UrbanTrailsNetwork",
    col_val: "BikewaysAccessToNature",
    tag_id: 18,
  },
  {
    col_name: "Arterial",
    col_val: 1,
    tag_id: 19,
  },
  {
    col_name: "UpgradesExistingBL",
    col_val: 1,
    tag_id: 20,
  },
];

function getComponentTags() {
  const bikeways = loadJsonFile(BIKEWAYS_FNAME);
  const componentTagIndex = {};
  bikeways.forEach((row) => {
    const id = row.Project_FacilityID;

    const matchedTags = [];
    fieldMap.forEach(({ col_name, col_val, tag_id }) => {
      let isMatch = false;
      if (typeof col_val === "function") {
        isMatch = col_val(row[col_name]);
      } else {
        isMatch = row[col_name] === col_val;
      }
      if (isMatch && !matchedTags.includes(tag_id)) {
        matchedTags.push(tag_id);
      }
    });
    // there should not be dupe rows per facility but being safe...
    componentTagIndex[id] ??= [];
    componentTagIndex[id] = [
      ...componentTagIndex[id],
      ...matchedTags.map((component_tag_id) => ({ component_tag_id })),
    ];
  });
  // const count = Object.keys(componentTagIndex).filter(
  //   (key) => componentTagIndex[key].length > 0
  // ).length;
  // console.log(count, "of", Object.keys(componentTagIndex).length, "have a tag");
  return componentTagIndex;
}

// getComponentTags();

exports.getComponentTags = getComponentTags;

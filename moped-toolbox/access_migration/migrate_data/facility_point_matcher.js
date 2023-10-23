/**
 * For every facility (aka component) point, find the nearest:
 * - CTN intersection feature
 * - signal asset feature
 *
 * If these features are within our `BUFFER_DIST` tolerance, they are saved
 * and referenced later when we build up component features
 *
 * Features are saved as a JSON indexed on the interim facility ID
 */
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const nearest = require("@turf/nearest-point").default;
const distance = require("@turf/distance").default;

// npm install @turf/buffer @turf/boolean-contains @turf/union
const CTN_POINTS_FNAME = "./data/agol/ctn_intersections.geojson";
const FACILITY_POINTS_FNAME = "./data/agol/interim_facility_points.geojson";
const SIGNALS_FNAME = "./data/agol/signals.geojson";

const POINT_BUFFER_DIST = 20; // feet - per discussion w/ NW
const POINT_BUFFER_DIST_SIGNAL = 100; // feet

// reduce coordinate precision
const trimCoords = (coords, factor = 1000000) =>
  coords.map((pair) => pair.map((val) => Math.round(val * factor) / factor));

const countDupeFacilities = (facilities) => {
  // a facility "Project_FacilityID" should only have one map feature
  const uniqueIds = {};
  facilities.forEach((f) => {
    const fid = f.properties.Project_FacilityID;
    uniqueIds[fid] ??= 0;
    uniqueIds[fid]++;
  });
  const probs = Object.keys(uniqueIds).filter((key) => uniqueIds[key] > 1);
  console.log("problems", probs);
  debugger;
};

let count = 0;

function main() {
  const stats = {
    facilities_processed: 0,
    facilities_matched: 0,
    total_segments: 0,
  };
  const ctnPoints = loadJsonFile(CTN_POINTS_FNAME);
  const facilities = loadJsonFile(FACILITY_POINTS_FNAME);
  const signals = loadJsonFile(SIGNALS_FNAME);

  const results = {};
  facilities.features.forEach((f) => {
    stats.facilities_processed++;

    stats.facilities_processed % 100 === 0 &&
      console.log(
        "Processed ",
        stats.facilities_processed,
        " out of ",
        facilities.features.length,
        " facilities"
      );
    const facilityId = f.properties.Project_FacilityID;
    if (!facilityId) {
      // it happens - apparently deleted or malcreated geoms
      // NW says to ignore them
      return;
    }
    const nearestPoint = nearest(f.geometry, ctnPoints);
    // very lazily we are calculating nearest signal for every point
    // regardless of component type
    // we'll pull from the signal data later as needed when matching
    // facilities to their component record
    const nearestSignal = nearest(f.geometry, signals);
    const dSignalMiles = distance(f, nearestSignal, { units: "miles" });
    const dSignalFeet = Math.round((dSignalMiles * 5280 * 1000) / 1000);
    const dMiles = distance(f, nearestPoint, { units: "miles" });
    const dFeet = Math.round((dMiles * 5280 * 1000) / 1000);
    results[facilityId] = {
      ctnFeature: null,
      signalFeature: null,
      originalFeature: f,
    };
    if (dFeet < POINT_BUFFER_DIST) {
      stats.facilities_matched++;
      results[facilityId].ctnFeature = nearestPoint;
    }
    if (dSignalFeet < POINT_BUFFER_DIST_SIGNAL) {
      results[facilityId].signalFeature = nearestSignal;
    }
  });
  saveJsonFile("./data/agol/ctn_points_matched.geojson", results);
  console.log(stats);
}

main();

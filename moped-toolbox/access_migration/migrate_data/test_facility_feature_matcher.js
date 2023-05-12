const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const buffer = require("@turf/buffer");
const booleanContains = require("@turf/boolean-contains").default;

// npm install @turf/buffer @turf/boolean-contains @turf/union
const SEGMENTS_FNAME = "./data/agol/ctn_segments.geojson";
const FACILITY_LINES_FNAME = "./data/agol/interim_facility_lines.geojson";
const SEGMENT_BUFFER_RADIUS = 100;
const SEGMENT_BUFFER_UNITS = "feet";

// reduce coordinate precision
const trimCoords = (coords, factor = 1000000) =>
  coords.map((pair) => pair.map((val) => Math.round(val * factor) / factor));

// ignore multilinestring features which cannot be eval'd with booleanContains
// todo: decide how to handle these 16-ish features
const makeSimple = (features) =>
  features
    .filter((segment) => segment.geometry.coordinates.length === 1)
    .map((segment) => {
      segment.geometry.type = "LineString";
      segment.geometry.coordinates = segment.geometry.coordinates[0];
      return segment;
    });

function main() {
  const stats = {
    facilities_processed: 0,
    facilities_matched: 0,
    total_segments: 0,
  };
  const segments = loadJsonFile(SEGMENTS_FNAME);
  const facilities = loadJsonFile(FACILITY_LINES_FNAME);
  segments.features = makeSimple(segments.features);
  const results = {};

  facilities.features.forEach((f) => {
    stats.facilities_processed++;
    const facilityId = f.properties.Project_FacilityID;
    console.log("Facility", facilityId);
    if (f.geometry.type === "MultiLineString") {
      f.geometry.coordinates = f.geometry.coordinates.flat();
      f.geometry.type = "LineString";
    }
    results[facilityId] = { originalFeature: f, ctnFeatures: [] };

    const fBuffered = buffer(f, SEGMENT_BUFFER_RADIUS, {
      units: SEGMENT_BUFFER_UNITS,
      steps: 2,
    });

    const containedSegments = segments.features
      .filter((segment) => {
        const res = booleanContains(fBuffered, segment);
        return res;
      })
      .map((segment) => {
        segment.properties.interim_facility_id =
          f.properties.Project_FacilityID;
        segment.geometry.coordinates = trimCoords(segment.geometry.coordinates);
        return segment;
      });
    if (containedSegments.length > 0) {
      stats.facilities_matched++;
      stats.total_segments += containedSegments.length;
      results[facilityId].ctnFeatures = containedSegments;
    }
  });
  saveJsonFile("./data/agol/ctn_segments_matched.geojson", results);
  console.log(stats)
}

main();

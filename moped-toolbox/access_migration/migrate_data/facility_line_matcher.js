/**
 * Attempts to match facility (aka component) line features to 
 * CTN street/trail segments.
 * 
 * In order for a match to be used:
 * - the buffered facility lines must entirely contain a set of CTN segments
 * - the buffer around the matched CTN segments must entirely contain the
 * facility lines they are matched to
 * 
 * This ensures we have captured an entire component geometry. 
 * 
 * Features are saved as a JSON indexed on the interim facility ID
 */
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const buffer = require("@turf/buffer");
const dissolve = require("@turf/dissolve");
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
const makeSimple = (features) =>
  features
    .filter((segment) => segment.geometry.coordinates.length === 1)
    .map((segment) => {
      segment.geometry.type = "LineString";
      segment.geometry.coordinates = segment.geometry.coordinates[0];
      return segment;
    });

const countDupeFacilities = (facilities) => {
  // a facility "Project_FacilityID" should only have one map feature
  const uniqueIds = {};
  facilities.forEach((f) => {
    const fid = f.properties.Project_FacilityID;
    uniqueIds[fid] ??= 0;
    uniqueIds[fid]++;
  });
  const dupes = Object.keys(uniqueIds).filter((key) => uniqueIds[key] > 1);
  console.log("dupes", dupes);
};

function main() {
  const stats = {
    facilities_processed: 0,
    facilities_matched: 0,
    total_segments: 0,
  };
  const segments = loadJsonFile(SEGMENTS_FNAME);
  console.log("Filtering multiline segments...");
  segments.features = makeSimple(segments.features);
  /**
   * turns out booleanContains is not reliable when
   * comaparing differing geometries -  gah!
   * but it does appear reliable if we buffer the input segment
   * so as to compare to polygons against eacher other.
   * one of multiple issues on this:
   *  https://github.com/Turfjs/turf/issues/2318
   */
  console.log("buffering all CTN segments...");
  const segmentsWithBuffers = segments.features.map((segment) => {
    // segment.geometry.coordinates = trimCoords(segment.geometry.coordinates);
    const buffered = buffer(segment, 1, {
      units: SEGMENT_BUFFER_UNITS,
      steps: 2,
    });
    segment = {
      original: segment,
      buffered: { ...segment },
    };
    segment.buffered.geometry = buffered.geometry;
    return segment;
  });

  const facilities = loadJsonFile(FACILITY_LINES_FNAME);
  // countDupeFacilities(facilities.features);
  const results = {};

  facilities.features.forEach((f) => {
    stats.facilities_processed++;
    const facilityId = f.properties.Project_FacilityID;
    if (!facilityId) {
      // ignore if the feature has no facility ID - 
      // this happens as an artiface of AGOL editing apparently
      return;
    }
    console.log("Facility", facilityId);
    if (f.geometry.type !== "MultiLineString") {
      throw `This should never happen`;
    }

    if (results[facilityId]) {
      // this is a dupe??
      console.log(
        "dupe facility feature prev result will be overwritten :/",
        facilityId
      );
    }

    results[facilityId] = { originalFeature: f, ctnFeatures: [] };
    let shouldContinue = true;
    /**
     * buffer/test each line segment in the multiline feature individually to see if it
     * contains any CTN segments, and if each segment is contained by the buffer
     * of those segments
     */
    const matchedFeatureChunks = f.geometry.coordinates
      .map((line) => {
        if (!shouldContinue) {
          return;
        }
        const testFeature = { type: "LineString", coordinates: line };
        const testFeatureBuffered = buffer(testFeature, SEGMENT_BUFFER_RADIUS, {
          units: SEGMENT_BUFFER_UNITS,
          steps: 2,
        });
        // get all CTN segments that are fully contained by this facility line
        const containedCTNSegments = segmentsWithBuffers
          .filter((segment) => {
            const res = booleanContains(testFeatureBuffered, segment.buffered);
            return res;
          })
          .map(({ original: segment }) => {
            segment.properties.interim_project_component_id = facilityId;
            return segment;
          });


        if (containedCTNSegments.length > 0) {
          // now see if facility line segment is contained by all CTN segments it contains
          // first - we have buffer and dissolve the matched CTN segments
          try {
            const bufferedSegmentsToDissolve = containedCTNSegments.map(
              (segment) =>
                buffer(segment, SEGMENT_BUFFER_RADIUS, {
                  units: SEGMENT_BUFFER_UNITS,
                  // a higher number of steps ensures we don't end up with multipoly artifacts curved lines
                  // which is a thing that happens that i don't understand
                  steps: 4,
                })
            );
            const dissolvedSegments = dissolve({
              type: "FeatureCollection",
              features: bufferedSegmentsToDissolve,
            });
            // and we have to buffer our line segment to compare polys to polys
            const testFeatureBufferedSmall = buffer(testFeature, 1, {
              units: SEGMENT_BUFFER_UNITS,
              steps: 2,
            });
            // finally - see if facility line segment is contained by all CTN segments it contains
            const res = booleanContains(
              dissolvedSegments.features[0],
              testFeatureBufferedSmall
            );
            if (res) {
              // wow - we have a match
              return containedCTNSegments;
            }
          } catch (err) {
            console.warn(err);
          }
        }
        // no CTM segments were matched to this line segment
        // stop further processing
        shouldContinue = false;
      })
      // exclude batch of results if empty
      .filter((containedCTNSegments) => containedCTNSegments);

    if (matchedFeatureChunks.length !== f.geometry.coordinates.length) {
      // console.log("didn't match enough");
      return;
    }

    // flatten and dedupe matched segments
    // see: https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects
    const uniqueMatchedCTNSegments = matchedFeatureChunks
      .flat()
      .filter(
        (feature, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.properties.CTN_SEGMENT_ID === feature.properties.CTN_SEGMENT_ID
          )
      );
    stats.facilities_matched++;
    stats.total_segments += uniqueMatchedCTNSegments.length;
    results[facilityId].ctnFeatures = uniqueMatchedCTNSegments;
  });
  saveJsonFile("./data/agol/ctn_segments_matched.geojson", results);
  console.log(stats);
}

main();

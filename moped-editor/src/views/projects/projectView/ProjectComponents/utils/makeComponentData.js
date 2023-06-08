import {
  makeDrawnLinesInsertionData,
  makeDrawnPointsInsertionData,
  makeLineStringFeatureInsertionData,
  makePointFeatureInsertionData,
} from "./makeFeatures";
import { isDrawnDraftFeature } from "./features";
import { knackSignalRecordToFeatureSignalsRecord } from "src/utils/signalComponentHelpers";

/**
 * Take a component object and return an object that can be used to insert a component record
 * @param {String} projectId - the primary key of the project record
 * @param {Object} component - component data and features collected from the UI
 * @returns
 */
export const makeComponentInsertData = (projectId, component) => {
  const {
    component_id,
    description,
    moped_subcomponents,
    phase_id,
    subphase_id,
    completion_date,
    internal_table,
    features,
    moped_proj_component_tags,
    srts_id,
  } = component;

  const subcomponentsArray = moped_subcomponents
    ? moped_subcomponents.map((subcomponent) => ({
        subcomponent_id: subcomponent.value,
      }))
    : [];

  const tagsArray = moped_proj_component_tags
    ? moped_proj_component_tags.map((tag) => ({
        component_tag_id: tag.value,
      }))
    : [];

  const featureTable = internal_table;

  const featuresToInsert = [];
  const signalFeaturesToInsert = [];
  const drawnLinesToInsert = [];
  const drawnPointsToInsert = [];

  const drawnFeatures = features.filter((feature) =>
    isDrawnDraftFeature(feature)
  );
  const selectedFeatures = features.filter(
    (feature) => !isDrawnDraftFeature(feature)
  );

  if (featureTable === "feature_street_segments") {
    makeLineStringFeatureInsertionData(
      featureTable,
      selectedFeatures,
      featuresToInsert
    );
    makeDrawnLinesInsertionData(drawnFeatures, drawnLinesToInsert);
  } else if (featureTable === "feature_intersections") {
    makePointFeatureInsertionData(
      featureTable,
      selectedFeatures,
      featuresToInsert
    );
    makeDrawnPointsInsertionData(drawnFeatures, drawnPointsToInsert);
  } else if (featureTable === "feature_signals") {
    features.forEach((feature) => {
      const signalRecord = knackSignalRecordToFeatureSignalsRecord(feature);
      signalFeaturesToInsert.push(signalRecord);
    });
  }

  return {
    description,
    component_id,
    project_id: projectId,
    moped_proj_components_subcomponents: {
      data: subcomponentsArray,
    },
    [featureTable]: {
      data: featuresToInsert,
    },
    moped_proj_component_tags: {
      data: tagsArray,
    },
    phase_id,
    subphase_id,
    completion_date,
    srts_id,
    feature_drawn_lines: { data: drawnLinesToInsert },
    feature_drawn_points: { data: drawnPointsToInsert },
    feature_signals: { data: signalFeaturesToInsert },
  };
};

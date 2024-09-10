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
    work_types,
    phase_id,
    subphase_id,
    completion_date,
    internal_table,
    features,
    moped_proj_component_tags,
    location_description,
    srts_id,
  } = component;

  const subcomponentsArray = moped_subcomponents
    ? moped_subcomponents.map((subcomponent) => ({
        subcomponent_id: subcomponent.value,
      }))
    : [];

  const workTypesArray = work_types
    ? work_types.map((workType) => ({
        work_type_id: workType.value,
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
    moped_proj_component_work_types: {
      data: workTypesArray,
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
    location_description,
    srts_id,
    feature_drawn_lines: { data: drawnLinesToInsert },
    feature_drawn_points: { data: drawnPointsToInsert },
    feature_signals: { data: signalFeaturesToInsert },
  };
};

/**
 * Assembles feature data based on I/O from the component attribute form. 
 * It handles when a signal component changes to a non-signal component, 
 * when a selected signal asset is cleared from the from the form input,
 * or when the selected signal asset is changed to a different signal
 * asset.
 * @param {Object} signalFromForm - signal objected as returned by the signal
 * autoomplete form option (which is essentially a signal record from
 *  socrata)
 * @param {Object} clickedComponent  - the moped_project_component record that is
 * currently being edited, including it's related feature data
 * @returns {Object[]} signalsToCreate - an array of length 1 or 0 which optionally
 * contains the signal feature record to be inserted
 * @returns {Number[]} featureIdsToDelete - array of 0 or more feature record IDs
 * which will be deleted
 */
export const getFeatureChangesFromComponentForm = (
  signalFromForm,
  clickedComponent
) => {
  let signalToCreate = null;
  const featureIdsToDelete = [];
  const newSignalId = parseInt(signalFromForm?.properties?.signal_id);
  const previousSignal = clickedComponent.feature_signals?.[0];
  const previousIntersectionFeatures = clickedComponent.feature_intersections;
  const previousDrawnPointFeatures = clickedComponent.feature_drawn_points;

  if (newSignalId) {
    // signal is selected in form
    if (previousSignal && newSignalId !== previousSignal?.signal_id) {
      // signal selection changed
      signalToCreate = knackSignalRecordToFeatureSignalsRecord(signalFromForm);
      signalToCreate.component_id = clickedComponent.project_component_id;
      featureIdsToDelete.push(previousSignal.id);
    } else if (!previousSignal) {
      // signal was previously blank
      signalToCreate = knackSignalRecordToFeatureSignalsRecord(signalFromForm);
      signalToCreate.component_id = clickedComponent.project_component_id;
    }
    if (previousIntersectionFeatures) {
      // delete all intersection features
      featureIdsToDelete.push(...previousIntersectionFeatures.map((f) => f.id));
    }
    if (previousDrawnPointFeatures) {
      // delete all drawn point features
      featureIdsToDelete.push(...previousDrawnPointFeatures.map((f) => f.id));
    }
  } else if (previousSignal) {
    // signal selection was cleared
    featureIdsToDelete.push(previousSignal.id);
  }
  // wrap signal in array to match hasura type
  // we do this because it's allowed to insert an empty array, but
  // but not a null object
  const signalsToCreate = signalToCreate ? [signalToCreate] : [];
  return { signalsToCreate, featureIdsToDelete };
};

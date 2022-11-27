import {
  makeDrawnLinesInsertionData,
  makeDrawnPointsInsertionData,
  makeLineStringFeatureInsertionData,
  makePointFeatureInsertionData,
} from "./makeFeatures";
import { getDrawId } from "./features";

/* Create */
export const onSaveComponent = ({
  addProjectComponent,
  draftComponent,
  projectId,
  refetchProjectComponents,
  setDraftComponent,
  setIsCreatingComponent,
  setLinkMode,
}) => {
  /* Start data preparation */
  const {
    component_id,
    description,
    moped_subcomponents,
    component_name,
    internal_table,
    features,
  } = draftComponent;

  const subcomponentsArray = moped_subcomponents
    ? moped_subcomponents.map((subcomponent) => ({
        subcomponent_id: subcomponent.value,
      }))
    : [];

  const featureTable = internal_table;

  const featuresToInsert = [];
  const drawnLinesToInsert = [];
  const drawnPointsToInsert = [];

  const drawnFeatures = features.filter((feature) =>
    Boolean(getDrawId(feature))
  );
  const selectedFeatures = features.filter(
    (feature) => !Boolean(getDrawId(feature))
  );

  if (featureTable === "feature_street_segments") {
    makeLineStringFeatureInsertionData(
      featureTable,
      selectedFeatures,
      featuresToInsert
    );
    makeDrawnLinesInsertionData(drawnFeatures, drawnLinesToInsert);
  } else if (
    featureTable === "feature_intersections" ||
    featureTable === "feature_signals"
  ) {
    makePointFeatureInsertionData(
      featureTable,
      selectedFeatures,
      featuresToInsert
    );
    makeDrawnPointsInsertionData(drawnFeatures, drawnPointsToInsert);
  }

  const newComponentData = {
    description,
    component_id,
    name: component_name,
    project_id: projectId,
    moped_proj_components_subcomponents: {
      data: subcomponentsArray,
    },
    [featureTable]: {
      data: featuresToInsert,
    },
    feature_drawn_lines: { data: drawnLinesToInsert },
    feature_drawn_points: { data: drawnPointsToInsert },
  };
  /* End data preparation */

  addProjectComponent({ variables: { object: newComponentData } }).then(() => {
    refetchProjectComponents();
  });

  setIsCreatingComponent(false);
  setDraftComponent(null);
  setLinkMode(null);
};

/* Update */
export const onUpdateComponent = ({ createdOnEditFeatures }) => {
  console.log("Updating component", createdOnEditFeatures);
};

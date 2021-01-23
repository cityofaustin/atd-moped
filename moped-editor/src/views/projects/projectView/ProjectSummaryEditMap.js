import React, { useState } from "react";
import NewProjectMap from "../newProjectView/NewProjectMap";

const ProjectSummaryMap = ({ selectedLayerIds, projectExtentGeoJSON }) => {
  const [editLayerIds, setEditLayerIds] = useState(selectedLayerIds);
  const [editFeatureCollection, setEditFeatureCollection] = useState(
    projectExtentGeoJSON
  );

  // TODO: Add full screen dialog

  return (
    <NewProjectMap
      selectedLayerIds={editLayerIds}
      setSelectedLayerIds={setEditLayerIds}
      featureCollection={editFeatureCollection}
      setFeatureCollection={setEditFeatureCollection}
    />
  );
};

export default ProjectSummaryMap;

import { Source, Layer } from "react-map-gl";
import { MAP_STYLES } from "../ProjectComponents/mapStyleSettings";
import { useFeatureTypes } from "../ProjectComponents/utils/map";

/**
 * Component that renders feature collection of all components features in a project
 * All layers are set to show below basemap street labels using beforeId = "street-labels"
 * @param {Object} projectFeatureCollection - GeoJSON feature collection with all project features
 * @returns JSX.Element
 */
const ProjectSummaryMapSourcesAndLayers = ({ projectFeatureCollection }) => {
  const projectLines = useFeatureTypes(projectFeatureCollection, "line");
  const projectPoints = useFeatureTypes(projectFeatureCollection, "point");

  console.log("projectLines", projectLines);

  return (
    <>
      <Source
        id="project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...MAP_STYLES["project-lines"].layerProps}
        />
      </Source>

      <Source
        id="project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          beforeId="street-labels"
          {...MAP_STYLES["project-points"].layerProps}
        />
      </Source>
    </>
  );
};

export default ProjectSummaryMapSourcesAndLayers;

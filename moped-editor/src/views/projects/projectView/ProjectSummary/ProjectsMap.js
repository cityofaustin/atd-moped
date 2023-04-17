import React, { useCallback, useState, useMemo } from "react";
import MapGL from "react-map-gl";
import { Box } from "@material-ui/core";
import BaseMapSourceAndLayers from "../ProjectComponents/BaseMapSourceAndLayers";
import BasemapSpeedDial from "../ProjectComponents/BasemapSpeedDial";
import ProjectsMapSourcesAndLayers from "./ProjectsMapSourcesAndLayers";
import FeaturePopup from "../ProjectComponents/FeaturePopup";

import {
  basemaps,
  mapParameters,
  initialViewState,
} from "../ProjectComponents/mapSettings";
import { makeFeatureFromProjectGeographyRecord } from "../ProjectComponents/utils/makeFeatureCollections";
import { useZoomToAllProjects } from "../ProjectComponents/utils/map";
import "mapbox-gl/dist/mapbox-gl.css";

/**
 * Use a callback ref to get the map instance and store it in state so we can watch it with useEffect
 * @see https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
 * @returns {Array} - [mapRef, mapRefState] - mapRef is a callback ref, mapRefState is a state variable
 */
const useMapRef = () => {
  const [mapRefState, setMapRefState] = useState(null);
  const mapRef = useCallback((mapInstance) => {
    if (mapInstance !== null) {
      // Store instance as the value of current just like a ref would
      setMapRefState({ current: mapInstance });
    }
  }, []);
  return [mapRef, mapRefState];
};

const ProjectsMap = ({ data }) => {
  const [mapRef, mapRefState] = useMapRef();
  const [basemapKey, setBasemapKey] = useState("streets");
  const [clickedFeatures, setClickedFeatures] = useState(null);
  const [cursor, setCursor] = useState("grab");

  const projectFeatureCollection = useMemo(() => {
    const featureCollection = {
      type: "FeatureCollection",
      features: [],
    };

    if (!data?.moped_project) return featureCollection;

    const projectGeographyGeoJSONFeatures = data.moped_project
      .map((project) => {
        // get project phasing
        const phase_key = project.current_phase_view?.phase_key;
        const phase_name = project.current_phase_view?.phase_name;

        return project.geography.map((rawFeature) => {
          const {
            project_id,
            project_name,
            proj_component: {
              project_component_id,
              moped_components: { component_name, component_subtype },
            },
          } = rawFeature;

          const feature = makeFeatureFromProjectGeographyRecord(rawFeature);
          // get project and component props

          feature.properties = {
            ...feature.properties,
            project_id,
            project_name,
            phase_key,
            phase_name,
            component_name,
            component_subtype,
            project_component_id,
          };
          return feature;
        });
      })
      .flat();

    return { ...featureCollection, features: projectGeographyGeoJSONFeatures };
  }, [data]);

  useZoomToAllProjects(mapRefState, data, "zoomToAllProjectsExtent");

  const areThereComponentFeatures =
    projectFeatureCollection.features.length > 0;

  const onClick = (e) => {
    if (!e.features || e.features?.length === 0) {
      if (clickedFeatures) {
        setClickedFeatures(null);
      }
    }
    setClickedFeatures(e.features);
  };

  const onMouseEnter = () => {
    setCursor("pointer");
  };

  const onMouseLeave = () => {
    setCursor("grab");
  };

  return (
    <Box>
      {areThereComponentFeatures && (
        <MapGL
          ref={mapRef}
          initialViewState={initialViewState}
          style={{ width: "100%", height: "80vh" }}
          mapStyle={basemaps.streets.mapStyle}
          {...mapParameters}
          onClick={onClick}
          cursor={cursor}
          interactiveLayerIds={["project-points", "project-lines"]}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <BasemapSpeedDial
            basemapKey={basemapKey}
            setBasemapKey={setBasemapKey}
          />
          <BaseMapSourceAndLayers basemapKey={basemapKey} />
          <ProjectsMapSourcesAndLayers
            projectFeatureCollection={projectFeatureCollection}
          />
          <FeaturePopup
            onClose={() => setClickedFeatures(null)}
            features={clickedFeatures}
            components={[]}
          />
        </MapGL>
      )}
    </Box>
  );
};

export default ProjectsMap;

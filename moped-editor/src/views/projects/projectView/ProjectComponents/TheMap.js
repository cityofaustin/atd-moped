import { useState, useMemo } from "react";
import MapGL from "react-map-gl";
import { cloneDeep } from "lodash";
import FeaturePopup from "./FeaturePopup";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import BasemapSpeedDial from "./BasemapSpeedDial";
import ComponentDrawTools from "./ComponentDrawTools";
import BaseMapSourceAndLayers from "./BaseMapSourceAndLayers";
import ComponentsSourcesAndLayers from "./ComponentsSourcesAndLayers";
import { basemaps, mapParameters, initialViewState } from "./mapSettings";
import { useFeatureTypes, interactiveLayerIds } from "./utils/map";
import {
  useAgolFeatures,
  findFeatureInAgolGeojsonFeatures,
} from "./utils/agol";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  isDrawnFeature,
  makeCapturedFromLayerFeature,
  useComponentFeatureCollection,
} from "./utils/features";
import { featureTableFieldMap } from "./utils/makeFeatures";

// See https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

// returns geojson of features across all components
const useProjectFeatures = (components) =>
  useMemo(() => {
    if (components.length === 0)
      return {
        type: "FeatureCollection",
        features: [],
      };

    const allComponentfeatures = [];

    components.forEach((component) => {
      Object.keys(featureTableFieldMap).forEach((key) => {
        if (component.hasOwnProperty(key))
          allComponentfeatures.push(component[key]);
      });
    });

    // Make features valid GeoJSON by adding type and properties attributes
    const geoJsonFeatures = allComponentfeatures.flat().map((component) => ({
      ...component,
      type: "Feature",
      properties: {},
    }));

    return {
      type: "FeatureCollection",
      features: geoJsonFeatures,
    };
  }, [components]);

const useDraftComponentFeatures = (draftComponent) =>
  useMemo(() => {
    return {
      type: "FeatureCollection",
      features: draftComponent?.features || [],
    };
  }, [draftComponent]);

export default function TheMap({
  setHoveredOnMapFeature,
  hoveredOnMapFeature,
  components,
  isEditingComponent,
  draftComponent,
  setDraftComponent,
  mapRef,
  clickedProjectFeature,
  setClickedProjectFeature,
  clickedComponent,
  setClickedComponent,
  linkMode,
  setIsFetchingFeatures,
  featureCollectionsByComponentId,
}) {
  const [cursor, setCursor] = useState("grab");

  const [bounds, setBounds] = useState();
  const [basemapKey, setBasemapKey] = useState("streets");
  const [isDrawing, setIsDrawing] = useState(false);
  const projectFeatures = useProjectFeatures(components);

  const draftComponentFeatures = useDraftComponentFeatures(draftComponent);
  const draftLayerId = `draft-component-${linkMode}`;

  const componentFeatureCollection = useComponentFeatureCollection(
    clickedComponent,
    featureCollectionsByComponentId
  );

  const currentZoom = mapRef?.current?.getZoom();
  const { ctnLinesGeojson, ctnPointsGeojson } = useAgolFeatures(
    linkMode,
    setIsFetchingFeatures,
    currentZoom,
    bounds
  );

  const projectLines = useFeatureTypes(projectFeatures, "line");
  const projectPoints = useFeatureTypes(projectFeatures, "point");

  const onMouseEnter = (e) => {
    // hover states conflict! the first feature to reach hover state wins
    // so set point radii and line widths accordingly
    setCursor("pointer");

    e.features.forEach((feature) => {
      if (feature.layer.id.includes("project")) {
        // it's a project feature, so add to the hover tracking for sidebar interaction
        setHoveredOnMapFeature(feature);
      }
      // mapRef.current?.setFeatureState(feature, { hover: true });
    });
  };

  const onMouseLeave = (e) => {
    setCursor("grab");
    setHoveredOnMapFeature(null);
    // e.features.forEach((feature) => {
    //   mapRef.current?.setFeatureState(feature, { hover: false });
    //   // setHoveredOnMapFeatureId(null);
    // });
  };

  const onClick = (e) => {
    if (e.features.length === 0) {
      // clear clickedComponent if map is clicked elsewhere
      if (clickedComponent) {
        setClickedComponent(null);
      }
      return;
    }

    /* If not editing, handle click on project feature */
    if (!isEditingComponent) {
      const clickedProjectFeature = e.features.find((feature) =>
        feature.layer.id.includes("project")
      );
      if (!clickedProjectFeature) {
        return;
      }
      setClickedProjectFeature(clickedProjectFeature);
      return;
    }

    /* We're editing, so handle add/remove draft component feature */
    const newDraftComponent = cloneDeep(draftComponent);
    const clickedDraftComponentFeature = e.features.find(
      (feature) => feature.layer.id === draftLayerId
    );

    // If we clicked a drawn feature, we don't need to capture from the CTN layers
    if (isDrawnFeature(clickedDraftComponentFeature)) return;

    if (clickedDraftComponentFeature) {
      // remove project feature, ignore underlying CTN features
      const filteredFeatures = draftComponent.features.filter((compFeature) => {
        return !(
          compFeature.properties.id ===
            clickedDraftComponentFeature.properties.id &&
          compFeature.properties._layerId ===
            clickedDraftComponentFeature.properties._layerId
        );
      });
      newDraftComponent.features = filteredFeatures;
      setDraftComponent(newDraftComponent);
      return;
    }

    // if multiple features are clicked, we ignore all but one
    const clickedFeature = e.features[0];
    const featureFromAgolGeojson = findFeatureInAgolGeojsonFeatures(
      clickedFeature,
      linkMode,
      ctnLinesGeojson,
      ctnPointsGeojson
    );

    const newFeature = makeCapturedFromLayerFeature(
      featureFromAgolGeojson,
      clickedFeature,
      ctnLinesGeojson
    );

    newDraftComponent.features.push(newFeature);
    setDraftComponent(newDraftComponent);
    // setHoveredOnMapFeatureId(newFeature.properties.id);
  };

  const onMoveEnd = (e) => {
    const newBounds = mapRef.current.getBounds().toArray();
    setBounds(newBounds.flat());
  };

  // This is a temporary to get data into the map sources
  const data = {
    draftComponentFeatures,
    ctnLinesGeojson,
    ctnPointsGeojson,
    projectLines,
    projectPoints,
  };

  return (
    <MapGL
      ref={mapRef}
      initialViewState={initialViewState}
      interactiveLayerIds={interactiveLayerIds}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMoveEnd={onMoveEnd}
      onClick={onClick}
      boxZoom={false}
      cursor={cursor}
      mapStyle={basemaps[basemapKey].mapStyle}
      {...mapParameters}
    >
      <BasemapSpeedDial basemapKey={basemapKey} setBasemapKey={setBasemapKey} />
      <GeocoderControl position="top-left" marker={false} />
      <ComponentDrawTools
        setDraftComponent={setDraftComponent}
        linkMode={linkMode}
        setCursor={setCursor}
        setIsDrawing={setIsDrawing}
      />
      <BaseMapSourceAndLayers basemapKey={basemapKey} />
      <ComponentsSourcesAndLayers
        data={data}
        isEditingComponent={isEditingComponent}
        isDrawing={isDrawing}
        linkMode={linkMode}
        draftLayerId={draftLayerId}
        componentFeatureCollection={componentFeatureCollection}
        clickedComponent={clickedComponent}
      />
      <FeaturePopup
        onClose={() => setClickedProjectFeature(null)}
        feature={clickedProjectFeature}
        components={components}
        setClickedComponent={setClickedComponent}
      />
    </MapGL>
  );
}

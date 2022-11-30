import { useState } from "react";
import MapGL from "react-map-gl";
import { cloneDeep } from "lodash";
// import FeaturePopup from "./FeaturePopup";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import BasemapSpeedDial from "./BasemapSpeedDial";
import ComponentDrawTools from "./ComponentDrawTools";
import BaseMapSourceAndLayers from "./BaseMapSourceAndLayers";
import ProjectSourcesAndLayers from "./ProjectSourcesAndLayers";
import DraftComponentSourcesAndLayers from "./DraftComponentSourcesAndLayers";
import EditDraftComponentSourcesAndLayers from "./EditDraftComponentSourcesAndLayers";
import CTNSourcesAndLayers from "./CTNSourcesAndLayers";
import ClickedComponentSourcesAndLayers from "./ClickedComponentSourcesAndLayers";
import {
  basemaps,
  mapParameters,
  initialViewState,
  SOURCES,
} from "./mapSettings";
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
import {
  useProjectFeatures,
  useDraftComponentFeatures,
} from "./utils/makeData";
import { getClickedFeatureFromMap } from "./utils/onMapClick";

// See https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export default function TheMap({
  setHoveredOnMapFeature,
  hoveredOnMapFeature,
  components,
  isCreatingComponent,
  isEditingComponent,
  draftComponent,
  setDraftComponent,
  draftEditComponent,
  setDraftEditComponent,
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
  const draftEditComponentFeatures = useProjectFeatures(draftEditComponent);
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
      if (clickedProjectFeature) {
        setClickedProjectFeature(null);
      }
      return;
    }

    /* If not creating or editing, we need to set clicked features in state */
    if (!isCreatingComponent && !isEditingComponent) {
      const clickedProjectFeature = getClickedFeatureFromMap(e);

      setClickedProjectFeature(clickedProjectFeature);
      return;
    }

    if (isCreatingComponent) {
      /* We're creating, so handle add/remove draft component feature */
      const newDraftComponent = cloneDeep(draftComponent);
      const clickedDraftComponentFeature = e.features.find(
        (feature) => feature.layer.id === draftLayerId
      );

      // If we clicked a drawn feature, we don't need to capture from the CTN layers
      if (isDrawnFeature(clickedDraftComponentFeature)) return;

      if (clickedDraftComponentFeature) {
        // remove project feature, ignore underlying CTN features
        const filteredFeatures = draftComponent.features.filter(
          (compFeature) => {
            return !(
              compFeature.properties.id ===
                clickedDraftComponentFeature.properties.id &&
              compFeature.properties._layerId ===
                clickedDraftComponentFeature.properties._layerId
            );
          }
        );
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
    }

    if (isEditingComponent) {
      // TODO: Get id from properties from project_geography payload
      // TODO: Use line_representation to decide whether to worry about point or line layer
      const clickedFeature = e.features[0];
      const clickedFeatureSource = clickedFeature.layer.source;
      // Add new feature tied to clickedComponent or remove component_id from feature table (or hard delete it)
      // This only happens when clicking the new "Save Edit" button
      const sourceFeatureId = SOURCES[clickedFeatureSource]._featureIdProp;
      const featureId = clickedFeature.properties[sourceFeatureId];
      console.log({
        clickedComponent,
        clickedFeature,
        clickedFeatureSource,
        featureId,
      });

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

      const tableToInsert =
        draftEditComponent?.[0]?.moped_components?.feature_layer
          ?.internal_table;

      setDraftEditComponent((prev) => {
        const isFeatureAlreadyInComponent = Boolean(
          draftEditComponent[0][tableToInsert].find(
            (feature) =>
              feature?.ctn_segment_id === featureId ||
              feature?.properties?.[sourceFeatureId] === featureId
          )
        );

        // If the feature is not alread in the draftEditComponent, add it
        if (!isFeatureAlreadyInComponent) {
          return [
            {
              ...prev[0],
              [tableToInsert]: [...prev[0][tableToInsert], newFeature],
            },
          ];
        } else if (isFeatureAlreadyInComponent) {
          return [
            {
              ...prev[0],
              [tableToInsert]: prev[0][tableToInsert].filter(
                (feature) =>
                  feature?.ctn_segment_id !== featureId &&
                  feature?.properties?.[sourceFeatureId] !== featureId
              ),
            },
          ];
        }
      });

      // Remove an existing segment
      // Check the clicked component to see it is already associated with the component
      // If so, add to list of feature IDs to remove on save click
    }

    // setHoveredOnMapFeatureId(newFeature.properties.id);
  };

  const onMoveEnd = (e) => {
    const newBounds = mapRef.current.getBounds().toArray();
    setBounds(newBounds.flat());
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
      <DraftComponentSourcesAndLayers
        draftComponentFeatures={draftComponentFeatures}
        linkMode={linkMode}
      />
      <ProjectSourcesAndLayers
        isCreatingComponent={isCreatingComponent}
        isEditingComponent={isEditingComponent}
        isDrawing={isDrawing}
        linkMode={linkMode}
        clickedComponent={clickedComponent}
        projectLines={projectLines}
        projectPoints={projectPoints}
      />
      <ClickedComponentSourcesAndLayers
        clickedComponent={clickedComponent}
        componentFeatureCollection={componentFeatureCollection}
        isEditingComponent={isEditingComponent}
      />
      <EditDraftComponentSourcesAndLayers
        draftEditComponentFeatures={draftEditComponentFeatures}
        linkMode={linkMode}
        isEditingComponent={isEditingComponent}
      />
      <CTNSourcesAndLayers
        isCreatingComponent={isCreatingComponent}
        isEditingComponent={isEditingComponent}
        isDrawing={isDrawing}
        linkMode={linkMode}
        ctnLinesGeojson={ctnLinesGeojson}
        ctnPointsGeojson={ctnPointsGeojson}
      />
      {/* <FeaturePopup
        onClose={() => setClickedProjectFeature(null)}
        feature={clickedProjectFeature}
        components={components}
        setClickedComponent={setClickedComponent}
      /> */}
    </MapGL>
  );
}

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
import { interactiveLayerIds } from "./utils/map";
import {
  useAgolFeatures,
  findFeatureInAgolGeojsonFeatures,
} from "./utils/agol";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  isDrawnFeature,
  makeCapturedFromLayerFeature,
  useComponentFeatureCollectionFromMap,
} from "./utils/features";
import {
  useComponentFeatureCollection,
  useAllComponentsFeatureCollection,
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
  createDispatch,
  draftEditComponent,
  editDispatch,
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
  const projectComponentsFeatureCollection =
    useAllComponentsFeatureCollection(components);

  const draftComponentFeatures = useDraftComponentFeatures(draftComponent);
  const draftEditComponentFeatureCollection =
    useComponentFeatureCollection(draftEditComponent);
  const draftLayerId = `draft-component-${linkMode}`;

  const componentFeatureCollection = useComponentFeatureCollectionFromMap(
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
        createDispatch({
          type: "store_draft_component",
          payload: newDraftComponent,
        });
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
      createDispatch({
        type: "store_draft_component",
        payload: newDraftComponent,
      });
    }

    if (isEditingComponent) {
      // TODO: Combine steps that overlap with creating in this handler, make helpers out of the rest
      const clickedFeature = e.features[0];
      const clickedFeatureSource = clickedFeature.layer.source;

      const sourceFeatureId = SOURCES[clickedFeatureSource]._featureIdProp;
      const featureUniqueId = clickedFeature.properties[sourceFeatureId];

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
        draftEditComponent?.moped_components?.feature_layer?.internal_table;

      // Update UI
      const addOrRemoveClickedEditFeatures = (currentComponent) => {
        const isFeatureAlreadyInComponent = Boolean(
          currentComponent[tableToInsert].find(
            (feature) =>
              feature?.[sourceFeatureId.toLowerCase()] === featureUniqueId || // Already in database
              feature?.properties?.[sourceFeatureId] === featureUniqueId // From CTN layers
          )
        );

        // If the feature is not already in the draftEditComponent, add it
        // otherwise, remove it.
        if (!isFeatureAlreadyInComponent) {
          return {
            ...currentComponent,
            [tableToInsert]: [...currentComponent[tableToInsert], newFeature],
          };
        } else if (isFeatureAlreadyInComponent) {
          return {
            ...currentComponent,
            [tableToInsert]: currentComponent[tableToInsert].filter(
              (feature) =>
                feature?.[sourceFeatureId.toLowerCase()] !== featureUniqueId && // Already in database
                feature?.properties?.[sourceFeatureId] !== featureUniqueId // From CTN layers
            ),
          };
        }
      };

      editDispatch({
        type: "update_clicked_features",
        callback: addOrRemoveClickedEditFeatures,
      });
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
        createDispatch={createDispatch}
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
        projectComponentsFeatureCollection={projectComponentsFeatureCollection}
        draftEditComponent={draftEditComponent}
      />
      <ClickedComponentSourcesAndLayers
        clickedComponent={clickedComponent}
        componentFeatureCollection={componentFeatureCollection}
        isEditingComponent={isEditingComponent}
      />
      <EditDraftComponentSourcesAndLayers
        draftEditComponentFeatureCollection={
          draftEditComponentFeatureCollection
        }
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

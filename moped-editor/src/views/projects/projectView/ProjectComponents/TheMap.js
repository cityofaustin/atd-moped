import { useState } from "react";
import MapGL from "react-map-gl";
import { cloneDeep } from "lodash";
// import FeaturePopup from "./FeaturePopup";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import BasemapSpeedDial from "./BasemapSpeedDial";
import CreateComponentDrawTools from "./CreateComponentDrawTools";
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
  isDrawnDraftFeature,
  isDrawnExistingFeature,
  makeCapturedFromLayerFeature,
  useComponentFeatureCollectionFromMap,
} from "./utils/features";
import {
  useComponentFeatureCollection,
  useAllComponentsFeatureCollection,
  useDraftComponentFeatures,
} from "./utils/makeFeatureCollections";
import { getClickedFeatureFromMap } from "./utils/onMapClick";

// See https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
import mapboxgl from "mapbox-gl";
import EditComponentDrawTools from "./EditComponentDrawTools";
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
    if (!isDrawing) {
      setCursor("pointer");
    }

    e.features.forEach((feature) => {
      if (feature.layer.id.includes("project")) {
        // it's a project feature, so add to the hover tracking for sidebar interaction
        setHoveredOnMapFeature(feature);
      }
      // mapRef.current?.setFeatureState(feature, { hover: true });
    });
  };

  const onMouseLeave = (e) => {
    if (!isDrawing) {
      setCursor("grab");
    }
    setHoveredOnMapFeature(null);
    // e.features.forEach((feature) => {
    //   mapRef.current?.setFeatureState(feature, { hover: false });
    //   // setHoveredOnMapFeatureId(null);
    // });
  };

  const handleCreateOnClick = (e) => {
    const newDraftComponent = cloneDeep(draftComponent);
    const clickedDraftComponentFeature = e.features.find(
      (feature) => feature.layer.id === draftLayerId
    );

    // If we clicked a drawn feature, we don't need to capture from the CTN layers
    if (isDrawnDraftFeature(clickedDraftComponentFeature)) return;

    // If we clicked a feature that's already in the draftComponent, we remove it
    if (clickedDraftComponentFeature) {
      createDispatch({
        type: "remove_draft_component_feature",
        payload: clickedDraftComponentFeature,
      });
      return;
    }

    // Otherwise, we capture the feature from the CTN layers and add it to the draftComponent
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
  };

  const handleEditOnClick = (e) => {
    const clickedFeature = e.features[0];
    const clickedFeatureSource = clickedFeature.layer.source;

    // If drawn feature is clicked, the draw tools take over and we don't need to do anything else
    if (isDrawnExistingFeature(clickedFeature)) return;

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
        const filteredFeatures = currentComponent[tableToInsert].filter(
          (feature) =>
            feature?.[sourceFeatureId.toLowerCase()] !== featureUniqueId && // Already in database
            feature?.properties?.[sourceFeatureId] !== featureUniqueId // From CTN layers
        );

        const isAtLeastOneFeatureRemaining = filteredFeatures.length > 0;
        return isAtLeastOneFeatureRemaining
          ? {
              ...currentComponent,
              [tableToInsert]: filteredFeatures,
            }
          : currentComponent;
      }
    };

    editDispatch({
      type: "update_clicked_features",
      callback: addOrRemoveClickedEditFeatures,
    });
  };

  const onClick = (e) => {
    // if map is clicked outside interactive layers
    if (e.features.length === 0) {
      // clear clickedComponent to collapse list item
      if (clickedComponent) {
        setClickedComponent(null);
      }
      // clear clickedProjectFeature to close FeaturePopup
      if (clickedProjectFeature) {
        setClickedProjectFeature(null);
      }
      return;
    }

    /* If not creating or editing, set clickedFeature for FeaturePopup */
    if (!isCreatingComponent && !isEditingComponent) {
      const clickedProjectFeature = getClickedFeatureFromMap(e);

      setClickedProjectFeature(clickedProjectFeature);
      return;
    }

    /* We're creating, so handle add/remove draft component feature */
    if (isCreatingComponent) {
      handleCreateOnClick(e);
      return;
    }

    /* We're editing, so handle add/remove existing component features */
    if (isEditingComponent) {
      handleEditOnClick(e);
      return;
    }

    // setHoveredOnMapFeatureId(newFeature.properties.id);
  };

  const onMoveEnd = (e) => {
    const newBounds = mapRef.current.getBounds().toArray();
    setBounds(newBounds.flat());
  };

  const shouldShowDrawControls = linkMode === "points" || linkMode === "lines";
  const shouldShowCreateDrawControls =
    isCreatingComponent && shouldShowDrawControls;
  const shouldShowEditDrawControls =
    isEditingComponent && shouldShowDrawControls;

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
      {shouldShowCreateDrawControls && (
        <CreateComponentDrawTools
          createDispatch={createDispatch}
          linkMode={linkMode}
          setCursor={setCursor}
          setIsDrawing={setIsDrawing}
        />
      )}
      {shouldShowEditDrawControls && (
        <EditComponentDrawTools
          editDispatch={editDispatch}
          linkMode={linkMode}
          setCursor={setCursor}
          setIsDrawing={setIsDrawing}
          draftEditComponent={draftEditComponent}
        />
      )}
      <BaseMapSourceAndLayers basemapKey={basemapKey} />
      <ProjectSourcesAndLayers
        isCreatingComponent={isCreatingComponent}
        isEditingComponent={isEditingComponent}
        isDrawing={isDrawing}
        linkMode={linkMode}
        clickedComponent={clickedComponent}
        projectComponentsFeatureCollection={projectComponentsFeatureCollection}
        draftEditComponent={draftEditComponent}
      />
      <DraftComponentSourcesAndLayers
        draftComponentFeatures={draftComponentFeatures}
        linkMode={linkMode}
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

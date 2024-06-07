import { useEffect, useState } from "react";
import MapGL, { NavigationControl } from "react-map-gl";
import { cloneDeep } from "lodash";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import BasemapSpeedDial from "./BasemapSpeedDial";
import CreateComponentDrawTools from "./CreateComponentDrawTools";
import EditComponentDrawTools from "./EditComponentDrawTools";
import BaseMapSourceAndLayers from "./BaseMapSourceAndLayers";
import ProjectSourcesAndLayers from "./ProjectSourcesAndLayers";
import RelatedProjectSourcesAndLayers from "./RelatedProjectSourcesAndLayers";
import DraftComponentSourcesAndLayers from "./DraftComponentSourcesAndLayers";
import EditDraftComponentSourcesAndLayers from "./EditDraftComponentSourcesAndLayers";
import CTNSourcesAndLayers from "./CTNSourcesAndLayers";
import ClickedComponentSourcesAndLayers from "./ClickedComponentSourcesAndLayers";
import {
  basemaps,
  mapParameters,
  initialViewState,
  SOURCES,
  MIN_SELECT_FEATURE_ZOOM,
} from "./mapSettings";
import { getInteractiveLayers, useZoomToExistingComponents } from "./utils/map";
import {
  useAgolFeatures,
  findFeatureInAgolGeojsonFeatures,
} from "./utils/agol";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  makeCapturedFromLayerFeature,
  areAnyClickedFeaturesSavedDrawnFeatures,
  areAnyClickedFeaturesDraftDrawnFeatures,
} from "./utils/features";
import {
  useComponentFeatureCollection,
  useAllComponentsFeatureCollection,
  useDraftComponentFeatures,
} from "./utils/makeFeatureCollections";
import { getClickedFeatureFromMap } from "./utils/onMapClick";
import { useHasMapLoaded } from "./utils/useHasMapLoaded";

export default function TheMap({
  projectComponents,
  allRelatedComponents,
  isCreatingComponent,
  isEditingComponent,
  draftComponent,
  createDispatch,
  draftEditComponent,
  editDispatch,
  mapRef,
  clickedComponent,
  linkMode,
  setIsFetchingFeatures,
  isDrawing,
  setIsDrawing,
  errorMessageDispatch,
  shouldShowRelatedProjects,
  isClickedComponentRelated,
  setIsClickedComponentRelated,
  makeClickedComponentUpdates,
}) {
  const [cursor, setCursor] = useState("grab");

  const [bounds, setBounds] = useState();
  const [basemapKey, setBasemapKey] = useState("streets");
  const projectComponentsFeatureCollection =
    useAllComponentsFeatureCollection(projectComponents);
  const allRelatedComponentsFeatureCollection =
    useAllComponentsFeatureCollection(allRelatedComponents);
  const projectAndRelatedComponentsFeatureCollection =
    useAllComponentsFeatureCollection([
      ...projectComponents,
      ...allRelatedComponents,
    ]);

  const draftComponentFeatures = useDraftComponentFeatures(draftComponent);
  const draftEditComponentFeatureCollection =
    useComponentFeatureCollection(draftEditComponent);

  const clickedComponentFeatureCollection =
    useComponentFeatureCollection(clickedComponent);

  const currentZoom = mapRef?.current?.getZoom();
  const { ctnLinesGeojson, ctnPointsGeojson } = useAgolFeatures(
    linkMode,
    setIsFetchingFeatures,
    currentZoom,
    bounds
  );

  useZoomToExistingComponents(
    mapRef,
    projectAndRelatedComponentsFeatureCollection,
    false
  );

  useEffect(() => {
    const shouldShowZoomAlert =
      currentZoom < MIN_SELECT_FEATURE_ZOOM &&
      (isCreatingComponent || isEditingComponent) &&
      isDrawing === false;

    if (shouldShowZoomAlert) {
      errorMessageDispatch({
        type: "show_error",
        payload: {
          message: "Zoom in to select features",
          severity: "error",
          messageType: "componentZoomError",
        },
      });
    } else {
      errorMessageDispatch({ type: "hide_zoom_error" });
    }
  }, [
    currentZoom,
    isCreatingComponent,
    isEditingComponent,
    isDrawing,
    errorMessageDispatch,
  ]);

  const onMouseEnter = (e) => {
    !isDrawing && setCursor("pointer");
  };

  const onMouseLeave = (e) => {
    !isDrawing && setCursor("grab");
  };

  const handleCreateOnClick = (e) => {
    const newDraftComponent = cloneDeep(draftComponent);
    const allClickedFeatures = e.features;

    /* Get the details we need to see if the feature is already in the draftComponent or not */
    const { internal_table } = newDraftComponent;
    const ctnUniqueIdentifier = Object.values(SOURCES).find(
      (source) => source.table === internal_table
    )._featureIdProp;

    /* Get the IDs of the features already in the draftComponent */
    const existingDraftIds = newDraftComponent.features.map(
      (feature) => feature.properties[ctnUniqueIdentifier]
    );

    /* Find the feature that was clicked that's already in the draftComponent */
    const clickedDraftComponentFeature = e.features.find((feature) =>
      existingDraftIds.includes(feature.properties[ctnUniqueIdentifier])
    );

    /* If any clicked features are drawn draft features, the draw tools 
    take over and we don't need to do anything else */
    if (areAnyClickedFeaturesDraftDrawnFeatures(allClickedFeatures)) return;

    /* If we clicked a feature that's already in the draftComponent, we remove it  */
    if (clickedDraftComponentFeature) {
      createDispatch({
        type: "remove_draft_component_feature",
        payload: clickedDraftComponentFeature,
      });
      return;
    }

    /* Otherwise, we capture the feature from the CTN layers and add it to the draftComponent  */
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
    const allClickedFeatures = e.features;
    const clickedFeatureSource = clickedFeature.layer.source;

    /* If any clicked features are draft drawn or saved drawn features, 
    the draw tools take over and we don't need to do anything else */
    if (
      areAnyClickedFeaturesSavedDrawnFeatures(allClickedFeatures) ||
      areAnyClickedFeaturesDraftDrawnFeatures(allClickedFeatures)
    )
      return;

    const source = SOURCES[clickedFeatureSource];
    if (!source) {
      // this can happen if the mapped is zoomed out such that AGOL/CTN feature layers are not visibile
      // but the underyling draft edit component has captured a click
      // we can't handle this click right now, so just return
      // todo: manage layer interactivity based on zoom level + if the feature is drawn?
      return;
    }
    const sourceFeatureId = source._featureIdProp;
    const databaseTableId = source.databaseTableId;
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

    /* Update UI  */
    const addOrRemoveClickedEditFeatures = (currentComponent) => {
      const isFeatureAlreadyInComponent = Boolean(
        currentComponent[tableToInsert].find(
          (feature) =>
            feature?.[databaseTableId] === featureUniqueId || // Already in database
            feature?.properties?.[sourceFeatureId] === featureUniqueId // From CTN layers
        )
      );

      /* 
        If the feature is not already in the draftEditComponent, add it
        otherwise, remove it.
      */
      if (!isFeatureAlreadyInComponent) {
        return {
          ...currentComponent,
          [tableToInsert]: [...currentComponent[tableToInsert], newFeature],
        };
      } else if (isFeatureAlreadyInComponent) {
        const filteredFeatures = currentComponent[tableToInsert].filter(
          (feature) =>
            feature?.[databaseTableId] !== featureUniqueId && // Already in database
            feature?.properties?.[sourceFeatureId] !== featureUniqueId // From CTN layers
        );

        return {
          ...currentComponent,
          [tableToInsert]: filteredFeatures,
        };
      }
    };

    editDispatch({
      type: "update_clicked_features",
      callback: addOrRemoveClickedEditFeatures,
    });
  };

  const onClick = (e) => {
    /* if map is clicked outside interactive layers */
    if (e.features.length === 0) {
      /* clear clickedComponent to collapse list item  */
      if (clickedComponent) {
        makeClickedComponentUpdates(null);
        setIsClickedComponentRelated(false);
      }

      /* If not editing, clear draftEditComponent when map is clicked away from expanded
      list item */
      if (draftEditComponent && !isEditingComponent) {
        editDispatch({ type: "clear_draft_component" });
      }
      return;
    }

    /* If not creating or editing, set clickedFeature for FeaturePopup */
    if (!isCreatingComponent && !isEditingComponent) {
      const clickedProjectFeature = getClickedFeatureFromMap(e);

      /* Extract component id fron the clicked feature */
      const clickedComponentId =
        clickedProjectFeature?.properties.project_component_id;

      /* Find the component (this project's component or related components) that matches this feature */
      let isNewClickedComponentRelated = false;
      let clickedComponentFromMap = projectComponents.find(
        (component) => component.project_component_id === clickedComponentId
      );

      if (!clickedComponentFromMap) {
        clickedComponentFromMap = allRelatedComponents.find(
          (component) => component.project_component_id === clickedComponentId
        );
        if (clickedComponentFromMap) {
          isNewClickedComponentRelated = true;
        }
      }

      /* Assign to clickedComponent and trigger side-panel scroll  */
      if (clickedComponentFromMap) {
        makeClickedComponentUpdates(clickedComponentFromMap);
        // Make sure that state reflects whether the clicked component is related or not
        // so that we see the map display features with the corresponding color
        isNewClickedComponentRelated && setIsClickedComponentRelated(true);
        !isNewClickedComponentRelated && setIsClickedComponentRelated(false);

        const ref = clickedComponentFromMap?._ref;
        ref?.current && ref.current.scrollIntoView({ behavior: "smooth" });
      }
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

  const { hasMapLoaded, onMapLoad } = useHasMapLoaded();

  return (
    <>
      <MapGL
        ref={mapRef}
        initialViewState={initialViewState}
        interactiveLayerIds={getInteractiveLayers(isDrawing)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMoveEnd={onMoveEnd}
        onClick={onClick}
        cursor={cursor}
        mapStyle={basemaps[basemapKey].mapStyle}
        onLoad={onMapLoad}
        {...mapParameters}
      >
        <BasemapSpeedDial
          basemapKey={basemapKey}
          setBasemapKey={setBasemapKey}
        />
        <NavigationControl position="bottom-left" showCompass={false} />
        <GeocoderControl position="top-left" marker={false} />
        {shouldShowCreateDrawControls && (
          <CreateComponentDrawTools
            createDispatch={createDispatch}
            linkMode={linkMode}
            setCursor={setCursor}
            setIsDrawing={setIsDrawing}
            isDrawing={isDrawing}
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
        {/* Wait until the map loads and components-placeholder layer is ready to target */}
        {hasMapLoaded && (
          <>
            <ProjectSourcesAndLayers
              isCreatingComponent={isCreatingComponent}
              isEditingComponent={isEditingComponent}
              isDrawing={isDrawing}
              linkMode={linkMode}
              clickedComponent={clickedComponent}
              projectComponentsFeatureCollection={
                projectComponentsFeatureCollection
              }
              draftEditComponent={draftEditComponent}
            />
            <RelatedProjectSourcesAndLayers
              isCreatingComponent={isCreatingComponent}
              isEditingComponent={isEditingComponent}
              featureCollection={allRelatedComponentsFeatureCollection}
              shouldShowRelatedProjects={shouldShowRelatedProjects}
              clickedComponent={clickedComponent}
            />
            <DraftComponentSourcesAndLayers
              draftComponentFeatures={draftComponentFeatures}
              linkMode={linkMode}
            />
            <ClickedComponentSourcesAndLayers
              clickedComponent={clickedComponent}
              componentFeatureCollection={clickedComponentFeatureCollection}
              isEditingComponent={isEditingComponent}
              isClickedComponentRelated={isClickedComponentRelated}
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
          </>
        )}
      </MapGL>
    </>
  );
}

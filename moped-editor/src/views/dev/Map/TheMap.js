import { useState, useMemo } from "react";
import MapGL, { Source, Layer } from "react-map-gl";
import { cloneDeep } from "lodash";
import FeaturePopup from "./FeaturePopup";
import {
  mapSettings,
  initialViewState,
  MAP_STYLES,
  SOURCES,
  MIN_SELECT_FEATURE_ZOOM,
} from "./settings";
import { getIntersectionLabel, useFeatureTypes } from "./utils";
import { useFeatureService } from "./agolUtils";
import "mapbox-gl/dist/mapbox-gl.css";

const useComponentFeatureCollection = (component) =>
  useMemo(() => {
    if (!component || !component?.features) return;
    return { type: "FeatureCollection", features: component.features };
  }, [component]);

const deDeupeProjectFeatures = (features) => {
  return features.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (f) =>
          f.properties.id === value.properties.id &&
          f.properties._layerId === value.properties._layerId
      )
  );
};

// returns geojson of **unique** features across all components
const useProjectFeatures = (components) =>
  useMemo(() => {
    const allComponentfeatures = [];
    components.forEach((component) =>
      allComponentfeatures.push(component.features)
    );
    return {
      type: "FeatureCollection",
      features: deDeupeProjectFeatures(allComponentfeatures.flat()),
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
}) {
  const [cursor, setCursor] = useState("grap");
  const [bounds, setBounds] = useState();
  const projectFeatures = useProjectFeatures(components);

  const draftComponentFeatures = useDraftComponentFeatures(draftComponent);
  const draftLayerId = `draft-component-${linkMode}`;

  const mapStyles = MAP_STYLES;

  // yeah, these props are mess :/
  const ctnLinesGeojson = useFeatureService({
    layerId: SOURCES["ctn-lines"].featureService.layerId,
    name: SOURCES["ctn-lines"].featureService.name,
    bounds,
    isVisible:
      linkMode === "lines" &&
      mapRef?.current?.getZoom() >= MIN_SELECT_FEATURE_ZOOM,
    featureIdProp: SOURCES["ctn-lines"]._featureIdProp,
    setIsFetchingFeatures,
  });

  const ctnPointsGeojson = useFeatureService({
    layerId: SOURCES["ctn-points"].featureService.layerId,
    name: SOURCES["ctn-points"].featureService.name,
    bounds,
    isVisible:
      linkMode === "points" &&
      mapRef?.current?.getZoom() >= MIN_SELECT_FEATURE_ZOOM,
    featureIdProp: SOURCES["ctn-points"]._featureIdProp,
    setIsFetchingFeatures,
  });

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

    const newFeature = {
      geometry: clickedFeature.geometry,
      properties: {
        ...clickedFeature.properties,
        id: clickedFeature.id,
        _layerId: clickedFeature.layer.id,
      },
    };

    if (newFeature.properties._layerId.includes("point")) {
      newFeature.properties._label = getIntersectionLabel(
        newFeature,
        ctnLinesGeojson
      );
    } else {
      newFeature.properties._label = `${newFeature.properties.FROM_ADDRESS_MIN} BLK ${newFeature.properties.FULL_STREET_NAME}`;
    }

    newDraftComponent.features.push(newFeature);
    setDraftComponent(newDraftComponent);
    // setHoveredOnMapFeatureId(newFeature.properties.id);
  };

  const onMoveEnd = (e) => {
    const newBounds = mapRef.current.getBounds().toArray();
    setBounds(newBounds.flat());
  };

  const componentFeatureCollection =
    useComponentFeatureCollection(clickedComponent);

  console.log(draftComponent?.features);
  return (
    <MapGL
      ref={mapRef}
      initialViewState={initialViewState}
      interactiveLayerIds={
        isEditingComponent
          ? linkMode === "lines"
            ? ["ctn-lines-underlay", "project-lines-underlay", draftLayerId]
            : ["ctn-points-underlay", "project-points", draftLayerId]
          : ["project-points", "project-lines-underlay"]
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMoveEnd={onMoveEnd}
      onClick={onClick}
      boxZoom={false}
      cursor={cursor}
      {...mapSettings}
    >
      <Source
        id="ctn-lines"
        type="geojson"
        data={ctnLinesGeojson}
        promoteId={SOURCES["ctn-lines"]._featureIdProp}
      >
        {isEditingComponent && linkMode === "lines" && (
          <Layer {...mapStyles["ctn-lines-underlay"]} />
        )}
        {isEditingComponent && linkMode === "lines" && (
          <Layer {...mapStyles["ctn-lines"]} />
        )}
      </Source>
      {/* <Source
        id="ctn-points"
        type="vector"
        tiles={[
          "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Intersections_MOPED/VectorTileServer/tile/{z}/{y}/{x}.pbf",
        ]}
      > */}
      <Source
        id="ctn-points"
        type="geojson"
        data={ctnPointsGeojson}
        promoteId={SOURCES["ctn-points"]._featureIdProp}
      >
        {isEditingComponent && linkMode === "points" && (
          <Layer {...mapStyles["ctn-points-underlay"]} />
        )}
        {isEditingComponent && linkMode === "points" && (
          <Layer {...mapStyles["ctn-points"]} />
        )}
      </Source>
      <Source
        id="project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer {...mapStyles["project-lines-underlay"]} />
        <Layer
          {...mapStyles[
            clickedComponent || isEditingComponent
              ? "project-lines-muted"
              : "project-lines"
          ]}
        />
      </Source>
      <Source
        id="project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer
          {...mapStyles[
            clickedComponent || isEditingComponent
              ? "project-points-muted"
              : "project-points"
          ]}
        />
      </Source>
      {linkMode && (
        <Source
          id={draftLayerId}
          type="geojson"
          data={draftComponentFeatures}
          promoteId="id"
        >
          <Layer {...mapStyles[draftLayerId]} />
        </Source>
      )}
      {componentFeatureCollection && (
        <Source
          id="clicked-component-features"
          type="geojson"
          data={componentFeatureCollection}
          promoteId="id"
        >
          {clickedComponent.line_representation && (
            <Layer {...mapStyles["clicked-component-features-lines"]} />
          )}
          {!clickedComponent.line_representation && (
            <Layer {...mapStyles["clicked-component-features-points"]} />
          )}
        </Source>
      )}
      <FeaturePopup
        onClose={() => setClickedProjectFeature(null)}
        feature={clickedProjectFeature}
        components={components}
        setClickedComponent={setClickedComponent}
      />
    </MapGL>
  );
}

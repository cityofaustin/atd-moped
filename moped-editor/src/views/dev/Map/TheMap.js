import { useState, useMemo } from "react";
import MapGL, { Source, Layer, Popup } from "react-map-gl";
import { cloneDeep } from "lodash";
import turfCenter from "@turf/center";
import { mapSettings, initialViewState, MAP_STYLES, SOURCES } from "./settings";
import {
  useFeatureService,
  getIntersectionLabel,
  useFeatureTypes,
} from "./utils";
import "mapbox-gl/dist/mapbox-gl.css";

export default function TheMap({
  projectFeatures,
  setProjectFeatures,
  setHoveredOnMapFeatureId,
  isEditingMap,
  mapRef,
  clickedProjectFeatureFromList,
  setClickedProjectFeatureFromList,
}) {
  const [cursor, setCursor] = useState("grap");
  const [bounds, setBounds] = useState();

  const mapStyles = MAP_STYLES;

  const ctnLinesGeojson = useFeatureService({
    layerId: SOURCES["ctn-lines"].featureService.layerId,
    name: SOURCES["ctn-lines"].featureService.name,
    bounds,
    isVisible: mapRef?.current?.getZoom() >= SOURCES["ctn-lines"].minZoom,
    featureIdProp: SOURCES["ctn-lines"]._featureIdProp,
  });

  const ctnPointsGeojson = useFeatureService({
    layerId: SOURCES["ctn-points"].featureService.layerId,
    name: SOURCES["ctn-points"].featureService.name,
    bounds,
    isVisible: mapRef?.current?.getZoom() >= SOURCES["ctn-points"].minZoom,
    featureIdProp: SOURCES["ctn-points"]._featureIdProp,
  });

  const projectLines = useFeatureTypes(projectFeatures, "line");
  const projectPoints = useFeatureTypes(projectFeatures, "point");

  const onMouseEnter = (e) => {
    // hover states conflict! the first feature to reach hover state wins
    // so set point radii and line widths accordingly
    setCursor("pointer");
    const commitsToMake = [];

    e.features.map((feature) => {
      if (feature.layer.id.includes("project")) {
        // it's a project feature, so add to the hover tracking for sidebar interaction
        commitsToMake.push(feature.properties.id);
      }
      mapRef.current?.setFeatureState(feature, { hover: true });
    });

    commitsToMake.length > 0 && setHoveredOnMapFeatureId(commitsToMake[0]);
  };

  const onMouseLeave = (e) => {
    setCursor("grab");
    e.features.map((feature) => {
      mapRef.current?.setFeatureState(feature, { hover: false });
      setHoveredOnMapFeatureId(null);
    });
  };

  const onClick = (e) => {
    if (e.features.length === 0) {
      return;
    }

    const newProjectFeatures = cloneDeep(projectFeatures);
    const clickedProjectFeature = e.features.find(
      (feature) =>
        feature.layer.id === "project-lines-underlay" ||
        feature.layer.id === "project-points"
    );

    // we have to fork our click effect to hand when map is being edited or not
    if (!isEditingMap) {
      if (!clickedProjectFeature) {
        return;
      }
      setClickedProjectFeatureFromList(clickedProjectFeature);
      return;
    }

    if (clickedProjectFeature) {
      // remove project feature, ignore underling CTN features
      // remove feature if it exists
      const filteredFeatures = projectFeatures.features.filter(
        (projFeature) => {
          return !(
            projFeature.properties.id === clickedProjectFeature.properties.id &&
            projFeature.properties._layerId ===
              clickedProjectFeature.properties._layerId
          );
        }
      );

      newProjectFeatures.features = filteredFeatures;
      setProjectFeatures(newProjectFeatures);
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

    newProjectFeatures.features.push(newFeature);
    setProjectFeatures(newProjectFeatures);
    setHoveredOnMapFeatureId(newFeature.properties.id);
  };

  const onMoveEnd = (e) => {
    const newBounds = mapRef.current.getBounds().toArray();
    setBounds(newBounds.flat());
  };

  const clickedProjectFeatureFromListCenter = useMemo(() => {
    if (!clickedProjectFeatureFromList) return;
    return turfCenter(clickedProjectFeatureFromList.geometry);
  }, [clickedProjectFeatureFromList]);

  return (
    <MapGL
      ref={mapRef}
      initialViewState={initialViewState}
      interactiveLayerIds={
        isEditingMap
          ? [
              "ctn-lines-underlay",
              "project-lines-underlay",
              "ctn-points-underlay",
              "project-points",
            ]
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
        {isEditingMap && <Layer {...mapStyles["ctn-lines-underlay"]} />}
        {isEditingMap && <Layer {...mapStyles["ctn-lines"]} />}
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
        {isEditingMap && <Layer {...mapStyles["ctn-points-underlay"]} />}
        {isEditingMap && <Layer {...mapStyles["ctn-points"]} />}
      </Source>
      <Source
        id="project-lines"
        type="geojson"
        data={projectLines}
        promoteId="id"
      >
        <Layer {...mapStyles["project-lines-underlay"]} />
        <Layer {...mapStyles["project-lines"]} />
      </Source>
      <Source
        id="project-points"
        type="geojson"
        data={projectPoints}
        promoteId="id"
      >
        <Layer {...mapStyles["project-points"]} />
      </Source>
      {clickedProjectFeatureFromList && (
        <Popup
          longitude={
            clickedProjectFeatureFromListCenter.geometry.coordinates[0]
          }
          latitude={clickedProjectFeatureFromListCenter.geometry.coordinates[1]}
          onClose={() => setClickedProjectFeatureFromList(null)}
        >
          {clickedProjectFeatureFromList.properties._label}
        </Popup>
      )}
    </MapGL>
  );
}

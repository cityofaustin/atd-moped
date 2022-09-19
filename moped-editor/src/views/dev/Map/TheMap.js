import { useRef, useState, useMemo, useEffect } from "react";
import MapGL, { Source, Layer, NavigationControl, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapSettings, initialViewState, MAP_STYLES, SOURCES } from "./settings";
import { cloneDeep } from "lodash";
import { useFeatureService, getIntersectionLabel } from "./utils";

const useFeatureTypes = (featureCollection, geomType) =>
  useMemo(() => {
    const features = featureCollection.features.filter((feature) => {
      const thisGeom = feature.geometry.type.toLowerCase();
      return thisGeom.includes(geomType);
    });
    return { type: "FeatureCollection", features };
  }, [featureCollection, geomType]);

export default function TheMap({ projectFeatures, setProjectFeatures }) {
  const [cursor, setCursor] = useState("grap");
  const [bounds, setBounds] = useState();
  const mapRef = useRef();

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
    setCursor("pointer");
    e.features.map((feature) => {
      mapRef.current?.setFeatureState(feature, { hover: true });
    });
  };

  const onMouseLeave = (e) => {
    setCursor("grab");
    e.features.map((feature) => {
      mapRef.current?.setFeatureState(feature, { hover: false });
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
    }

    newProjectFeatures.features.push(newFeature);
    setProjectFeatures(newProjectFeatures);
  };

  const onMoveEnd = (e) => {
    const newBounds = mapRef.current.getBounds().toArray();
    setBounds(newBounds.flat());
  };

  return (
    <MapGL
      ref={mapRef}
      initialViewState={initialViewState}
      interactiveLayerIds={[
        "project-points",
        // "ctn-lines",
        "ctn-lines-underlay",
        "project-lines-underlay",
        // "project-lines",
        "ctn-points",
      ]}
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
        <Layer {...mapStyles["ctn-lines-underlay"]} />
        <Layer {...mapStyles["ctn-lines"]} />
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
        <Layer {...mapStyles["ctn-points"]} />
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
    </MapGL>
  );
}

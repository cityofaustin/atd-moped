import { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import { basemaps, SOURCES } from "./mapSettings";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

const useComponentFeatureCollection = (component) =>
  useMemo(() => {
    if (!component || !component?.features) return;
    return { type: "FeatureCollection", features: component.features };
  }, [component]);

export const useBasemapLayers = ({ basemapKey }) => {
  // Handle basemaps
  // TODO: Address https://github.com/cityofaustin/atd-moped/pull/837#pullrequestreview-1146234061
  // See https://github.com/visgl/react-map-gl/issues/939

  const BaseMapSourceAndLayers = () =>
    basemapKey === "aerial" && (
      <>
        <Source {...basemaps[basemapKey].sources.aerials} />
        <Layer {...basemaps[basemapKey].layers.aerials} />
        {/* show street labels on top of other layers */}
        {/* Use beforeId on other layers to make street labels above everything else */}
        {/* Should we just style this layer to be hidden with Mapbox style spec? */}
        <Layer {...basemaps[basemapKey].layers.streetLabels} />
      </>
    );

  return { BaseMapSourceAndLayers };
};
// There is a config here that sets the order of layers on the map
// The hook makes sure this is enforced
// Config also sets whether a layer is interactive or not

// inputs:
// 1. basemapKey: aerial or streets
// 2. data (to see what sources and layers need to be added)
// 3. isEditingComponent

// outputs
// 1. basemap source and layer if aerial
// 2. sources and layers in correct order
// 3. array of interactive layers based on config and what layers are present in the data
export const useMapLayers = ({
  data,
  isEditingComponent,
  linkMode,
  draftLayerId,
  clickedComponent,
}) => {
  const interactiveLayerIds = useMemo(() => {
    return isEditingComponent
      ? linkMode === "lines"
        ? ["ctn-lines-underlay", "project-lines-underlay", draftLayerId]
        : ["ctn-points-underlay", "project-points", draftLayerId]
      : ["project-points", "project-lines-underlay"];
  }, [isEditingComponent, linkMode]);

  console.log(interactiveLayerIds);

  // Handle sources and layer for data
  const {
    ctnLinesGeojson,
    ctnPointsGeojson,
    projectLines,
    projectPoints,
    draftComponentFeatures,
  } = data;

  const componentFeatureCollection =
    useComponentFeatureCollection(clickedComponent);

  const ProjectComponentsSourcesAndLayers = () => (
    <>
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
    </>
  );

  return {
    interactiveLayerIds,
    ProjectComponentsSourcesAndLayers,
  };
};

import * as React from "react";
import { useState } from "react";
import { useControl, Marker } from "react-map-gl/mapbox";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { mapParameters } from "src/views/projects/projectView/ProjectComponents/mapSettings";

// See MOPED Technical Docs > Dev Guides > Maps and geospatial data  > Libraries
const austinFullPurposeJurisdictionFeatureCollection = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:4326",
    },
  },
  bbox: [-98.182, 29.987, -97.304, 30.663],
  features: [],
};

// See https://github.com/visgl/react-map-gl/tree/7.0-release/examples/geocoder
export default function GeocoderControl(props) {
  const [marker, setMarker] = useState(null);

  const handleLoading = (...args) => {
    if (typeof props.onLoading === "function") {
      props.onLoading(...args);
    }
  };

  const handleResults = (...args) => {
    if (typeof props.onResults === "function") {
      props.onResults(...args);
    }
  };

  const handleResult = (evt) => {
    if (typeof props.onResult === "function") {
      props.onResult(evt);
    }
  };

  const handleError = (...args) => {
    if (typeof props.onError === "function") {
      props.onError(...args);
    }
  };

  const geocoder = useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        flyTo: true,
        accessToken: mapParameters.mapboxAccessToken,
        bbox: austinFullPurposeJurisdictionFeatureCollection.bbox,
      });
      ctrl.on("loading", handleLoading);
      ctrl.on("results", handleResults);
      ctrl.on("result", (evt) => {
        handleResult(evt);

        const { result } = evt;
        const location =
          result &&
          (result.center ||
            (result.geometry?.type === "Point" && result.geometry.coordinates));
        if (location && props.marker) {
          setMarker(
            <Marker
              {...props.marker}
              longitude={location[0]}
              latitude={location[1]}
            />
          );
        } else {
          setMarker(null);
        }
      });
      ctrl.on("error", handleError);
      return ctrl;
    },
    {
      position: props.position,
    }
  );

  // @ts-expect-error (TS2339) private member
  if (geocoder._map) {
    if (
      geocoder.getProximity() !== props.proximity &&
      props.proximity !== undefined
    ) {
      geocoder.setProximity(props.proximity);
    }
    if (
      geocoder.getRenderFunction() !== props.render &&
      props.render !== undefined
    ) {
      geocoder.setRenderFunction(props.render);
    }
    if (
      geocoder.getLanguage() !== props.language &&
      props.language !== undefined
    ) {
      geocoder.setLanguage(props.language);
    }
    if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
      geocoder.setZoom(props.zoom);
    }
    if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
      geocoder.setFlyTo(props.flyTo);
    }
    if (
      geocoder.getPlaceholder() !== props.placeholder &&
      props.placeholder !== undefined
    ) {
      geocoder.setPlaceholder(props.placeholder);
    }
    if (
      geocoder.getCountries() !== props.countries &&
      props.countries !== undefined
    ) {
      geocoder.setCountries(props.countries);
    }
    if (geocoder.getTypes() !== props.types && props.types !== undefined) {
      geocoder.setTypes(props.types);
    }
    if (
      geocoder.getMinLength() !== props.minLength &&
      props.minLength !== undefined
    ) {
      geocoder.setMinLength(props.minLength);
    }
    if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
      geocoder.setLimit(props.limit);
    }
    if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
      geocoder.setFilter(props.filter);
    }
    if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
      geocoder.setOrigin(props.origin);
    }
  }
  return marker;
}

const noop = () => {};

// To do: replace defaultProps
GeocoderControl.defaultProps = {
  marker: true,
  onLoading: noop,
  onResults: noop,
  onResult: noop,
  onError: noop,
};

import { useMemo } from "react";
import { Popup } from "react-map-gl";
import turfCenter from "@turf/center";

export default function ComponentPopup({
  component,
  onClose,
  featureCollection,
}) {
  const center = useMemo(() => {
    if (!featureCollection) return;
    return turfCenter(featureCollection);
  }, [featureCollection]);

  if (!component) return null;

  return (
    <Popup
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      onClose={onClose}
    >
      <div style={{ width: 300 }}>
        <div>
          <span style={{ fontWeight: "bold" }}>{component.component_name}</span>
        </div>
      </div>
    </Popup>
  );
}

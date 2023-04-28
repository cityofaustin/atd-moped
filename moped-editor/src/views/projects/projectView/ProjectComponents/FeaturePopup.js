import React, { useMemo } from "react";
import { Popup } from "react-map-gl";
import turfCenter from "@turf/center";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const useFeatureComponents = (feature, components) =>
  useMemo(() => {
    if (!feature || !components?.length > 0) {
      return;
    }
    return components.filter(
      (component) =>
        !!component.features.find(
          (thisFeature) =>
            thisFeature.properties.id === feature.properties.id &&
            feature.properties._layerId === thisFeature.properties._layerId
        )
    );
  }, [feature, components]);

export default function FeaturePopup({
  feature,
  onClose,
  components,
  setClickedComponent,
}) {
  const featureComponents = useFeatureComponents(feature, components);

  const center = useMemo(() => {
    if (!feature) return;
    return turfCenter(feature.geometry);
  }, [feature]);

  if (!feature) return null;
  return (
    <Popup
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      onClose={onClose}
    >
      <div>
        <List dense>
          <ListItem>
            <ListItemText primary={feature.properties._label} />
          </ListItem>
          {featureComponents?.map((component) => {
            return (
              <React.Fragment key={component._id}>
                <ListItem
                  button
                  onClick={() => {
                    setClickedComponent(component);
                    onClose();
                  }}
                  disableGutters
                >
                  <ListItemIcon style={{ minWidth: 0, paddingRight: "1rem" }}>
                    <ChevronRightIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={component.component_name}
                    secondary={component.component_subtype}
                  />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      </div>
    </Popup>
  );
}

import React, { useMemo } from "react";
import { Popup } from "react-map-gl";
import turfCenter from "@turf/center";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

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
  console.log({ feature, components });
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

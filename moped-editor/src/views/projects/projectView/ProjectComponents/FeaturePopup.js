import React, { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { Popup } from "react-map-gl";
import turfCenter from "@turf/center";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ProjectStatusBadge from "../ProjectStatusBadge";

/**
 * Group features by project
 */
const useGroupedFeatures = (features) =>
  useMemo(() => {
    if (!features) return;
    const projects = {};
    features.forEach((feature) => {
      const project_id = feature.properties.project_id;
      projects[project_id] ??= [];
      projects[project_id].push(feature);
    });
    return Object.keys(projects).map((key) => projects[key]);
  }, [features]);

export default function FeaturePopup({ features, onClose }) {
  const center = useMemo(() => {
    if (!features?.length > 0) return;
    return turfCenter(features[0].geometry);
  }, [features]);

  const projects = useGroupedFeatures(features);

  if (!features || !features.length > 0) return null;

  return (
    <Popup
      longitude={center.geometry.coordinates[0]}
      latitude={center.geometry.coordinates[1]}
      onClose={onClose}
    >
      <div>
        <List dense>
          {projects.map((features) => {
            return (
              <Fragment key={features[0].properties.project_id}>
                <ListItem
                  style={{ minWidth: 200, fontWeight: "bold" }}
                  button
                  onClick={() => {
                    // setClickedComponent(component);
                    onClose();
                  }}
                  component={Link}
                  to={`/moped/projects/${features[0].properties.project_id}`}
                >
                  <ListItemText
                    primary={
                      <span style={{ fontWeight: "bold" }}>
                        {features[0].properties.project_name}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <ProjectStatusBadge
                        phaseKey={features[0].properties.phase_key}
                        phaseName={features[0].properties.phase_name}
                        condensed
                      />
                    }
                  />
                </ListItem>
                {features?.map((feature, i) => {
                  const componentLabel = `${feature.properties.component_name}${
                    feature.properties.component_subtype
                      ? ` - ${feature.properties.component_subtype}`
                      : ""
                  }`;
                  return (
                    <React.Fragment key={i}>
                      <ListItem disableGutters>
                        <ListItemIcon
                          style={{ minWidth: 0, paddingRight: ".5rem" }}
                        >
                          <ChevronRightIcon />
                        </ListItemIcon>
                        <ListItemText primary="" secondary={componentLabel} />
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </List>
      </div>
    </Popup>
  );
}

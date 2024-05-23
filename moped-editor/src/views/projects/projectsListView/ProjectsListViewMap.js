import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { NavLink as RouterLink } from "react-router-dom";
import MapDrawer from "./components/MapDrawer";
import ProjectsMap from "./components/ProjectsMap";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import makeStyles from "@mui/styles/makeStyles";
import { GET_PROJECTS_GEOGRAPHIES } from "src/queries/project";
import { styleMapping } from "../projectView/ProjectStatusBadge";

const useStyles = makeStyles(() => ({
  content: {
    display: "flex",
    height: "100%",
    width: "100%",
  },
}));

const ProjectsListViewMap = ({
  mapQuery,
  fetchPolicy,
  setIsMapDataLoading,
}) => {
  const classes = useStyles();

  /* Get search params to pass in project links for back button in Project Summary view */
  const location = useLocation();
  const queryString = location.search;

  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();
  const [featuredProjectIds, setFeaturedProjectIds] = React.useState([]);

  /* MapDrawer state and handlers */
  const [open, setOpen] = React.useState(false);

  /* Toggle drawer based on whether components are captured in map click or not */
  useEffect(() => {
    if (featuredProjectIds.length > 0) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [featuredProjectIds, setOpen]);

  const { data: projectMapViewData } = useQuery(mapQuery, {
    fetchPolicy,
  });

  /* Build object to get project data needed for projectsFeatureCollection by project id  */
  const projectDataById = React.useMemo(
    () =>
      projectMapViewData
        ? projectMapViewData?.project_list_view.reduce((acc, project) => {
            return {
              ...acc,
              [project.project_id]: project,
            };
          }, {})
        : {},
    [projectMapViewData]
  );

  /* Build array of project data needed to show in MapDrawer */
  const featuredProjectsData = React.useMemo(
    () => featuredProjectIds.map((projectId) => projectDataById[projectId]),
    [featuredProjectIds, projectDataById]
  );

  /* Build array of project ids to request project geography */
  const projectIds = React.useMemo(
    () => Object.keys(projectDataById),
    [projectDataById]
  );

  const {
    loading,
    error,
    data: projectsGeographies,
  } = useQuery(GET_PROJECTS_GEOGRAPHIES, { variables: { projectIds } });

  /* Update state tied to loading spinner in SearchBar component */
  useEffect(() => {
    setIsMapDataLoading(loading);
  }, [loading, setIsMapDataLoading]);

  /* Build feature collection to pass to the map, add project_geography attributes to feature properties along with status color */
  const projectsFeatureCollection = React.useMemo(() => {
    const projectGeographiesFeatureCollection =
      projectsGeographies?.project_geography
        ? projectsGeographies?.project_geography.reduce(
            (acc, projectGeography) => {
              const phaseKey =
                projectDataById[projectGeography.project_id]?.current_phase_key;
              const statusBadgeColor = phaseKey
                ? styleMapping[phaseKey]?.background
                : styleMapping.default.background;

              const projectGeographyFeature = {
                id: projectGeography.project_id,
                type: "Feature",
                geometry: projectGeography.geography,
                properties: {
                  ...(projectGeography.attributes
                    ? projectGeography.attributes
                    : {}),
                  color: statusBadgeColor,
                },
              };

              return {
                ...acc,
                features: [...acc.features, projectGeographyFeature],
              };
            },
            { type: "FeatureCollection", features: [] }
          )
        : { type: "FeatureCollection", features: [] };

    return projectGeographiesFeatureCollection;
  }, [projectsGeographies, projectDataById]);

  return (
    <Paper component="main" className={classes.content}>
      <MapDrawer title={"Projects"} ref={mapRef} open={open} setOpen={setOpen}>
        <List>
          {featuredProjectsData.length > 0 ? (
            featuredProjectsData.map((projectData) => (
              <ListItem key={projectData.project_id} disablePadding>
                <ListItemText
                  primary={
                    <Link
                      component={RouterLink}
                      to={`/moped/projects/${projectData.project_id}`}
                      target="_blank"
                      state={{ queryString }}
                    >
                      {projectData.project_name_full}
                    </Link>
                  }
                  secondary={`#${projectData.project_id}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem disablePadding>
              <ListItemText primary="No projects selected" />
            </ListItem>
          )}
        </List>
      </MapDrawer>
      {error && <Alert severity="error">{`Unable to load project data`}</Alert>}
      <ProjectsMap
        ref={mapRef}
        projectsFeatureCollection={projectsFeatureCollection}
        loading={loading}
        setFeaturedProjectIds={setFeaturedProjectIds}
      />
    </Paper>
  );
};

export default ProjectsListViewMap;

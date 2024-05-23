import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import MapDrawer from "./components/MapDrawer";
import ProjectsMap from "./components/ProjectsMap";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import { GET_PROJECTS_GEOGRAPHIES } from "src/queries/project";
import { styleMapping } from "../projectView/ProjectStatusBadge";

// TODO: Show projects in list with links to project summary view
// TODO: Open project in new tab

const useStyles = makeStyles((theme) => ({
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

  /* Bulid array of project data needed to show in MapDrawer */
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
        <Stack spacing={1}>
          {featuredProjectsData.length > 0 ? (
            featuredProjectsData.map((projectData) => (
              <Typography
                key={projectData.project_id}
              >{`#${projectData.project_id} - ${projectData.project_name_full}`}</Typography>
            ))
          ) : (
            <Typography>No projects selected</Typography>
          )}
        </Stack>
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

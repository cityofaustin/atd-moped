import React from "react";
import { useQuery } from "@apollo/client";
import ProjectsMap from "./components/ProjectsMap";
import Alert from "@mui/material/Alert";
import { GET_PROJECTS_GEOGRAPHIES } from "src/queries/project";
import { useGetProjectMapView } from "./useProjectListViewQuery/useProjectMapViewQuery";

const ProjectsListViewMap = ({
  searchWhereString,
  advancedSearchWhereString,
}) => {
  /* Store map instance to call Mapbox GL methods where needed */
  const mapRef = React.useRef();

  //   const projectIds = React.useMemo(
  //     () =>
  //       data ? data?.project_list_view?.map((project) => project.project_id) : [],
  //     [data]
  //   );

  //   const {
  //     loading,
  //     error,
  //     data: projectsGeographies,
  //   } = useQuery(GET_PROJECTS_GEOGRAPHIES, { variables: { projectIds } });

  //   const projectsFeatureCollection = React.useMemo(() => {
  //     const projectGeographiesFeatureCollection =
  //       projectsGeographies?.project_geography
  //         ? projectsGeographies?.project_geography.reduce(
  //             (acc, projectGeography) => {
  //               const projectGeographyFeature = {
  //                 type: "Feature",
  //                 geometry: projectGeography.geography,
  //                 properties: projectGeography.attributes,
  //               };

  //               return {
  //                 ...acc,
  //                 features: [...acc.features, projectGeographyFeature],
  //               };
  //             },
  //             { type: "FeatureCollection", features: [] }
  //           )
  //         : { type: "FeatureCollection", features: [] };

  //     return projectGeographiesFeatureCollection;
  //   }, [projectsGeographies]);

  const { query } = useGetProjectMapView({
    searchWhereString,
    advancedSearchWhereString,
  });

  const { loading, error, data: projectsWithComponents } = useQuery(query);

  console.log(projectsWithComponents);

  return (
    <>
      {error && <Alert severity="error">{`Unable to load project data`}</Alert>}
      <ProjectsMap
        ref={mapRef}
        // projectsFeatureCollection={projectsFeatureCollection}
        loading={loading}
      />
    </>
  );
};

export default ProjectsListViewMap;

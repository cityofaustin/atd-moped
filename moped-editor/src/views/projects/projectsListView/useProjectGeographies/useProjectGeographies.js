import React from "react";
import { styleMapping } from "../../projectView/ProjectStatusBadge";

/* Initial feature collections to pass to the map when data has not yet loaded */
const initialProjectGeographiesMap = {
  projectGeographiesFeatureCollectionLines: {
    type: "FeatureCollection",
    features: [],
  },
  projectGeographiesFeatureCollectionPoints: {
    type: "FeatureCollection",
    features: [],
  },
  selectedProjectsFeatureCollectionLines: {
    type: "FeatureCollection",
    features: [],
  },
  selectedProjectsFeatureCollectionPoints: {
    type: "FeatureCollection",
    features: [],
  },
};

/**  Build feature collection to pass to the map, add project_geography attributes to feature properties along with status color
 * @param {Object} projectsGeographies - Object with project geographies data
 * @param {Object} projectDataById - Object with project data by project id to add to feature properties
 * @param {Array} selectedProjectIds - Array of project ids that are selected (clicked on map)
 */
export const useProjectGeographies = ({
  projectsGeographies,
  projectDataById,
  selectedProjectIds,
}) =>
  React.useMemo(() => {
    const projectGeographiesArr = projectsGeographies?.project_geography;

    if (!projectGeographiesArr) return initialProjectGeographiesMap;

    const projectGeographiesMap = projectGeographiesArr.reduce(
      (acc, projectGeography) => {
        const lineRepresentation = projectGeography?.line_representation;
        const phaseKey =
          projectDataById[projectGeography.project_id]?.current_phase_key;

        // Set color based on phase key or default if not defined
        const statusBadgeColor = phaseKey
          ? styleMapping[phaseKey]?.background
          : styleMapping.default.background;

        const projectGeographyFeature = {
          id: projectGeography.project_id,
          type: "Feature",
          geometry: projectGeography.geography,
          properties: {
            ...(projectGeography.attributes ? projectGeography.attributes : {}),
            color: statusBadgeColor,
          },
        };

        // Check if project is selected and if it is a line or point feature
        const isSelected = selectedProjectIds.includes(
          projectGeography.project_id
        );
        const isSelectedLine = lineRepresentation && isSelected;
        const isSelectedPoint = !lineRepresentation && isSelected;

        // Sort into selected or non-selected project and line and point geographies for map layers
        if (isSelectedLine) {
          return {
            ...acc,
            selectedProjectsFeatureCollectionLines: {
              type: "FeatureCollection",
              features: [
                ...acc.selectedProjectsFeatureCollectionLines.features,
                projectGeographyFeature,
              ],
            },
          };
        } else if (isSelectedPoint) {
          return {
            ...acc,
            selectedProjectsFeatureCollectionPoints: {
              type: "FeatureCollection",
              features: [
                ...acc.selectedProjectsFeatureCollectionPoints.features,
                projectGeographyFeature,
              ],
            },
          };
        } else if (lineRepresentation) {
          return {
            ...acc,
            projectGeographiesFeatureCollectionLines: {
              type: "FeatureCollection",
              features: [
                ...acc.projectGeographiesFeatureCollectionLines.features,
                projectGeographyFeature,
              ],
            },
          };
        } else if (!lineRepresentation) {
          return {
            ...acc,
            projectGeographiesFeatureCollectionPoints: {
              type: "FeatureCollection",
              features: [
                ...acc.projectGeographiesFeatureCollectionPoints.features,
                projectGeographyFeature,
              ],
            },
          };
        } else {
          return acc;
        }
      },
      initialProjectGeographiesMap
    );

    return projectGeographiesMap;
  }, [selectedProjectIds, projectsGeographies, projectDataById]);

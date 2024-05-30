import React from "react";
import { styleMapping } from "../../ProjectStatusBadge";

const initialProjectGeographiesMap = {
  projectGeographiesFeatureCollectionLines: {
    type: "FeatureCollection",
    features: [],
  },
  projectGeographiesFeatureCollectionPoints: {
    type: "FeatureCollection",
    features: [],
  },
  featuredProjectsFeatureCollectionLines: {
    type: "FeatureCollection",
    features: [],
  },
  featuredProjectsFeatureCollectionPoints: {
    type: "FeatureCollection",
    features: [],
  },
};

/* Build feature collection to pass to the map, add project_geography attributes to feature properties along with status color */
export const useProjectGeographies = ({
  projectsGeographies,
  projectDataById,
  featuredProjectIds,
}) =>
  React.useMemo(() => {
    const projectGeographiesArr = projectsGeographies?.project_geography;

    if (!projectGeographiesArr) return initialProjectGeographiesMap;

    const projectGeographiesMap = projectGeographiesArr.reduce(
      (acc, projectGeography) => {
        console.log(projectGeography);
        const lineRepresentation = projectGeography?.line_representation;
        const phaseKey =
          projectDataById[projectGeography.project_id]?.current_phase_key;

        // Set color based on phase key or default and mute if not in selected projects (if there are any selected)
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

        // Check if project is featured and add to line or point feature collections
        const isFeatured = featuredProjectIds.includes(
          projectGeography.project_id
        );
        const isFeaturedLine = lineRepresentation && isFeatured;
        const isFeaturePoint = !lineRepresentation && isFeatured;

        if (isFeaturedLine) {
          return {
            ...acc,
            featuredProjectsFeatureCollectionLines: {
              type: "FeatureCollection",
              features: [
                ...acc.featuredProjectsFeatureCollectionLines.features,
                projectGeographyFeature,
              ],
            },
          };
        } else if (isFeaturePoint) {
          return {
            ...acc,
            featuredProjectsFeatureCollectionPoints: {
              type: "FeatureCollection",
              features: [
                ...acc.featuredProjectsFeatureCollectionPoints.features,
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
  }, [featuredProjectIds, projectsGeographies, projectDataById]);

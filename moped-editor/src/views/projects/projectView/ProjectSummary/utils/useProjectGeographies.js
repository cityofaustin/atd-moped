import React from "react";
import { styleMapping } from "../../ProjectStatusBadge";

/* Build feature collection to pass to the map, add project_geography attributes to feature properties along with status color */
export const useProjectGeographies = ({
  projectsGeographies,
  projectDataById,
  featuredProjectIds,
}) =>
  React.useMemo(() => {
    const projectGeographiesFeatureCollectionLines =
      projectsGeographies?.project_geography
        ? projectsGeographies?.project_geography.reduce(
            (acc, projectGeography) => {
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
                  ...(projectGeography.attributes
                    ? projectGeography.attributes
                    : {}),
                  color: statusBadgeColor,
                },
              };

              return lineRepresentation
                ? {
                    ...acc,
                    features: [...acc.features, projectGeographyFeature],
                  }
                : acc;
            },
            { type: "FeatureCollection", features: [] }
          )
        : { type: "FeatureCollection", features: [] };

    const projectGeographiesFeatureCollectionPoints =
      projectsGeographies?.project_geography
        ? projectsGeographies?.project_geography.reduce(
            (acc, projectGeography) => {
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
                  ...(projectGeography.attributes
                    ? projectGeography.attributes
                    : {}),
                  color: statusBadgeColor,
                },
              };

              return !lineRepresentation
                ? {
                    ...acc,
                    features: [...acc.features, projectGeographyFeature],
                  }
                : acc;
            },
            { type: "FeatureCollection", features: [] }
          )
        : { type: "FeatureCollection", features: [] };

    const featuredProjectsFeatureCollectionLines =
      projectsGeographies?.project_geography
        ? projectsGeographies?.project_geography.reduce(
            (acc, projectGeography) => {
              const phaseKey =
                projectDataById[projectGeography.project_id]?.current_phase_key;

              const isInSelectedProjects = featuredProjectIds.includes(
                projectGeography.project_id
              );
              const lineRepresentation = projectGeography?.line_representation;

              if (!isInSelectedProjects || !lineRepresentation) {
                return acc;
              }

              // Set color based on phase key or default and mute if not in selected projects (if there are any selected)
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

    const featuredProjectsFeatureCollectionPoints =
      projectsGeographies?.project_geography
        ? projectsGeographies?.project_geography.reduce(
            (acc, projectGeography) => {
              const phaseKey =
                projectDataById[projectGeography.project_id]?.current_phase_key;

              const isInSelectedProjects = featuredProjectIds.includes(
                projectGeography.project_id
              );
              const lineRepresentation = projectGeography?.line_representation;

              if (!isInSelectedProjects || lineRepresentation) {
                return acc;
              }

              // Set color based on phase key or default and mute if not in selected projects (if there are any selected)
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

    return {
      projectGeographiesFeatureCollectionLines,
      projectGeographiesFeatureCollectionPoints,
      featuredProjectsFeatureCollectionLines,
      featuredProjectsFeatureCollectionPoints,
    };
  }, [featuredProjectIds, projectsGeographies, projectDataById]);

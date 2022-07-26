import { useEffect, useState } from "react";
import { createFeatureCollectionFromProjectFeatures } from "./mapHelpers";

/**
 * Construct a FeatureCollection comprised of all moped_proj_components in the proejct. Used
 * for representing the entire project on a map
 * @param {Object[]} projectComponents - an array of moped_proj_component records with their
 * respective moped_proj_features arrays
 */
export const createProjectFeatureCollection = projectComponents => {
  // extract all features and flatten into a single list
  const projectFeatures =
    projectComponents
      .map(projComponent => projComponent.moped_proj_features)
      .flat() || [];

  /**
   * Build an all-inclusive list of components associated with this project
   * Used in the static map view
   * @type FeatureCollection {Object}
   */
  return createFeatureCollectionFromProjectFeatures(projectFeatures);
};

/**
 * Hook to generate a unique sorted list containing the names of available components
 * @param {Object[]} mopedComponents - the moped_components lookup table
 */
export const useAvailableTypes = mopedComponents => {
  const [availableTypes, setAvailableTypes] = useState([]);
  useEffect(() => {
    if (!mopedComponents) return;
    let availableTypesNew = [
      ...new Set(
        mopedComponents.map(moped_component => moped_component.component_name)
      ),
    ].sort();
    setAvailableTypes(availableTypesNew);
  }, [mopedComponents]);
  return availableTypes;
};

/**
 * Hook to generate a list of components that are represented by lines ** note: highway can be either
 * @param {Object[]} mopedComponents - the moped_components lookup table
 */
export const useLineRepresentable = mopedComponents => {
  const [lineRepresentable, setLineRepresentable] = useState([]);
  useEffect(() => {
    if (!mopedComponents) return;
    const lineRepresentableNew = {}
    mopedComponents.forEach(moped_component => {
      const componentNameKey =
        moped_component.component_name.toLowerCase().replaceAll(" ", "") +
        (moped_component.component_subtype ?? "").toLowerCase().replaceAll(" ", "");
      lineRepresentableNew[componentNameKey] = moped_component?.line_representation ?? false;
    })
    setLineRepresentable(lineRepresentableNew);
  }, [mopedComponents]);
  return lineRepresentable;
};

/**
 * Generates an initial list of component types, subtypes and counts (counts is total number of subtypes)
 * @param {Object[]} mopedComponents - the moped_components lookup table
 * @param {Object[]} mopedSubcomponents - the moped_subcomponents lookup table
 */
export const useInitialTypeCounts = (mopedComponents, mopedSubcomponents) => {
  const [initialTypeCounts, setInitialTypeCounts] = useState(null);

  useEffect(() => {
    if (!mopedComponents || !mopedSubcomponents) return;

    let initialTypeCountsNew = mopedComponents.reduce(
      (accumulator, component, index) => {
        // Retrieve the current component's values, in lower case
        const componentId = component?.component_id ?? null;
        const componentName = (component?.component_name ?? "").toLowerCase();
        const componentSubtype = (
          component?.component_subtype ?? ""
        ).toLowerCase();

        /**
         * Then, retrieve the subcomponents associated to this component. We must preserve
         * known subcomponents for other subtypes of the same component name.
         * TODO: refactor "initialTypeCounts" and form inputs to key on component_id
         * throughout. Gulp!
         */
        const currentSubcomponents =
          accumulator[componentName]?.subcomponents || [];

        const currentSubcomponentNames = currentSubcomponents.map(
          subcomponent => subcomponent.subcomponent_name
        );

        const componentSubcomponents = mopedSubcomponents.filter(
          subcomponent =>
            subcomponent.component_id === componentId &&
            !currentSubcomponentNames.includes(subcomponent.subcomponent_name)
        );

        // Get the total count for this component name
        const currentCount = accumulator[componentName]?.count ?? 0;

        // Send back to the accumulator a copy of itself plus new data:
        return {
          // Here is the copy of the current state of the output:
          ...accumulator,
          // And for new data, create (or overwrite) a new key with the component name
          [componentName]: {
            count: currentCount + 1, // Assign count to currentCount + 1
            /**
             * If currentCount is zero, it means this is the first iteration of reduce
             * for this componentName, which means this should be considered a single item
             * and we need to give it its component_id.
             *
             * Otherwise, this is another iteration (n+1) for this componentName, which means
             * componentName is a group. Let's give it an id of zero as a lazy way to categorize
             * and differentiate groups from single items.
             */
            component_id: currentCount > 1 ? 0 : componentId,
            // Provide Index for context
            index: index,
            // Initialize a subtypes key with an object containing componentSubtype information.
            subtypes: {
              // Copy the current state of the accumulator's subtypes
              ...(accumulator[componentName]?.subtypes ?? {}),
              /**
               * Create (or overwrite) a new subtype by the name of componentSubtype,
               * containing all the data of this component iteration.
               */
              [componentSubtype]: {
                component_id: componentId,
                component_name: component?.component_name ?? null,
                component_subtype: component?.component_subtype ?? null,
              },
            },
            subcomponents: [...currentSubcomponents, ...componentSubcomponents],
          },
        };
      },
      {}
    );
    setInitialTypeCounts(initialTypeCountsNew);
  }, [mopedComponents, mopedSubcomponents]);

  return initialTypeCounts;
};

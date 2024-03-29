import { useMemo, createRef } from "react";
import { cloneDeep } from "lodash";

const setComponentCouncilDistrict = (component, projectGeography) => {
  const componentID = component.project_component_id;
  const councilDistricts = projectGeography
    .filter((f) => f.component_id === componentID)
    .map((f) => f.council_districts)
    .flat();
  component.council_districts = [
    ...new Set(councilDistricts.sort((a, b) => a - b)),
  ];
};

const setLengthFeet = (component, projectGeography) => {
  const componentID = component.project_component_id;
  const componentLengthArray = projectGeography.filter(
    (f) => f.component_id === componentID
  );

  component.component_length = componentLengthArray.reduce(
    (acc, geometry) => acc + geometry.length_feet,
    0
  );
};

export const useProjectComponents = (data) => {
  /* holds this project's components */
  const projectComponents = useMemo(() => {
    if (!data?.moped_proj_components) return [];

    return data.moped_proj_components.map((component) => {
      const newComponent = cloneDeep(component);
      newComponent._ref = createRef();
      setComponentCouncilDistrict(newComponent, data.project_geography);
      setLengthFeet(newComponent, data.project_geography);
      return newComponent;
    });
  }, [data]);

  const parentComponents = useMemo(() => {
    if (!data?.parentProjectComponents) return [];

    return data.parentProjectComponents;
  }, [data]);

  const siblingComponents = useMemo(() => {
    if (!data?.siblingProjects) return [];

    const allSiblingComponents = data.siblingProjects.reduce(
      (acc, sibling) => [...acc, ...sibling.moped_proj_components],
      []
    );

    return allSiblingComponents;
  }, [data]);

  const childComponents = useMemo(() => {
    if (!data?.childProjects) return [];

    const allChildComponents = data.childProjects.reduce(
      (acc, child) => [...acc, ...child.moped_proj_components],
      []
    );

    return allChildComponents;
  }, [data]);

  const allRelatedComponents = useMemo(() => {
    return [...parentComponents, ...siblingComponents, ...childComponents].map(
      (component) => {
        const newComponent = cloneDeep(component);
        /* these refs will feed component list items so that we can scroll to them */
        newComponent._ref = createRef();
        setComponentCouncilDistrict(newComponent, data.project_geography);
        setLengthFeet(newComponent, data.project_geography);
        return newComponent;
      }
    );
  }, [
    parentComponents,
    siblingComponents,
    childComponents,
    data?.project_geography,
  ]);

  return {
    projectComponents,
    allRelatedComponents,
    childComponents,
  };
};

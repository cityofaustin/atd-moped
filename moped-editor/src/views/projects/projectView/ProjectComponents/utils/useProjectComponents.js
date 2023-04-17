import { useMemo, createRef } from "react";

export const useProjectComponents = (data) => {
  /* holds this project's components */
  const projectComponents = useMemo(() => {
    if (!data?.moped_proj_components) return [];

    return data.moped_proj_components.map((component) => {
      component._ref = createRef();
      return component;
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
        /* these refs will feed component list items so that we can scroll to them */
        component._ref = createRef();
        return component;
      }
    );
  }, [parentComponents, siblingComponents, childComponents]);

  return {
    projectComponents,
    allRelatedComponents,
  };
};

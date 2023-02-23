import { useMemo } from "react";

export const useProjectComponents = (data) => {
  /* holds this project's components */
  const projectComponents = useMemo(() => {
    if (!data?.moped_proj_components) return [];

    return data.moped_proj_components;
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

  return {
    projectComponents,
    parentComponents,
    siblingComponents,
    childComponents,
  };
};

import { useMemo } from "react";

/**
 * Take the moped_project records data response and create options for a MUI autocomplete
 * @param {Object} data Data returned with moped_project records
 * @returns {Array} The options with value and label for moped projects
 */
export const useProjectOptions = (data) =>
  useMemo(() => {
    if (!data) return [];

    const options = data.moped_project.map((option) => ({
      value: option.project_id,
      label: `${option.project_id} - ${option.project_name_full}`,
    }));

    return options;
  }, [data]);

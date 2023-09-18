import React, { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import { getOptionLabel, isOptionEqualToValue } from "./utils/form";
import { PROJECT_OPTIONS } from "src/queries/project";

import * as yup from "yup";

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
      label: `${option.project_id} - ${option.project_name}`,
    }));

    return options;
  }, [data]);

const validationSchema = yup.object().shape({
  project: yup.object().required(),
});

const MoveComponentForm = ({ onSave, component }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { project: null },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });
  const currentProjectId = component?.project_id;
  const areFormErrors = Object.keys(errors).length > 0;

  // Get projects for autocomplete
  const { data, error } = useQuery(PROJECT_OPTIONS, {
    variables: { projectId: currentProjectId },
  });
  const projectOptions = useProjectOptions(data);

  error && console.error(error);

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="project"
            label="Project"
            options={projectOptions}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={getOptionLabel}
            name="project"
            control={control}
            autoFocus
            helperText="Required"
          />
        </Grid>
      </Grid>
      <Grid container spacing={4} display="flex" justifyContent="flex-end">
        <Grid item style={{ margin: 5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={areFormErrors}
          >
            Move component
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MoveComponentForm;

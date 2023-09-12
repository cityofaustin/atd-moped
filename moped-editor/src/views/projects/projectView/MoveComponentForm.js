import React from "react";
import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import ControlledAutocomplete from "./ProjectComponents/ControlledAutocomplete";
import { PROJECT_OPTIONS } from "src/queries/project";

import * as yup from "yup";

const validationSchema = yup.object().shape({
  projectId: yup.number().required(),
});

const MoveComponentForm = ({ onSave, projectId }) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: { projectId },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const areFormErrors = Object.keys(errors).length > 0;

  // Get projects for autocomplete
  const { data: optionsData, error } = useQuery(PROJECT_OPTIONS, {
    variables: { projectId: projectId },
  });

  error && console.error(error);

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="project"
            label="Project"
            options={optionsData || []}
            renderOption={(option) =>
              `${option.project_id} - ${option.project_name}`
            }
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
            disabled={!isDirty || areFormErrors}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MoveComponentForm;

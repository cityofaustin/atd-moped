import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import { getOptionLabel, isOptionEqualToValue } from "./utils/form";
import { PROJECT_OPTIONS } from "src/queries/project";
import { useProjectOptions } from "src/views/projects/projectView/ProjectComponents/utils/useProjectOptions";

import * as yup from "yup";

const validationSchema = yup.object().shape({
  project: yup.object().required(),
});

const MoveComponentForm = ({ onSave, component }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { project: null },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });
  const currentProjectId = component?.project_id;

  // Get projects for autocomplete
  const { data, error } = useQuery(PROJECT_OPTIONS, {
    variables: { projectId: currentProjectId },
  });
  const projectOptions = useProjectOptions(data);

  if (error) console.error(error);

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2} sx={{ pt: 1 }}>
        <Grid size={12}>
          <ControlledAutocomplete
            id="project"
            label="Project"
            options={projectOptions}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={getOptionLabel}
            name="project"
            control={control}
            error={!!errors?.project}
            autoFocus
            helperText="Required"
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={4}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Grid style={{ margin: 5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={!isValid}
          >
            Move component
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default MoveComponentForm;

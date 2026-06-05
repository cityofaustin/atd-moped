import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid2 } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import ControlledAutocomplete from "src/components/forms/ControlledAutocomplete";
import { getOptionLabel, isOptionEqualToValue } from "./utils/form";
import { PROJECT_OPTIONS } from "src/queries/project";

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
      <Grid2 container spacing={2} sx={{ pt: 1 }}>
        <Grid2 size={12}>
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
        </Grid2>
      </Grid2>
      <Grid2
        container
        spacing={4}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Grid2 style={{ margin: 5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={!isValid}
          >
            Move component
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};
export default MoveComponentForm;

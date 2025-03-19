import React from "react";
import { useForm } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

import * as yup from "yup";
import ControlledTextInput from "src/components/forms/ControlledTextInput";

const validationSchema = yup.object().shape({
  description: yup.string().trim().required("Required").nullable(),
});

const SaveViewForm = ({ onSave, description, loading }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { description: description },
    resolver: yupResolver(validationSchema),
  });

  const areFormErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Description"
              name="description"
              size="small"
              control={control}
              error={!!errors?.description}
              helperText={errors?.description?.message}
              InputProps={{
                disabled: loading,
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={4} display="flex" justifyContent="flex-end">
        <Grid item style={{ margin: 5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={loading || areFormErrors}
          >
            Save view
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SaveViewForm;

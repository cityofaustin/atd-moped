import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { currencyFormatter } from "src/utils/numberFormatters";
import {
  UPDATE_PROJECT_PHASE_AND_ADD_STATUS_UPDATE,
  ADD_PROJECT_PHASE_AND_STATUS_UPDATE,
} from "src/queries/project";

const OverrideFundingForm = ({
  fundingRecord,
  onSubmitCallback,
  handleSnackbar,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, errors: formErrors },
  } = useForm({
    defaultValues: {
      funding_amount: fundingRecord?.funding_amount ?? 0,
      fdu_description: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Amount"
              name="funding_amount"
              control={control}
              size="small"
              type="number"
              inputMode="numeric"
            />
            <FormHelperText>
              eCapris amount:{" "}
              {currencyFormatter.format(fundingRecord.funding_amount)}{" "}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <ControlledTextInput
              fullWidth
              label="Description"
              multiline
              rows={2}
              name="fdu_description"
              control={control}
              size="small"
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid container display="flex" justifyContent="flex-end">
        <Grid item sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!isDirty}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default OverrideFundingForm;

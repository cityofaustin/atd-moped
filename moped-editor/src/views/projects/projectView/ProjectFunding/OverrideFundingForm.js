import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { currencyFormatter } from "src/utils/numberFormatters";
import {
  ADD_PROJECT_FUNDING,
  ECAPRIS_SUBPROJECT_FUNDING_QUERY,
} from "src/queries/funding";
import { transformGridToDatabase } from "src/views/projects/projectView/ProjectFunding/helpers";

const OverrideFundingForm = ({
  fundingRecord,
  projectId,
  onSubmitCallback,
  handleSnackbar,
  onClose,
}) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      funding_amount: fundingRecord?.funding_amount ?? 0,
      description: fundingRecord?.funding_description ?? "",
    },
  });

  const [addProjectFunding] = useMutation(ADD_PROJECT_FUNDING);

  const { data: fduData } = useQuery(ECAPRIS_SUBPROJECT_FUNDING_QUERY, {
    variables: { fdu: fundingRecord.fdu.fdu },
  });

  const appropriatedFunding = fduData?.ecapris_subproject_funding
    ? fduData.ecapris_subproject_funding[0]["amount"]
    : 0;

  const onSubmit = (data) => {
    const transformedRecord = transformGridToDatabase(fundingRecord);
    // override record with data from form
    transformedRecord.funding_description = data.description;
    transformedRecord.funding_amount = data.funding_amount;

    addProjectFunding({
      variables: {
        objects: {
          ...transformedRecord,
          ecapris_subproject_id: fundingRecord.ecapris_subproject_id,
          project_id: Number(projectId),
        },
      },
    })
      .then(() => {
        handleSnackbar(true, "Funding source added", "success");
        onSubmitCallback();
        onClose();
      })
      .catch((error) => {
        handleSnackbar(true, "Error adding funding source", "error", error);
      });
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
              eCapris appropriated amount:{" "}
              {currencyFormatter.format(appropriatedFunding)}{" "}
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
              name="description"
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

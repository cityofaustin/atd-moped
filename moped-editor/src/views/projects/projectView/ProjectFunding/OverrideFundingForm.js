import { useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { currencyFormatter } from "src/utils/numberFormatters";
import {
  ADD_PROJECT_FUNDING,
  ECAPRIS_SUBPROJECT_FUNDING_QUERY,
  UPDATE_PROJECT_FUNDING,
} from "src/queries/funding";
import { transformGridToDatabase } from "src/views/projects/projectView/ProjectFunding/helpers";
import { amountOnChangeHandler } from "src/views/projects/projectView/ProjectWorkActivity/utils/form";

// TODO: Conditionally disabled amount input when "Use latest eCAPRIS appropriated amount" is checked
// TODO: On submit, if checked, mutate funding_amount to appropriated amount from eCAPRIS to reset override flow
// TODO: When checked, set funding_amount input to appropriated amount from eCAPRIS

const OverrideFundingForm = ({
  fundingRecord,
  projectId,
  refetchFundingQuery,
  setOverrideFundingRecord,
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

  console.log(fundingRecord);

  // if record is synced from ecapris and not yet manual, its first time overriding amount and description
  const isNewOverride =
    fundingRecord.is_synced_from_ecapris && !fundingRecord.is_manual;

  const [mutate] = useMutation(
    isNewOverride ? ADD_PROJECT_FUNDING : UPDATE_PROJECT_FUNDING
  );

  const { data: fduData } = useQuery(ECAPRIS_SUBPROJECT_FUNDING_QUERY, {
    variables: { fdu: fundingRecord?.fdu?.fdu },
  });

  const appropriatedFunding = fduData?.ecapris_subproject_funding
    ? fduData.ecapris_subproject_funding[0]["amount"]
    : 0;

  const onSubmit = (data) => {
    const transformedRecord = transformGridToDatabase(fundingRecord);
    // override record with data from form
    transformedRecord.funding_description = data.description;
    transformedRecord.funding_amount = data.funding_amount;

    if (isNewOverride) {
      mutate({
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
          refetchFundingQuery();
          setOverrideFundingRecord(null);
          onClose();
        })
        .catch((error) => {
          handleSnackbar(true, "Error adding funding source", "error", error);
        });
    } else {
      mutate({
        variables: {
          ...transformedRecord,
          proj_funding_id: fundingRecord.proj_funding_id,
        },
      })
        .then(() => {
          handleSnackbar(true, "Funding source updated", "success");
          refetchFundingQuery();
          setOverrideFundingRecord(null);
          onClose();
        })
        .catch((error) => {
          handleSnackbar(true, "Error updating funding source", "error", error);
        });
    }
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
              type="text"
              inputMode="numeric"
              onChangeHandler={amountOnChangeHandler}
            />
            <FormHelperText>
              eCapris appropriated amount:{" "}
              {currencyFormatter.format(appropriatedFunding)}{" "}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Use latest eCAPRIS appropriated amount"
          />
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
